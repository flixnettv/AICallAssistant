package com.myapp.aicallassistant;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class AiCallSchedulerReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String number = intent.getStringExtra("number");
        String purpose = intent.getStringExtra("purpose");
        String style = intent.getStringExtra("style");
        boolean autoStart = intent.getBooleanExtra("autoStart", true);

        Intent open = new Intent(context, OutgoingAiCallActivity.class);
        open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        if (number != null) open.putExtra("prefill_number", number);
        if (purpose != null) open.putExtra("prefill_purpose", purpose);
        if (style != null) open.putExtra("prefill_style", style);
        open.putExtra("autoStart", autoStart);
        context.startActivity(open);
    }
}