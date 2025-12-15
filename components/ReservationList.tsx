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

  const getTodayStats = () => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const todayReservations = reservations.filter(r => r.date === today && r.status === 'reserved');
    
    const lunchReservations = todayReservations.filter(r => {
      const hour = parseInt(r.time.split(':')[0]);
      return hour >= 11 && hour < 15;
    });
    
    const dinnerReservations = todayReservations.filter(r => {
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

  const todayStats = getTodayStats();

  if (loading) {
    return <div className="text-center py-8 text-gray-600">로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      {filter === 'today' && (todayStats.lunchTeams > 0 || todayStats.dinnerTeams > 0) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-500 mb-1">런치 예약</div>
              <div className="flex items-baseline gap-2 justify-center">
                <span className="text-2xl font-bold text-green-600">{todayStats.lunchTeams}</span>
                <span className="text-sm text-gray-600">팀</span>
                <span className="text-gray-400">/</span>
                <span className="text-2xl font-bold text-green-600">{todayStats.lunchAdults}</span>
                {todayStats.lunchChildren > 0 && (
                  <>
                    <span className="text-lg font-bold text-green-500">+{todayStats.lunchChildren}</span>
                  </>
                )}
                <span className="text-sm text-gray-600">명</span>
              </div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-500 mb-1">디너 예약</div>
              <div className="flex items-baseline gap-2 justify-center">
                <span className="text-2xl font-bold text-red-600">{todayStats.dinnerTeams}</span>
                <span className="text-sm text-gray-600">팀</span>
                <span className="text-gray-400">/</span>
                <span className="text-2xl font-bold text-red-600">{todayStats.dinnerAdults}</span>
                {todayStats.dinnerChildren > 0 && (
                  <>
                    <span className="text-lg font-bold text-red-500">+{todayStats.dinnerChildren}</span>
                  </>
                )}
                <span className="text-sm text-gray-600">명</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter('today')}
          className={`flex-1 py-3 px-4 text-lg font-semibold rounded-lg transition-colors ${
            filter === 'today'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          오늘
        </button>
        <button
          onClick={() => setFilter('tomorrow')}
          className={`flex-1 py-3 px-4 text-lg font-semibold rounded-lg transition-colors ${
            filter === 'tomorrow'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          내일
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-3 px-4 text-lg font-semibold rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
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
              ? 'from-green-50 to-emerald-50' 
              : timeCategory === 'dinner'
              ? 'from-red-50 to-rose-50'
              : 'from-blue-50 to-indigo-50';
            
            return (
              <div
                key={reservation.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${headerColor} px-5 py-3 border-b border-gray-200`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500">
                        {timeCategory === 'lunch' ? '런치 예약' : timeCategory === 'dinner' ? '디너 예약' : '예약번호'}
                      </span>
                      <span className="text-sm font-bold text-gray-900">{reservation.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        reservation.status === 'reserved'
                          ? timeCategory === 'lunch'
                            ? 'bg-green-500 text-white'
                            : timeCategory === 'dinner'
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                          : reservation.status === 'done'
                          ? 'bg-gray-400 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {getStatusText(reservation.status)}
                    </span>
                  </div>
                </div>

              <div className="px-5 py-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">예약일</div>
                    <div className="text-base font-bold text-gray-900">{reservation.date}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">예약시간</div>
                    <div className="text-base font-bold text-gray-900">{reservation.time}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">예약자</div>
                    <div className="text-base font-bold text-gray-900">{reservation.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">인원</div>
                    <div className="text-base font-bold text-gray-900">
                      {reservation.children > 0 ? `${reservation.adults}+${reservation.children}人` : `${reservation.adults}人`}
                    </div>
                  </div>
                </div>

                {reservation.room && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">룸 요청</div>
                    <div className="text-base font-bold text-blue-600">{reservation.room}</div>
                  </div>
                )}

                <div>
                  <div className="text-xs text-gray-500 mb-1">연락처</div>
                  <div className="text-base font-medium text-gray-900">{reservation.phone}</div>
                </div>

                {reservation.memo && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">메모</div>
                    <div className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">{reservation.memo}</div>
                  </div>
                )}

                <div>
                  <div className="text-xs text-gray-500 mb-1">예약일시</div>
                  <div className="text-xs text-gray-400">{new Date(reservation.created_at).toLocaleString('ko-KR')}</div>
                </div>
              </div>

              {editable && (
                <div className="px-5 pb-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingReservation(reservation)}
                      className="flex-1 py-3 px-4 text-base font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('취소하시겠습니까?')) {
                          deleteReservation(reservation.id);
                        }
                      }}
                      className="flex-1 py-3 px-4 text-base font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
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
