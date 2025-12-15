export type Database = {
  public: {
    Tables: {
      reservations: {
        Row: {
          id: string;
          date: string;
          time: string;
          adults: number;
          children: number;
          room: string | null;
          name: string;
          phone: string;
          memo: string | null;
          status: 'reserved' | 'done' | 'cancelled';
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          time: string;
          adults: number;
          children: number;
          room?: string | null;
          name: string;
          phone: string;
          memo?: string | null;
          status?: 'reserved' | 'done' | 'cancelled';
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          time?: string;
          adults?: number;
          children?: number;
          room?: string | null;
          name?: string;
          phone?: string;
          memo?: string | null;
          status?: 'reserved' | 'done' | 'cancelled';
          created_at?: string;
        };
      };
    };
  };
};

export type Reservation = Database['public']['Tables']['reservations']['Row'];
