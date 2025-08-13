package com.myapp.aicallassistant;

import android.content.Context;

public class SpeechProcessor {
    public interface Listener {
        void onPartialResult(String text);
        void onFinalResult(String text);
        void onError(Exception e);
    }

    private Listener listener;

    public SpeechProcessor(Listener listener) {
        this.listener = listener;
    }

    public void start(Context context, boolean offlinePreferred) {
        boolean online = !offlinePreferred && ConnectivityUtils.isOnline(context);
        if (online) {
            // TODO: Hook to online ASR provider (OpenAI/Whisper server, etc.)
        } else {
            // TODO: Initialize Vosk offline recognizer with model from assets
        }
    }

    public void stop() {
        // TODO: Stop ASR
    }
}