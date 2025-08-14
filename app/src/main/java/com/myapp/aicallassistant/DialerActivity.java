package com.myapp.aicallassistant;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.telecom.TelecomManager;
import android.app.role.RoleManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class DialerActivity extends AppCompatActivity {
    private static final int REQ_CALL_PERM = 2001;
    private static final int REQ_ROLE_DIALER = 2002;

    EditText numberInput;
    Button callBtn;
    Button askDefaultBtn;
    Button contactsBtn;
    android.widget.Switch aiCallSwitch;
    EditText aiReasonInput;
    android.widget.Spinner aiVoiceSpinner;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dialer);

        numberInput = findViewById(R.id.numberInput);
        callBtn = findViewById(R.id.callBtn);
        askDefaultBtn = findViewById(R.id.askDefaultDialerBtn);
        contactsBtn = findViewById(R.id.openContactsBtn);
        aiCallSwitch = findViewById(R.id.aiCallSwitch);
        aiReasonInput = findViewById(R.id.aiReasonInput);
        aiVoiceSpinner = findViewById(R.id.aiVoiceSpinner);

        callBtn.setOnClickListener(v -> placeCall());
        askDefaultBtn.setOnClickListener(v -> requestDefaultDialer());
        contactsBtn.setOnClickListener(v -> startActivity(new Intent(this, ContactsActivity.class)));

        // voice styles list
        String[] styles = new String[]{"طفل","طفلة","شاب","شابة","رجل عجوز","امرأة عجوز","مرعب وضخم","ساخر"};
        android.widget.ArrayAdapter<String> adapter = new android.widget.ArrayAdapter<>(this, android.R.layout.simple_spinner_item, styles);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        aiVoiceSpinner.setAdapter(adapter);
        int defaultIndex = 2; // شاب
        aiVoiceSpinner.setSelection(defaultIndex);

        // If started with tel: URI, prefill number
        Intent intent = getIntent();
        if (intent != null && intent.getData() != null && "tel".equals(intent.getData().getScheme())) {
            String num = intent.getData().getSchemeSpecificPart();
            numberInput.setText(num);
        }
    }

    private void placeCall() {
        String number = numberInput.getText() == null ? null : numberInput.getText().toString().trim();
        if (number == null || number.isEmpty()) {
            Toast.makeText(this, "أدخل رقم الهاتف", Toast.LENGTH_SHORT).show();
            return;
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CALL_PHONE}, REQ_CALL_PERM);
            return;
        }

        if (aiCallSwitch.isChecked()) {
            String reason = aiReasonInput.getText() == null ? "" : aiReasonInput.getText().toString().trim();
            String style = (String) aiVoiceSpinner.getSelectedItem();
            AIAssistController.setPendingOutgoing(number, reason, style);
        } else {
            AIAssistController.clear();
        }

        Uri uri = Uri.fromParts("tel", number, null);
        Intent call = new Intent(Intent.ACTION_CALL, uri);
        startActivity(call);
    }

    private void requestDefaultDialer() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            RoleManager roleManager = getSystemService(RoleManager.class);
            if (roleManager != null && roleManager.isRoleAvailable(RoleManager.ROLE_DIALER)) {
                if (!roleManager.isRoleHeld(RoleManager.ROLE_DIALER)) {
                    Intent intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_DIALER);
                    startActivityForResult(intent, REQ_ROLE_DIALER);
                } else {
                    Toast.makeText(this, "تم التعيين مسبقًا كتطبيق الاتصال الافتراضي", Toast.LENGTH_SHORT).show();
                }
            }
        } else {
            TelecomManager telecomManager = (TelecomManager) getSystemService(TELECOM_SERVICE);
            Intent intent = new Intent(TelecomManager.ACTION_CHANGE_DEFAULT_DIALER);
            intent.putExtra(TelecomManager.EXTRA_CHANGE_DEFAULT_DIALER_PACKAGE_NAME, getPackageName());
            startActivity(intent);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_CALL_PERM) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                placeCall();
            } else {
                Toast.makeText(this, "إذن الاتصال ضروري لإجراء مكالمات", Toast.LENGTH_SHORT).show();
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_ROLE_DIALER) {
            Toast.makeText(this, resultCode == RESULT_OK ? "تم التعيين كتطبيق الاتصال الافتراضي" : "لم يتم التعيين", Toast.LENGTH_SHORT).show();
        }
    }
}