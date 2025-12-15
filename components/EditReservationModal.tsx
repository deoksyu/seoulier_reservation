'use client';

import { useState, useEffect } from 'react';
import { Reservation } from '@/types/database';
import DatePickerModal from './DatePickerModal';
import TimePickerModal from './TimePickerModal';
import PeoplePickerModal from './PeoplePickerModal';
import RoomPickerModal from './RoomPickerModal';
import PhoneInputModal from './PhoneInputModal';

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
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    adults: 0,
    children: 0,
    room: null as string | null,
    name: '',
    phone: '',
    memo: '',
  });

  useEffect(() => {
    if (isOpen && reservation) {
      setFormData({
        date: reservation.date,
        time: reservation.time,
        adults: reservation.adults,
        children: reservation.children,
        room: reservation.room,
        name: reservation.name,
        phone: reservation.phone,
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
      room: formData.room,
      name: formData.name,
      phone: formData.phone,
      memo: formData.memo || null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full my-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">예약 수정</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
              <button
                type="button"
                onClick={() => setIsDateModalOpen(true)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left bg-white hover:bg-gray-50 transition-colors"
              >
                {formData.date ? (
                  <span className="text-gray-900">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
              <button
                type="button"
                onClick={() => setIsTimeModalOpen(true)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left bg-white hover:bg-gray-50 transition-colors"
              >
                {formData.time ? (
                  <span className="text-gray-900">{formData.time}</span>
                ) : (
                  <span className="text-gray-400">시간 선택</span>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">인원</label>
              <button
                type="button"
                onClick={() => setIsPeopleModalOpen(true)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left bg-white hover:bg-gray-50 transition-colors"
              >
                {formData.adults > 0 ? (
                  <span className="text-gray-900">
                    {formData.children > 0 ? `${formData.adults}+${formData.children}` : `${formData.adults}人`}
                  </span>
                ) : (
                  <span className="text-gray-400">인원 선택</span>
                )}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">룸 요청</label>
              <button
                type="button"
                onClick={() => setIsRoomModalOpen(true)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left bg-white hover:bg-gray-50 transition-colors"
              >
                {formData.room ? (
                  <span className="text-gray-900">{formData.room}</span>
                ) : (
                  <span className="text-gray-400">룸 선택</span>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">예약자 이름</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="이름"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
            <button
              type="button"
              onClick={() => setIsPhoneModalOpen(true)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left bg-white hover:bg-gray-50 transition-colors"
            >
              {formData.phone ? (
                <span className="text-gray-900">{formData.phone}</span>
              ) : (
                <span className="text-gray-400">전화번호 입력</span>
              )}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="특이사항이나 요청사항"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 text-lg font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!formData.date || !formData.time || formData.adults === 0 || !formData.name || !formData.phone}
            className="flex-1 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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

        <RoomPickerModal
          isOpen={isRoomModalOpen}
          onClose={() => setIsRoomModalOpen(false)}
          onSelect={(room) => setFormData({ ...formData, room })}
          selectedRoom={formData.room}
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
