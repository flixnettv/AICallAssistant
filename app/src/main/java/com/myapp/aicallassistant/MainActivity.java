package com.myapp.aicallassistant;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Switch;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class MainActivity extends AppCompatActivity {

    Switch autoReplySwitch;
    Button replyNowButton;
    Button voiceMaleButton;
    Button voiceFemaleButton;
    TextView aiResponseText;

    public static boolean autoReply = false;
    public static String selectedVoice = "male";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        autoReplySwitch = findViewById(R.id.autoReplySwitch);
        replyNowButton = findViewById(R.id.replyNowButton);
        voiceMaleButton = findViewById(R.id.voiceMaleButton);
        voiceFemaleButton = findViewById(R.id.voiceFemaleButton);
        aiResponseText = findViewById(R.id.aiResponseText);

        // طلب الصلاحيات
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED ||
                ContextCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.RECORD_AUDIO, Manifest.permission.READ_PHONE_STATE, Manifest.permission.CALL_PHONE},
                    1);
        }

        autoReplySwitch.setOnCheckedChangeListener((buttonView, isChecked) -> autoReply = isChecked);

        replyNowButton.setOnClickListener(v -> {
            // تشغيل الرد اليدوي
            VoiceResponder.replyNow("مرحبًا! كيف يمكنني مساعدتك؟", selectedVoice);
        });

        voiceMaleButton.setOnClickListener(v -> selectedVoice = "male");
        voiceFemaleButton.setOnClickListener(v -> selectedVoice = "female");
    }
}