import React, { useState } from 'react';

export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="bg-analog-black border border-analog-gold/30 p-4 rounded shadow-inner">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-analog-gold text-analog-black hover:bg-analog-cream transition-colors"
                >
                    {isPlaying ? (
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                        <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                </button>
                
                <div className="flex-grow h-16 bg-black/50 rounded overflow-hidden relative">
                    {/* Fake Waveform */}
                    <svg className="absolute inset-0 w-full h-full text-analog-gold opacity-50" preserveAspectRatio="none">
                        <path d="M0,32 Q20,5 40,32 T80,32 T120,32 T160,32 T200,32 T240,32 T280,32" stroke="currentColor" strokeWidth="2" fill="none" 
                              className={isPlaying ? "animate-pulse" : ""} />
                         <path d="M0,32 Q10,15 20,32 T40,32 T60,32 T80,32" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" transform="scale(1.5, 0.5)" />
                    </svg>
                    
                    {/* Playhead */}
                    <div className={`absolute top-0 bottom-0 w-0.5 bg-analog-cream ${isPlaying ? 'left-1/2' : 'left-0'} transition-all duration-1000`}></div>
                </div>
            </div>
            <div className="flex justify-between mt-2 font-mono text-xs text-analog-gold/60">
                <span>00:00</span>
                <span>DEMO TRACK 1</span>
                <span>03:45</span>
            </div>
        </div>
    );
}
