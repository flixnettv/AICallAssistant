package com.myapp.aicallassistant;

import android.content.Context;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;

import org.vosk.Model;
import org.vosk.Recognizer;

import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

public class SpeechProcessor {
    public interface Listener {
        void onPartialResult(String text);
        void onFinalResult(String text);
        void onError(Exception e);
    }

    private Listener listener;

    private Thread recordThread;
    private volatile boolean isRecording = false;

    private static Model voskModel;

    public SpeechProcessor(Listener listener) {
        this.listener = listener;
    }

    public void start(Context context, boolean offlinePreferred) {
        boolean hasWhisper = AppSettings.getWhisperServerUrl(context) != null && !AppSettings.getWhisperServerUrl(context).trim().isEmpty();
        boolean canTryOnline = !offlinePreferred && ConnectivityUtils.isOnline(context) && hasWhisper;
        if (canTryOnline) {
            startRecordForOnline(context, true);
        } else {
            startVoskOffline(context);
        }
    }

    public void stop() {
        isRecording = false;
        if (recordThread != null) {
            try { recordThread.join(1000); } catch (InterruptedException ignored) {}
        }
    }

    private void startVoskOffline(Context context) {
        if (voskModel == null) {
            try {
                voskModel = new Model(AssetUtils.syncAssetDir(context, "models/vosk_model"));
            } catch (IOException e) {
                if (listener != null) listener.onError(e);
                return;
            }
        }

        final int bufferSize = AudioRecord.getMinBufferSize(Config.SAMPLE_RATE,
                AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT);
        final Recognizer recognizer = new Recognizer(voskModel, Config.SAMPLE_RATE);

        isRecording = true;
        recordThread = new Thread(() -> {
            AudioRecord recorder = new AudioRecord(MediaRecorder.AudioSource.MIC,
                    Config.SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO,
                    AudioFormat.ENCODING_PCM_16BIT, bufferSize);
            byte[] buffer = new byte[bufferSize];
            try {
                recorder.startRecording();
                long endTime = System.currentTimeMillis() + Config.RECORD_MS;
                while (isRecording && System.currentTimeMillis() < endTime) {
                    int n = recorder.read(buffer, 0, buffer.length);
                    if (n > 0) {
                        if (recognizer.acceptWaveForm(buffer, n)) {
                            String result = recognizer.getResult();
                            String text = new org.json.JSONObject(result).optString("text", "");
                            if (listener != null && !text.isEmpty()) listener.onPartialResult(text);
                        } else {
                            String partial = recognizer.getPartialResult();
                            String text = new org.json.JSONObject(partial).optString("partial", "");
                            if (listener != null && !text.isEmpty()) listener.onPartialResult(text);
                        }
                    }
                }
                String finalRes = recognizer.getFinalResult();
                String text = new org.json.JSONObject(finalRes).optString("text", "");
                if (listener != null) listener.onFinalResult(text);
            } catch (Exception e) {
                if (listener != null) listener.onError(e);
            } finally {
                try { recorder.stop(); } catch (Exception ignored) {}
                recorder.release();
                recognizer.close();
            }
        }, "vosk-recorder");
        recordThread.start();
    }

    private void startRecordForOnline(Context context, boolean allowFallback) {
        final int bufferSize = AudioRecord.getMinBufferSize(Config.SAMPLE_RATE,
                AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT);
        isRecording = true;
        recordThread = new Thread(() -> {
            AudioRecord recorder = new AudioRecord(MediaRecorder.AudioSource.MIC,
                    Config.SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO,
                    AudioFormat.ENCODING_PCM_16BIT, bufferSize);
            byte[] buffer = new byte[bufferSize];
            ByteArrayOutputStream pcm = new ByteArrayOutputStream();
            boolean failed = false;
            try {
                recorder.startRecording();
                long endTime = System.currentTimeMillis() + Config.RECORD_MS;
                while (isRecording && System.currentTimeMillis() < endTime) {
                    int n = recorder.read(buffer, 0, buffer.length);
                    if (n > 0) pcm.write(buffer, 0, n);
                }
                byte[] wavData = WavUtils.pcmToWav(pcm.toByteArray(), Config.SAMPLE_RATE, 1, 16);
                String text = sendToWhisper(context, wavData);
                if (text == null || text.trim().isEmpty()) {
                    failed = true;
                } else {
                    if (listener != null) listener.onFinalResult(text);
                }
            } catch (Exception e) {
                failed = true;
                if (listener != null) listener.onError(e);
            } finally {
                try { recorder.stop(); } catch (Exception ignored) {}
                recorder.release();
            }
            if (allowFallback && failed) {
                // Seamless fallback to offline
                startVoskOffline(context);
            }
        }, "online-recorder");
        recordThread.start();
    }

    private String sendToWhisper(Context context, byte[] wavData) throws IOException {
        String serverUrl = AppSettings.getWhisperServerUrl(context);
        if (serverUrl == null || serverUrl.isEmpty()) return "";
        URL url = new URL(serverUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setConnectTimeout(Config.HTTP_TIMEOUT_MS);
        conn.setReadTimeout(Config.HTTP_TIMEOUT_MS);
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("Content-Type", "audio/wav");
        try (DataOutputStream dos = new DataOutputStream(conn.getOutputStream())) {
            dos.write(wavData);
        }
        int code = conn.getResponseCode();
        if (code == 200) {
            String body = StreamUtils.readFully(conn.getInputStream());
            try {
                org.json.JSONObject json = new org.json.JSONObject(body);
                return json.optString("text", body);
            } catch (Exception ignored) {
                return body;
            }
        } else {
            return "";
        }
    }
}