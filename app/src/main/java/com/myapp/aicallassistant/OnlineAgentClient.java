package com.myapp.aicallassistant;

import org.json.JSONObject;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

public class OnlineAgentClient {
    public static String generateReplyEgyptian(String userText) throws IOException {
        if (Config.OLLAMA_SERVER_URL == null || Config.OLLAMA_SERVER_URL.isEmpty()) {
            return "";
        }
        String endpoint = Config.OLLAMA_SERVER_URL;
        if (!endpoint.endsWith("/")) endpoint += "/";
        endpoint += "api/generate";

        String systemPrompt = "انت مساعد صوتي ودود ترد باللهجة المصرية العامية فقط. " +
                "خلي ردودك قصيرة وواضحة ومحترمة. تجنب الفصحى وأي لهجات عربية أخرى. " +
                "لو فيه التباس، اسأل سؤال بسيط للتوضيح.\n\n";
        String prompt = systemPrompt + "المستخدم قال: '" + userText + "'\nرد باللهجة المصرية:";

        JSONObject body = new JSONObject();
        JSONObject options = new JSONObject();
        try {
            body.put("model", Config.OLLAMA_MODEL);
            body.put("prompt", prompt);
            body.put("stream", false);
            options.put("temperature", 0.6);
            options.put("num_predict", 120);
            body.put("options", options);
        } catch (Exception ignored) {}

        URL url = new URL(endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setConnectTimeout(Config.HTTP_TIMEOUT_MS);
        conn.setReadTimeout(Config.HTTP_TIMEOUT_MS);
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");
        try (DataOutputStream dos = new DataOutputStream(conn.getOutputStream())) {
            dos.write(body.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8));
        }
        int code = conn.getResponseCode();
        if (code == 200) {
            String resp = StreamUtils.readFully(conn.getInputStream());
            try {
                JSONObject json = new JSONObject(resp);
                return json.optString("response", resp).trim();
            } catch (Exception e) {
                return resp.trim();
            }
        }
        return "";
    }
}