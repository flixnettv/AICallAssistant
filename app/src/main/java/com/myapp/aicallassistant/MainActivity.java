package com.myapp.aicallassistant;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.AdapterView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class MainActivity extends AppCompatActivity implements SpeechProcessor.Listener {

    Switch autoReplySwitch;
    Switch offlineModeSwitch;
    Switch darkModeSwitch;
    Spinner voiceStyleSpinner;
    Button replyNowButton;
    TextView aiResponseText;

    public static boolean autoReply = false;
    public static boolean offlineMode = false;
    public static String selectedVoiceStyle = "شاب";

    private static final String[] VOICE_STYLES = new String[]{
            "طفل", "طفلة", "شاب", "شابة", "رجل عجوز", "امرأة عجوز", "مرعب وضخم", "ساخر"
    };

    private SpeechProcessor speechProcessor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        autoReplySwitch = findViewById(R.id.autoReplySwitch);
        offlineModeSwitch = findViewById(R.id.offlineModeSwitch);
        darkModeSwitch = findViewById(R.id.darkModeSwitch);
        voiceStyleSpinner = findViewById(R.id.voiceStyleSpinner);
        replyNowButton = findViewById(R.id.replyNowButton);
        aiResponseText = findViewById(R.id.aiResponseText);

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED ||
                ContextCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.RECORD_AUDIO, Manifest.permission.READ_PHONE_STATE, Manifest.permission.CALL_PHONE},
                    1);
        }

        VoiceResponder.initialize(getApplicationContext());
        speechProcessor = new SpeechProcessor(this);

        autoReplySwitch.setOnCheckedChangeListener((buttonView, isChecked) -> autoReply = isChecked);
        offlineModeSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> offlineMode = isChecked);
        darkModeSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> {
            AppCompatDelegate.setDefaultNightMode(isChecked
                    ? AppCompatDelegate.MODE_NIGHT_YES
                    : AppCompatDelegate.MODE_NIGHT_NO);
        });

        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, VOICE_STYLES);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        voiceStyleSpinner.setAdapter(adapter);
        int defaultIndex = 2; // "شاب"
        voiceStyleSpinner.setSelection(defaultIndex);
        voiceStyleSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, android.view.View view, int position, long id) {
                selectedVoiceStyle = VOICE_STYLES[position];
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) { }
        });

        replyNowButton.setOnClickListener(v -> {
            aiResponseText.setText("يسجّل الآن... تحدث من فضلك");
            speechProcessor.start(getApplicationContext(), offlineMode);
        });
    }

    @Override
    public void onPartialResult(String text) {
        runOnUiThread(() -> aiResponseText.setText("(جزئي) " + text));
    }

    @Override
    public void onFinalResult(String text) {
        runOnUiThread(() -> {
            String input = text == null || text.trim().isEmpty() ? "" : text.trim();
            String reply = input.isEmpty() ? "مرحبًا! كيف يمكنني مساعدتك؟" : generateReply(input);
            aiResponseText.setText("أنت قلت: " + input + "\nالرد: " + reply);
            VoiceResponder.replyWithStyle(reply, selectedVoiceStyle);
        });
    }

    @Override
    public void onError(Exception e) {
        runOnUiThread(() -> aiResponseText.setText("حدث خطأ في التعرف الصوتي"));
    }

    private String generateReply(String input) {
        if (!offlineMode && ConnectivityUtils.isOnline(getApplicationContext()) && Config.hasOnlineAgent()) {
            // TODO: call Ollama server for a better reply
            return "سمعتك تقول: " + input + ". كيف أستطيع المساعدة أكثر؟";
        }
        String dialect = DialectDetector.detectDialect(input);
        if (!dialect.isEmpty()) {
            return "أهلاً! (غير متصل) لهجتك: " + dialect + ". كيف أقدر أساعدك؟";
        }
        return "أهلاً! كيف أقدر أساعدك؟";
    }
}