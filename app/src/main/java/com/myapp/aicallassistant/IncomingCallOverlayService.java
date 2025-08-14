package com.myapp.aicallassistant;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.provider.Settings;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

public class IncomingCallOverlayService extends Service {
    private static final String CHANNEL_ID = "ai_call_overlay";
    private WindowManager windowManager;
    private View overlayView;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        startForegroundWithNotification();
        showOverlay();
        return START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (overlayView != null && windowManager != null) {
            windowManager.removeView(overlayView);
            overlayView = null;
        }
    }

    private void startForegroundWithNotification() {
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel ch = new NotificationChannel(CHANNEL_ID, "تحكم مكالمة AI", NotificationManager.IMPORTANCE_LOW);
            nm.createNotificationChannel(ch);
        }
        Intent openIntent = new Intent(this, MainActivity.class);
        PendingIntent pi = PendingIntent.getActivity(this, 0, openIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Notification notif = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("مكالمة AI قيد التشغيل")
                .setContentText("يمكنك إيقاف/استئناف AI من التراكب")
                .setSmallIcon(android.R.drawable.ic_btn_speak_now)
                .setContentIntent(pi)
                .build();
        startForeground(1002, notif);
    }

    private void showOverlay() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(this)) {
                Toast.makeText(this, "اسمح بالظهور فوق التطبيقات من الإعدادات", Toast.LENGTH_LONG).show();
                return;
            }
        }
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        LayoutInflater inflater = LayoutInflater.from(this);
        overlayView = inflater.inflate(R.layout.view_ai_overlay, null);
        ImageButton stopBtn = overlayView.findViewById(R.id.stopAiBtn);
        ImageButton playBtn = overlayView.findViewById(R.id.playAiBtn);

        stopBtn.setOnClickListener(v -> {
            // Stop current TTS immediately
            try {
                java.lang.reflect.Field f = VoiceResponder.class.getDeclaredField("tts");
                f.setAccessible(true);
                android.speech.tts.TextToSpeech tts = (android.speech.tts.TextToSpeech) f.get(null);
                if (tts != null) tts.stop();
                Toast.makeText(this, "تم إيقاف AI مؤقتًا", Toast.LENGTH_SHORT).show();
            } catch (Exception ignored) {}
        });
        playBtn.setOnClickListener(v -> Toast.makeText(this, "سيستأنف AI في الرد القادم", Toast.LENGTH_SHORT).show());

        int type = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY : WindowManager.LayoutParams.TYPE_PHONE;
        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                type,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                PixelFormat.TRANSLUCENT
        );
        params.gravity = Gravity.TOP | Gravity.END;
        params.x = 20;
        params.y = 100;
        windowManager.addView(overlayView, params);
    }
}