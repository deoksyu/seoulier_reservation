'use client';

import { useState, useEffect, useRef } from 'react';

interface PeoplePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (adults: number, children: number) => void;
  selectedAdults?: number;
  selectedChildren?: number;
}

export default function PeoplePickerModal({ isOpen, onClose, onSelect, selectedAdults, selectedChildren }: PeoplePickerModalProps) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  
  const adultsRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const adultsScrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const childrenScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (selectedAdults !== undefined) {
        setAdults(selectedAdults);
        setTimeout(() => {
          if (adultsRef.current) {
            const itemHeight = 56;
            adultsRef.current.scrollTop = (selectedAdults - 1) * itemHeight;
          }
        }, 0);
      } else {
        setTimeout(() => {
          if (adultsRef.current) {
            const itemHeight = 56;
            adultsRef.current.scrollTop = itemHeight;
          }
        }, 0);
      }
      
      if (selectedChildren !== undefined) {
        setChildren(selectedChildren);
        setTimeout(() => {
          if (childrenRef.current) {
            const itemHeight = 56;
            childrenRef.current.scrollTop = selectedChildren * itemHeight;
          }
        }, 0);
      } else {
        setTimeout(() => {
          if (childrenRef.current) {
            childrenRef.current.scrollTop = 0;
          }
        }, 0);
      }
    }
  }, [isOpen, selectedAdults, selectedChildren]);

  if (!isOpen) return null;

  const adultsOptions = Array.from({ length: 20 }, (_, i) => i + 1);
  const childrenOptions = Array.from({ length: 11 }, (_, i) => i);

  const handleConfirm = () => {
    onSelect(adults, children);
    onClose();
  };

  const handleScroll = (
    e: React.UIEvent<HTMLDivElement>,
    setter: (value: number) => void,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
    startFrom: number = 1
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
      
      setter(index + startFrom);
      
      target.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth'
      });
    }, 150);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">인원 선택</h2>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="text-center text-sm font-semibold text-gray-600 mb-2">성인</div>
            <div className="relative h-[280px] overflow-hidden">
              <div className="absolute inset-x-0 top-[112px] h-[56px] border-y-2 border-blue-500 pointer-events-none z-10" />
              <div
                ref={adultsRef}
                className="h-full overflow-y-scroll scrollbar-hide"
                onScroll={(e) => handleScroll(e, setAdults, adultsScrollTimeout, 1)}
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain'
                }}
              >
                <div className="h-[112px]" />
                {adultsOptions.map((a) => (
                  <div
                    key={a}
                    className="h-[56px] flex items-center justify-center text-2xl font-semibold"
                    style={{
                      color: a === adults ? '#1d4ed8' : '#9ca3af',
                      fontSize: a === adults ? '2rem' : '1.5rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    {a}
                  </div>
                ))}
                <div className="h-[112px]" />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-center text-sm font-semibold text-gray-600 mb-2">유아</div>
            <div className="relative h-[280px] overflow-hidden">
              <div className="absolute inset-x-0 top-[112px] h-[56px] border-y-2 border-blue-500 pointer-events-none z-10" />
              <div
                ref={childrenRef}
                className="h-full overflow-y-scroll scrollbar-hide"
                onScroll={(e) => handleScroll(e, setChildren, childrenScrollTimeout, 0)}
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain'
                }}
              >
                <div className="h-[112px]" />
                {childrenOptions.map((c) => (
                  <div
                    key={c}
                    className="h-[56px] flex items-center justify-center text-2xl font-semibold"
                    style={{
                      color: c === children ? '#1d4ed8' : '#9ca3af',
                      fontSize: c === children ? '2rem' : '1.5rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    {c}
                  </div>
                ))}
                <div className="h-[112px]" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 text-lg font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
