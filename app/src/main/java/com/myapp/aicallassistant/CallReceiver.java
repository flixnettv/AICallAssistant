package com.myapp.aicallassistant;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.telephony.TelephonyManager;

public class CallReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String state = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
        if (state == null) return;
        if (TelephonyManager.EXTRA_STATE_RINGING.equals(state)) {
            if (MainActivity.autoReply) {
                VoiceResponder.initialize(context);
                boolean online = !MainActivity.offlineMode && ConnectivityUtils.isOnline(context);
                String response = online
                        ? "مرحبًا! أنت تتحدث مع المساعد الذكي، كيف أقدر أساعدك؟"
                        : "مرحبًا! أنا مساعدك الصوتي بدون إنترنت، كيف أقدر أساعدك بشكل مبسط؟";
                VoiceResponder.replyWithStyle(response, MainActivity.selectedVoiceStyle);
            }
        }
    }
}