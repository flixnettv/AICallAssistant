package com.myapp.aicallassistant;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class IncomingCallActivity extends AppCompatActivity {
    private Switch autoReplySwitch;
    private Spinner voiceStyleSpinner;
    private Button quick1;
    private Button quick2;
    private Button quick3;
    private Button quick4;
    private Button startReplyButton;
    private Button dismissButton;
    private TextView callerNumberText;
    private Button answerAiButton;
    private Button answerNormalButton;

    private String selectedQuickTemplate = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
            );
        }
        setContentView(R.layout.activity_incoming_call);

        callerNumberText = findViewById(R.id.callerNumberText);
        autoReplySwitch = findViewById(R.id.autoReplySwitch);
        voiceStyleSpinner = findViewById(R.id.voiceStyleSpinner);
        quick1 = findViewById(R.id.quick1);
        quick2 = findViewById(R.id.quick2);
        quick3 = findViewById(R.id.quick3);
        quick4 = findViewById(R.id.quick4);
        startReplyButton = findViewById(R.id.startReplyButton);
        dismissButton = findViewById(R.id.dismissButton);
        answerAiButton = findViewById(R.id.answerAiButton);
        answerNormalButton = findViewById(R.id.answerNormalButton);

        String number = getIntent().getStringExtra("incoming_number");
        callerNumberText.setText(number == null || number.trim().isEmpty() ? "غير معروف" : number);

        autoReplySwitch.setChecked(MainActivity.autoReply);

        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, MainActivity.VOICE_STYLES);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        voiceStyleSpinner.setAdapter(adapter);
        int selectedIndex = 0;
        for (int i = 0; i < MainActivity.VOICE_STYLES.length; i++) {
            if (MainActivity.VOICE_STYLES[i].equals(MainActivity.selectedVoiceStyle)) {
                selectedIndex = i;
                break;
            }
        }
        voiceStyleSpinner.setSelection(selectedIndex);
        voiceStyleSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                // no-op
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) { }
        });

        View.OnClickListener quickListener = v -> {
            clearQuickSelection();
            v.setSelected(true);
            if (v == quick1) selectedQuickTemplate = "أنا مشغول حالياً. هكلمك بعدين إن شاء الله.";
            else if (v == quick2) selectedQuickTemplate = "من فضلك ابعتلي التفاصيل على واتساب وهارجعلك.";
            else if (v == quick3) selectedQuickTemplate = "في اجتماع دلوقتي. هل ينفع أكلمك بعد 30 دقيقة؟";
            else if (v == quick4) selectedQuickTemplate = "اترك رسالة قصيرة وهسمعها أول ما أفضى.";
        };
        quick1.setOnClickListener(quickListener);
        quick2.setOnClickListener(quickListener);
        quick3.setOnClickListener(quickListener);
        quick4.setOnClickListener(quickListener);

        startReplyButton.setOnClickListener(v -> {
            MainActivity.autoReply = autoReplySwitch.isChecked();
            String style = (String) voiceStyleSpinner.getSelectedItem();
            MainActivity.selectedVoiceStyle = style;

            boolean online = ConnectivityUtils.isOnline(getApplicationContext());
            String message;
            if (selectedQuickTemplate != null && !selectedQuickTemplate.isEmpty()) {
                message = selectedQuickTemplate;
            } else {
                message = online
                        ? "مرحبًا! أنت تتحدث مع المساعد الذكي، كيف أقدر أساعدك؟"
                        : "مرحبًا! أنا مساعدك الصوتي بدون إنترنت، كيف أقدر أساعدك بشكل مبسط؟";
            }

            VoiceResponder.initialize(getApplicationContext());
            VoiceResponder.replyWithStyle(message, MainActivity.selectedVoiceStyle);
            Toast.makeText(this, "تم تشغيل الرد الصوتي", Toast.LENGTH_SHORT).show();
        });

        answerAiButton.setOnClickListener(v -> {
            Toast.makeText(this, "اختر إعدادات الرد ثم اضغط بدء الرد", Toast.LENGTH_SHORT).show();
        });

        answerNormalButton.setOnClickListener(v -> {
            finish();
        });

        dismissButton.setOnClickListener(v -> finish());
    }

    private void clearQuickSelection() {
        quick1.setSelected(false);
        quick2.setSelected(false);
        quick3.setSelected(false);
        quick4.setSelected(false);
    }
}