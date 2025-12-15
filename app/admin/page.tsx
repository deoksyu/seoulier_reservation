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
        <div className="glass-effect rounded-2xl p-4 md:p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-blue-500 rounded-full"></div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">서울리에 예약 관리</h1>
              </div>
              <p className="text-gray-400 ml-5 text-sm md:text-base">예약 추가 및 관리</p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <button
                onClick={() => setIsTodaySummaryOpen(true)}
                className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25 whitespace-nowrap"
              >
                금일 요약
              </button>
              <button
                onClick={() => setIsTomorrowSummaryOpen(true)}
                className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25 whitespace-nowrap"
              >
                명일 요약
              </button>
              <Link
                href="/"
                className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-gray-300 glass-effect rounded-xl hover:bg-white/10 transition-all border border-gray-700 whitespace-nowrap text-center"
              >
                ← 홈으로
              </Link>
            </div>
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
