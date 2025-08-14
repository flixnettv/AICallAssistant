package com.myapp.aicallassistant;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class HttpTestUtils {
	public static boolean pingJsonPost(String urlStr) {
		if (urlStr == null || urlStr.trim().isEmpty()) return false;
		try {
			URL url = new URL(urlStr);
			HttpURLConnection c = (HttpURLConnection) url.openConnection();
			c.setConnectTimeout(Config.HTTP_TIMEOUT_MS);
			c.setReadTimeout(Config.HTTP_TIMEOUT_MS);
			c.setRequestMethod("POST");
			c.setDoOutput(true);
			c.setRequestProperty("Content-Type", "application/json");
			try (OutputStream os = c.getOutputStream()) {
				os.write("{}".getBytes());
			}
			int code = c.getResponseCode();
			return code >= 200 && code < 500; // any reachable response
		} catch (Exception e) {
			return false;
		}
	}

	public static boolean pingJsonGet(String urlStr) {
		if (urlStr == null || urlStr.trim().isEmpty()) return false;
		try {
			URL url = new URL(urlStr);
			HttpURLConnection c = (HttpURLConnection) url.openConnection();
			c.setConnectTimeout(Config.HTTP_TIMEOUT_MS);
			c.setReadTimeout(Config.HTTP_TIMEOUT_MS);
			c.setRequestMethod("GET");
			return c.getResponseCode() >= 200 && c.getResponseCode() < 400;
		} catch (Exception e) {
			return false;
		}
	}

	public static String httpGet(String urlStr) {
		if (urlStr == null || urlStr.trim().isEmpty()) return "";
		try {
			URL url = new URL(urlStr);
			HttpURLConnection c = (HttpURLConnection) url.openConnection();
			c.setConnectTimeout(Config.HTTP_TIMEOUT_MS);
			c.setReadTimeout(Config.HTTP_TIMEOUT_MS);
			c.setRequestMethod("GET");
			if (c.getResponseCode() >= 200 && c.getResponseCode() < 300) {
				return StreamUtils.readFully(c.getInputStream());
			}
		} catch (Exception ignored) { }
		return "";
	}

	public static String pickFirstModel(String tagsJson) {
		try {
			org.json.JSONObject json = new org.json.JSONObject(tagsJson);
			org.json.JSONArray models = json.optJSONArray("models");
			if (models != null && models.length() > 0) {
				org.json.JSONObject m = models.getJSONObject(0);
				String name = m.optString("name");
				if (name != null && !name.isEmpty()) return name;
			}
		} catch (Exception ignored) { }
		return "llama3";
	}
}