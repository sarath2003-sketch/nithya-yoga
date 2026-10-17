package com.nithya.yoga;

import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Configure WebView for direct external browser launches and file downloads
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();

            // 1. Android DownloadListener: opens any APK or external download in Google Chrome
            webView.setDownloadListener(new DownloadListener() {
                @Override
                public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                    openInExternalBrowser(url);
                }
            });

            // 2. JavaScript Interface: directly callable from React/JS as window.AndroidNativeUpdater
            webView.addJavascriptInterface(new Object() {
                @JavascriptInterface
                public void openInChrome(String url) {
                    openInExternalBrowser(url);
                }

                @JavascriptInterface
                public void downloadApkDirect(String url) {
                    try {
                        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                        request.setTitle("NITHYA Yoga Update");
                        request.setDescription("Downloading latest NITHYA Yoga APK...");
                        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                        request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "NITHYA-Yoga-v1.0.apk");
                        DownloadManager dm = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
                        if (dm != null) {
                            dm.enqueue(request);
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(MainActivity.this, "Downloading APK in background...", Toast.LENGTH_SHORT).show();
                                }
                            });
                        } else {
                            openInExternalBrowser(url);
                        }
                    } catch (Exception e) {
                        openInExternalBrowser(url);
                    }
                }
            }, "AndroidNativeUpdater");
        }
    }

    public void openInExternalBrowser(String url) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(url));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

