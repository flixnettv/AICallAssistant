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
        VoiceResponder.replyWithStyle("مكالمة واردة من " + number, MainActivity.selectedVoiceStyle);
    }

    @Override
    public void onCallRemoved(Call call) {
        super.onCallRemoved(call);
    }
}