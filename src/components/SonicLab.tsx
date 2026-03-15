import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

export default function SonicLab() {
    const [isPowerOn, setIsPowerOn] = useState(false);
    const [freq, setFreq] = useState(110);
    const [cutoff, setCutoff] = useState(2500);
    const [resonance, setResonance] = useState(2.0);
    const [waveType, setWaveType] = useState<"sawtooth" | "square" | "triangle">("sawtooth");
    
    // Refs for Tone.js objects
    const osc = useRef<Tone.Oscillator | null>(null);
    const filter = useRef<Tone.Filter | null>(null);
    const analyser = useRef<Tone.Analyser | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    const initAudio = () => {
        if (osc.current) return;

        osc.current = new Tone.Oscillator(freq, waveType).start();
        filter.current = new Tone.Filter(cutoff, "lowpass", -24);
        filter.current.Q.value = resonance;
        analyser.current = new Tone.Analyser("waveform", 256);

        osc.current.connect(filter.current);
        filter.current.connect(analyser.current);
        filter.current.toDestination();
        
        // Start muted
        Tone.Destination.volume.value = -Infinity;
    };

    const togglePower = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        if (checked) {
            await Tone.start();
            initAudio();
            Tone.Destination.volume.rampTo(-10, 0.1);
            setIsPowerOn(true);
        } else {
            Tone.Destination.volume.rampTo(-Infinity, 0.1);
            setIsPowerOn(false);
        }
    };

    // Canvas drawing loop
    useEffect(() => {
        if (!isPowerOn) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            return;
        }

        const draw = () => {
            if (!canvasRef.current || !analyser.current) {
                animationRef.current = requestAnimationFrame(draw);
                return;
            }

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const values = analyser.current.getValue();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.lineJoin = "round";
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#ffbf00";

            // values is Float32Array
            if (values instanceof Float32Array) {
                for (let i = 0; i < values.length; i++) {
                    const x = (i / values.length) * canvas.width;
                    const y = ((values[i] + 1) / 2) * canvas.height;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            animationRef.current = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPowerOn]);

    // Effect for parameter updates
    useEffect(() => {
        if (osc.current) osc.current.frequency.rampTo(freq, 0.05);
    }, [freq]);

    useEffect(() => {
        if (filter.current) filter.current.frequency.rampTo(cutoff, 0.05);
    }, [cutoff]);

    useEffect(() => {
        if (filter.current) filter.current.Q.rampTo(resonance, 0.05);
    }, [resonance]);

    useEffect(() => {
        if (osc.current) osc.current.type = waveType;
    }, [waveType]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-4 border-[#222] rounded-xl overflow-hidden shadow-2xl shadow-amber-500/20">
            {/* Visualizer and Switch */}
            <div className="bg-[#1a1a1a] p-8 border-r border-[#222] flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs text-amber-200/80 uppercase">Oscilloscope</span>
                        <div className={`w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_red] ${isPowerOn ? 'animate-pulse' : 'opacity-20'}`}></div>
                    </div>
                    <div className="bg-black/80 rounded border border-green-900/50 p-2 overflow-hidden">
                        <canvas ref={canvasRef} role="img" aria-label="Oscilloscope waveform display" className="w-full h-[120px] opacity-90" width={596} height={240}></canvas>
                    </div>
                </div>
                
                <div className="mt-8 flex items-center justify-center space-x-4">
                    <span id="power-label" className="font-mono text-xs uppercase text-gray-400">Power</span>
                    <label className="relative inline-flex items-center cursor-pointer" aria-label="Power">
                        <input type="checkbox" onChange={togglePower} className="sr-only peer" aria-labelledby="power-label" />
                        <div className="w-14 h-7 bg-zinc-800 rounded-full peer peer-checked:bg-amber-600 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-gray-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-7 peer-checked:after:bg-white"></div>
                    </label>
                </div>
            </div>

            {/* Knobs Panel */}
            <div className="lg:col-span-2 bg-[#3d2b1f] p-8 relative">
                 {/* Wood texture overlay simulated with CSS in global, but here we just use bg color for now */}
                 <div className="absolute inset-0 bg-[url('/textures/wood-pattern.webp')] opacity-30 pointer-events-none"></div>

                <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Freq Knob */}
                    <div className="flex flex-col items-center">
                        <span className="font-mono text-[10px] uppercase text-amber-200/50 mb-4">Freq</span>
                        <Knob 
                            value={freq} 
                            min={20} 
                            max={800} 
                            onChange={setFreq} 
                        />
                        <span className="font-mono text-xs mt-4 text-amber-500">{Math.round(freq)} Hz</span>
                    </div>

                    {/* Cutoff Knob */}
                    <div className="flex flex-col items-center">
                        <span className="font-mono text-[10px] uppercase text-amber-200/50 mb-4">Cutoff</span>
                        <Knob 
                            value={cutoff} 
                            min={20} 
                            max={15000} 
                            onChange={setCutoff} 
                        />
                        <span className="font-mono text-xs mt-4 text-amber-500">{Math.round(cutoff)} Hz</span>
                    </div>

                    {/* Resonance Knob */}
                    <div className="flex flex-col items-center">
                        <span className="font-mono text-[10px] uppercase text-amber-200/50 mb-4">Res</span>
                        <Knob 
                            value={resonance} 
                            min={0} 
                            max={20} 
                            onChange={setResonance} 
                        />
                        <span className="font-mono text-xs mt-4 text-amber-500">{resonance.toFixed(1)}</span>
                    </div>

                    {/* Wave Select */}
                    <div className="flex flex-col items-center">
                        <span className="font-mono text-[10px] uppercase text-amber-200/50 mb-4">Wave</span>
                        <div className="flex flex-col space-y-2 mt-2 w-full">
                            {(['sawtooth', 'square', 'triangle'] as const).map((type) => (
                                <button 
                                    key={type}
                                    onClick={() => setWaveType(type)}
                                    className={`px-3 py-1 text-[10px] font-mono border transition-all uppercase ${
                                        waveType === type
                                        ? 'bg-amber-600/20 text-amber-500 border-amber-600/50'
                                        : 'bg-zinc-800 text-gray-400 border-transparent hover:bg-zinc-700'
                                    }`}
                                >
                                    {type.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                {!isPowerOn && (
                    <div className="mt-12 text-center">
                        <p className="text-amber-500/80 font-mono text-[10px] uppercase animate-bounce">Click 'Power' to Initialize Oscillator</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Knob Component (Simplified for this view)
function Knob({ value, min, max, onChange }: { value: number, min: number, max: number, onChange: (v: number) => void }) {
    const [rotation, setRotation] = useState((value - min) / (max - min) * 300 - 150);
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const startRotation = useRef(0);

    // Sync rotation with external value updates
    useEffect(() => {
        const newRot = ((value - min) / (max - min)) * 300 - 150;
        setRotation(newRot);
    }, [value, min, max]);

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const deltaY = startY.current - e.clientY;
            const sensitivity = 2; 
            let newRotation = startRotation.current + deltaY * sensitivity;
            
            // Clamp between -150 and 150
            if (newRotation < -150) newRotation = -150;
            if (newRotation > 150) newRotation = 150;
            
            setRotation(newRotation);
            
            // Map back to value
            const percent = (newRotation + 150) / 300;
            const newValue = min + percent * (max - min);
            onChange(newValue);
        };
        
        const handleUp = () => {
             setIsDragging(false);
             document.body.style.cursor = 'default';
        };

        if (isDragging) {
             window.addEventListener('mousemove', handleMove);
             window.addEventListener('mouseup', handleUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        }
    }, [isDragging, min, max, onChange]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        document.body.style.cursor = 'ns-resize';
        startY.current = e.clientY;
        startRotation.current = rotation;
    };

    return (
        <div 
            onMouseDown={handleMouseDown}
            className="w-[60px] h-[60px] rounded-full border-2 border-[#444] relative cursor-pointer touch-none"
            style={{ 
                background: 'radial-gradient(circle, #333 0%, #111 100%)' 
            }}
        >
            <div 
                className="absolute w-[3px] h-[12px] bg-[#ffbf00] rounded-sm left-1/2 top-[5px]"
                style={{ 
                    transformOrigin: '50% 25px',
                    transform: `translateX(-50%) rotate(${rotation}deg)` 
                }}
            ></div>
        </div>
    );
}
