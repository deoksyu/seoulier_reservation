'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Reservation } from '@/types/database';

interface ReservationListProps {
  editable?: boolean;
  refreshTrigger?: number;
}

type FilterType = 'today' | 'tomorrow' | 'all';

export default function ReservationList({ editable = false, refreshTrigger = 0 }: ReservationListProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<FilterType>('today');
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      setReservations(data || []);
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
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchReservations();
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const deleteReservation = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchReservations();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const getFilteredReservations = () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    switch (filter) {
      case 'today':
        return reservations.filter((r) => r.date === today);
      case 'tomorrow':
        return reservations.filter((r) => r.date === tomorrow);
      default:
        return reservations;
    }
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

  if (loading) {
    return <div className="text-center py-8 text-gray-600">로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
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

      {filteredReservations.length === 0 ? (
        <div className="text-center py-8 text-gray-600">예약이 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {filteredReservations.map((reservation) => (
            <div
              key={reservation.id}
              className={`p-4 rounded-lg border-2 ${getStatusColor(reservation.status)}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {reservation.date} {reservation.time}
                  </div>
                  <div className="text-sm text-gray-600">
                    {reservation.people}명 · {reservation.name}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    reservation.status === 'reserved'
                      ? 'bg-blue-100 text-blue-800'
                      : reservation.status === 'done'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {getStatusText(reservation.status)}
                </span>
              </div>

              <div className="text-sm text-gray-700 mb-2">
                <div>📞 {reservation.phone}</div>
                {reservation.memo && <div className="mt-1">📝 {reservation.memo}</div>}
              </div>

              {editable && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => updateStatus(reservation.id, 'reserved')}
                    className="flex-1 py-2 px-3 text-sm font-semibold text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                  >
                    예약
                  </button>
                  <button
                    onClick={() => updateStatus(reservation.id, 'done')}
                    className="flex-1 py-2 px-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  >
                    완료
                  </button>
                  <button
                    onClick={() => updateStatus(reservation.id, 'cancelled')}
                    className="flex-1 py-2 px-3 text-sm font-semibold text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => deleteReservation(reservation.id)}
                    className="py-2 px-3 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
