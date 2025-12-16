'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Reservation } from '@/types/database';
import EditReservationModal from './EditReservationModal';
import MonthCalendar from './MonthCalendar';
import DateReservationsModal from './DateReservationsModal';

interface ReservationListProps {
  editable?: boolean;
  refreshTrigger?: number;
}

type FilterType = 'today' | 'tomorrow' | 'all';

export default function ReservationList({ editable = false, refreshTrigger = 0 }: ReservationListProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<FilterType>('today');
  const [loading, setLoading] = useState(true);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dateModalReservations, setDateModalReservations] = useState<Reservation[]>([]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await storage.getReservations();
      setReservations(data);
    } catch (error) {
      console.error('예약 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [refreshTrigger]);

  const updateStatus = async (id: string, status: 'reserved' | 'done' | 'cancelled') => {
    try {
      await storage.updateReservation(id, { status });
      fetchReservations();
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      await storage.deleteReservation(id);
      fetchReservations();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleEditSave = async (id: string, updates: Partial<Reservation>) => {
    try {
      await storage.updateReservation(id, updates);
      fetchReservations();
      setEditingReservation(null);
      if (selectedDate) {
        const filtered = reservations.filter(r => r.date === selectedDate);
        setDateModalReservations(filtered);
      }
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정에 실패했습니다.');
    }
  };

  const handleDateClick = (date: string) => {
    const filtered = reservations.filter(r => r.date === date);
    setDateModalReservations(filtered);
    setSelectedDate(date);
  };

  const handleDateModalDelete = async (id: string) => {
    await deleteReservation(id);
    if (selectedDate) {
      const filtered = reservations.filter(r => r.date === selectedDate);
      setDateModalReservations(filtered);
    }
  };

  const getTimeCategory = (time: string): 'lunch' | 'dinner' | 'other' => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 11 && hour < 15) return 'lunch';
    if (hour >= 17 && hour < 21) return 'dinner';
    return 'other';
  };

  const getFilteredReservations = () => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const tomorrowDate = new Date(now);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = `${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth() + 1).padStart(2, '0')}-${String(tomorrowDate.getDate()).padStart(2, '0')}`;

    let filtered: Reservation[];
    switch (filter) {
      case 'today':
        filtered = reservations.filter((r) => r.date === today);
        break;
      case 'tomorrow':
        filtered = reservations.filter((r) => r.date === tomorrow);
        break;
      default:
        filtered = reservations;
    }

    return filtered.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.time.localeCompare(b.time);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reserved':
        return 'bg-blue-50 border-blue-200';
      case 'done':
        return 'bg-gray-100 border-gray-300';
      case 'cancelled':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reserved':
        return '예약';
      case 'done':
        return '완료';
      case 'cancelled':
        return '취소';
      default:
        return status;
    }
  };

  const filteredReservations = getFilteredReservations();

  const getDateStats = (dateString: string) => {
    const dateReservations = reservations.filter((r: Reservation) => r.date === dateString && r.status === 'reserved');
    
    const lunchReservations = dateReservations.filter((r: Reservation) => {
      const hour = parseInt(r.time.split(':')[0]);
      return hour >= 11 && hour < 15;
    });
    
    const dinnerReservations = dateReservations.filter((r: Reservation) => {
      const hour = parseInt(r.time.split(':')[0]);
      return hour >= 17 && hour < 21;
    });
    
    return {
      lunchTeams: lunchReservations.length,
      lunchAdults: lunchReservations.reduce((sum: number, r: Reservation) => sum + r.adults, 0),
      lunchChildren: lunchReservations.reduce((sum: number, r: Reservation) => sum + r.children, 0),
      dinnerTeams: dinnerReservations.length,
      dinnerAdults: dinnerReservations.reduce((sum: number, r: Reservation) => sum + r.adults, 0),
      dinnerChildren: dinnerReservations.reduce((sum: number, r: Reservation) => sum + r.children, 0),
    };
  };

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = `${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth() + 1).padStart(2, '0')}-${String(tomorrowDate.getDate()).padStart(2, '0')}`;

  const todayStats = getDateStats(today);
  const tomorrowStats = getDateStats(tomorrow);

  if (loading) {
    return <div className="text-center py-8 text-gray-600">로딩 중...</div>;
  }

  const currentStats = filter === 'today' ? todayStats : filter === 'tomorrow' ? tomorrowStats : null;

  return (
    <div className="space-y-4">
      {(filter === 'today' || filter === 'tomorrow') && currentStats && (currentStats.lunchTeams > 0 || currentStats.dinnerTeams > 0) && (
        <div className="glass-effect rounded-2xl p-6 mb-6 shadow-xl border border-gray-700">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-400 mb-2">런치 예약</div>
              <div className="flex items-baseline gap-2 justify-center">
                <span className="text-3xl font-bold text-green-400">{currentStats.lunchTeams}</span>
                <span className="text-sm text-gray-400">팀</span>
                <span className="text-gray-600">/</span>
                <span className="text-3xl font-bold text-green-400">{currentStats.lunchAdults}</span>
                {currentStats.lunchChildren > 0 && (
                  <span className="text-xl font-bold text-green-500">+{currentStats.lunchChildren}</span>
                )}
                <span className="text-sm text-gray-400">명</span>
              </div>
            </div>
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-400 mb-2">디너 예약</div>
              <div className="flex items-baseline gap-2 justify-center">
                <span className="text-3xl font-bold text-red-400">{currentStats.dinnerTeams}</span>
                <span className="text-sm text-gray-400">팀</span>
                <span className="text-gray-600">/</span>
                <span className="text-3xl font-bold text-red-400">{currentStats.dinnerAdults}</span>
                {currentStats.dinnerChildren > 0 && (
                  <span className="text-xl font-bold text-red-500">+{currentStats.dinnerChildren}</span>
                )}
                <span className="text-sm text-gray-400">명</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter('today')}
          className={`flex-1 py-3 px-4 text-base font-semibold rounded-xl transition-all ${
            filter === 'today'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
              : 'glass-effect text-gray-300 border border-gray-700 hover:bg-white/10'
          }`}
        >
          오늘
        </button>
        <button
          onClick={() => setFilter('tomorrow')}
          className={`flex-1 py-3 px-4 text-base font-semibold rounded-xl transition-all ${
            filter === 'tomorrow'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
              : 'glass-effect text-gray-300 border border-gray-700 hover:bg-white/10'
          }`}
        >
          내일
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-3 px-4 text-base font-semibold rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
              : 'glass-effect text-gray-300 border border-gray-700 hover:bg-white/10'
          }`}
        >
          전체
        </button>
      </div>

      {filter === 'all' ? (
        <MonthCalendar 
          reservations={reservations}
          onDateClick={handleDateClick}
        />
      ) : filteredReservations.length === 0 ? (
        <div className="text-center py-8 text-gray-600">예약이 없습니다.</div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => {
            const timeCategory = getTimeCategory(reservation.time);
            const headerColor = timeCategory === 'lunch' 
              ? 'from-green-500/20 to-emerald-500/20' 
              : timeCategory === 'dinner'
              ? 'from-red-500/20 to-rose-500/20'
              : 'from-blue-500/20 to-indigo-500/20';
            
            return (
              <div
                key={reservation.id}
                className="glass-effect rounded-2xl shadow-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all"
              >
                <div className={`bg-gradient-to-r ${headerColor} px-5 py-3 border-b border-gray-700/50`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400">
                        {timeCategory === 'lunch' ? '런치 예약' : timeCategory === 'dinner' ? '디너 예약' : '예약'}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-xl shadow-lg ${
                        reservation.status === 'reserved'
                          ? timeCategory === 'lunch'
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                            : timeCategory === 'dinner'
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : reservation.status === 'done'
                          ? 'bg-gray-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {getStatusText(reservation.status)}
                    </span>
                  </div>
                </div>

              <div className="px-5 py-4 space-y-3 bg-gray-800/30">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">예약자</div>
                    <div className="text-base font-bold text-white">{reservation.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">예약시간</div>
                    <div className="text-base font-bold text-white">{reservation.time}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">인원</div>
                    <div className="text-base font-bold text-white">
                      {reservation.children > 0 ? `${reservation.adults}+${reservation.children}人` : `${reservation.adults}人`}
                    </div>
                  </div>
                  {reservation.room && reservation.room.length > 0 ? (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">룸 요청</div>
                      <div className="text-base font-bold text-green-400">{reservation.room.join(', ')}</div>
                    </div>
                  ) : reservation.seat ? (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">좌석</div>
                      <div className="text-base font-bold text-blue-400">{reservation.seat}</div>
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">연락처</div>
                    <div className="text-base font-medium text-gray-300">{reservation.phone}</div>
                  </div>
                  {reservation.confirmer && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">확인자</div>
                      <div className="text-base font-medium text-green-400">{reservation.confirmer}</div>
                    </div>
                  )}
                </div>

                {reservation.memo && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">메모</div>
                    <div className="text-sm text-gray-300 bg-gray-900/50 rounded-lg px-3 py-2 border border-gray-700">{reservation.memo}</div>
                  </div>
                )}
              </div>

              {editable && (
                <div className="px-5 pb-4 bg-gray-800/30">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingReservation(reservation)}
                      className="flex-1 py-3 px-4 text-base font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('취소하시겠습니까?')) {
                          deleteReservation(reservation.id);
                        }
                      }}
                      className="flex-1 py-3 px-4 text-base font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/25"
                    >
                      예약 취소
                    </button>
                  </div>
                </div>
              )}
              </div>
            );
          })}
        </div>
      )}

      <EditReservationModal
        isOpen={editingReservation !== null}
        onClose={() => setEditingReservation(null)}
        onSave={handleEditSave}
        reservation={editingReservation}
      />

      <DateReservationsModal
        isOpen={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
        date={selectedDate || ''}
        reservations={dateModalReservations}
        onEdit={editable ? setEditingReservation : undefined}
        onDelete={editable ? handleDateModalDelete : undefined}
      />
    </div>
  );
}
