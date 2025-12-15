'use client';

import { useState, useEffect } from 'react';

interface SeatPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (seat: string | null) => void;
  selectedSeat?: string | null;
}

export default function SeatPickerModal({ isOpen, onClose, onSelect, selectedSeat }: SeatPickerModalProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (selectedSeat) {
        setSelectedSeats(selectedSeat.split(', '));
      } else {
        setSelectedSeats([]);
      }
    }
  }, [isOpen, selectedSeat]);

  if (!isOpen) return null;

  const seats = Array.from({ length: 13 }, (_, i) => `T${i + 1}`);

  const handleSeatClick = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleConfirm = () => {
    const seatString = selectedSeats.length > 0 ? selectedSeats.sort((a, b) => {
      const numA = parseInt(a.substring(1));
      const numB = parseInt(b.substring(1));
      return numA - numB;
    }).join(', ') : null;
    onSelect(seatString);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="glass-effect rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">좌석 선택 (중복 가능)</h2>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {seats.map((seat) => (
            <button
              key={seat}
              type="button"
              onClick={() => handleSeatClick(seat)}
              className={`py-3 px-4 text-lg font-semibold rounded-lg transition-all ${
                selectedSeats.includes(seat)
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                  : 'glass-effect text-gray-300 border border-gray-700 hover:bg-white/10'
              }`}
            >
              {seat}
            </button>
          ))}
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
            className="flex-1 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
