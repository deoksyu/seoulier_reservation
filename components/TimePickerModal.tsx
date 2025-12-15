'use client';

import { useState, useEffect, useRef } from 'react';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  selectedTime?: string;
}

export default function TimePickerModal({ isOpen, onClose, onSelect, selectedTime }: TimePickerModalProps) {
  const [hour, setHour] = useState(11);
  const [minute, setMinute] = useState(0);
  
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const hourScrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const minuteScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (selectedTime) {
        const [h, m] = selectedTime.split(':').map(Number);
        setHour(h);
        setMinute(m);
        
        setTimeout(() => {
          if (hourRef.current) {
            const itemHeight = 56;
            hourRef.current.scrollTop = (h - 11) * itemHeight;
          }
          if (minuteRef.current) {
            const itemHeight = 56;
            minuteRef.current.scrollTop = (m / 10) * itemHeight;
          }
        }, 0);
      } else {
        setTimeout(() => {
          if (hourRef.current) {
            const itemHeight = 56;
            hourRef.current.scrollTop = 0;
          }
          if (minuteRef.current) {
            minuteRef.current.scrollTop = 0;
          }
        }, 0);
      }
    }
  }, [isOpen, selectedTime]);

  if (!isOpen) return null;

  const hours = Array.from({ length: 10 }, (_, i) => i + 11);
  const minutes = Array.from({ length: 6 }, (_, i) => i * 10);

  const handleConfirm = () => {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onSelect(timeString);
    onClose();
  };

  const handleScroll = (
    e: React.UIEvent<HTMLDivElement>, 
    setter: (value: number) => void,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
    isMinute: boolean = false
  ) => {
    const target = e.currentTarget;
    if (!target) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      const itemHeight = 56;
      const scrollTop = target.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      
      if (isMinute) {
        setter(index * 10);
      } else {
        setter(index + 11);
      }
      
      target.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth'
      });
    }, 150);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="glass-effect rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">시간 선택</h2>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="text-center text-sm font-semibold text-gray-400 mb-2">시</div>
            <div className="relative h-[280px] overflow-hidden">
              <div className="absolute inset-x-0 top-[112px] h-[56px] border-y-2 border-green-500 pointer-events-none z-10" />
              <div
                ref={hourRef}
                className="h-full overflow-y-scroll scrollbar-hide"
                onScroll={(e) => handleScroll(e, setHour, hourScrollTimeout, false)}
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain'
                }}
              >
                <div className="h-[112px]" />
                {hours.map((h) => (
                  <div
                    key={h}
                    className="h-[56px] flex items-center justify-center text-2xl font-semibold snap-start"
                    style={{
                      color: h === hour ? '#22c55e' : '#6b7280',
                      fontSize: h === hour ? '2rem' : '1.5rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    {h.toString().padStart(2, '0')}
                  </div>
                ))}
                <div className="h-[112px]" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center text-3xl font-bold text-gray-500">:</div>

          <div className="flex-1">
            <div className="text-center text-sm font-semibold text-gray-400 mb-2">분</div>
            <div className="relative h-[280px] overflow-hidden">
              <div className="absolute inset-x-0 top-[112px] h-[56px] border-y-2 border-green-500 pointer-events-none z-10" />
              <div
                ref={minuteRef}
                className="h-full overflow-y-scroll scrollbar-hide"
                onScroll={(e) => handleScroll(e, setMinute, minuteScrollTimeout, true)}
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain'
                }}
              >
                <div className="h-[112px]" />
                {minutes.map((m) => (
                  <div
                    key={m}
                    className="h-[56px] flex items-center justify-center text-2xl font-semibold snap-start"
                    style={{
                      color: m === minute ? '#22c55e' : '#6b7280',
                      fontSize: m === minute ? '2rem' : '1.5rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    {m.toString().padStart(2, '0')}
                  </div>
                ))}
                <div className="h-[112px]" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-lg font-semibold text-gray-300 glass-effect rounded-lg hover:bg-white/10 transition-colors border border-gray-700"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
