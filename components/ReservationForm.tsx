'use client';

import { useState } from 'react';
import { storage } from '@/lib/storage';
import DatePickerModal from './DatePickerModal';
import TimePickerModal from './TimePickerModal';
import PeoplePickerModal from './PeoplePickerModal';
import PhoneInputModal from './PhoneInputModal';
import RoomPickerModal from './RoomPickerModal';

interface ReservationFormProps {
  onSuccess: () => void;
}

export default function ReservationForm({ onSuccess }: ReservationFormProps) {
  const [loading, setLoading] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newReservation = await storage.addReservation({
        date: formData.date,
        time: formData.time,
        adults: formData.adults,
        children: formData.children,
        room: formData.room,
        name: formData.name,
        phone: formData.phone,
        memo: formData.memo || null,
        status: 'reserved',
      });

      console.log('예약 추가 성공:', newReservation);
      setFormData({
        date: '',
        time: '',
        adults: 0,
        children: 0,
        room: null,
        name: '',
        phone: '',
        memo: '',
      });
      alert('예약이 추가되었습니다!');
      onSuccess();
    } catch (error) {
      console.error('예약 추가 실패:', error);
      if (error instanceof Error) {
        alert(`예약 추가 실패: ${error.message}`);
      } else {
        alert('예약 추가에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTimeCategory = (): 'lunch' | 'dinner' | null => {
    if (!formData.time) return null;
    const hour = parseInt(formData.time.split(':')[0]);
    if (hour >= 11 && hour < 15) return 'lunch';
    if (hour >= 17 && hour < 21) return 'dinner';
    return null;
  };

  const timeCategory = getTimeCategory();

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">새 예약 추가</h2>
        {timeCategory && (
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
            timeCategory === 'lunch' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {timeCategory === 'lunch' ? '런치 예약' : '디너 예약'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            날짜
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            시간
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            인원
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            룸 요청 (선택)
          </label>
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          예약자 이름
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="이름"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          전화번호
        </label>
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
        <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-1">
          메모 (선택)
        </label>
        <textarea
          id="memo"
          value={formData.memo}
          onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="특이사항이나 요청사항"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !formData.date || !formData.time || formData.adults === 0 || !formData.name || !formData.phone}
        className="w-full py-4 px-6 text-xl font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
      >
        {loading ? '저장 중...' : '예약'}
      </button>

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

      <PhoneInputModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onSelect={(phone) => setFormData({ ...formData, phone })}
        selectedPhone={formData.phone}
      />

      <RoomPickerModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onSelect={(room) => setFormData({ ...formData, room })}
        selectedRoom={formData.room}
      />
    </form>
  );
}
