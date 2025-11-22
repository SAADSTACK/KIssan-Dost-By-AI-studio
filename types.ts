export enum Language {
  ENGLISH = 'en',
  URDU = 'ur',
  PUNJABI = 'pa'
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  updatedAt: number;
  messages: Message[];
}

export interface MarketRate {
  crop: string;
  price: string;
  trend: 'up' | 'down' | 'stable';
  location: string;
}

export interface WeatherAlert {
  type: 'rain' | 'heat' | 'wind';
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface WeatherForecast {
  dayOffset: number; // 0 = today, 1 = tomorrow...
  tempMax: number;
  tempMin: number;
  condition: 'sunny' | 'cloudy' | 'rain' | 'storm' | 'partly_cloudy';
  humidity: number;
  windSpeed: number;
}

export interface DiagnosticResult {
  cropDetected: string;
  disease: string;
  severity: string;
  treatment: string[];
  prevention: string[];
  confidence: number;
}

export type TabView = 'chat' | 'diagnostic' | 'market' | 'offline';

export interface OfflineGuide {
  id: string;
  title: {[key in Language]: string};
  category: 'calendar' | 'disease_chart' | 'general';
  content: {[key in Language]: string}; 
  isDownloaded?: boolean;
}

export interface SymptomMatcher {
    crop: string;
    symptoms: {
        id: string;
        description: {[key in Language]: string};
        possibleIssue: {[key in Language]: string};
        preliminaryAction: {[key in Language]: string};
    }[];
}