/**
 * Internationalization (i18n) utility for UI localization
 * Maps UI text to different languages based on user's selected language
 */

const translations = {
    // English (default)
    'en-US': {
        // Screen Analysis
        'analyzeScreen': 'Analyze screen',
        'processing': 'Processing...',
        'searchAnalyses': 'Search analyses...',
        'clearAll': 'Clear All',
        'noAnalysesMatch': 'No analyses match',
        'noAnalysesYet': 'No analyses yet',

        // Status Messages
        'listening': 'Listening...',
        'reconnected': 'Reconnected! Listening...',
        'listeningToSession': 'Hey, Im listening to your session?',
        'listeningToInterview': 'Hey, Im listening to your interview?',
        'listeningToYourDay': 'Hey, Im listening to your day?',
        'listeningToCoach': 'Hey, Im listening to your Study Coach?',
        'listeningForSpeech': 'Listening for speech to translate...',

        // Common
        'cancel': 'Cancel',
        'save': 'Save',
        'delete': 'Delete',
        'close': 'Close',
        'search': 'Search',
    },

    // Japanese
    'ja-JP': {
        // Screen Analysis
        'analyzeScreen': '画面を分析',
        'processing': '処理中...',
        'searchAnalyses': '分析を検索...',
        'clearAll': 'すべてクリア',
        'noAnalysesMatch': '一致する分析がありません',
        'noAnalysesYet': 'まだ分析がありません',

        // Status Messages
        'listening': '聞いています...',
        'reconnected': '再接続しました！聞いています...',
        'listeningToSession': 'あなたのセッションを聞いています？',
        'listeningToInterview': 'あなたの面接を聞いています？',
        'listeningToYourDay': 'あなたの一日を聞いています？',
        'listeningToCoach': 'あなたの学習コーチを聞いています？',
        'listeningForSpeech': '翻訳する音声を聞いています...',

        // Common
        'cancel': 'キャンセル',
        'save': '保存',
        'delete': '削除',
        'close': '閉じる',
        'search': '検索',
    },

    // Spanish
    'es-ES': {
        'analyzeScreen': 'Analizar pantalla',
        'processing': 'Procesando...',
        'searchAnalyses': 'Buscar análisis...',
        'clearAll': 'Borrar todo',
        'noAnalysesMatch': 'No hay análisis que coincidan',
        'noAnalysesYet': 'Aún no hay análisis',
        'listening': 'Escuchando...',
        'reconnected': '¡Reconectado! Escuchando...',
        'listeningToSession': 'Hola, estoy escuchando tu sesión?',
        'listeningToInterview': 'Hola, estoy escuchando tu entrevista?',
        'listeningToYourDay': 'Hola, estoy escuchando tu día?',
        'listeningToCoach': 'Hola, estoy escuchando a tu Entrenador de Estudio?',
        'listeningForSpeech': 'Escuchando el habla para traducir...',
        'cancel': 'Cancelar',
        'save': 'Guardar',
        'delete': 'Eliminar',
        'close': 'Cerrar',
        'search': 'Buscar',
    },
    'es-US': {
        'analyzeScreen': 'Analizar pantalla',
        'processing': 'Procesando...',
        'searchAnalyses': 'Buscar análisis...',
        'clearAll': 'Borrar todo',
        'noAnalysesMatch': 'No hay análisis que coincidan',
        'noAnalysesYet': 'Aún no hay análisis',
        'listening': 'Escuchando...',
        'reconnected': '¡Reconectado! Escuchando...',
        'listeningToSession': 'Hola, estoy escuchando tu sesión?',
        'listeningToInterview': 'Hola, estoy escuchando tu entrevista?',
        'listeningToYourDay': 'Hola, estoy escuchando tu día?',
        'listeningToCoach': 'Hola, estoy escuchando a tu Entrenador de Estudio?',
        'listeningForSpeech': 'Escuchando el habla para traducir...',
        'cancel': 'Cancelar',
        'save': 'Guardar',
        'delete': 'Eliminar',
        'close': 'Cerrar',
        'search': 'Buscar',
    },

    // French
    'fr-FR': {
        'analyzeScreen': 'Analyser l\'écran',
        'processing': 'Traitement...',
        'searchAnalyses': 'Rechercher des analyses...',
        'clearAll': 'Tout effacer',
        'noAnalysesMatch': 'Aucune analyse ne correspond',
        'noAnalysesYet': 'Pas encore d\'analyses',
        'listening': 'À l\'écoute...',
        'reconnected': 'Reconnecté ! À l\'écoute...',
        'listeningToSession': 'Salut, j\'écoute votre session ?',
        'listeningToInterview': 'Salut, j\'écoute votre entretien ?',
        'listeningToYourDay': 'Salut, j\'écoute votre journée ?',
        'listeningToCoach': 'Salut, j\'écoute votre Coach d\'Étude ?',
        'listeningForSpeech': 'À l\'écoute de la parole à traduire...',
        'cancel': 'Annuler',
        'save': 'Enregistrer',
        'delete': 'Supprimer',
        'close': 'Fermer',
        'search': 'Rechercher',
    },
    'fr-CA': {
        'analyzeScreen': 'Analyser l\'écran',
        'processing': 'Traitement...',
        'searchAnalyses': 'Rechercher des analyses...',
        'clearAll': 'Tout effacer',
        'noAnalysesMatch': 'Aucune analyse ne correspond',
        'noAnalysesYet': 'Pas encore d\'analyses',
        'listening': 'À l\'écoute...',
        'reconnected': 'Reconnecté ! À l\'écoute...',
        'listeningToSession': 'Salut, j\'écoute votre session ?',
        'listeningToInterview': 'Salut, j\'écoute votre entretien ?',
        'listeningToYourDay': 'Salut, j\'écoute votre journée ?',
        'listeningToCoach': 'Salut, j\'écoute votre Coach d\'Étude ?',
        'listeningForSpeech': 'À l\'écoute de la parole à traduire...',
        'cancel': 'Annuler',
        'save': 'Enregistrer',
        'delete': 'Supprimer',
        'close': 'Fermer',
        'search': 'Rechercher',
    },

    // German
    'de-DE': {
        'analyzeScreen': 'Bildschirm analysieren',
        'processing': 'Verarbeitung...',
        'searchAnalyses': 'Analysen durchsuchen...',
        'clearAll': 'Alles löschen',
        'noAnalysesMatch': 'Keine übereinstimmenden Analysen',
        'noAnalysesYet': 'Noch keine Analysen',
        'listening': 'Höre zu...',
        'reconnected': 'Wiederverbunden! Höre zu...',
        'listeningToSession': 'Hey, ich höre deiner Sitzung zu?',
        'listeningToInterview': 'Hey, ich höre deinem Vorstellungsgespräch zu?',
        'listeningToYourDay': 'Hey, ich höre deinem Tag zu?',
        'listeningToCoach': 'Hey, ich höre deinem Lern-Coach zu?',
        'listeningForSpeech': 'Höre auf Sprache zum Übersetzen...',
        'cancel': 'Abbrechen',
        'save': 'Speichern',
        'delete': 'Löschen',
        'close': 'Schließen',
        'search': 'Suchen',
    },

    // Chinese (Mandarin)
    'cmn-CN': {
        'analyzeScreen': '分析屏幕',
        'processing': '处理中...',
        'searchAnalyses': '搜索分析...',
        'clearAll': '全部清除',
        'noAnalysesMatch': '没有匹配的分析',
        'noAnalysesYet': '暂无分析',
        'listening': '正在聆听...',
        'reconnected': '已重新连接！正在聆听...',
        'listeningToSession': '嘿，我正在倾听你的会话？',
        'listeningToInterview': '嘿，我正在倾听你的面试？',
        'listeningToYourDay': '嘿，我正在倾听你的一天？',
        'listeningToCoach': '嘿，我正在倾听你的学习教练？',
        'listeningForSpeech': '正在聆听要翻译的语音...',
        'cancel': '取消',
        'save': '保存',
        'delete': '删除',
        'close': '关闭',
        'search': '搜索',
    },

    // Korean
    'ko-KR': {
        'analyzeScreen': '화면 분석',
        'processing': '처리 중...',
        'searchAnalyses': '분석 검색...',
        'clearAll': '모두 지우기',
        'noAnalysesMatch': '일치하는 분석 없음',
        'noAnalysesYet': '아직 분석 없음',
        'listening': '듣고 있습니다...',
        'reconnected': '다시 연결되었습니다! 듣고 있습니다...',
        'listeningToSession': '안녕하세요, 세션을 듣고 있습니다?',
        'listeningToInterview': '안녕하세요, 면접을 듣고 있습니다?',
        'listeningToYourDay': '안녕하세요, 하루를 듣고 있습니다?',
        'listeningToCoach': '안녕하세요, 학습 코치를 듣고 있습니다?',
        'listeningForSpeech': '번역할 음성을 듣고 있습니다...',
        'cancel': '취소',
        'save': '저장',
        'delete': '삭제',
        'close': '닫기',
        'search': '검색',
    },

    // Portuguese
    'pt-BR': {
        'analyzeScreen': 'Analisar tela',
        'processing': 'Processando...',
        'searchAnalyses': 'Pesquisar análises...',
        'clearAll': 'Limpar tudo',
        'noAnalysesMatch': 'Nenhuma análise correspondente',
        'noAnalysesYet': 'Ainda sem análises',
        'listening': 'Ouvindo...',
        'reconnected': 'Reconectado! Ouvindo...',
        'listeningToSession': 'Ei, estou ouvindo sua sessão?',
        'listeningToInterview': 'Ei, estou ouvindo sua entrevista?',
        'listeningToYourDay': 'Ei, estou ouvindo seu dia?',
        'listeningToCoach': 'Ei, estou ouvindo seu Coach de Estudo?',
        'listeningForSpeech': 'Ouvindo fala para traduzir...',
        'cancel': 'Cancelar',
        'save': 'Salvar',
        'delete': 'Excluir',
        'close': 'Fechar',
        'search': 'Pesquisar',
    },

    // Italian
    'it-IT': {
        'analyzeScreen': 'Analizza schermo',
        'processing': 'Elaborazione...',
        'searchAnalyses': 'Cerca analisi...',
        'clearAll': 'Cancella tutto',
        'noAnalysesMatch': 'Nessuna analisi corrispondente',
        'noAnalysesYet': 'Nessuna analisi ancora',
        'listening': 'In ascolto...',
        'reconnected': 'Riconnesso! In ascolto...',
        'listeningToSession': 'Ehi, sto ascoltando la tua sessione?',
        'listeningToInterview': 'Ehi, sto ascoltando il tuo colloquio?',
        'listeningToYourDay': 'Ehi, sto ascoltando la tua giornata?',
        'listeningToCoach': 'Ehi, sto ascoltando il tuo Coach di Studio?',
        'listeningForSpeech': 'In ascolto del parlato da tradurre...',
        'cancel': 'Annulla',
        'save': 'Salva',
        'delete': 'Elimina',
        'close': 'Chiudi',
        'search': 'Cerca',
    },

    // Russian
    'ru-RU': {
        'analyzeScreen': 'Анализировать экран',
        'processing': 'Обработка...',
        'searchAnalyses': 'Поиск анализов...',
        'clearAll': 'Очистить всё',
        'noAnalysesMatch': 'Нет соответствующих анализов',
        'noAnalysesYet': 'Анализов пока нет',
        'listening': 'Слушаю...',
        'reconnected': 'Переподключено! Слушаю...',
        'listeningToSession': 'Привет, я слушаю вашу сессию?',
        'listeningToInterview': 'Привет, я слушаю ваше собеседование?',
        'listeningToYourDay': 'Привет, я слушаю ваш день?',
        'listeningToCoach': 'Привет, я слушаю вашего Учебного Тренера?',
        'listeningForSpeech': 'Слушаю речь для перевода...',
        'cancel': 'Отмена',
        'save': 'Сохранить',
        'delete': 'Удалить',
        'close': 'Закрыть',
        'search': 'Поиск',
    },

    // Hindi
    'hi-IN': {
        'analyzeScreen': 'स्क्रीन विश्लेषण करें',
        'processing': 'प्रसंस्करण...',
        'searchAnalyses': 'विश्लेषण खोजें...',
        'clearAll': 'सभी साफ़ करें',
        'noAnalysesMatch': 'कोई विश्लेषण मेल नहीं खाता',
        'noAnalysesYet': 'अभी तक कोई विश्लेषण नहीं',
        'listening': 'सुन रहा हूँ...',
        'reconnected': 'फिर से जुड़ा! सुन रहा हूँ...',
        'listeningToSession': 'नमस्ते, मैं आपके सत्र को सुन रहा हूँ?',
        'listeningToInterview': 'नमस्ते, मैं आपके साक्षात्कार को सुन रहा हूँ?',
        'listeningToYourDay': 'नमस्ते, मैं आपके दिन को सुन रहा हूँ?',
        'listeningToCoach': 'नमस्ते, मैं आपके अध्ययन कोच को सुन रहा हूँ?',
        'listeningForSpeech': 'अनुवाद के लिए भाषण सुन रहा हूँ...',
        'cancel': 'रद्द करें',
        'save': 'सहेजें',
        'delete': 'हटाएं',
        'close': 'बंद करें',
        'search': 'खोजें',
    },

    // Arabic
    'ar-XA': {
        'analyzeScreen': 'تحليل الشاشة',
        'processing': 'جاري المعالجة...',
        'searchAnalyses': 'البحث في التحليلات...',
        'clearAll': 'مسح الكل',
        'noAnalysesMatch': 'لا توجد تحليلات مطابقة',
        'noAnalysesYet': 'لا توجد تحليلات بعد',
        'listening': 'أستمع...',
        'reconnected': 'تم إعادة الاتصال! أستمع...',
        'listeningToSession': 'مرحباً، أستمع إلى جلستك؟',
        'listeningToInterview': 'مرحباً، أستمع إلى مقابلتك؟',
        'listeningToYourDay': 'مرحباً، أستمع إلى يومك؟',
        'listeningToCoach': 'مرحباً، أستمع إلى مدرب الدراسة الخاص بك؟',
        'listeningForSpeech': 'أستمع للكلام للترجمة...',
        'cancel': 'إلغاء',
        'save': 'حفظ',
        'delete': 'حذف',
        'close': 'إغلاق',
        'search': 'بحث',
    },

    // Turkish
    'tr-TR': {
        'analyzeScreen': 'Ekranı analiz et',
        'processing': 'İşleniyor...',
        'searchAnalyses': 'Analizleri ara...',
        'clearAll': 'Tümünü temizle',
        'noAnalysesMatch': 'Eşleşen analiz yok',
        'noAnalysesYet': 'Henüz analiz yok',
        'listening': 'Dinliyorum...',
        'reconnected': 'Yeniden bağlandı! Dinliyorum...',
        'listeningToSession': 'Merhaba, oturumunuzu dinliyorum?',
        'listeningToInterview': 'Merhaba, görüşmenizi dinliyorum?',
        'listeningToYourDay': 'Merhaba, gününüzü dinliyorum?',
        'listeningToCoach': 'Merhaba, Çalışma Koçunuzu dinliyorum?',
        'listeningForSpeech': 'Çeviri için konuşma dinliyorum...',
        'cancel': 'İptal',
        'save': 'Kaydet',
        'delete': 'Sil',
        'close': 'Kapat',
        'search': 'Ara',
    },

    // Indonesian
    'id-ID': {
        'analyzeScreen': 'Analisis layar',
        'processing': 'Memproses...',
        'searchAnalyses': 'Cari analisis...',
        'clearAll': 'Hapus semua',
        'noAnalysesMatch': 'Tidak ada analisis yang cocok',
        'noAnalysesYet': 'Belum ada analisis',
        'listening': 'Mendengarkan...',
        'reconnected': 'Tersambung kembali! Mendengarkan...',
        'listeningToSession': 'Hei, saya mendengarkan sesi Anda?',
        'listeningToInterview': 'Hei, saya mendengarkan wawancara Anda?',
        'listeningToYourDay': 'Hei, saya mendengarkan hari Anda?',
        'listeningToCoach': 'Hei, saya mendengarkan Pelatih Studi Anda?',
        'listeningForSpeech': 'Mendengarkan ucapan untuk diterjemahkan...',
        'cancel': 'Batal',
        'save': 'Simpan',
        'delete': 'Hapus',
        'close': 'Tutup',
        'search': 'Cari',
    },

    // Vietnamese
    'vi-VN': {
        'analyzeScreen': 'Phân tích màn hình',
        'processing': 'Đang xử lý...',
        'searchAnalyses': 'Tìm kiếm phân tích...',
        'clearAll': 'Xóa tất cả',
        'noAnalysesMatch': 'Không có phân tích phù hợp',
        'noAnalysesYet': 'Chưa có phân tích',
        'listening': 'Đang lắng nghe...',
        'reconnected': 'Đã kết nối lại! Đang lắng nghe...',
        'listeningToSession': 'Xin chào, tôi đang lắng nghe phiên của bạn?',
        'listeningToInterview': 'Xin chào, tôi đang lắng nghe cuộc phỏng vấn của bạn?',
        'listeningToYourDay': 'Xin chào, tôi đang lắng nghe ngày của bạn?',
        'listeningToCoach': 'Xin chào, tôi đang lắng nghe Huấn luyện viên Học tập của bạn?',
        'listeningForSpeech': 'Đang lắng nghe lời nói để dịch...',
        'cancel': 'Hủy',
        'save': 'Lưu',
        'delete': 'Xóa',
        'close': 'Đóng',
        'search': 'Tìm kiếm',
    },

    // Thai
    'th-TH': {
        'analyzeScreen': 'วิเคราะห์หน้าจอ',
        'processing': 'กำลังประมวลผล...',
        'searchAnalyses': 'ค้นหาการวิเคราะห์...',
        'clearAll': 'ล้างทั้งหมด',
        'noAnalysesMatch': 'ไม่มีการวิเคราะห์ที่ตรงกัน',
        'noAnalysesYet': 'ยังไม่มีการวิเคราะห์',
        'listening': 'กำลังฟัง...',
        'reconnected': 'เชื่อมต่อใหม่แล้ว! กำลังฟัง...',
        'listeningToSession': 'สวัสดี ฉันกำลังฟังเซสชันของคุณ?',
        'listeningToInterview': 'สวัสดี ฉันกำลังฟังการสัมภาษณ์ของคุณ?',
        'listeningToYourDay': 'สวัสดี ฉันกำลังฟังวันของคุณ?',
        'listeningToCoach': 'สวัสดี ฉันกำลังฟังโค้ชการศึกษาของคุณ?',
        'listeningForSpeech': 'กำลังฟังคำพูดเพื่อแปล...',
        'cancel': 'ยกเลิก',
        'save': 'บันทึก',
        'delete': 'ลบ',
        'close': 'ปิด',
        'search': 'ค้นหา',
    },

    // Polish
    'pl-PL': {
        'analyzeScreen': 'Analizuj ekran',
        'processing': 'Przetwarzanie...',
        'searchAnalyses': 'Szukaj analiz...',
        'clearAll': 'Wyczyść wszystko',
        'noAnalysesMatch': 'Brak pasujących analiz',
        'noAnalysesYet': 'Brak analiz',
        'listening': 'Słucham...',
        'reconnected': 'Połączono ponownie! Słucham...',
        'listeningToSession': 'Hej, słucham twojej sesji?',
        'listeningToInterview': 'Hej, słucham twojej rozmowy kwalifikacyjnej?',
        'listeningToYourDay': 'Hej, słucham twojego dnia?',
        'listeningToCoach': 'Hej, słucham twojego Trenera Nauki?',
        'listeningForSpeech': 'Słucham mowy do tłumaczenia...',
        'cancel': 'Anuluj',
        'save': 'Zapisz',
        'delete': 'Usuń',
        'close': 'Zamknij',
        'search': 'Szukaj',
    },

    // Dutch
    'nl-NL': {
        'analyzeScreen': 'Scherm analyseren',
        'processing': 'Verwerken...',
        'searchAnalyses': 'Analyses zoeken...',
        'clearAll': 'Alles wissen',
        'noAnalysesMatch': 'Geen overeenkomende analyses',
        'noAnalysesYet': 'Nog geen analyses',
        'listening': 'Luisteren...',
        'reconnected': 'Opnieuw verbonden! Luisteren...',
        'listeningToSession': 'Hey, ik luister naar je sessie?',
        'listeningToInterview': 'Hey, ik luister naar je sollicitatiegesprek?',
        'listeningToYourDay': 'Hey, ik luister naar je dag?',
        'listeningToCoach': 'Hey, ik luister naar je Studiecoach?',
        'listeningForSpeech': 'Luisteren naar spraak om te vertalen...',
        'cancel': 'Annuleren',
        'save': 'Opslaan',
        'delete': 'Verwijderen',
        'close': 'Sluiten',
        'search': 'Zoeken',
    },
};

