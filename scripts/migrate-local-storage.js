// 로컬 스토리지 데이터 마이그레이션 스크립트
// 브라우저 콘솔에서 실행하세요

(function migrateLocalStorage() {
  const STORAGE_KEY = 'seoulier_reservations';
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      console.log('로컬 스토리지에 데이터가 없습니다.');
      return;
    }
    
    const reservations = JSON.parse(data);
    console.log('기존 데이터:', reservations);
    
    const migratedReservations = reservations.map(reservation => {
      // 기존 필드 유지
      const migrated = { ...reservation };
      
      // people 필드를 adults로 변경
      if (reservation.people !== undefined) {
        migrated.adults = reservation.people;
        delete migrated.people;
      }
      
      // 새로운 필드 추가 (없으면)
      if (migrated.adults === undefined) migrated.adults = 2;
      if (migrated.children === undefined) migrated.children = 0;
      if (migrated.room === undefined) migrated.room = null;
      if (migrated.confirmer === undefined) migrated.confirmer = null;
      if (migrated.phone === undefined) migrated.phone = '';
      
      return migrated;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedReservations));
    console.log('마이그레이션 완료!');
    console.log('새로운 데이터:', migratedReservations);
    
    alert('로컬 스토리지 데이터 마이그레이션이 완료되었습니다. 페이지를 새로고침하세요.');
  } catch (error) {
    console.error('마이그레이션 실패:', error);
    alert('마이그레이션 중 오류가 발생했습니다. 콘솔을 확인하세요.');
  }
})();
