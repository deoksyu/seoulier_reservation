'use client';

import { useState, useEffect } from 'react';
import { Reservation } from '@/types/database';
import DatePickerModal from './DatePickerModal';
import TimePickerModal from './TimePickerModal';
import PeoplePickerModal from './PeoplePickerModal';
import SeatPickerModal from './SeatPickerModal';
import RoomPickerModal from './RoomPickerModal';
import PhoneInputModal from './PhoneInputModal';
import ConfirmerPickerModal from './ConfirmerPickerModal';

interface EditReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Reservation>) => void;
  reservation: Reservation | null;
}

export default function EditReservationModal({ isOpen, onClose, onSave, reservation }: EditReservationModalProps) {
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isConfirmerModalOpen, setIsConfirmerModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    adults: 0,
    children: 0,
    seat: null as string | null,
    room: null as string | null,
    name: '',
    phone: '' as string | null,
    confirmer: null as string | null,
    memo: '',
  });

  useEffect(() => {
    if (isOpen && reservation) {
      setFormData({
        date: reservation.date,
        time: reservation.time,
        adults: reservation.adults,
        children: reservation.children,
        seat: reservation.seat,
        room: reservation.room,
        name: reservation.name,
        phone: reservation.phone || '',
        confirmer: reservation.confirmer,
        memo: reservation.memo || '',
      });
    }
  }, [isOpen, reservation]);

  if (!isOpen || !reservation) return null;

  const handleSave = () => {
    onSave(reservation.id, {
      date: formData.date,
      time: formData.time,
      adults: formData.adults,
      children: formData.children,
      seat: formData.seat,
      room: formData.room,
      name: formData.name,
      phone: formData.phone || null,
      confirmer: formData.confirmer,
      memo: formData.memo || null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="glass-effect rounded-2xl p-6 max-w-lg w-full my-8 shadow-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">예약 수정</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">날짜</label>
              <button
                type="button"
                onClick={() => setIsDateModalOpen(true)}
                className="w-full px-4 py-3 text-base border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left bg-gray-800/50 hover:bg-gray-700/50 transition-all backdrop-blur-sm"
              >
                {formData.date ? (
                  <span className="text-white font-medium">
                    {new Date(formData.date + 'T00:00:00').toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                ) : (
                  <span className="text-gray-400">날짜 선택</span>
                )}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">시간</label>
              <button
                type="button"
                onClick={() => setIsTimeModalOpen(true)}
                className="w-full px-4 py-3 text-base border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left bg-gray-800/50 hover:bg-gray-700/50 transition-all backdrop-blur-sm"
              >
                {formData.time ? (
                  <span className="text-white font-medium">{formData.time}</span>
                ) : (
                  <span className="text-gray-400">시간 선택</span>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">인원</label>
            <button
              type="button"
              onClick={() => setIsPeopleModalOpen(true)}
              className="w-full px-4 py-3 text-base border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left bg-gray-800/50 hover:bg-gray-700/50 transition-all backdrop-blur-sm"
            >
              {formData.adults > 0 ? (
                <span className="text-white font-medium">
                  {formData.children > 0 ? `${formData.adults}+${formData.children}` : `${formData.adults}人`}
                </span>
              ) : (
                <span className="text-gray-400">인원 선택</span>
              )}
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">예약자 이름</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 text-base border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800/50 text-white placeholder-gray-500"
              placeholder="이름"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">전화번호 (선택)</label>
              <button
                type="button"
                onClick={() => setIsPhoneModalOpen(true)}
                className="w-full px-4 py-3 text-base border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left bg-gray-800/50 hover:bg-gray-700/50 transition-all backdrop-blur-sm"
              >
                {formData.phone ? (
                  <span className="text-white font-medium">{formData.phone}</span>
                ) : (
                  <span className="text-gray-400">전화번호 입력</span>
                )}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">예약 확인자</label>
              <button
                type="button"
                onClick={() => setIsConfirmerModalOpen(true)}
                className="w-full px-4 py-3 text-base border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left bg-gray-800/50 hover:bg-gray-700/50 transition-all backdrop-blur-sm"
              >
                {formData.confirmer ? (
                  <span className="text-white font-medium">{formData.confirmer}</span>
                ) : (
                  <span className="text-gray-400">확인자 선택</span>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">좌석 (선택)</label>
              <button
                type="button"
                onClick={() => setIsSeatModalOpen(true)}
                className="w-full px-4 py-3 text-base border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left bg-gray-800/50 hover:bg-gray-700/50 transition-all backdrop-blur-sm"
              >
                {formData.seat ? (
                  <span className="text-white font-medium">{formData.seat}</span>
                ) : (
                  <span className="text-gray-400">좌석 선택</span>
                )}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">룸 요청 (선택)</label>
              <button
                type="button"
                onClick={() => setIsRoomModalOpen(true)}
                disabled={!formData.date || !formData.time}
                className={`w-full px-4 py-3 text-base border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left transition-all backdrop-blur-sm ${
                  !formData.date || !formData.time
                    ? 'bg-gray-800/30 cursor-not-allowed opacity-50'
                    : 'bg-gray-800/50 hover:bg-gray-700/50'
                }`}
              >
                {formData.room ? (
                  <span className="text-white font-medium">{formData.room}</span>
                ) : (
                  <span className="text-gray-400">
                    {!formData.date || !formData.time ? '날짜와 시간을 먼저 선택하세요' : '룸 선택'}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">메모</label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              className="w-full px-4 py-3 text-base border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800/50 text-white placeholder-gray-500"
              placeholder="특이사항이나 요청사항"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 text-lg font-semibold text-gray-300 glass-effect rounded-xl hover:bg-white/10 transition-colors border border-gray-700"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!formData.date || !formData.time || formData.adults === 0 || !formData.name}
            className="flex-1 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/25 disabled:shadow-none"
          >
            저장
          </button>
        </div>

        <DatePickerModal
          isOpen={isDateModalOpen}
          onClose={() => setIsDateModalOpen(false)}
          onSelect={(date) => setFormData({ ...formData, date })}
          selectedDate={formData.date}
        />

        <TimePickerModal
          isOpen={isTimeModalOpen}
          onClose={() => setIsTimeModalOpen(false)}
          onSelect={(time) => setFormData({ ...formData, time })}
          selectedTime={formData.time}
        />

        <PeoplePickerModal
          isOpen={isPeopleModalOpen}
          onClose={() => setIsPeopleModalOpen(false)}
          onSelect={(adults, children) => setFormData({ ...formData, adults, children })}
          selectedAdults={formData.adults > 0 ? formData.adults : undefined}
          selectedChildren={formData.children}
        />

        <SeatPickerModal
          isOpen={isSeatModalOpen}
          onClose={() => setIsSeatModalOpen(false)}
          onSelect={(seat) => setFormData({ ...formData, seat })}
          selectedSeat={formData.seat}
        />

        <RoomPickerModal
          isOpen={isRoomModalOpen}
          onClose={() => setIsRoomModalOpen(false)}
          onSelect={(room) => setFormData({ ...formData, room })}
          selectedRoom={formData.room}
          selectedDate={formData.date}
          selectedTime={formData.time}
        />

        <ConfirmerPickerModal
          isOpen={isConfirmerModalOpen}
          onClose={() => setIsConfirmerModalOpen(false)}
          onSelect={(confirmer) => setFormData({ ...formData, confirmer })}
          selectedConfirmer={formData.confirmer}
        />

        <PhoneInputModal
          isOpen={isPhoneModalOpen}
          onClose={() => setIsPhoneModalOpen(false)}
          onSelect={(phone) => setFormData({ ...formData, phone })}
          selectedPhone={formData.phone}
        />
      </div>
    </div>
  );
}
