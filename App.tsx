import React, { useState, useEffect } from 'react';
import { Language, TabView } from './types';
import { TRANSLATIONS } from './constants';
import Header from './components/Header';
import Hero from './components/Hero';
import ChatInterface from './components/ChatInterface';
import ImageDiagnostic from './components/ImageDiagnostic';
import Dashboard from './components/Dashboard';
import OfflineResources from './components/OfflineResources';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { useOnlineStatus } from './services/offlineService';
import { MessageSquare, Camera, TrendingUp, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.ENGLISH);
  const [activeTab, setActiveTab] = useState<TabView>('chat');
  const [appLoading, setAppLoading] = useState(true);
  const isOnline = useOnlineStatus();
  
  const t = TRANSLATIONS[lang];
  const isRtl = lang !== Language.ENGLISH;

  // Initial Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 2000); // Show splash for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  if (appLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`h-[100dvh] flex flex-col bg-earth-50 font-sans selection:bg-leaf-200 selection:text-leaf-900 overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <Header currentLang={lang} setLang={setLang} isOnline={isOnline} />
      
      {/* Hero Section */}
      {/* We hide the hero on mobile ONLY when in chat mode to maximize chat space. */}
      <div className={`flex-shrink-0 ${activeTab === 'chat' ? 'hidden sm:block' : 'block'}`}>
          <Hero lang={lang} />
      </div>

      {/* Main Content Wrapper */}
      <main className="flex-grow flex flex-col w-full max-w-5xl mx-auto relative z-30 overflow-hidden">
        
        {/* Floating Tab Navigation */}
        {/* Adjusted margins to pull it up over the hero or sit nicely at the top if hero is hidden */}
        <div className={`z-40 px-4 py-2 sm:py-0 flex-shrink-0 ${activeTab === 'chat' ? 'sm:-mt-12 mt-2' : '-mt-10 sm:-mt-12'}`}>
           <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl sm:rounded-full shadow-lg border border-white/50 max-w-2xl mx-auto flex gap-1 overflow-x-auto scrollbar-hide justify-between sm:justify-center">
                {[
                    { id: 'chat', icon: MessageSquare, label: t.tab_chat },
                    { id: 'diagnostic', icon: Camera, label: t.tab_diagnostic },
                    { id: 'market', icon: TrendingUp, label: t.tab_market },
                    { id: 'offline', icon: BookOpen, label: t.tab_offline },
                ].map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabView)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 sm:py-3 sm:px-6 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-leaf-500 min-w-[70px] whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-leaf-600 text-white shadow-md scale-[1.02]' 
                            : 'text-gray-500 hover:bg-white/50 hover:text-leaf-700'
                        }`}
                    >
                        <tab.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className={`hidden sm:inline ${isRtl ? 'font-urdu pt-1' : ''}`}>{tab.label}</span>
                    </button>
                ))}
           </div>
        </div>

        {/* Tab Content Area */}
        {/* flex-1 ensures it takes all remaining space. h-full and overflow-hidden manages scroll internally. */}
        <div className="flex-1 overflow-hidden w-full h-full p-2 sm:p-0 sm:mt-4 sm:pb-4 sm:px-4">
            {activeTab === 'chat' && (
                isOnline 
                ? <ChatInterface lang={lang} />
                : <div className="h-full flex items-center justify-center p-4">
                    <div className="bg-white p-8 sm:p-10 text-center rounded-3xl shadow-md border border-gray-100 text-gray-500 animate-fade-in max-w-md w-full">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="text-gray-400" size={28} />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">{t.offline_mode}</h3>
                        <p className="text-sm">{t.connect_internet}</p>
                    </div>
                  </div>
            )}
            
            {activeTab === 'diagnostic' && (
                <div className="h-full overflow-y-auto pb-20 scrollbar-hide sm:pr-2">
                    <ImageDiagnostic lang={lang} isOnline={isOnline} />
                    <Footer />
                </div>
            )}
            
            {activeTab === 'market' && (
                isOnline
                ? <div className="h-full overflow-y-auto pb-20 scrollbar-hide sm:pr-2">
                    <Dashboard lang={lang} />
                    <Footer />
                  </div>
                : <div className="h-full flex items-center justify-center p-4">
                    <div className="bg-white p-8 sm:p-10 text-center rounded-3xl shadow-md border border-gray-100 text-gray-500 animate-fade-in max-w-md w-full">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="text-gray-400" size={28} />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">{t.offline_mode}</h3>
                        <p className="text-sm">{t.connect_internet}</p>
                    </div>
                  </div>
            )}
            
            {activeTab === 'offline' && (
                <div className="h-full overflow-y-auto pb-20 scrollbar-hide sm:pr-2">
                    <OfflineResources lang={lang} />
                    <Footer />
                </div>
            )}
        </div>

      </main>
    </div>
  );
};

export default App;