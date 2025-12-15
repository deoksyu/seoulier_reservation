'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReservationForm from '@/components/ReservationForm';
import ReservationList from '@/components/ReservationList';
import TodaySummaryModal from '@/components/TodaySummaryModal';
import TomorrowSummaryModal from '@/components/TomorrowSummaryModal';
import SnowEffect from '@/components/SnowEffect';

export default function AdminPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isTodaySummaryOpen, setIsTodaySummaryOpen] = useState(false);
  const [isTomorrowSummaryOpen, setIsTomorrowSummaryOpen] = useState(false);

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <SnowEffect />
      <div className="min-h-screen p-6 pb-24">
        <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between glass-effect rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-blue-500 rounded-full"></div>
              <h1 className="text-3xl font-bold text-white">서울리에 예약 관리</h1>
            </div>
            <p className="text-gray-400 ml-5">예약 추가 및 관리</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsTodaySummaryOpen(true)}
              className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25"
            >
              금일 예약 요약
            </button>
            <button
              onClick={() => setIsTomorrowSummaryOpen(true)}
              className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
            >
              명일 예약 요약
            </button>
            <Link
              href="/"
              className="px-6 py-3 text-sm font-semibold text-gray-300 glass-effect rounded-xl hover:bg-white/10 transition-all border border-gray-700"
            >
              ← 홈으로
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ReservationForm onSuccess={handleSuccess} />
          </div>
          <div>
            <ReservationList editable={true} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>

      <TodaySummaryModal
        isOpen={isTodaySummaryOpen}
        onClose={() => setIsTodaySummaryOpen(false)}
      />

      <TomorrowSummaryModal
        isOpen={isTomorrowSummaryOpen}
        onClose={() => setIsTomorrowSummaryOpen(false)}
      />
      </div>
    </>
  );
}
