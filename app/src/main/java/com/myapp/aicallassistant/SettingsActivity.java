package com.myapp.aicallassistant;

import android.os.Bundle;
import android.text.InputType;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import androidx.appcompat.app.AppCompatActivity;

public class SettingsActivity extends AppCompatActivity {
    EditText whisperUrl;
    EditText ollamaUrl;
    EditText ollamaModel;
         Button saveButton;
     Button testButton;
     Button fetchModelsButton;

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

        whisperUrl.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_URI);
        ollamaUrl.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_URI);

        whisperUrl.setText(AppSettings.getWhisperServerUrl(this));
        ollamaUrl.setText(AppSettings.getOllamaServerUrl(this));
        ollamaModel.setText(AppSettings.getOllamaModel(this));

        saveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AppSettings.setWhisperServerUrl(SettingsActivity.this, whisperUrl.getText().toString());
                AppSettings.setOllamaServerUrl(SettingsActivity.this, ollamaUrl.getText().toString());
                AppSettings.setOllamaModel(SettingsActivity.this, ollamaModel.getText().toString());
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
    }
}
