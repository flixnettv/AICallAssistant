package com.myapp.aicallassistant;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class OutgoingAiCallActivity extends AppCompatActivity {
    private EditText phoneNumber;
    private EditText callPurpose;
    private Spinner voiceStyleSpinner;
    private Button startAiCallBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_outgoing_ai_call);

        phoneNumber = findViewById(R.id.phoneNumber);
        callPurpose = findViewById(R.id.callPurpose);
        voiceStyleSpinner = findViewById(R.id.voiceStyleSpinner);
        startAiCallBtn = findViewById(R.id.startAiCallBtn);

        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, MainActivity.VOICE_STYLES);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        voiceStyleSpinner.setAdapter(adapter);

        String prefillNumber = getIntent().getStringExtra("prefill_number");
        String prefillPurpose = getIntent().getStringExtra("prefill_purpose");
        String prefillStyle = getIntent().getStringExtra("prefill_style");
        boolean autoStart = getIntent().getBooleanExtra("autoStart", false);
        if (prefillNumber != null) phoneNumber.setText(prefillNumber);
        if (prefillPurpose != null) callPurpose.setText(prefillPurpose);
        if (prefillStyle != null) {
            for (int i = 0; i < MainActivity.VOICE_STYLES.length; i++) {
                if (MainActivity.VOICE_STYLES[i].equals(prefillStyle)) {
                    voiceStyleSpinner.setSelection(i);
                    break;
                }
            }
        }

        startAiCallBtn.setOnClickListener(v -> startCall());
        if (autoStart) startCall();
    }

    private void startCall() {
        String number = phoneNumber.getText().toString().trim();
        String purpose = callPurpose.getText().toString().trim();
        String style = (String) voiceStyleSpinner.getSelectedItem();
        if (number.isEmpty()) {
            Toast.makeText(this, "أدخل رقم الهاتف", Toast.LENGTH_SHORT).show();
            return;
        }
        VoiceResponder.initialize(getApplicationContext());
        String intro = purpose.isEmpty() ? "سأجري المكالمة نيابةً عنك." : ("سأتواصل معهم بخصوص: " + purpose);
        VoiceResponder.replyWithStyle(intro, style);

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CALL_PHONE}, 2);
            return;
        }
        Intent intent = new Intent(Intent.ACTION_CALL);
        intent.setData(Uri.parse("tel:" + number));
        startActivity(intent);
    }
}