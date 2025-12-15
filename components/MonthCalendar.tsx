'use client';

import { useState } from 'react';
import { Reservation } from '@/types/database';

interface MonthCalendarProps {
  reservations: Reservation[];
  onDateClick: (date: string) => void;
}

export default function MonthCalendar({ reservations, onDateClick }: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const getReservationCount = (day: number): number => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return reservations.filter(r => r.date === dateString).length;
  };

  const handleDateClick = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const count = getReservationCount(day);
    if (count > 0) {
      onDateClick(dateString);
    }
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const count = getReservationCount(day);
    const isToday = dateString === todayString;
    const hasReservations = count > 0;

    days.push(
      <button
        key={day}
        type="button"
        onClick={() => handleDateClick(day)}
        disabled={!hasReservations}
        className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
          isToday
            ? 'bg-blue-500 text-white'
            : hasReservations
            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            : 'text-gray-300 cursor-not-allowed'
        }`}
      >
        <span>{day}</span>
        {hasReservations && (
          <span className="text-xs mt-1">
            {count}건
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-xl font-bold">←</span>
        </button>
        <h3 className="text-xl font-bold text-gray-900">
          {year}년 {month + 1}월
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-xl font-bold">→</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
    </div>
  );
}
