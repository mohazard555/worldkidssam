
import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';
import { AppContext } from '../App';
import { PlayIcon, ShareIcon, SearchIcon, MusicIcon, WhatsAppIcon, FacebookIcon, TelegramIcon, CopyIcon, CheckIcon } from './Icons';

interface VideoData {
    url: string;
    videoId: string;
    title: string;
    thumbnailUrl: string;
}

const KidsSongsSection: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    const [searchTerm, setSearchTerm] = useState('');
    const [videoData, setVideoData] = useState<VideoData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeShareMenu, setActiveShareMenu] = useState<string | null>(null);
    const [copySuccessVideoId, setCopySuccessVideoId] = useState<string | null>(null);
    const shareMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
                setActiveShareMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const urls = useMemo(() => (appData.settings.songUrls || []).filter(url => url.trim() !== ''), [appData.settings.songUrls]);

    const getYoutubeVideoId = (url: string): string | null => {
        let videoId = null;
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') {
                videoId = urlObj.pathname.slice(1);
            } else if (urlObj.hostname.includes('youtube.com')) {
                videoId = urlObj.searchParams.get('v');
            }
        } catch (error) {
            console.error('Invalid YouTube URL:', url);
        }
        return videoId;
    };

    useEffect(() => {
        if (urls.length > 0 && videoData.length !== urls.length) {
            const fetchVideoData = async () => {
                setIsLoading(true);
                const dataPromises = urls.map(async (url): Promise<VideoData | null> => {
                    const videoId = getYoutubeVideoId(url);
                    if (!videoId) return null;
                    try {
                        const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
                        if (!response.ok) throw new Error('Failed to fetch');
                        const data = await response.json();
                        return {
                            url,
                            videoId,
                            title: data.title || 'أغنية أطفال',
                            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                        };
                    } catch (error) {
                        console.error('Failed to fetch video data for', url, error);
                        return {
                            url,
                            videoId,
                            title: 'أغنية أطفال',
                            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                        };
                    }
                });
                const results = await Promise.all(dataPromises);
                setVideoData(results.filter((item): item is VideoData => item !== null));
                setIsLoading(false);
            };
            fetchVideoData();
        }
    }, [urls]);


    const filteredVideos = useMemo(() => {
        if (!searchTerm) return videoData;
        return videoData.filter(video =>
            video.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, videoData]);

    const handleShare = async (title: string, url: string, videoId: string) => {
        if (navigator.share) { // Web Share API for mobile
            try {
                await navigator.share({ title, url, text: `استمع لهذه الأغنية الرائعة للأطفال: ${title}` });
            } catch (error) {
                console.error('Share failed:', error);
            }
        } else { // Fallback for desktop
            setActiveShareMenu(prev => (prev === videoId ? null : videoId));
        }
    };

    const handleCopy = (url: string, videoId: string) => {
        navigator.clipboard.writeText(url).then(() => {
            setCopySuccessVideoId(videoId);
            setTimeout(() => {
                setCopySuccessVideoId(null);
                setActiveShareMenu(null);
            }, 1500);
        }, () => {
            alert('فشل النسخ');
        });
    };

    if (urls.length === 0) {
        return (
            <div className="text-center text-white/80 p-8 bg-slate-800/50 rounded-xl">
                <p className="font-bold text-lg">لا توجد أغاني حالياً.</p>
                <p className="text-sm mt-2">لإضافة أغاني، اذهب إلى لوحة التحكم ⚙️ ثم قسم "عام".</p>
            </div>
        );
    }

    return (
        <div id="kids-songs-section-content" className="animate-fade-in">
             <div className="relative mb-6">
                <input
                    type="search"
                    placeholder="ابحث عن أغنية..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-800/50 text-white placeholder-gray-400 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-transparent focus:border-yellow-400"
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>
            {isLoading ? (
                 <div className="text-center text-white/80 p-8"><p>جاري تحميل عناوين الأغاني...</p></div>
            ) : filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredVideos.map((video) => {
                        return (
                            <div key={video.videoId} className="bg-slate-800/80 rounded-2xl shadow-lg overflow-hidden group flex flex-col text-white transform transition-all duration-300 hover:scale-105 hover:rotate-2 border-4 border-cyan-400 p-2">
                                <div className="relative aspect-video overflow-hidden rounded-lg">
                                    <img 
                                        src={video.thumbnailUrl} 
                                        alt={`Thumbnail for ${video.title}`} 
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-black/20"></div>
                                </div>
                                
                                <div className="pt-3 px-1 flex-grow flex flex-col">
                                    <p className="font-bold text-base line-clamp-2 flex-grow" title={video.title}>
                                        {video.title}
                                    </p>
                                    
                                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-700/50">
                                        <div className="relative">
                                            <button
                                                onClick={() => handleShare(video.title, video.url, video.videoId)}
                                                className="flex items-center space-x-1 space-x-reverse text-sm text-slate-300 hover:text-white transition-colors"
                                                aria-label="مشاركة الأغنية"
                                            >
                                                <ShareIcon className="w-5 h-5" />
                                                <span>مشاركة</span>
                                            </button>
                                            {activeShareMenu === video.videoId && (
                                                <div ref={shareMenuRef} className="absolute bottom-full mb-2 right-0 bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-2xl p-2 flex items-center gap-1 z-10 border border-slate-700">
                                                    <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(video.title + ' ' + video.url)}`} target="_blank" rel="noopener noreferrer" className="p-2 text-green-500 hover:bg-slate-700 rounded-full" title="مشاركة عبر واتساب"><WhatsAppIcon className="w-6 h-6"/></a>
                                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(video.url)}`} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-500 hover:bg-slate-700 rounded-full" title="مشاركة عبر فيسبوك"><FacebookIcon className="w-6 h-6"/></a>
                                                    <a href={`https://t.me/share/url?url=${encodeURIComponent(video.url)}&text=${encodeURIComponent(video.title)}`} target="_blank" rel="noopener noreferrer" className="p-2 text-sky-400 hover:bg-slate-700 rounded-full" title="مشاركة عبر تليغرام"><TelegramIcon className="w-6 h-6"/></a>
                                                    <button onClick={() => handleCopy(video.url, video.videoId)} className="p-2 text-slate-300 hover:bg-slate-700 rounded-full" title="نسخ الرابط">
                                                        {copySuccessVideoId === video.videoId ? <CheckIcon className="w-6 h-6 text-green-400"/> : <CopyIcon className="w-6 h-6"/>}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <a 
                                            href={video.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2 space-x-reverse bg-pink-600 hover:bg-pink-700 transition-colors px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                                            aria-label={`استمع إلى ${video.title} على يوتيوب`}
                                        >
                                            <MusicIcon className="w-5 h-5" />
                                            <span>استمع الآن</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                 <div className="text-center text-white/80 p-8 bg-slate-800/50 rounded-xl">
                    <p className="font-bold text-lg">{searchTerm ? 'لا توجد نتائج بحث!' : 'لا توجد أغاني حالياً.'}</p>
                    <p className="text-sm mt-2">{searchTerm ? 'جرّب كلمة بحث أخرى.' : 'لإضافة أغاني، اذهب إلى لوحة التحكم ⚙️ ثم قسم "عام".'}</p>
                </div>
            )}
        </div>
    );
};

export default KidsSongsSection;
