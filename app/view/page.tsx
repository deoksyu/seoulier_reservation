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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">예약 현황</h1>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            홈으로
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <ReservationList editable={false} refreshTrigger={refreshTrigger} />
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          30초마다 자동 새로고침
        </div>
      </div>
    </div>
  );
}
