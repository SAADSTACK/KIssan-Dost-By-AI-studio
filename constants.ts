import { Language, MarketRate, WeatherAlert, OfflineGuide, SymptomMatcher, WeatherForecast } from './types';

export const APP_NAME = "Kissan Dost";

// In a real RAG system, this would come from a vector DB
export const MOCK_MARKET_DATA: MarketRate[] = [
  { crop: "Wheat (Gandum)", price: "PKR 4,200 / 40kg", trend: "up", location: "Lahore Mandi" },
  { crop: "Cotton (Kapas)", price: "PKR 8,500 / 40kg", trend: "down", location: "Multan Mandi" },
  { crop: "Rice (Basmati)", price: "PKR 3,800 / 40kg", trend: "stable", location: "Gujranwala" },
  { crop: "Sugarcane", price: "PKR 450 / 40kg", trend: "up", location: "Rahim Yar Khan" },
];

export const MOCK_WEATHER_ALERTS: WeatherAlert[] = [
  { type: 'rain', message: 'Heavy rainfall expected in Punjab region over next 48 hours.', severity: 'high' },
  { type: 'heat', message: 'High temperature warning for Sindh belt. Irrigate crops at night.', severity: 'medium' },
];

export const MOCK_WEATHER_FORECAST: WeatherForecast[] = [
  { dayOffset: 0, tempMax: 34, tempMin: 26, condition: 'sunny', humidity: 45, windSpeed: 12 },
  { dayOffset: 1, tempMax: 32, tempMin: 25, condition: 'partly_cloudy', humidity: 50, windSpeed: 15 },
  { dayOffset: 2, tempMax: 29, tempMin: 23, condition: 'rain', humidity: 78, windSpeed: 18 },
  { dayOffset: 3, tempMax: 28, tempMin: 22, condition: 'rain', humidity: 82, windSpeed: 14 },
  { dayOffset: 4, tempMax: 31, tempMin: 24, condition: 'cloudy', humidity: 60, windSpeed: 10 },
];

