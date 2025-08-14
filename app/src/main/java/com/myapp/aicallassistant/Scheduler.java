package com.myapp.aicallassistant;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

public class Scheduler extends BroadcastReceiver {
	public static void scheduleCall(Context context, String number, String reason, long timeMillis) {
		AppSettings.setScheduledCall(context, number, reason, timeMillis);
		Intent i = new Intent(context, Scheduler.class);
		PendingIntent pi = PendingIntent.getBroadcast(context, 1001, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
		AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
		if (am != null) am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, timeMillis, pi);
	}

	@Override
	public void onReceive(Context context, Intent intent) {
		String number = AppSettings.getScheduledNumber(context);
		String reason = AppSettings.getScheduledReason(context);
		if (number == null || number.isEmpty()) return;
		AIAssistController.setPendingOutgoing(number, reason, MainActivity.selectedVoiceStyle);
		Uri uri = Uri.fromParts("tel", number, null);
		Intent call = new Intent(Intent.ACTION_CALL, uri);
		call.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		context.startActivity(call);
	}
}