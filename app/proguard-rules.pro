# Keep Vosk classes and JNI
-keep class org.vosk.** { *; }
-keep class com.alphacephei.** { *; }

# Keep model manager and broadcast receiver
-keep class com.myapp.aicallassistant.** { *; }

# Remove logging
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
}