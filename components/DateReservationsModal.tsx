'use client';

import { Reservation } from '@/types/database';

interface DateReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  reservations: Reservation[];
  onEdit?: (reservation: Reservation) => void;
  onDelete?: (id: string) => void;
}

export default function DateReservationsModal({ 
  isOpen, 
  onClose, 
  date, 
  reservations,
  onEdit,
  onDelete
}: DateReservationsModalProps) {
  if (!isOpen) return null;

  const getTimeCategory = (time: string): 'lunch' | 'dinner' | 'other' => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 11 && hour < 15) return 'lunch';
    if (hour >= 17 && hour < 21) return 'dinner';
    return 'other';
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

  const sortedReservations = [...reservations].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {new Date(date + 'T00:00:00').toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })} 예약
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {sortedReservations.length === 0 ? (
          <div className="text-center py-8 text-gray-600">예약이 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {sortedReservations.map((reservation) => {
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
                  <div className={`bg-gradient-to-r ${headerColor} px-4 py-2 border-b border-gray-200`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500">
                          {timeCategory === 'lunch' ? '런치 예약' : timeCategory === 'dinner' ? '디너 예약' : '예약'}
                        </span>
                        <span className="text-sm font-bold text-gray-900">{reservation.time}</span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-full ${
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

                  <div className="px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-gray-900">{reservation.name}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          {reservation.children > 0 ? `${reservation.adults}+${reservation.children}人` : `${reservation.adults}人`}
                        </span>
                      </div>
                      {reservation.room && (
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {reservation.room}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600">{reservation.phone}</div>
                    {reservation.memo && (
                      <div className="text-xs text-gray-700 bg-gray-50 rounded px-2 py-1">{reservation.memo}</div>
                    )}
                  </div>

                  {(onEdit || onDelete) && (
                    <div className="px-4 pb-3">
                      <div className="flex gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(reservation)}
                            className="flex-1 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            수정
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => {
                              if (confirm('취소하시겠습니까?')) {
                                onDelete(reservation.id);
                              }
                            }}
                            className="flex-1 py-2 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            취소
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
