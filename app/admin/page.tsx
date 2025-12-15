'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReservationForm from '@/components/ReservationForm';
import ReservationList from '@/components/ReservationList';

export default function AdminPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">관리자 페이지</h1>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            홈으로
          </Link>
        </div>

        <div className="space-y-6">
          <ReservationForm onSuccess={handleSuccess} />
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">예약 목록</h2>
            <ReservationList editable={true} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
}
