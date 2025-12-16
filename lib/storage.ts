import { supabase } from './supabase';
import { Reservation } from '@/types/database';

const STORAGE_KEY = 'seoulier_reservations';

// Vercel 배포 환경이거나 Supabase URL이 설정되어 있으면 Supabase 사용
const isProduction = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
);

const getLocalReservations = (): Reservation[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const setLocalReservations = (reservations: Reservation[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
};

const normalizeRoom = (room: any): string[] | null => {
  if (!room) return null;
  if (Array.isArray(room)) return room;
  if (typeof room === 'string') {
    try {
      const parsed = JSON.parse(room);
      return Array.isArray(parsed) ? parsed : [room];
    } catch {
      return [room];
    }
  }
  return null;
};

export const storage = {
  async getReservations() {
    if (isProduction) {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });
      
      if (error) throw error;
      const normalized = (data || []).map(r => ({
        ...r,
        room: normalizeRoom(r.room)
      }));
      return normalized;
    } else {
      return getLocalReservations();
    }
  },

  async addReservation(reservation: Omit<Reservation, 'id' | 'created_at'>) {
    if (isProduction) {
      const { data, error } = await supabase
        .from('reservations')
        .insert([reservation])
        .select();
      
      if (error) throw error;
      return data?.[0];
    } else {
      const reservations = getLocalReservations();
      const newReservation: Reservation = {
        ...reservation,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };
      reservations.push(newReservation);
      setLocalReservations(reservations);
      return newReservation;
    }
  },

  async updateReservation(id: string, updates: Partial<Reservation>) {
    if (isProduction) {
      const { data, error } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data?.[0];
    } else {
      const reservations = getLocalReservations();
      const index = reservations.findIndex(r => r.id === id);
      if (index !== -1) {
        reservations[index] = { ...reservations[index], ...updates };
        setLocalReservations(reservations);
        return reservations[index];
      }
      return null;
    }
  },

  async deleteReservation(id: string) {
    if (isProduction) {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } else {
      const reservations = getLocalReservations();
      const filtered = reservations.filter(r => r.id !== id);
      setLocalReservations(filtered);
    }
  },

  isUsingLocalStorage() {
    return !isProduction;
  }
};
