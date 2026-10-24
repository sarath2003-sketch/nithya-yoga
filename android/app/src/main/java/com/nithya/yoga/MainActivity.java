package com.nithya.yoga;

import android.app.DownloadManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;
import androidx.core.app.NotificationCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    public static final String NOTIFICATION_CHANNEL_ID = "nithya_reminders";
    private String pendingDeepLinkUrl = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Capture incoming deep link if launched directly from a link (cold start)
        if (getIntent() != null && getIntent().getData() != null) {
            pendingDeepLinkUrl = getIntent().getData().toString();
        }

        // 1. Create High-Priority Notification Channel for Android 8.0+
        createNotificationChannel();

        // 2. Request POST_NOTIFICATIONS runtime permission for Android 13+ (API 33+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{android.Manifest.permission.POST_NOTIFICATIONS}, 101);
            }
        }

        // Configure WebView for direct external browser launches, file downloads, and native notifications
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            webView.getSettings().setDomStorageEnabled(true);
            webView.getSettings().setCacheMode(android.webkit.WebSettings.LOAD_DEFAULT);
            webView.getSettings().setMediaPlaybackRequiresUserGesture(false);
            webView.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);

            // Android DownloadListener: opens any APK or external download in Google Chrome
            webView.setDownloadListener(new DownloadListener() {
                @Override
                public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                    openInExternalBrowser(url);
                }
            });

            // JavaScript Interface: directly callable from React/JS as window.AndroidNativeUpdater
            webView.addJavascriptInterface(new Object() {
                @JavascriptInterface
                public String getInitialDeepLink() {
                    String url = pendingDeepLinkUrl;
                    pendingDeepLinkUrl = null;
                    return url != null ? url : "";
                }

                @JavascriptInterface
                public void openInChrome(String url) {
                    openInExternalBrowser(url);
                }

                @JavascriptInterface
                public void reloadAppFresh() {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            webView.clearCache(true);
                            webView.reload();
                        }
                    });
                }

                @JavascriptInterface
                public void showNativePopupNotification(String title, String message) {
                    triggerNativePopup(title, message);
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

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "NITHYA Yoga Reminders",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Daily yoga class reminders and live announcements");
            channel.enableLights(true);
            channel.setLightColor(Color.MAGENTA);
            channel.enableVibration(true);
            channel.setVibrationPattern(new long[]{0, 400, 200, 400});
            channel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    public void triggerNativePopup(String title, String message) {
        try {
            NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager == null) return;

            Intent intent = new Intent(this, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 0, intent,
                PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE
            );

            Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            NotificationCompat.Builder builder = new NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_popup_reminder)
                .setContentTitle(title)
                .setContentText(message)
                .setAutoCancel(true)
                .setSound(defaultSoundUri)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setDefaults(NotificationCompat.DEFAULT_ALL)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setContentIntent(pendingIntent);

            manager.notify((int) System.currentTimeMillis(), builder.build());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        if (intent != null && intent.getData() != null) {
            final String deepLink = intent.getData().toString();
            if (getBridge() != null && getBridge().getWebView() != null) {
                getBridge().getWebView().post(new Runnable() {
                    @Override
                    public void run() {
                        getBridge().getWebView().evaluateJavascript(
                            "if (typeof window !== 'undefined' && window.__handleDeepLink) { window.__handleDeepLink('" + deepLink.replace("'", "\\'") + "'); }",
                            null
                        );
                    }
                });
            }
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

