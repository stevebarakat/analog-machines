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
    const startY = useRef(0);
    const startRotation = useRef(0);

    const currentValue = Math.round(min + ((rotation + 135) / 270) * (max - min));

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        document.body.style.cursor = 'ns-resize';
        startY.current = e.clientY;
        startRotation.current = rotation;
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const step = (max - min) / 100;
        let newRotation = rotation;

        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
            e.preventDefault();
            newRotation = Math.min(135, rotation + step * 2.7);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
            e.preventDefault();
            newRotation = Math.max(-135, rotation - step * 2.7);
        } else {
            return;
        }

        setRotation(newRotation);
        if (onChange) {
            const percent = (newRotation + 135) / 270;
            onChange(min + percent * (max - min));
        }
    };

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const deltaY = startY.current - e.clientY;
            const sensitivity = 2;
            let newRotation = startRotation.current + deltaY * sensitivity;

            if (newRotation < -135) newRotation = -135;
            if (newRotation > 135) newRotation = 135;

            setRotation(newRotation);

            if (onChange) {
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
        };
    }, [isDragging, min, max, onChange]);

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                ref={knobRef}
                tabIndex={0}
                role="slider"
                aria-label={label}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={currentValue}
                onMouseDown={handleMouseDown}
                onKeyDown={handleKeyDown}
                className="w-16 h-16 rounded-full bg-analog-black border-2 border-analog-gold relative cursor-ns-resize shadow-lg active:scale-95 transition-transform focus:outline focus:outline-2 focus:outline-amber-500 focus:outline-offset-2"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <div className="w-1 h-3 bg-analog-cream absolute top-1 left-1/2 -translate-x-1/2 rounded-full"></div>
            </div>
            <span className="font-mono text-xs uppercase tracking-wider text-analog-cream/80">{label}</span>
        </div>
    );
}
