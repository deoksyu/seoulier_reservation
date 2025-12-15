'use client';

import { useState, useEffect } from 'react';

interface PhoneInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (phone: string) => void;
  selectedPhone?: string | null;
}

export default function PhoneInputModal({ isOpen, onClose, onSelect, selectedPhone }: PhoneInputModalProps) {
  const [phoneDigits, setPhoneDigits] = useState('');

  useEffect(() => {
    if (isOpen && selectedPhone) {
      const digits = selectedPhone.replace(/010-/g, '').replace(/-/g, '');
      setPhoneDigits(digits);
    } else if (isOpen) {
      setPhoneDigits('');
    }
  }, [isOpen, selectedPhone]);

  if (!isOpen) return null;

  const handleNumberClick = (num: string) => {
    if (phoneDigits.length < 8) {
      setPhoneDigits(phoneDigits + num);
    }
  };

  const handleBackspace = () => {
    if (phoneDigits.length > 0) {
      setPhoneDigits(phoneDigits.slice(0, -1));
    }
  };

  const handleClear = () => {
    setPhoneDigits('');
  };

  const handleConfirm = () => {
    if (phoneDigits.length === 8) {
      const formattedPhone = `010-${phoneDigits.slice(0, 4)}-${phoneDigits.slice(4)}`;
      onSelect(formattedPhone);
      onClose();
    }
  };

  const getDisplayPhone = () => {
    if (phoneDigits.length === 0) {
      return '010-____-____';
    }
    const part1 = phoneDigits.slice(0, 4).padEnd(4, '_');
    const part2 = phoneDigits.slice(4, 8).padEnd(4, '_');
    return `010-${part1}-${part2}`;
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="glass-effect rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-4 text-center">전화번호 입력</h2>

        <div className="mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-3xl font-bold h-12 flex items-center justify-center">
              <span className={phoneDigits.length === 0 ? 'text-gray-500' : 'text-white'}>
                {getDisplayPhone()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {numbers.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleNumberClick(num)}
              className="h-16 text-2xl font-semibold text-white glass-effect rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors border border-gray-700"
            >
              {num}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 text-lg font-semibold text-white bg-yellow-600/80 rounded-lg hover:bg-yellow-600 active:bg-yellow-700 transition-colors border border-yellow-500/50"
          >
            ← 지우기
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="h-14 text-lg font-semibold text-white bg-red-600/80 rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors border border-red-500/50"
          >
            초기화
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 text-lg font-semibold text-gray-300 glass-effect rounded-lg hover:bg-white/10 transition-colors border border-gray-700"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={phoneDigits.length < 8}
            className="flex-1 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/25 disabled:shadow-none"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
