import React, { useState } from 'react';
import { Language, DiagnosticResult } from '../types';
import { TRANSLATIONS, OFFLINE_SYMPTOM_DATA } from '../constants';
import { analyzeCropImage } from '../services/geminiService';
import { CheckCircle, AlertTriangle, Droplets, ShieldCheck, Loader2, ImageIcon, WifiOff, ArrowRight, Camera } from 'lucide-react';

interface ImageDiagnosticProps {
  lang: Language;
  isOnline: boolean;
}

const ImageDiagnostic: React.FC<ImageDiagnosticProps> = ({ lang, isOnline }) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang !== Language.ENGLISH;
  
  // Online State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Offline State
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [selectedSymptomId, setSelectedSymptomId] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset
    setResult(null);
    setError(null);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      startAnalysis(base64);
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = async (base64: string) => {
    if (!isOnline) {
        setError("Offline mode: Cannot analyze images. Please switch to symptom checker.");
        return;
    }

    setAnalyzing(true);
    try {
      const jsonResponse = await analyzeCropImage(base64, lang);
      const cleanJson = jsonResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed: DiagnosticResult = JSON.parse(cleanJson);
      setResult(parsed);
    } catch (err) {
      console.error(err);
      setError("Could not analyze image. Please try a clearer photo.");
    } finally {
      setAnalyzing(false);
    }
  };

  const availableCrops = OFFLINE_SYMPTOM_DATA;
  const cropData = availableCrops.find(c => c.crop === selectedCrop);
  const symptomData = cropData?.symptoms.find(s => s.id === selectedSymptomId);

  // Render Offline UI
  if (!isOnline) {
      return (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 sm:gap-4 shadow-sm">
                  <div className="bg-amber-100 p-2 rounded-full text-amber-600 flex-shrink-0">
                     <WifiOff size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                      <h3 className={`font-bold text-amber-900 text-base sm:text-lg ${isRtl ? 'font-urdu' : ''}`}>{t.offline_diagnostic_title}</h3>
                      <p className={`text-sm text-amber-800/80 mt-1 leading-relaxed ${isRtl ? 'font-urdu' : ''}`}>{t.offline_diagnostic_desc}</p>
                  </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-lg border border-gray-100">
                  {/* Crop Selector */}
                  <div className="mb-6">
                      <label className={`block text-sm font-bold text-gray-700 mb-2 ${isRtl ? 'text-right font-urdu' : ''}`}>
                          {t.select_crop}
                      </label>
                      <select 
                          className={`w-full p-3 sm:p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500 focus:outline-none bg-gray-50 transition-all text-gray-800 text-sm sm:text-base ${isRtl ? 'text-right font-urdu' : ''}`}
                          value={selectedCrop}
                          onChange={(e) => {
                              setSelectedCrop(e.target.value);
                              setSelectedSymptomId('');
                          }}
                      >
                          <option value="">-- {t.select_crop} --</option>
                          {availableCrops.map(c => (
                              <option key={c.crop} value={c.crop}>{c.crop}</option>
                          ))}
                      </select>
                  </div>

                  {/* Symptom Selector */}
                  {selectedCrop && (
                    <div className="mb-6">
                        <label className={`block text-sm font-bold text-gray-700 mb-2 ${isRtl ? 'text-right font-urdu' : ''}`}>
                            {t.select_symptom}
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            {cropData?.symptoms.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedSymptomId(s.id)}
                                    className={`p-3 sm:p-4 rounded-xl border text-left transition-all shadow-sm hover:shadow-md text-sm sm:text-base ${isRtl ? 'text-right font-urdu' : ''} ${
                                        selectedSymptomId === s.id 
                                        ? 'bg-leaf-50 border-leaf-500 text-leaf-900 ring-1 ring-leaf-500' 
                                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700'
                                    }`}
                                >
                                    {s.description[lang]}
                                </button>
                            ))}
                        </div>
                    </div>
                  )}

                  {/* Result Card */}
                  {symptomData && (
                      <div className="bg-gradient-to-br from-leaf-50 to-white rounded-2xl p-4 sm:p-6 border border-leaf-100 shadow-md animate-fade-in">
                          <h4 className={`font-bold text-lg sm:text-xl text-leaf-900 mb-4 sm:mb-6 pb-3 border-b border-leaf-100 flex items-center gap-2 ${isRtl ? 'flex-row-reverse font-urdu' : ''}`}>
                             <AlertTriangle className="text-orange-500 flex-shrink-0" size={20} />
                             <span>{t.possible_cause}: {symptomData.possibleIssue[lang]}</span>
                          </h4>
                          
                          <div className={`flex items-start gap-3 sm:gap-4 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                             <div className="bg-leaf-100 p-2 sm:p-2.5 rounded-full text-leaf-700 flex-shrink-0 shadow-inner">
                                 <ArrowRight size={20} className={isRtl ? "rotate-180" : ""} />
                             </div>
                             <div>
                                 <p className="text-[10px] sm:text-xs uppercase font-bold text-gray-400 tracking-wider mb-1">{t.immediate_action}</p>
                                 <p className={`text-gray-800 font-medium text-base sm:text-lg leading-relaxed ${isRtl ? 'font-urdu' : ''}`}>
                                     {symptomData.preliminaryAction[lang]}
                                 </p>
                             </div>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      );
  }

  // Online UI
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Upload Area */}
      <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-sm border-2 border-dashed border-leaf-200 text-center hover:border-leaf-500 hover:bg-leaf-50/30 transition-all group">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
          id="crop-upload"
        />
        <label htmlFor="crop-upload" className="cursor-pointer flex flex-col items-center gap-4 w-full">
          {imagePreview ? (
            <div className="relative w-full max-w-md mx-auto">
                 <img src={imagePreview} alt="Preview" className="w-full h-48 sm:h-56 object-cover rounded-2xl shadow-md" />
                 <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white w-10 h-10" />
                 </div>
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-leaf-50 rounded-full flex items-center justify-center text-leaf-400 mb-2 group-hover:scale-110 transition-transform shadow-inner">
              <ImageIcon size={32} className="sm:w-12 sm:h-12" />
            </div>
          )}
          <div>
              <span className="text-leaf-900 font-bold text-lg sm:text-xl block">{t.upload_label}</span>
              <span className="text-gray-400 text-xs sm:text-sm mt-1 inline-block">Support: JPG, PNG</span>
          </div>
        </label>
      </div>

      {/* Loading State */}
      {analyzing && (
        <div className="bg-white/80 backdrop-blur p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center space-y-4 border border-leaf-100">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-leaf-100 border-t-leaf-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-leaf-600 animate-pulse" />
            </div>
          </div>
          <p className="text-leaf-800 font-semibold text-base sm:text-lg animate-pulse">{t.analyzing}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-red-700 text-center flex items-center justify-center gap-2 shadow-sm text-sm sm:text-base">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      {/* Results Card */}
      {result && !analyzing && (
        <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in`}>
          
          {/* Header */}
          <div className={`p-4 sm:p-6 ${result.severity?.toLowerCase().includes('high') ? 'bg-red-50/50' : 'bg-leaf-50/50'} border-b border-gray-100`}>
             <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                <div className="w-full sm:w-auto">
                    <h3 className={`text-xl sm:text-3xl font-black text-gray-900 mb-2 leading-tight ${isRtl ? 'font-urdu' : ''}`}>
                        {result.disease}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-white border border-gray-200 text-gray-700 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
                            {result.cropDetected}
                        </span>
                        {result.confidence && (
                            <span className="text-[10px] sm:text-xs text-gray-500 font-medium flex items-center bg-gray-100 px-2 py-0.5 rounded-full">
                                AI Confidence: {result.confidence}%
                            </span>
                        )}
                    </div>
                </div>
                <div className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm self-start sm:self-center ${
                    result.severity?.toLowerCase().includes('high') || result.severity?.toLowerCase().includes('severe')
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}>
                    {result.severity}
                </div>
             </div>
          </div>

          <div className={`p-4 sm:p-8 space-y-6 sm:space-y-8 ${isRtl ? 'font-urdu text-right' : 'text-left'}`}>
            
            {/* Treatment Section */}
            <div>
                <div className={`flex items-center gap-3 mb-3 sm:mb-4 text-sky-700 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="p-1.5 sm:p-2 bg-sky-100 rounded-lg">
                        <Droplets size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="font-bold text-lg sm:text-xl">{t.treatment}</h4>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                    {result.treatment.map((item, idx) => (
                        <li key={idx} className={`group flex items-start gap-3 sm:gap-4 bg-sky-50/50 hover:bg-sky-50 p-3 sm:p-4 rounded-2xl transition-colors border border-transparent hover:border-sky-100 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="bg-sky-200 text-sky-800 text-xs sm:text-sm font-bold w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                {idx + 1}
                            </span>
                            <span className="text-gray-800 leading-relaxed font-medium text-sm sm:text-base">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Prevention Section */}
            <div>
                <div className={`flex items-center gap-3 mb-3 sm:mb-4 text-emerald-700 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg">
                        <ShieldCheck size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="font-bold text-lg sm:text-xl">{t.prevention}</h4>
                </div>
                <div className="bg-emerald-50 p-4 sm:p-6 rounded-2xl border border-emerald-100 text-gray-700 leading-relaxed shadow-sm text-sm sm:text-base">
                    <ul className={`list-disc space-y-2 ${isRtl ? 'pr-4' : 'pl-4'}`}>
                        {result.prevention.map((item, idx) => (
                            <li key={idx} className="pl-1">{item}</li>
                        ))}
                    </ul>
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDiagnostic;