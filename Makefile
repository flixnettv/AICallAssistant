# ========================================
# Contact Management & Communication App
# Makefile for Development Operations
# ========================================

.PHONY: help install setup build run clean test deploy

# Default target
help:
	@echo "🚀 تطبيق إدارة جهات الاتصال والذكاء الاصطناعي"
	@echo "=================================================="
	@echo "الأوامر المتاحة:"
	@echo ""
	@echo "📦 التثبيت والإعداد:"
	@echo "  make install          - تثبيت جميع التبعيات"
	@echo "  make setup            - إعداد البيئة الكاملة"
	@echo "  make setup-ai         - إعداد خدمات الذكاء الاصطناعي"
	@echo "  make setup-db         - إعداد قاعدة البيانات"
	@echo "  make setup-permissions - إعداد الأذونات"
	@echo ""
	@echo "🏗️  البناء والتشغيل:"
	@echo "  make build            - بناء التطبيق (Release)"
	@echo "  make build-debug      - بناء التطبيق (Debug)"
	@echo "  make run-android      - تشغيل على Android"
	@echo "  make run-ios          - تشغيل على iOS"
	@echo ""
	@echo "🔧 التطوير والاختبار:"
	@echo "  make dev              - إعداد بيئة التطوير"
	@echo "  make test             - تشغيل الاختبارات"
	@echo "  make lint             - فحص الكود"
	@echo "  make format           - تنسيق الكود"
	@echo ""
	@echo "🐳 خدمات الذكاء الاصطناعي:"
	@echo "  make ai-start         - تشغيل خدمات الذكاء الاصطناعي"
	@echo "  make ai-stop          - إيقاف خدمات الذكاء الاصطناعي"
	@echo "  make ai-restart       - إعادة تشغيل الخدمات"
	@echo "  make ai-logs          - عرض سجلات الخدمات"
	@echo ""
	@echo "🗄️  قاعدة البيانات:"
	@echo "  make db-start         - تشغيل قاعدة البيانات"
	@echo "  make db-stop          - إيقاف قاعدة البيانات"
	@echo "  make db-reset         - إعادة تعيين قاعدة البيانات"
	@echo ""
	@echo "🧹 الصيانة:"
	@echo "  make clean            - تنظيف المشروع"
	@echo "  make reset            - إعادة تعيين كاملة"
	@echo "  make deploy           - نشر التطبيق"
	@echo ""

# Installation and Setup
install:
	@echo "📦 تثبيت التبعيات..."
	@chmod +x install.sh
	@./install.sh

setup: install
	@echo "⚙️  إعداد البيئة الكاملة..."
	@chmod +x setup-ai.sh setup-database.sh setup-permissions.sh setup-dev.sh
	@./setup-ai.sh
	@./setup-database.sh
	@./setup-permissions.sh
	@./setup-dev.sh

setup-ai:
	@echo "🤖 إعداد خدمات الذكاء الاصطناعي..."
	@chmod +x setup-ai.sh
	@./setup-ai.sh

setup-db:
	@echo "🗄️  إعداد قاعدة البيانات..."
	@chmod +x setup-database.sh
	@./setup-database.sh

setup-permissions:
	@echo "🔐 إعداد الأذونات..."
	@chmod +x setup-permissions.sh
	@./setup-permissions.sh

# Building and Running
build:
	@echo "🏗️  بناء التطبيق (Release)..."
	@chmod +x build-android.sh
	@./build-android.sh

build-debug:
	@echo "🏗️  بناء التطبيق (Debug)..."
	@chmod +x build-android-debug.sh
	@./build-android-debug.sh

run-android:
	@echo "🚀 تشغيل التطبيق على Android..."
	@chmod +x run-android.sh
	@./run-android.sh

run-ios:
	@echo "🚀 تشغيل التطبيق على iOS..."
	@chmod +x run-ios.sh
	@./run-ios.sh

# Development and Testing
dev:
	@echo "🔧 إعداد بيئة التطوير..."
	@chmod +x setup-dev.sh
	@./setup-dev.sh

test:
	@echo "🧪 تشغيل الاختبارات..."
	@npm test

lint:
	@echo "🔍 فحص الكود..."
	@npm run lint

format:
	@echo "✨ تنسيق الكود..."
	@npx prettier --write "src/**/*.{js,jsx,ts,tsx}"
	@npx prettier --write "*.{js,jsx,ts,tsx,json,md}"

# AI Services
ai-start:
	@echo "🤖 تشغيل خدمات الذكاء الاصطناعي..."
	@docker-compose up -d coqui-tts open-tts ollama speech-recognition ai-conversation spam-detection caller-id

ai-stop:
	@echo "🛑 إيقاف خدمات الذكاء الاصطناعي..."
	@docker-compose stop coqui-tts open-tts ollama speech-recognition ai-conversation spam-detection caller-id

