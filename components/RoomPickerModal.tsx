'use client';

import { useState, useEffect } from 'react';

interface RoomPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (room: string | null) => void;
  selectedRoom?: string | null;
}

export default function RoomPickerModal({ isOpen, onClose, onSelect, selectedRoom }: RoomPickerModalProps) {
  const [room, setRoom] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRoom(selectedRoom || null);
    }
  }, [isOpen, selectedRoom]);

  if (!isOpen) return null;

  const rooms = ['B1', 'B2', 'A1'];

  const handleRoomClick = (selectedRoom: string) => {
    setRoom(selectedRoom);
  };

  const handleConfirm = () => {
    onSelect(room);
    onClose();
  };

  const handleNoRoom = () => {
    setRoom(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">룸 선택</h2>

        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={handleNoRoom}
            className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-colors ${
              room === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            룸 요청 없음
          </button>
          
          {rooms.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoomClick(r)}
              className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-colors ${
                room === r
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
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
