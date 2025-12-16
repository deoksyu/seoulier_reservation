'use client';

import { useState } from 'react';
import { storage } from '@/lib/storage';
import DatePickerModal from './DatePickerModal';
import TimePickerModal from './TimePickerModal';
import PeoplePickerModal from './PeoplePickerModal';
import SeatPickerModal from './SeatPickerModal';
import PhoneInputModal from './PhoneInputModal';
import RoomPickerModal from './RoomPickerModal';
import ConfirmerPickerModal from './ConfirmerPickerModal';

interface ReservationFormProps {
  onSuccess: () => void;
}

export default function ReservationForm({ onSuccess }: ReservationFormProps) {
  const [loading, setLoading] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isConfirmerModalOpen, setIsConfirmerModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    adults: 0,
    children: 0,
    seat: null as string | null,
    room: null as string[] | null,
    name: '',
    phone: '',
    confirmer: null as string | null,
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
        seat: formData.seat,
        room: formData.room,
        name: formData.name,
        phone: formData.phone.trim() || null,
        confirmer: formData.confirmer,
        memo: formData.memo || null,
        status: 'reserved',
      });

      console.log('예약 추가 성공:', newReservation);
      setFormData({
        date: '',
        time: '',
        adults: 0,
        children: 0,
        seat: null,
        room: null,
        name: '',
        phone: '',
        confirmer: null,
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
    <form onSubmit={handleSubmit} className="glass-effect p-8 rounded-2xl shadow-2xl space-y-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">새 예약 추가</h2>
          <p className="text-sm text-gray-400">예약 정보를 입력하세요</p>
        </div>
        {timeCategory && (
          <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
            timeCategory === 'lunch' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
          }`}>
            {timeCategory === 'lunch' ? '런치 예약' : '디너 예약'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            날짜
          </label>
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
              <span className="text-gray-500">날짜 선택</span>
            )}
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            시간
          </label>
          <button
            type="button"
            onClick={() => setIsTimeModalOpen(true)}
            className="w-full px-4 py-3 text-base border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left bg-gray-800/50 hover:bg-gray-700/50 transition-all backdrop-blur-sm"
          >
            {formData.time ? (
              <span className="text-white font-medium">{formData.time}</span>
            ) : (
              <span className="text-gray-500">시간 선택</span>
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          인원
        </label>
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
            <span className="text-gray-500">인원 선택</span>
          )}
        </button>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
          예약자 이름
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 text-base border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800/50 text-white placeholder-gray-500 backdrop-blur-sm transition-all"
          placeholder="이름을 입력하세요"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            전화번호 (선택)
          </label>
          <button
            type="button"
            onClick={() => setIsPhoneModalOpen(true)}
            className="w-full px-4 py-3 text-base border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left bg-gray-800/50 hover:bg-gray-700/50 transition-all backdrop-blur-sm"
          >
            {formData.phone ? (
              <span className="text-white font-medium">{formData.phone}</span>
            ) : (
              <span className="text-gray-500">전화번호 입력</span>
            )}
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            예약 확인자
          </label>
          <button
            type="button"
            onClick={() => setIsConfirmerModalOpen(true)}
            className="w-full px-4 py-3 text-base border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left bg-gray-800/50 hover:bg-gray-700/50 transition-all backdrop-blur-sm"
          >
            {formData.confirmer ? (
              <span className="text-white font-medium">{formData.confirmer}</span>
            ) : (
              <span className="text-gray-500">확인자 선택</span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            좌석 (선택)
          </label>
          <button
            type="button"
            onClick={() => setIsSeatModalOpen(true)}
            className="w-full px-4 py-3 text-base border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left bg-gray-800/50 hover:bg-gray-700/50 transition-all backdrop-blur-sm"
          >
            {formData.seat ? (
              <span className="text-white font-medium">{formData.seat}</span>
            ) : (
              <span className="text-gray-500">좌석 선택</span>
            )}
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            룸 요청 (선택)
          </label>
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
            {formData.room && (Array.isArray(formData.room) ? formData.room.length > 0 : formData.room) ? (
              <span className="text-white font-medium">{Array.isArray(formData.room) ? formData.room.join(', ') : formData.room}</span>
            ) : (
              <span className="text-gray-500">
                {!formData.date || !formData.time ? '날짜와 시간을 먼저 선택하세요' : '룸 선택'}
              </span>
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="memo" className="block text-sm font-semibold text-gray-300 mb-2">
          메모 (선택)
        </label>
        <textarea
          id="memo"
          value={formData.memo}
          onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
          className="w-full px-4 py-3 text-base border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800/50 text-white placeholder-gray-500 backdrop-blur-sm transition-all resize-none"
          placeholder="특이사항이나 요청사항을 입력하세요"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !formData.date || !formData.time || formData.adults === 0 || !formData.name}
        className="w-full py-4 px-6 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 disabled:shadow-none"
      >
        {loading ? '저장 중...' : '예약 추가'}
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

      <SeatPickerModal
        isOpen={isSeatModalOpen}
        onClose={() => setIsSeatModalOpen(false)}
        onSelect={(seat) => setFormData({ ...formData, seat })}
        selectedSeat={formData.seat}
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
        selectedDate={formData.date}
        selectedTime={formData.time}
      />

      <ConfirmerPickerModal
        isOpen={isConfirmerModalOpen}
        onClose={() => setIsConfirmerModalOpen(false)}
        onSelect={(confirmer) => setFormData({ ...formData, confirmer })}
        selectedConfirmer={formData.confirmer}
      />
    </form>
  );
}
