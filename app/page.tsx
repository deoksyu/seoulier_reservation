import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-3">
          <div className="inline-block px-4 py-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full border border-green-500/30 mb-4">
            <span className="text-sm font-medium text-green-400">Reservation System</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-3">
            솥밥 예약 관리
          </h1>
          <p className="text-gray-400 text-lg">매장 예약을 스마트하게 관리하세요</p>
        </div>
        <div className="space-y-3">
          <Link 
            href="/admin" 
            className="block w-full py-4 px-6 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
          >
            서울리에 예약 관리
          </Link>
          <Link 
            href="/view" 
            className="block w-full py-4 px-6 text-lg font-semibold text-gray-300 glass-effect rounded-xl hover:bg-white/10 transition-all border border-gray-700"
          >
            예약 현황 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