export const TRANSLATIONS = {
  [Language.ENGLISH]: {
    welcome: "Welcome to Kissan Dost",
    subtitle: "Your AI Agriculture Expert",
    ask_anything: "Ask me about crops, diseases, or prices...",
    tab_chat: "AI Advisor",
    tab_diagnostic: "Crop Doctor",
    tab_market: "Mandi Rates",
    tab_offline: "Offline Guides",
    upload_label: "Upload Crop Photo",
    analyzing: "Analyzing Crop Health...",
    send: "Send",
    disease_detected: "Diagnosis Report",
    treatment: "Treatment Plan",
    prevention: "Prevention",
    confidence: "AI Confidence",
    language_label: "Language / زبان",
    offline_mode: "Offline Mode",
    online_mode: "Online",
    download: "Download",
    view: "View",
    downloaded: "Downloaded",
    offline_diagnostic_title: "Offline Symptom Checker",
    offline_diagnostic_desc: "Internet unavailable. Use this tool for preliminary advice.",
    select_crop: "Select Crop",
    select_symptom: "Select Symptom",
    possible_cause: "Possible Cause",
    immediate_action: "Immediate Action",
    connect_internet: "Connect to internet for full AI analysis",
    weather_forecast: "5-Day Weather Forecast",
    humidity: "Humidity",
    wind: "Wind",
    today: "Today",
    tomorrow: "Tomorrow",
    condition_sunny: "Sunny",
    condition_partly_cloudy: "Partly Cloudy",
    condition_cloudy: "Cloudy",
    condition_rain: "Rain",
    condition_storm: "Storm",
    new_chat: "New Chat",
    chat_history: "Chat History",
    no_history: "No previous chats",
    delete_chat: "Delete",
  },
  [Language.URDU]: {
    welcome: "کسان دوست میں خوش آمدید",
    subtitle: "آپ کا زرعی مصنوعی ذہانت کا ماہر",
    ask_anything: "مجھ سے فصلوں، بیماریوں یا قیمتوں کے بارے میں پوچھیں...",
    tab_chat: "مشیر",
    tab_diagnostic: "فصل ڈاکٹر",
    tab_market: "منڈی کے بھاؤ",
    tab_offline: "آف لائن گائیڈز",
    upload_label: "فصل کی تصویر اپ لوڈ کریں",
    analyzing: "فصل کی صحت کا تجزیہ کیا جا رہا ہے...",
    send: "بھیجیں",
    disease_detected: "تشخیص کی رپورٹ",
    treatment: "علاج کا منصوبہ",
    prevention: "احتیاطی تدابیر",
    confidence: "AI اعتماد",
    language_label: "زبان",
    offline_mode: "آف لائن موڈ",
    online_mode: "آن لائن",
    download: "ڈاؤن لوڈ کریں",
    view: "دیکھیں",
    downloaded: "محفوظ شدہ",
    offline_diagnostic_title: "آف لائن علامات چیکر",
    offline_diagnostic_desc: "انٹرنیٹ دستیاب نہیں۔ ابتدائی مشورے کے لیے یہ آلہ استعمال کریں۔",
    select_crop: "فصل منتخب کریں",
    select_symptom: "علامت منتخب کریں",
    possible_cause: "ممکنہ وجہ",
    immediate_action: "فوری عمل",
    connect_internet: "مکمل AI تجزیہ کے لیے انٹرنیٹ سے منسلک ہوں",
    weather_forecast: "5 دن کی موسم کی پیشن گوئی",
    humidity: "نمی",
    wind: "ہوا",
    today: "آج",
    tomorrow: "کل",
    condition_sunny: "دھوپ",
    condition_partly_cloudy: "جزوی بادل",
    condition_cloudy: "بادل",
    condition_rain: "بارش",
    condition_storm: "طوفان",
    new_chat: "نئی بات چیت",
    chat_history: "پرانی بات چیت",
    no_history: "کوئی پرانی بات چیت نہیں",
    delete_chat: "ختم کریں",
  },
  [Language.PUNJABI]: {
    welcome: "کسان دوست وچ جی آیاں نوں",
    subtitle: "تہاڈا زرعی ماہر",
    ask_anything: "میرے کولوں فصلاں، بیماریاں یا ریٹ پوچھو...",
    tab_chat: "صلاح کار",
    tab_diagnostic: "فصل ڈاکٹر",
    tab_market: "منڈی دے ریٹ",
    tab_offline: "آف لائن گائیڈز",
    upload_label: "فصل دی فوٹو لاؤ",
    analyzing: "فصل دی جانچ پڑتال ہو رہی اے...",
    send: "کلّو",
    disease_detected: "بیماری دی رپورٹ",
    treatment: "علاج",
    prevention: "بچاؤ",
    confidence: "یقین دہانی",
    language_label: "بولی",
    offline_mode: "آف لائن موڈ",
    online_mode: "آن لائن",
    download: "ڈاؤن لوڈ کرو",
    view: "ویکھو",
    downloaded: "محفوظ",
    offline_diagnostic_title: "آف لائن علامات چیکر",
    offline_diagnostic_desc: "نیٹ نئیں چل ریا۔ ابتدائی مشورے لئی اے ورتو۔",
    select_crop: "فصل چنو",
    select_symptom: "علامت چنو",
    possible_cause: "وجہ",
    immediate_action: "فوری عمل",
    connect_internet: "پوری جانچ لئی انٹرنیٹ چلاؤ",
    weather_forecast: "5 دناں دا موسم",
    humidity: "نمی",
    wind: "ہوا",
    today: "اج",
    tomorrow: "کل",
    condition_sunny: "دھپ",
    condition_partly_cloudy: "تھوڑے بادل",
    condition_cloudy: "بادل",
    condition_rain: "مینھ",
    condition_storm: "طوفان",
    new_chat: "نوی گل بات",
    chat_history: "پرانی گلاں",
    no_history: "کوئی پرانی گل نہیں",
    delete_chat: "مٹاؤ",
  }
};

export const SYSTEM_INSTRUCTION = `
You are Kissan Dost, a Master-Level Agriculture AI Advisor for farmers in Pakistan.
Your goal is to provide accurate, actionable, and low-literacy friendly advice.

Core Rules:
1. ALWAYS reply in the language the user is currently using or explicitly requested.
2. Be concise, encouraging, and respectful. Use "Brother farmer" (Kissan bhai) often.
3. Simplify scientific terms. Instead of "Nitrogen deficiency", say "Lack of growth power (Urea needed)".
4. Provide step-by-step instructions for remedies.
5. Include estimated costs in PKR if possible based on general knowledge.

Context Data (Use this to ground your answers):
${JSON.stringify(MOCK_MARKET_DATA)}
${JSON.stringify(MOCK_WEATHER_ALERTS)}
`;

