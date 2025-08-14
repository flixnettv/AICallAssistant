package com.myapp.aicallassistant;

import android.telecom.Call;
import android.telecom.InCallService;
import android.net.Uri;

public class MyInCallService extends InCallService {
    @Override
    public void onCallAdded(Call call) {
        super.onCallAdded(call);
        VoiceResponder.initialize(getApplicationContext());
        Call.Details d = call.getDetails();
        Uri handle = d == null ? null : d.getHandle();
        String number = handle != null ? handle.getSchemeSpecificPart() : "";
        if (call.getState() == Call.STATE_RINGING) {
            // واردة
            if (MainActivity.autoReply) {
                // لو النت غير متاح يعمل Offline تلقائيًا (مغطى في SpeechProcessor بالفعل)
                String msg = ConnectivityUtils.isOnline(getApplicationContext()) ?
                        "مرحبًا! أنت تتحدث مع المساعد الذكي، كيف أقدر أساعدك؟" :
                        "مرحبًا! أنت تتحدث مع المساعد الذكي بدون إنترنت، كيف أقدر أساعدك؟";
                VoiceResponder.replyToCallWithStyle(getApplicationContext(), msg, MainActivity.selectedVoiceStyle);
            } else {
                // لاحقًا يمكن إظهار واجهة "رد AI" ضمن UI المكالمة
                VoiceResponder.replyToCallWithStyle(getApplicationContext(), "مكالمة واردة من " + number, MainActivity.selectedVoiceStyle);
            }
        } else if (call.getState() == Call.STATE_DIALING || call.getState() == Call.STATE_CONNECTING) {
            // صادرة: لو تم اختيار اتصال AI سابقًا نبدأ المقدمة
            if (AIAssistController.hasPendingFor(number)) {
                AIAssistController.startConversation(getApplicationContext(), number);
            }
        }
    }

    @Override
    public void onCallRemoved(Call call) {
        super.onCallRemoved(call);
    }
}