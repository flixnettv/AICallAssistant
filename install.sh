#!/bin/bash

# ========================================
# Contact Management & Communication App
# Installation Script
# ========================================

echo "🚀 بدء تثبيت تطبيق إدارة جهات الاتصال والذكاء الاصطناعي..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت. يرجى تثبيت Node.js أولاً."
    echo "📥 قم بتحميل Node.js من: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ يتطلب التطبيق Node.js الإصدار 16 أو أحدث."
    echo "📥 الإصدار الحالي: $(node -v)"
    echo "📥 يرجى تحديث Node.js"
    exit 1
fi

echo "✅ Node.js مثبت: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm غير مثبت. يرجى تثبيت npm أولاً."
    exit 1
fi

echo "✅ npm مثبت: $(npm -v)"

# Check if React Native CLI is installed
if ! command -v react-native &> /dev/null; then
    echo "📦 تثبيت React Native CLI..."
    npm install -g @react-native-community/cli
fi

echo "✅ React Native CLI مثبت"

# Check if Android Studio is installed (for Android development)
if [ "$OSTYPE" = "linux-gnu" ] || [ "$OSTYPE" = "darwin" ]; then
    if ! command -v adb &> /dev/null; then
        echo "⚠️  Android Studio غير مثبت أو غير مكون."
        echo "📥 قم بتحميل Android Studio من: https://developer.android.com/studio"
        echo "🔧 قم بتكوين ANDROID_HOME و PATH"
    else
        echo "✅ Android Studio مثبت ومكون"
    fi
fi

# Check if Xcode is installed (for iOS development on macOS)
if [ "$OSTYPE" = "darwin" ]; then
    if ! command -v xcodebuild &> /dev/null; then
        echo "⚠️  Xcode غير مثبت."
        echo "📥 قم بتحميل Xcode من App Store"
    else
        echo "✅ Xcode مثبت"
    fi
fi

# Install project dependencies
echo "📦 تثبيت تبعيات المشروع..."
npm install

# Install additional dependencies for AI features
echo "🤖 تثبيت مكتبات الذكاء الاصطناعي..."
npm install --save \
    @tensorflow/tfjs \
    @tensorflow/tfjs-react-native \
    @react-native-async-storage/async-storage \
    react-native-fs \
    react-native-audio-recorder-player \
    react-native-voice \
    react-native-tts \
    react-native-sound \
    react-native-permissions \
    react-native-device-info \
    react-native-background-timer \
    react-native-push-notification \
    react-native-localize \
    i18n-js

# Install development dependencies
echo "🔧 تثبيت تبعيات التطوير..."
npm install --save-dev \
    @types/react-native \
    @types/react-native-vector-icons \
    react-native-vector-icons \
    @babel/plugin-proposal-decorators

# Create necessary directories
echo "📁 إنشاء المجلدات المطلوبة..."
mkdir -p src/assets/images
mkdir -p src/assets/icons
mkdir -p src/assets/fonts
mkdir -p android/app/src/main/assets/fonts
mkdir -p android/app/src/main/res/raw

