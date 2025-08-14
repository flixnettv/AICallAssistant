package com.myapp.aicallassistant;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
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

public class MainActivity extends AppCompatActivity implements SpeechProcessor.Listener, OnlineAgentClient.ContextProvider {

    Switch autoReplySwitch;
    Switch offlineModeSwitch;
    Switch darkModeSwitch;
    Spinner voiceStyleSpinner;
    Button replyNowButton;
    Button settingsButton;
    TextView aiResponseText;
    Button aiCallButton;

    public static boolean autoReply = false;
    public static boolean offlineMode = false;
    public static String selectedVoiceStyle = "شاب";

    public static final String[] VOICE_STYLES = new String[]{
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
        settingsButton = findViewById(R.id.settingsButton);
        aiResponseText = findViewById(R.id.aiResponseText);
        aiCallButton = findViewById(R.id.aiCallButton);

        autoReply = AppSettings.isAutoReplyDefault(this);
        autoReplySwitch.setChecked(autoReply);
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

        settingsButton.setOnClickListener(v -> startActivity(new Intent(this, SettingsActivity.class)));

        if (aiCallButton != null) {
            aiCallButton.setOnClickListener(v -> startActivity(new Intent(this, OutgoingAiCallActivity.class)));
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.menu_settings) {
            startActivity(new Intent(this, SettingsActivity.class));
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onPartialResult(String text) {
        runOnUiThread(() -> aiResponseText.setText("(جزئي) " + text));
    }

    @Override
    public void onFinalResult(String text) {
        runOnUiThread(() -> {
            String input = text == null || text.trim().isEmpty() ? "" : text.trim();
            String reply = input.isEmpty() ? "مرحبًا! إزيّك؟" : generateReply(input);
            aiResponseText.setText("أنت قلت: " + input + "\nالرد: " + reply);
            VoiceResponder.replyWithStyle(reply, selectedVoiceStyle);
        });
    }

    @Override
    public void onError(Exception e) {
        runOnUiThread(() -> aiResponseText.setText("حدث خطأ في التعرف الصوتي"));
    }

    private String generateReply(String input) {
        if (!offlineMode && ConnectivityUtils.isOnline(getApplicationContext()) && AppSettings.getOllamaServerUrl(getApplicationContext()) != null && !AppSettings.getOllamaServerUrl(getApplicationContext()).trim().isEmpty()) {
            try {
                String resp = OnlineAgentClient.generateReplyEgyptian(this, input);
                if (resp != null && !resp.trim().isEmpty()) return resp.trim();
            } catch (Exception ignored) { }
        }
        return "أهلاً! أنا سامعك. عايزني أعمل إيه؟";
    }

    @Override
    public android.content.Context getAppContext() {
        return getApplicationContext();
    }
}