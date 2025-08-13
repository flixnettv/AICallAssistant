package com.myapp.aicallassistant;

import android.content.Context;
import android.speech.tts.TextToSpeech;

import java.util.Locale;

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

    public static void replyWithStyle(String message, String style) {
        if (tts == null) return;
        float pitch = 1.0f;
        float rate = 1.0f;
        switch (style) {
            case "طفل":
                pitch = 1.6f; rate = 1.15f; break;
            case "طفلة":
                pitch = 1.8f; rate = 1.2f; break;
            case "شاب":
                pitch = 1.1f; rate = 1.05f; break;
            case "شابة":
                pitch = 1.3f; rate = 1.1f; break;
            case "رجل عجوز":
                pitch = 0.8f; rate = 0.9f; break;
            case "امرأة عجوز":
                pitch = 0.9f; rate = 0.95f; break;
            case "مرعب وضخم":
                pitch = 0.6f; rate = 0.9f; break;
            case "عاهرة":
                // Replace inappropriate style label with neutral variant for safety
                pitch = 1.2f; rate = 1.05f; break;
            default:
                pitch = 1.0f; rate = 1.0f; break;
        }
        tts.setPitch(pitch);
        tts.setSpeechRate(rate);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            tts.speak(message, TextToSpeech.QUEUE_FLUSH, null, "aicall_msg_style");
        } else {
            tts.speak(message, TextToSpeech.QUEUE_FLUSH, null);
        }
    }
}