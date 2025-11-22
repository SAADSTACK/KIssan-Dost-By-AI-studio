import React, { useState, useEffect } from 'react';
import { Language, OfflineGuide } from '../types';
import { TRANSLATIONS, OFFLINE_GUIDES_DATA } from '../constants';
import { BookOpen, Download, Check, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface OfflineResourcesProps {
  lang: Language;
}

const OfflineResources: React.FC<OfflineResourcesProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang !== Language.ENGLISH;
  
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
      const stored = localStorage.getItem('kissan_offline_guides');
      if (stored) {
          setDownloadedIds(new Set(JSON.parse(stored)));
      }
  }, []);

  const toggleDownload = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const newSet = new Set(downloadedIds);
      if (newSet.has(id)) {
          newSet.delete(id);
      } else {
          newSet.add(id);
      }
      setDownloadedIds(newSet);
      localStorage.setItem('kissan_offline_guides', JSON.stringify(Array.from(newSet)));
  };

  const toggleExpand = (id: string) => {
      setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`flex items-center gap-3 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
         <h2 className={`text-2xl font-bold text-leaf-900 ${isRtl ? 'font-urdu' : ''}`}>
            {t.tab_offline}
         </h2>
         <span className="text-xs font-medium bg-leaf-100 text-leaf-800 px-2 py-1 rounded-full">
            Available without internet
         </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {OFFLINE_GUIDES_DATA.map((guide) => {
            const isDownloaded = downloadedIds.has(guide.id);
            const isExpanded = expandedId === guide.id;

            return (
                <div 
                    key={guide.id} 
                    className={`bg-white rounded-3xl shadow-sm border-2 transition-all duration-200 overflow-hidden ${isExpanded ? 'border-leaf-400 ring-4 ring-leaf-50 shadow-lg' : 'border-transparent hover:border-leaf-200 hover:shadow-md'}`}
                >
                    {/* Header / Summary Card */}
                    <div 
                        onClick={() => toggleExpand(guide.id)}
                        className="p-5 flex items-center justify-between cursor-pointer bg-white"
                    >
                        <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                            <div className={`p-3.5 rounded-2xl flex-shrink-0 transition-colors ${isDownloaded ? 'bg-leaf-500 text-white shadow-md shadow-leaf-200' : 'bg-gray-100 text-gray-500'}`}>
                                {guide.category === 'calendar' ? <FileText size={22} /> : <BookOpen size={22} />}
                            </div>
                            <div>
                                <h3 className={`font-bold text-gray-800 text-lg mb-0.5 ${isRtl ? 'font-urdu' : ''}`}>
                                    {guide.title[lang]}
                                </h3>
                                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${isRtl ? 'flex-row-reverse justify-end' : ''} ${isDownloaded ? 'text-leaf-600' : 'text-gray-400'}`}>
                                    {isDownloaded ? <><Check size={12} /> {t.downloaded}</> : 'Cloud Access'}
                                </span>
                            </div>
                        </div>

                        <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            {/* Download Button */}
                            <button
                                onClick={(e) => toggleDownload(guide.id, e)}
                                className={`p-2.5 rounded-full transition-all active:scale-95 ${
                                    isDownloaded 
                                    ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                }`}
                                title={isDownloaded ? "Remove" : "Download for Offline"}
                            >
                                {isDownloaded ? <Check size={20} /> : <Download size={20} />}
                            </button>
                            
                            {/* Expand Icon */}
                            <div className={`text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                <ChevronDown size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/50">
                            <div className={`p-6 text-gray-700 text-base leading-loose whitespace-pre-wrap ${isRtl ? 'text-right font-urdu' : ''}`}>
                                {guide.content[lang]}
                            </div>
                        </div>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default OfflineResources;