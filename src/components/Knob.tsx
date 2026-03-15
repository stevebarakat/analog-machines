import React, { useState, useEffect, useRef } from 'react';

interface KnobProps {
    label: string;
    min?: number;
    max?: number;
    value?: number;
    onChange?: (value: number) => void;
}

export default function Knob({ label, min = 0, max = 100, value = 0, onChange }: KnobProps) {
    const [rotation, setRotation] = useState((value / max) * 270 - 135);
    const knobRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !knobRef.current) return;
            
            const rect = knobRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            
            let angle = Math.atan2(dy, dx) * (180 / Math.PI);
            angle = angle + 90; // Offset to start at 12 o'clock
            
            if (angle < 0) angle += 360;
            
            // Constrain between -135 and 135 (270 degrees total)
            // Map 0-360 to standard knob range logic
            // This is a simplified logic for prototype
            
            // Just using delta Y for simple vertical drag control is often better for web knobs
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = 'default';
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        document.body.style.cursor = 'ns-resize';
        startY.current = e.clientY;
        startRotation.current = rotation;
    };
    
    // Simpler Vertical Drag Approach
    const startY = useRef(0);
    const startRotation = useRef(0);
    
    const handleDrag = (e: React.MouseEvent) => {
       // Handled by effect
    };
    
    // Overriding the effect for vertical drag which is more standard
    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const deltaY = startY.current - e.clientY;
            const sensitivity = 2; // Degrees per pixel
            let newRotation = startRotation.current + deltaY * sensitivity;
            
            // Clamp
            if (newRotation < -135) newRotation = -135;
            if (newRotation > 135) newRotation = 135;
            
            setRotation(newRotation);
            
            if (onChange) {
                // Map rotation (-135 to 135) to value (min to max)
                const percent = (newRotation + 135) / 270;
                const newValue = min + percent * (max - min);
                onChange(newValue);
            }
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

    return (
        <div className="flex flex-col items-center gap-2">
            <div 
                ref={knobRef}
                onMouseDown={handleMouseDown}
                className="w-16 h-16 rounded-full bg-analog-black border-2 border-analog-gold relative cursor-ns-resize shadow-lg active:scale-95 transition-transform"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <div className="w-1 h-3 bg-analog-cream absolute top-1 left-1/2 -translate-x-1/2 rounded-full"></div>
            </div>
            <span className="font-mono text-xs uppercase tracking-wider text-analog-cream/80">{label}</span>
        </div>
    );
}
