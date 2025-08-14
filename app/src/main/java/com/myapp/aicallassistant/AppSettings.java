package com.myapp.aicallassistant;

import android.content.Context;
import android.content.SharedPreferences;

public class AppSettings {
    private static final String PREFS = "app_settings";
    private static final String KEY_WHISPER_URL = "whisper_url";
    private static final String KEY_OLLAMA_URL = "ollama_url";
    private static final String KEY_OLLAMA_MODEL = "ollama_model";
    private static final String KEY_SCHEDULED_NUMBER = "scheduled_number";
    private static final String KEY_SCHEDULED_REASON = "scheduled_reason";
    private static final String KEY_SCHEDULED_TIME_MS = "scheduled_time";

    private static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    public static String getWhisperServerUrl(Context context) {
        String def = Config.WHISPER_SERVER_URL == null ? "" : Config.WHISPER_SERVER_URL;
        return prefs(context).getString(KEY_WHISPER_URL, def);
    }

    public static void setWhisperServerUrl(Context context, String url) {
        prefs(context).edit().putString(KEY_WHISPER_URL, url == null ? "" : url.trim()).apply();
    }

    public static String getOllamaServerUrl(Context context) {
        String def = Config.OLLAMA_SERVER_URL == null ? "" : Config.OLLAMA_SERVER_URL;
        return prefs(context).getString(KEY_OLLAMA_URL, def);
    }

    public static void setOllamaServerUrl(Context context, String url) {
        prefs(context).edit().putString(KEY_OLLAMA_URL, url == null ? "" : url.trim()).apply();
    }

    public static String getOllamaModel(Context context) {
        String def = Config.OLLAMA_MODEL == null ? "llama3" : Config.OLLAMA_MODEL;
        return prefs(context).getString(KEY_OLLAMA_MODEL, def);
    }

    public static void setOllamaModel(Context context, String model) {
        prefs(context).edit().putString(KEY_OLLAMA_MODEL, model == null ? "llama3" : model.trim()).apply();
    }

    public static void setScheduledCall(Context context, String number, String reason, long timeMillis) {
        prefs(context).edit()
                .putString(KEY_SCHEDULED_NUMBER, number == null ? "" : number.trim())
                .putString(KEY_SCHEDULED_REASON, reason == null ? "" : reason.trim())
                .putLong(KEY_SCHEDULED_TIME_MS, timeMillis)
                .apply();
    }

    public static String getScheduledNumber(Context context) {
        return prefs(context).getString(KEY_SCHEDULED_NUMBER, "");
    }

    public static String getScheduledReason(Context context) {
        return prefs(context).getString(KEY_SCHEDULED_REASON, "");
    }

    public static long getScheduledTime(Context context) {
        return prefs(context).getLong(KEY_SCHEDULED_TIME_MS, 0);
    }
}