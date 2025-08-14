package com.myapp.aicallassistant;

import android.content.Context;
import android.content.SharedPreferences;

public class AppSettings {
    private static final String PREFS = "app_settings";
    private static final String KEY_WHISPER_URL = "whisper_url";
    private static final String KEY_OLLAMA_URL = "ollama_url";
    private static final String KEY_OLLAMA_MODEL = "ollama_model";
    private static final String KEY_AUTO_REPLY_DEFAULT = "auto_reply_default";

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

    public static boolean isAutoReplyDefault(Context context) {
        return prefs(context).getBoolean(KEY_AUTO_REPLY_DEFAULT, false);
    }

    public static void setAutoReplyDefault(Context context, boolean enabled) {
        prefs(context).edit().putBoolean(KEY_AUTO_REPLY_DEFAULT, enabled).apply();
    }
}