import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">솥밥 예약 관리</h1>
          <p className="text-gray-600">매장 예약 관리 시스템</p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/admin"
            className="block w-full py-4 px-6 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            관리자 페이지
          </Link>
          
          <Link
            href="/view"
            className="block w-full py-4 px-6 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            예약 현황 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
