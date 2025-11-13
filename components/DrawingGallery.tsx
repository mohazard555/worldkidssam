import React, { useContext } from 'react';
import { AppContext } from '../App';

const DrawingGallery: React.FC = () => {
    const { appData } = useContext(AppContext)!;
    
    const drawings = appData.settings.drawings || [];

    if (drawings.length === 0) {
        return (
            <div className="text-center text-white/80 p-8 bg-slate-800/50 rounded-xl">
                <p className="font-bold text-lg">لا توجد رسومات حالياً.</p>
                <p className="text-sm mt-2">لإضافة رسومات، اذهب إلى لوحة التحكم ⚙️ ثم قسم "المعرض".</p>
            </div>
        );
    }

    return (
        <div id="drawing-gallery-content" className="animate-fade-in">
            <div className="bg-yellow-100/20 border-2 border-yellow-300/50 text-yellow-200 text-center p-3 rounded-xl mb-6">
                <p className="font-bold">ارسلو رسوماتكم يا اطفالي الصغار عبر الواتساب لمشاركتها هنا على موقعنا</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {drawings.map((drawing) => (
                    <div key={drawing.id} className="bg-slate-800 rounded-lg shadow-lg overflow-hidden group flex flex-col text-center animate-fade-in">
                        <div className="aspect-square bg-slate-700">
                            <img 
                                src={drawing.imageUrl} 
                                alt={drawing.title} 
                                className="w-full h-full object-contain" 
                            />
                        </div>
                        <div className="p-2 bg-slate-900/50">
                            <p className="text-white font-semibold text-sm truncate" title={drawing.title}>
                                {drawing.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DrawingGallery;