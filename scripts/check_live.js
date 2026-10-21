async function check() {
  try {
    const res = await fetch('https://sarath2003-sketch.github.io/nithya-yoga/index.html', { cache: 'no-store' });
    const text = await res.text();
    console.log('GitHub Pages index.html length:', text.length);
    const m = text.match(/bundle\.js[^\"]*/);
    console.log('Live index.html bundle tag:', m ? m[0] : 'not found');

    const vRes = await fetch('https://sarath2003-sketch.github.io/nithya-yoga/version.json', { cache: 'no-store' });
    const vJson = await vRes.json();
    console.log('Live version.json:', vJson);

    const bRes = await fetch('https://sarath2003-sketch.github.io/nithya-yoga/dist/bundle.js', { method: 'HEAD', cache: 'no-store' });
    console.log('Live bundle.js last-modified:', bRes.headers.get('last-modified'), 'content-length:', bRes.headers.get('content-length'));
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}
check();
