'use client';

import { useState } from 'react';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  selectedDate?: string;
}

export default function DatePickerModal({ isOpen, onClose, onSelect, selectedDate }: DatePickerModalProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate) {
      return new Date(selectedDate);
    }
    return new Date();
  });

  if (!isOpen) return null;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onSelect(dateString);
    onClose();
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];
    const isSelected = dateString === selectedDate;
    const isToday = date.getTime() === today.getTime();
    const isPast = date < today;

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`
          aspect-square flex items-center justify-center text-lg font-semibold rounded-lg transition-colors
          ${isSelected ? 'bg-blue-600 text-white' : ''}
          ${!isSelected && isToday ? 'bg-blue-100 text-blue-600' : ''}
          ${!isSelected && !isToday && !isPast ? 'bg-white hover:bg-gray-100 text-gray-900' : ''}
          ${!isSelected && !isToday && isPast ? 'bg-gray-50 text-gray-400' : ''}
        `}
      >
        {day}
      </button>
    );
  }

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={prevMonth}
            className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {year}년 {monthNames[month]}
          </h2>
          <button
            onClick={nextMonth}
            className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-4 text-lg font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
