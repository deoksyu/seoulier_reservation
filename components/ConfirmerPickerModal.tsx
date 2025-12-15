'use client';

interface ConfirmerPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (confirmer: string) => void;
  selectedConfirmer: string | null;
}

export default function ConfirmerPickerModal({ 
  isOpen, 
  onClose, 
  onSelect,
  selectedConfirmer 
}: ConfirmerPickerModalProps) {
  if (!isOpen) return null;

  const confirmers = [
    '김서울',
    '이한강',
    '박남산',
    '정동해',
    '최북악',
    '강인왕',
    '윤설악',
    '임지리',
    '송한라',
    '조백두'
  ];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="glass-effect rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">예약 확인자 선택</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {confirmers.map((confirmer) => (
            <button
              key={confirmer}
              type="button"
              onClick={() => {
                onSelect(confirmer);
                onClose();
              }}
              className={`py-4 px-6 text-lg font-semibold rounded-xl transition-all ${
                selectedConfirmer === confirmer
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                  : 'glass-effect text-gray-300 border border-gray-700 hover:bg-white/10'
              }`}
            >
              {confirmer}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-6 py-3 px-6 text-base font-semibold text-gray-300 glass-effect rounded-xl hover:bg-white/10 transition-all border border-gray-700"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
