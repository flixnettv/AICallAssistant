package com.myapp.aicallassistant;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.text.InputType;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Switch;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class SettingsActivity extends AppCompatActivity {
    EditText whisperUrl;
    EditText ollamaUrl;
    EditText ollamaModel;
    Button saveButton;
    Switch autoReplyDefaultSwitch;
    Button requestOverlayPermission;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        whisperUrl = findViewById(R.id.whisperUrl);
        ollamaUrl = findViewById(R.id.ollamaUrl);
        ollamaModel = findViewById(R.id.ollamaModel);
        saveButton = findViewById(R.id.saveButton);
        autoReplyDefaultSwitch = findViewById(R.id.autoReplyDefaultSwitch);
        requestOverlayPermission = findViewById(R.id.requestOverlayPermission);

        whisperUrl.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_URI);
        ollamaUrl.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_URI);

        whisperUrl.setText(AppSettings.getWhisperServerUrl(this));
        ollamaUrl.setText(AppSettings.getOllamaServerUrl(this));
        ollamaModel.setText(AppSettings.getOllamaModel(this));
        autoReplyDefaultSwitch.setChecked(AppSettings.isAutoReplyDefault(this));

        saveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AppSettings.setWhisperServerUrl(SettingsActivity.this, whisperUrl.getText().toString());
                AppSettings.setOllamaServerUrl(SettingsActivity.this, ollamaUrl.getText().toString());
                AppSettings.setOllamaModel(SettingsActivity.this, ollamaModel.getText().toString());
                AppSettings.setAutoReplyDefault(SettingsActivity.this, autoReplyDefaultSwitch.isChecked());
                Toast.makeText(SettingsActivity.this, "تم الحفظ", Toast.LENGTH_SHORT).show();
                finish();
            }
        });

        requestOverlayPermission.setOnClickListener(v -> {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (!Settings.canDrawOverlays(this)) {
                    Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                            Uri.parse("package:" + getPackageName()));
                    startActivity(intent);
                } else {
                    Toast.makeText(this, "الصلاحية مفعّلة بالفعل", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
}