# Copy vector icons to Android
echo "📱 نسخ أيقونات Vector إلى Android..."
cp -r node_modules/react-native-vector-icons/Fonts/* android/app/src/main/assets/fonts/

# Create environment configuration
echo "⚙️  إنشاء ملف التكوين البيئي..."
cat > .env << EOL
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
FIREBASE_APP_ID=your_app_id_here

# AI Services Configuration
COQUI_TTS_URL=http://localhost:5002
OPEN_TTS_URL=http://localhost:5003
LOCAL_LLM_URL=http://localhost:11434

# API Keys (Free Services)
NUMLOOKUP_API_KEY=your_numlookup_key_here
SPAMCHECK_API_KEY=your_spamcheck_key_here
TELNYX_API_KEY=your_telnyx_key_here

# App Configuration
APP_NAME=Contact Manager Pro
APP_VERSION=1.0.0
DEBUG_MODE=true
EOL

echo "✅ تم إنشاء ملف .env"

# Create Android configuration
echo "🤖 تكوين Android..."
cat > android/app/src/main/java/com/contactmanager/MainApplication.java << EOL
package com.contactmanager;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Add custom packages here if needed
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }
}
EOL

# Create iOS configuration (if on macOS)
if [ "$OSTYPE" = "darwin" ]; then
    echo "🍎 تكوين iOS..."
    cd ios
    pod install
    cd ..
fi

# Create build scripts
echo "🔨 إنشاء سكريبتات البناء..."
cat > build-android.sh << EOL
#!/bin/bash
echo "🏗️  بناء تطبيق Android..."
cd android
./gradlew clean
./gradlew assembleRelease
echo "✅ تم بناء APK بنجاح!"
echo "📱 يمكنك العثور على APK في: android/app/build/outputs/apk/release/"
cd ..
EOL

chmod +x build-android.sh

cat > build-android-debug.sh << EOL
#!/bin/bash
echo "🏗️  بناء تطبيق Android (Debug)..."
cd android
./gradlew clean
./gradlew assembleDebug
echo "✅ تم بناء APK Debug بنجاح!"
echo "📱 يمكنك العثور على APK في: android/app/build/outputs/apk/debug/"
cd ..
EOL

chmod +x build-android-debug.sh

# Create run scripts
echo "▶️  إنشاء سكريبتات التشغيل..."
cat > run-android.sh << EOL
#!/bin/bash
echo "🚀 تشغيل التطبيق على Android..."
npx react-native run-android
EOL

chmod +x run-android.sh

if [ "$OSTYPE" = "darwin" ]; then
    cat > run-ios.sh << EOL
#!/bin/bash
echo "🚀 تشغيل التطبيق على iOS..."
npx react-native run-ios
EOL
    chmod +x run-ios.sh
fi

# Create development setup script
echo "⚙️  إنشاء سكريبت إعداد التطوير..."
cat > setup-dev.sh << EOL
#!/bin/bash
echo "🔧 إعداد بيئة التطوير..."

# Install development tools
npm install -g @react-native-community/cli
npm install -g react-native-debugger
npm install -g @babel/cli

# Install additional development dependencies
npm install --save-dev \
    @types/jest \
    @types/react-test-renderer \
    react-test-renderer \
    jest \
    @testing-library/react-native \
    @testing-library/jest-native

echo "✅ تم إعداد بيئة التطوير بنجاح!"
EOL

chmod +x setup-dev.sh

# Create AI services setup script
echo "🤖 إنشاء سكريبت إعداد خدمات الذكاء الاصطناعي..."
cat > setup-ai.sh << EOL
#!/bin/bash
echo "🤖 إعداد خدمات الذكاء الاصطناعي..."

# Install Python dependencies for AI services
if command -v python3 &> /dev/null; then
    echo "📦 تثبيت مكتبات Python للذكاء الاصطناعي..."
    pip3 install coqui-tts openai-whisper transformers torch torchaudio
    
    # Install additional AI libraries
    pip3 install speechbrain kaldi-active-grammar vosk
    
    echo "✅ تم تثبيت مكتبات Python بنجاح!"
else
    echo "⚠️  Python3 غير مثبت. يرجى تثبيت Python3 أولاً."
fi

# Install Node.js AI libraries
echo "📦 تثبيت مكتبات Node.js للذكاء الاصطناعي..."
npm install --save \
    @tensorflow/tfjs-node \
    natural \
    compromise \
    compromise-numbers \
    compromise-dates

echo "✅ تم إعداد خدمات الذكاء الاصطناعي بنجاح!"
EOL

chmod +x setup-ai.sh

# Create database setup script
echo "🗄️  إنشاء سكريبت إعداد قاعدة البيانات..."
cat > setup-database.sh << EOL
#!/bin/bash
echo "🗄️  إعداد قاعدة البيانات..."

# Install database dependencies
npm install --save \
    @react-native-async-storage/async-storage \
    react-native-sqlite-storage \
    @nozbe/watermelondb \
    @nozbe/with-observables

# Install Firebase dependencies
npm install --save \
    @react-native-firebase/app \
    @react-native-firebase/auth \
    @react-native-firebase/firestore \
    @react-native-firebase/storage \
    @react-native-firebase/messaging

echo "✅ تم إعداد قاعدة البيانات بنجاح!"
EOL

chmod +x setup-database.sh

# Create permissions setup script
echo "🔐 إنشاء سكريبت إعداد الأذونات..."
cat > setup-permissions.sh << EOL
#!/bin/bash
echo "🔐 إعداد الأذونات..."

# Android permissions
cat > android/app/src/main/AndroidManifest.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.contactmanager">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.WRITE_CONTACTS" />
    <uses-permission android:name="android.permission.CALL_PHONE" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
        <service android:name=".services.CallService" />
        <service android:name=".services.AIService" />
        <service android:name=".services.RecordingService" />
        
        <receiver android:name=".receivers.CallReceiver" />
        <receiver android:name=".receivers.BootReceiver" />
        
    </application>
</manifest>
EOF

echo "✅ تم إعداد الأذونات بنجاح!"
EOL

chmod +x setup-permissions.sh

# Create final setup instructions
echo "📋 إنشاء تعليمات التثبيت النهائية..."
cat > INSTALLATION_GUIDE.md << EOL
# دليل التثبيت - تطبيق إدارة جهات الاتصال والذكاء الاصطناعي

## 🚀 التثبيت المكتمل!

تم تثبيت جميع المكونات الأساسية بنجاح. إليك الخطوات التالية:

### 📱 بناء التطبيق

#### Android:
\`\`\`bash
# بناء نسخة الإنتاج
./build-android.sh

# بناء نسخة التطوير
./build-android-debug.sh

# تشغيل التطبيق
./run-android.sh
\`\`\`

#### iOS (macOS فقط):
\`\`\`bash
./run-ios.sh
\`\`\`

### 🤖 إعداد الذكاء الاصطناعي
\`\`\`bash
./setup-ai.sh
\`\`\`

### 🗄️ إعداد قاعدة البيانات
\`\`\`bash
./setup-database.sh
\`\`\`

### 🔐 إعداد الأذونات
\`\`\`bash
./setup-permissions.sh
\`\`\`

### 🔧 إعداد بيئة التطوير
\`\`\`bash
./setup-dev.sh
\`\`\`

## 📁 هيكل المشروع
\`\`\`
src/
├── components/          # مكونات واجهة المستخدم
├── screens/            # شاشات التطبيق
├── navigation/         # نظام التنقل
├── store/              # إدارة الحالة (Redux)
├── services/           # الخدمات والواجهات الخلفية
├── utils/              # الأدوات المساعدة
├── types/              # تعريفات TypeScript
├── constants/          # الثوابت والإعدادات
└── assets/             # الصور والأيقونات
\`\`\`

## 🌟 الميزات المتاحة
- ✅ إدارة جهات الاتصال (CRUD)
- ✅ البحث والتصفية
- ✅ المجموعات والفئات
- ✅ نظام المكالمات
- ✅ الذكاء الاصطناعي للمكالمات
- ✅ تسجيل المكالمات
- ✅ كشف الرسائل المزعجة
- ✅ معرف المتصل
- ✅ دعم اللغة العربية
- ✅ الوضع المظلم/المضيء

## 🔗 الروابط المفيدة
- 📚 [React Native Documentation](https://reactnative.dev/)
- 🤖 [TensorFlow.js](https://www.tensorflow.org/js)
- 🎤 [Coqui TTS](https://github.com/coqui-ai/TTS)
- 🔥 [Firebase](https://firebase.google.com/)

## 📞 الدعم
إذا واجهت أي مشاكل، يرجى فتح issue في مستودع GitHub.

---
**تم التطوير باستخدام React Native والذكاء الاصطناعي** 🤖✨
EOL

# Final installation message
echo ""
echo "🎉 تم التثبيت بنجاح!"
echo "=================================================="
echo "✅ تم تثبيت جميع التبعيات"
echo "✅ تم إنشاء ملفات التكوين"
echo "✅ تم إنشاء سكريبتات البناء"
echo "✅ تم إنشاء دليل التثبيت"
echo ""
echo "📋 الخطوات التالية:"
echo "1. قم بتعديل ملف .env بإعداداتك"
echo "2. شغل: ./setup-ai.sh لإعداد الذكاء الاصطناعي"
echo "3. شغل: ./setup-database.sh لإعداد قاعدة البيانات"
echo "4. شغل: ./build-android.sh لبناء التطبيق"
echo ""
echo "📖 راجع INSTALLATION_GUIDE.md للتفاصيل الكاملة"
echo "=================================================="