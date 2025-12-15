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

  const getDateStats = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateReservations = reservations.filter(r => r.date === dateString && r.status === 'reserved');
    
    const lunchReservations = dateReservations.filter(r => {
      const hour = parseInt(r.time.split(':')[0]);
      return hour >= 11 && hour < 15;
    });
    
    const dinnerReservations = dateReservations.filter(r => {
      const hour = parseInt(r.time.split(':')[0]);
      return hour >= 17 && hour < 21;
    });
    
    return {
      lunchTeams: lunchReservations.length,
      lunchPeople: lunchReservations.reduce((sum, r) => sum + r.adults + r.children, 0),
      dinnerTeams: dinnerReservations.length,
      dinnerPeople: dinnerReservations.reduce((sum, r) => sum + r.adults + r.children, 0),
    };
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
    const stats = getDateStats(day);
    const isToday = dateString === todayString;
    const hasReservations = count > 0;

    days.push(
      <button
        key={day}
        type="button"
        onClick={() => handleDateClick(day)}
        disabled={!hasReservations}
        className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-semibold transition-all p-1 ${
          isToday
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
            : hasReservations
            ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border border-green-500/50 hover:from-green-500/30 hover:to-green-600/30'
            : 'text-gray-600 cursor-not-allowed bg-gray-800/30 border border-gray-800'
        }`}
      >
        <span className="mb-1">{day}</span>
        {hasReservations && (
          <div className="text-[10px] leading-tight space-y-0.5">
            {stats.lunchTeams > 0 && (
              <div className="text-green-400">
                L {stats.lunchTeams}팀/{stats.lunchPeople}명
              </div>
            )}
            {stats.dinnerTeams > 0 && (
              <div className="text-red-400">
                D {stats.dinnerTeams}팀/{stats.dinnerPeople}명
              </div>
            )}
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="glass-effect rounded-2xl shadow-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <span className="text-xl font-bold text-gray-300">←</span>
        </button>
        <h3 className="text-xl font-bold text-white">
          {year}년 {month + 1}월
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <span className="text-xl font-bold text-gray-300">→</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-400">
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
