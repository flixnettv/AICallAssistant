package com.myapp.aicallassistant;

import android.os.Bundle;
import android.text.InputType;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.ArrayAdapter;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;

public class SettingsActivity extends AppCompatActivity {
    EditText whisperUrl;
    EditText ollamaUrl;
    EditText ollamaModel;
         Button saveButton;
     Button testButton;
     Button fetchModelsButton;

     EditText scheduleNumber;
     EditText scheduleReason;
     EditText scheduleTime;
     Button scheduleSaveBtn;
     Spinner themeSpinner;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        whisperUrl = findViewById(R.id.whisperUrl);
        ollamaUrl = findViewById(R.id.ollamaUrl);
        ollamaModel = findViewById(R.id.ollamaModel);
        saveButton = findViewById(R.id.saveButton);
        testButton = findViewById(R.id.testButton);
        fetchModelsButton = findViewById(R.id.fetchModelsButton);
        scheduleNumber = findViewById(R.id.scheduleNumber);
        scheduleReason = findViewById(R.id.scheduleReason);
        scheduleTime = findViewById(R.id.scheduleTime);
        scheduleSaveBtn = findViewById(R.id.scheduleSaveBtn);
        themeSpinner = findViewById(R.id.themeSpinner);

        whisperUrl.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_URI);
        ollamaUrl.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_URI);

        whisperUrl.setText(AppSettings.getWhisperServerUrl(this));
        ollamaUrl.setText(AppSettings.getOllamaServerUrl(this));
        ollamaModel.setText(AppSettings.getOllamaModel(this));

        // Theme
        String[] themes = new String[]{"فاتح","داكن","يتبع النظام"};
        ArrayAdapter<String> tAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, themes);
        tAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        themeSpinner.setAdapter(tAdapter);

        saveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AppSettings.setWhisperServerUrl(SettingsActivity.this, whisperUrl.getText().toString());
                AppSettings.setOllamaServerUrl(SettingsActivity.this, ollamaUrl.getText().toString());
                AppSettings.setOllamaModel(SettingsActivity.this, ollamaModel.getText().toString());
                int idx = themeSpinner.getSelectedItemPosition();
                if (idx == 0) AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
                else if (idx == 1) AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
                else AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
                finish();
            }
        });

        testButton.setOnClickListener(v -> new Thread(() -> {
            String w = AppSettings.getWhisperServerUrl(this);
            String o = AppSettings.getOllamaServerUrl(this);
            boolean wOk = HttpTestUtils.pingJsonPost(w);
            boolean oOk = HttpTestUtils.pingJsonGet(o + (o.endsWith("/")?"":"/") + "api/tags");
            runOnUiThread(() -> android.widget.Toast.makeText(this,
                    (wOk?"Whisper OK":"Whisper FAILED") + " | " + (oOk?"Ollama OK":"Ollama FAILED"),
                    android.widget.Toast.LENGTH_LONG).show());
        }).start());

        fetchModelsButton.setOnClickListener(v -> new Thread(() -> {
            String base = AppSettings.getOllamaServerUrl(this);
            String tags = HttpTestUtils.httpGet(base + (base.endsWith("/")?"":"/") + "api/tags");
            runOnUiThread(() -> ollamaModel.setText(HttpTestUtils.pickFirstModel(tags)));
        }).start());

        scheduleSaveBtn.setOnClickListener(v -> {
            String num = scheduleNumber.getText() == null ? "" : scheduleNumber.getText().toString().trim();
            String reason = scheduleReason.getText() == null ? "" : scheduleReason.getText().toString().trim();
            String when = scheduleTime.getText() == null ? "" : scheduleTime.getText().toString().trim();
            long t = parseTime(when);
            if (t > System.currentTimeMillis() && !num.isEmpty()) {
                Scheduler.scheduleCall(this, num, reason, t);
                android.widget.Toast.makeText(this, "تمت الجدولة", android.widget.Toast.LENGTH_SHORT).show();
            } else {
                android.widget.Toast.makeText(this, "وقت/رقم غير صالح", android.widget.Toast.LENGTH_SHORT).show();
            }
        });
    }

    private long parseTime(String ts) {
        try {
            java.text.SimpleDateFormat f = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm", java.util.Locale.US);
            return f.parse(ts).getTime();
        } catch (Exception e) {
            return 0;
        }
    }
}
