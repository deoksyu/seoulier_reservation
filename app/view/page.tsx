'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReservationList from '@/components/ReservationList';

export default function ViewPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between glass-effect rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-blue-500 rounded-full"></div>
              <h1 className="text-3xl font-bold text-white">예약 현황</h1>
            </div>
            <p className="text-gray-400 ml-5">실시간 예약 현황 (30초 자동 새로고침)</p>
          </div>
          <Link
            href="/"
            className="px-6 py-3 text-sm font-semibold text-gray-300 glass-effect rounded-xl hover:bg-white/10 transition-all border border-gray-700"
          >
            ← 홈으로
          </Link>
        </div>

        <ReservationList editable={false} refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