export const OFFLINE_GUIDES_DATA: OfflineGuide[] = [
  {
    id: 'guide_1',
    category: 'calendar',
    title: {
      [Language.ENGLISH]: "Wheat Sowing Calendar",
      [Language.URDU]: "گندم کی کاشت کا کیلنڈر",
      [Language.PUNJABI]: "کنک بیجن دا ٹائم"
    },
    content: {
      [Language.ENGLISH]: "Best time: Nov 1 - Nov 30.\nSeed Rate: 50kg/acre.\nFertilizer: 1 Bag DAP at sowing.",
      [Language.URDU]: "بہترین وقت: 1 نومبر - 30 نومبر۔\nبیج کی شرح: 50 کلوگرام فی ایکڑ۔\nکھاد: بوائی کے وقت 1 بوری ڈی اے پی۔",
      [Language.PUNJABI]: "سب توں اچھا ٹائم: 1 توں 30 نومبر۔\nبیج: 50 کلو فی ایکڑ۔\nکھاد: 1 بوری ڈی اے پی۔"
    }
  },
  {
    id: 'guide_2',
    category: 'disease_chart',
    title: {
      [Language.ENGLISH]: "Common Rice Diseases",
      [Language.URDU]: "چاول کی عام بیماریاں",
      [Language.PUNJABI]: "چاول دیاں بیماریاں"
    },
    content: {
      [Language.ENGLISH]: "1. Blast: Brown spots on leaves.\n2. Bacterial Blight: Yellowing leaf tips.\nUse Copper Fungicide for Blight.",
      [Language.URDU]: "1. بلاسٹ: پتوں پر بھورے دھبے۔\n2. بیکٹیریل بلائٹ: پتوں کے سروں کا پیلا ہونا۔\nبلائٹ کے لیے کاپر فنگسائڈ استعمال کریں۔",
      [Language.PUNJABI]: "1. بلاسٹ: پتیاں تے بھورے نشان۔\n2. بلائٹ: پتیاں دے کنارے پیلے۔\nکاپر والی دوائی ورتو۔"
    }
  }
];

export const OFFLINE_SYMPTOM_DATA: SymptomMatcher[] = [
  {
    crop: "Wheat",
    symptoms: [
      {
        id: "w1",
        description: { [Language.ENGLISH]: "Yellow leaves", [Language.URDU]: "پتے پیلے ہو رہے ہیں", [Language.PUNJABI]: "پتر پیلے ہو رہے نیں" },
        possibleIssue: { [Language.ENGLISH]: "Nitrogen Deficiency", [Language.URDU]: "نائٹروجن کی کمی", [Language.PUNJABI]: "یوریا دی کمی" },
        preliminaryAction: { [Language.ENGLISH]: "Apply Urea irrigation.", [Language.URDU]: "یوریا کھاد پانی کے ساتھ دیں۔", [Language.PUNJABI]: "پانی لا کے یوریا سٹ دو۔" }
      },
      {
        id: "w2",
        description: { [Language.ENGLISH]: "Orange dust on leaves", [Language.URDU]: "پتوں پر نارنجی پاؤڈر", [Language.PUNJABI]: "پتیاں تے زنگ" },
        possibleIssue: { [Language.ENGLISH]: "Rust Disease", [Language.URDU]: "رسٹ (زنگ) کی بیماری", [Language.PUNJABI]: "رسٹ دی بیماری" },
        preliminaryAction: { [Language.ENGLISH]: "Spray Propiconazole immediately.", [Language.URDU]: "فوری طور پر پروپیکونازول کا سپرے کریں۔", [Language.PUNJABI]: "پروپیکونازول دا سپرے کرو۔" }
      }
    ]
  },
  {
    crop: "Rice",
    symptoms: [
      {
        id: "r1",
        description: { [Language.ENGLISH]: "Brown spots", [Language.URDU]: "بھورے دھبے", [Language.PUNJABI]: "بھورے داغ" },
        possibleIssue: { [Language.ENGLISH]: "Brown Spot Disease", [Language.URDU]: "براؤن سپاٹ بیماری", [Language.PUNJABI]: "براؤن سپاٹ" },
        preliminaryAction: { [Language.ENGLISH]: "Balanced fertilizer usage.", [Language.URDU]: "متوازن کھاد کا استعمال کریں۔", [Language.PUNJABI]: "کھاد دا صحیح استعمال کرو۔" }
      }
    ]
  }
];