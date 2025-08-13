package com.myapp.aicallassistant;

import android.content.Context;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;

import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

public class VoiceResponder {
    private static TextToSpeech tts;
    private static boolean initialized = false;

    public static void initialize(Context context) {
        if (initialized) return;
        tts = new TextToSpeech(context.getApplicationContext(), status -> {
            if (status == TextToSpeech.SUCCESS) {
                int result = tts.setLanguage(new Locale("ar"));
                if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                    tts.setLanguage(Locale.US);
                }
                initialized = true;
            }
        });
    }

    public static void replyNow(String message, String voice) {
        if (tts == null) return;
        float pitch = "female".equalsIgnoreCase(voice) ? 1.2f : 0.9f;
        float rate = 1.0f;
        tts.setPitch(pitch);
        tts.setSpeechRate(rate);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            tts.speak(message, TextToSpeech.QUEUE_FLUSH, null, "aicall_msg");
        } else {
            tts.speak(message, TextToSpeech.QUEUE_FLUSH, null);
        }
    }
}