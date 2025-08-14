package com.myapp.aicallassistant;

import android.content.Context;

public class AIAssistController implements OnlineAgentClient.ContextProvider {
	private static String pendingNumber = null;
	private static String pendingReason = null;
	private static String pendingVoice = null;

	public static synchronized void setPendingOutgoing(String number, String reason, String voice) {
		pendingNumber = number;
		pendingReason = reason;
		pendingVoice = voice;
	}

	public static synchronized boolean hasPendingFor(String number) {
		return pendingNumber != null && number != null && number.equals(pendingNumber);
	}

	public static synchronized void clear() {
		pendingNumber = null;
		pendingReason = null;
		pendingVoice = null;
	}

	public static void startConversation(Context context, String number) {
		String reason;
		String voice;
		synchronized (AIAssistController.class) {
			reason = pendingReason;
			voice = pendingVoice == null ? MainActivity.selectedVoiceStyle : pendingVoice;
		}
		if (reason == null) reason = "التواصل بشأن أمر مهم";

		String opening;
		boolean online = ConnectivityUtils.isOnline(context)
				&& AppSettings.getOllamaServerUrl(context) != null
				&& !AppSettings.getOllamaServerUrl(context).trim().isEmpty();
		if (online) {
			try {
				String prompt = "اتصلت نيابة عن المستخدم. السبب: " + reason + ". قدم نفسك باختصار وابدأ المحادثة بأدب باللهجة المصرية";
				opening = OnlineAgentClient.generateReplyEgyptian(() -> context.getApplicationContext(), prompt);
			} catch (Exception e) {
				opening = "مرحبًا! أنا مساعد ذكي أتصل نيابة عن صديقي بخصوص: " + reason + ".";
			}
		} else {
			opening = "مرحبًا! أنا مساعد ذكي أتصل نيابة عن صديقي بخصوص: " + reason + ".";
		}
		VoiceResponder.replyToCallWithStyle(context.getApplicationContext(), opening, voice);
		clear();
	}

	private Context appContext;
	public AIAssistController(Context ctx) { this.appContext = ctx.getApplicationContext(); }
	@Override public Context getAppContext() { return appContext; }
}