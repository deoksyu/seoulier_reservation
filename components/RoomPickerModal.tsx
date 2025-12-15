'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Reservation } from '@/types/database';

interface RoomPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (room: string | null) => void;
  selectedRoom?: string | null;
  selectedDate?: string;
  selectedTime?: string;
}

export default function RoomPickerModal({ isOpen, onClose, onSelect, selectedRoom, selectedDate, selectedTime }: RoomPickerModalProps) {
  const [room, setRoom] = useState<string | null>(null);
  const [bookedRooms, setBookedRooms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRoom(selectedRoom || null);
      if (selectedDate && selectedTime) {
        checkBookedRooms();
      } else {
        setBookedRooms([]);
      }
    }
  }, [isOpen, selectedRoom, selectedDate, selectedTime]);

  const checkBookedRooms = async () => {
    if (!selectedDate || !selectedTime) return;
    
    setLoading(true);
    const hour = parseInt(selectedTime.split(':')[0]);
    const isLunch = hour >= 11 && hour < 15;
    const isDinner = hour >= 17 && hour < 21;
    
    console.log('=== Room Check Debug ===');
    console.log('Selected Date:', selectedDate);
    console.log('Selected Time:', selectedTime);
    console.log('Hour:', hour);
    console.log('Is Lunch:', isLunch);
    console.log('Is Dinner:', isDinner);
    
    if (!isLunch && !isDinner) {
      setBookedRooms([]);
      setLoading(false);
      return;
    }
    
    try {
      const allReservations = await storage.getReservations();
      const reservations = allReservations.filter(
        r => r.date === selectedDate && r.status === 'reserved'
      );
      
      console.log('Fetched reservations:', reservations);
      
      const booked: string[] = [];
      
      reservations.forEach((reservation) => {
        if (!reservation.room) return;
        
        const resHour = parseInt(reservation.time.split(':')[0]);
        const resIsLunch = resHour >= 11 && resHour < 15;
        const resIsDinner = resHour >= 17 && resHour < 21;
        
        console.log(`Reservation: ${reservation.room} at ${reservation.time} (hour: ${resHour}, isLunch: ${resIsLunch}, isDinner: ${resIsDinner})`);
        
        if ((isLunch && resIsLunch) || (isDinner && resIsDinner)) {
          if (!booked.includes(reservation.room)) {
            booked.push(reservation.room);
            console.log(`Added ${reservation.room} to booked list`);
          }
        }
      });
      
      console.log('Final booked rooms:', booked);
      setBookedRooms(booked);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const rooms = ['B1', 'B2', 'A1'];

  const handleRoomClick = (selectedRoom: string) => {
    setRoom(selectedRoom);
  };

  const handleConfirm = () => {
    onSelect(room);
    onClose();
  };

  const handleNoRoom = () => {
    setRoom(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="glass-effect rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">룸 선택</h2>

        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={handleNoRoom}
            className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-all ${
              room === null
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                : 'glass-effect text-gray-300 border border-gray-700 hover:bg-white/10'
            }`}
          >
            룸 요청 없음
          </button>
          
          {rooms.map((r) => {
            const isBooked = bookedRooms.includes(r);
            return (
              <button
                key={r}
                type="button"
                onClick={() => !isBooked && handleRoomClick(r)}
                disabled={isBooked}
                className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-all relative ${
                  isBooked
                    ? 'bg-gray-800/50 text-gray-600 border border-gray-800 cursor-not-allowed opacity-40'
                    : room === r
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                    : 'glass-effect text-gray-300 border border-gray-700 hover:bg-white/10'
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 text-lg font-semibold text-gray-300 glass-effect rounded-lg hover:bg-white/10 transition-colors border border-gray-700"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
