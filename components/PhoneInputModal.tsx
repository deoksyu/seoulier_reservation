'use client';

import { useState, useEffect } from 'react';

interface PhoneInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (phone: string) => void;
  selectedPhone?: string;
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
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">전화번호 입력</h2>

        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold h-12 flex items-center justify-center">
              <span className={phoneDigits.length === 0 ? 'text-gray-400' : 'text-gray-900'}>
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
              className="h-16 text-2xl font-semibold text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
            >
              {num}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 text-lg font-semibold text-gray-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 active:bg-yellow-300 transition-colors"
          >
            ← 지우기
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="h-14 text-lg font-semibold text-gray-700 bg-red-100 rounded-lg hover:bg-red-200 active:bg-red-300 transition-colors"
          >
            초기화
          </button>
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
            disabled={phoneDigits.length < 8}
            className="flex-1 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
