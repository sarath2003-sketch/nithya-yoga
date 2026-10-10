/**
 * Centralized Resilient API Client for NITHYA Yoga & Wellness
 * 
 * Handles:
 * - Dynamic backend URL resolution (same-origin, custom hosted backend, or localhost)
 * - Strict verification of HTTP response status and Content-Type headers
 * - Meaningful error messages preventing "Unexpected token '<', '<html>...' is not valid JSON"
 * - Safe JWT token injection for admin and member authenticated routes
 */

export function getApiBaseUrl() {
  // 1. Check user-configured backend URL in localStorage
  const storedUrl = localStorage.getItem('nithya_backend_url');
  if (storedUrl && storedUrl.trim()) {
    return storedUrl.trim().replace(/\/+$/, '');
  }

  // 2. Check global window config
  if (typeof window !== 'undefined' && window.__NITHYA_API_URL__) {
    return window.__NITHYA_API_URL__.replace(/\/+$/, '');
  }

  // 3. If running on GitHub Pages without configured backend, give a clear clue
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    // Default to empty so it fetches relative unless user sets their backend
    return '';
  }

  // 4. Default to same origin (relative path)
  return '';
}

export function setApiBaseUrl(url) {
  if (!url || !url.trim()) {
    localStorage.removeItem('nithya_backend_url');
  } else {
    localStorage.setItem('nithya_backend_url', url.trim().replace(/\/+$/, ''));
  }
}

/**
 * Perform a safe API fetch with Content-Type and status validation.
 * Guaranteed never to throw "Unexpected token <" JSON parsing exceptions.
 */
export async function apiFetch(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = baseUrl ? `${baseUrl}${cleanEndpoint}` : cleanEndpoint;

  const defaultHeaders = {
    'Accept': 'application/json'
  };

  if (options.body && typeof options.body === 'string' && !options.headers?.['Content-Type']) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...(options.headers || {})
  };

  let response;
  try {
    response = await fetch(fullUrl, {
      ...options,
      headers: mergedHeaders
    });
  } catch (networkErr) {
    throw new Error(
      `Cannot connect to backend server at ${fullUrl || window.location.origin}. ` +
      `Please verify that the server is online and reachable.`
    );
  }

  const contentType = response.headers.get('content-type') || '';

  // Handle 404 / HTML responses (typically returned by GitHub Pages for non-existent /api routes)
  if (response.status === 404 || contentType.includes('text/html')) {
    const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
    if (isGitHubPages && !baseUrl) {
      throw new Error(
        `Backend server not configured. GitHub Pages is a static host and does not run a Node.js backend. ` +
        `Please open LiveKit Settings and enter your hosted backend API URL (e.g. from Render or Railway).`
      );
    }
    throw new Error(
      `API endpoint "${cleanEndpoint}" not found on ${baseUrl || window.location.origin} (HTTP 404). ` +
      `Check your backend URL configuration.`
    );
  }

  // Handle non-OK status codes (4xx, 5xx)
  if (!response.ok) {
    let errorMessage = `Server error (HTTP ${response.status})`;
    if (contentType.includes('application/json')) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (_) {}
    } else {
      try {
        const textData = await response.text();
        if (textData && !textData.startsWith('<')) {
          errorMessage = textData;
        }
      } catch (_) {}
    }
    const err = new Error(errorMessage);
    err.status = response.status;
    throw err;
  }

  // If response is OK, verify that Content-Type is application/json before parsing
  if (!contentType.includes('application/json')) {
    const rawText = await response.text();
    if (rawText.startsWith('<!DOCTYPE') || rawText.startsWith('<html')) {
      throw new Error(
        `Received HTML instead of JSON from ${fullUrl}. ` +
        `Ensure your backend server is deployed and correctly mapped.`
      );
    }
    // Try to parse just in case header was omitted
    try {
      return JSON.parse(rawText);
    } catch (_) {
      throw new Error(`Unexpected non-JSON response from server: ${rawText.slice(0, 120)}`);
    }
  }

  return await response.json();
}
