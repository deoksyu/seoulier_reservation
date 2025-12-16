'use client';

import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { Reservation } from '@/types/database';

interface TomorrowSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TomorrowSummaryModal({ isOpen, onClose }: TomorrowSummaryModalProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTomorrowReservations();
    }
  }, [isOpen]);

  const fetchTomorrowReservations = async () => {
    setLoading(true);
    try {
      const allReservations = await storage.getReservations();
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
      
      const tomorrowReservations = allReservations
        .filter(r => r.date === tomorrowString && r.status === 'reserved')
        .sort((a, b) => a.time.localeCompare(b.time));
      
      setReservations(tomorrowReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const month = tomorrow.getMonth() + 1;
    const day = tomorrow.getDate();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[tomorrow.getDay()];
    return `${month}/${day} (${dayName})`;
  };

  const getStats = () => {
    const lunchReservations = reservations.filter(r => {
      const hour = parseInt(r.time.split(':')[0]);
      return hour >= 11 && hour < 15;
    });
    
    const dinnerReservations = reservations.filter(r => {
      const hour = parseInt(r.time.split(':')[0]);
      return hour >= 17 && hour < 21;
    });
    
    return {
      lunchTeams: lunchReservations.length,
      lunchAdults: lunchReservations.reduce((sum, r) => sum + r.adults, 0),
      lunchChildren: lunchReservations.reduce((sum, r) => sum + r.children, 0),
      dinnerTeams: dinnerReservations.length,
      dinnerAdults: dinnerReservations.reduce((sum, r) => sum + r.adults, 0),
      dinnerChildren: dinnerReservations.reduce((sum, r) => sum + r.children, 0),
    };
  };

  if (!isOpen) return null;

  const stats = getStats();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="glass-effect rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">{getTomorrowDate()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">로딩 중...</div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-8 text-gray-400">예약이 없습니다.</div>
        ) : (
          <>
            <div className="space-y-3 mb-8">
              {reservations.map((reservation, index) => {
                const hour = parseInt(reservation.time.split(':')[0]);
                const isLunch = hour >= 11 && hour < 15;
                const isDinner = hour >= 17 && hour < 21;
                
                // 이전 예약과 현재 예약 사이에 런치->디너 전환이 있는지 확인
                const prevReservation = index > 0 ? reservations[index - 1] : null;
                const prevHour = prevReservation ? parseInt(prevReservation.time.split(':')[0]) : null;
                const prevIsLunch = prevHour ? (prevHour >= 11 && prevHour < 15) : false;
                const showDivider = prevIsLunch && isDinner;
                
                return (
                  <div key={reservation.id}>
                    {showDivider && (
                      <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                        <span className="text-gray-500 text-sm font-semibold">DINNER</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-white text-xl font-medium">
                      <span className="text-gray-400 w-16 font-bold">{reservation.time.slice(0, 5)}</span>
                      <span className="flex-1">
                        <span className="font-bold">{reservation.name}</span> ({reservation.children > 0 ? `${reservation.adults}+${reservation.children}` : reservation.adults})
                      </span>
                      {reservation.room && reservation.room.length > 0 ? (
                        <span className="text-green-400 font-bold">{reservation.room.join(', ')}</span>
                      ) : reservation.seat ? (
                        <span className="text-blue-400 font-bold">{reservation.seat}</span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex justify-around text-2xl font-bold">
                <div className="text-center">
                  <span className="text-gray-400">L: </span>
                  <span className="text-green-400">{stats.lunchTeams}</span>
                  <span className="text-gray-500">/</span>
                  <span className="text-green-400">
                    {stats.lunchChildren > 0 ? `${stats.lunchAdults}+${stats.lunchChildren}` : stats.lunchAdults}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-gray-400">D: </span>
                  <span className="text-red-400">{stats.dinnerTeams}</span>
                  <span className="text-gray-500">/</span>
                  <span className="text-red-400">
                    {stats.dinnerChildren > 0 ? `${stats.dinnerAdults}+${stats.dinnerChildren}` : stats.dinnerAdults}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 py-4 text-lg font-semibold text-gray-300 glass-effect rounded-xl hover:bg-white/10 transition-colors border border-gray-700"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
