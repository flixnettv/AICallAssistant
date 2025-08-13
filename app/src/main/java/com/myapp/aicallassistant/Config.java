package com.myapp.aicallassistant;

public class Config {
    public static final String WHISPER_SERVER_URL = ""; // e.g., http://your-whisper-server:9000/inference
    public static final String OLLAMA_SERVER_URL = ""; // e.g., http://your-ollama-host:11434
    public static final String OLLAMA_MODEL = "llama3"; // or "qwen2" etc.

    public static final int RECORD_MS = 5000; // 5 seconds
    public static final int SAMPLE_RATE = 16000;
    public static final int HTTP_TIMEOUT_MS = 30000;

    public static boolean hasOnlineAsr() {
        return WHISPER_SERVER_URL != null && !WHISPER_SERVER_URL.trim().isEmpty();
    }

    public static boolean hasOnlineAgent() {
        return OLLAMA_SERVER_URL != null && !OLLAMA_SERVER_URL.trim().isEmpty();
    }
}