ai-restart:
	@echo "🔄 إعادة تشغيل خدمات الذكاء الاصطناعي..."
	@make ai-stop
	@make ai-start

ai-logs:
	@echo "📋 عرض سجلات خدمات الذكاء الاصطناعي..."
	@docker-compose logs -f coqui-tts open-tts ollama speech-recognition ai-conversation spam-detection caller-id

# Database Services
db-start:
	@echo "🗄️  تشغيل قاعدة البيانات..."
	@docker-compose up -d postgres mongodb redis elasticsearch

db-stop:
	@echo "🛑 إيقاف قاعدة البيانات..."
	@docker-compose stop postgres mongodb redis elasticsearch

db-reset:
	@echo "🔄 إعادة تعيين قاعدة البيانات..."
	@docker-compose down -v
	@docker-compose up -d postgres mongodb redis elasticsearch

# All Services
services-start:
	@echo "🚀 تشغيل جميع الخدمات..."
	@docker-compose up -d

services-stop:
	@echo "🛑 إيقاف جميع الخدمات..."
	@docker-compose down

services-restart:
	@echo "🔄 إعادة تشغيل جميع الخدمات..."
	@make services-stop
	@make services-start

services-logs:
	@echo "📋 عرض سجلات جميع الخدمات..."
	@docker-compose logs -f

# Maintenance
clean:
	@echo "🧹 تنظيف المشروع..."
	@cd android && ./gradlew clean
	@rm -rf node_modules
	@rm -rf android/app/build
	@rm -rf ios/build
	@rm -rf dist
	@echo "✅ تم التنظيف بنجاح!"

reset: clean
	@echo "🔄 إعادة تعيين كاملة..."
	@make services-stop
	@docker system prune -f
	@docker volume prune -f
	@npm install
	@make setup

deploy:
	@echo "🚀 نشر التطبيق..."
	@make build
	@echo "📱 تم بناء APK بنجاح!"
	@echo "📁 الموقع: android/app/build/outputs/apk/release/"

# Quick Commands
quick-start: setup services-start
	@echo "🚀 تم الإعداد السريع بنجاح!"
	@echo "📱 يمكنك الآن بناء التطبيق باستخدام: make build"

quick-stop: services-stop
	@echo "🛑 تم إيقاف جميع الخدمات!"

# Status Commands
status:
	@echo "📊 حالة الخدمات:"
	@docker-compose ps

health:
	@echo "🏥 فحص صحة الخدمات..."
	@curl -f http://localhost:5002/health || echo "❌ Coqui TTS غير متاح"
	@curl -f http://localhost:5003/health || echo "❌ Open TTS غير متاح"
	@curl -f http://localhost:11434/api/tags || echo "❌ Ollama غير متاح"
	@curl -f http://localhost:5004/health || echo "❌ Speech Recognition غير متاح"
	@curl -f http://localhost:5005/health || echo "❌ AI Conversation غير متاح"
	@curl -f http://localhost:5006/health || echo "❌ Spam Detection غير متاح"
	@curl -f http://localhost:5007/health || echo "❌ Caller ID غير متاح"

# Development Workflow
dev-workflow: clean install setup-ai setup-db services-start
	@echo "🎯 تم إعداد بيئة التطوير الكاملة!"
	@echo "📱 يمكنك الآن البدء في التطوير"

# Production Setup
prod-setup: clean install setup-ai setup-db
	@echo "🏭 تم إعداد بيئة الإنتاج!"
	@echo "📱 يمكنك الآن بناء التطبيق للإنتاج"

# Help for specific commands
help-install:
	@echo "📦 مساعدة التثبيت:"
	@echo "  make install          - تثبيت جميع التبعيات الأساسية"
	@echo "  make setup            - إعداد البيئة الكاملة"
	@echo "  make quick-start      - إعداد سريع للبدء"

help-ai:
	@echo "🤖 مساعدة الذكاء الاصطناعي:"
	@echo "  make ai-start         - تشغيل خدمات الذكاء الاصطناعي"
	@echo "  make ai-stop          - إيقاف الخدمات"
	@echo "  make ai-restart       - إعادة تشغيل الخدمات"
	@echo "  make ai-logs          - عرض السجلات"

help-db:
	@echo "🗄️  مساعدة قاعدة البيانات:"
	@echo "  make db-start         - تشغيل قواعد البيانات"
	@echo "  make db-stop          - إيقاف قواعد البيانات"
	@echo "  make db-reset         - إعادة تعيين قواعد البيانات"

help-build:
	@echo "🏗️  مساعدة البناء:"
	@echo "  make build            - بناء نسخة الإنتاج"
	@echo "  make build-debug      - بناء نسخة التطوير"
	@echo "  make run-android      - تشغيل على Android"
	@echo "  make run-ios          - تشغيل على iOS"