// Map English variants to base English
const languageMap = {
    'en-GB': 'en-US',
    'en-AU': 'en-US',
    'en-IN': 'en-US',
};

// Map Indian languages to Hindi as fallback (can be expanded later)
const indianLanguageFallback = {
    'bn-IN': 'hi-IN',
    'gu-IN': 'hi-IN',
    'kn-IN': 'hi-IN',
    'ml-IN': 'hi-IN',
    'mr-IN': 'hi-IN',
    'ta-IN': 'hi-IN',
    'te-IN': 'hi-IN',
};

/**
 * Get localized text for a given key and language
 * @param {string} key - Translation key
 * @param {string} language - Language code (e.g., 'en-US', 'ja-JP')
 * @returns {string} Localized text or the key if not found
 */
export function t(key, language = 'en-US') {
    // Map language variants
    let targetLang = languageMap[language] || language;

    // Use Indian language fallback if needed
    if (indianLanguageFallback[language] && !translations[language]) {
        targetLang = indianLanguageFallback[language];
    }

    // Get translation, fallback to English if not found
    const langTranslations = translations[targetLang] || translations['en-US'];
    return langTranslations[key] || translations['en-US'][key] || key;
}

/**
 * Get the base language code (e.g., 'ja' from 'ja-JP')
 * @param {string} language - Full language code
 * @returns {string} Base language code
 */
export function getBaseLanguage(language) {
    return language.split('-')[0];
}

export default { t, getBaseLanguage };
