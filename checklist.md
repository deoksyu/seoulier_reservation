# 솥밥 매장 예약 관리 MVP 개발 체크리스트

## 📋 프로젝트 설정 (0-10분)

### Next.js 프로젝트 초기화
- [ ] `npx create-next-app@latest` 실행
- [ ] TypeScript, TailwindCSS, App Router 선택
- [ ] 프로젝트 구조 확인

### Supabase 설정
- [ ] Supabase 프로젝트 생성 (supabase.com)
- [ ] Project URL 및 anon key 복사
- [ ] `@supabase/supabase-js` 설치: `npm install @supabase/supabase-js`
- [ ] Supabase 클라이언트 초기화 파일 생성 (`lib/supabase.ts`)

### 환경 변수 설정
- [ ] `.env.local` 파일 생성
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 추가
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가

### Supabase 테이블 생성
- [ ] Supabase Dashboard → SQL Editor 접속
- [ ] `reservations` 테이블 생성 쿼리 실행:
  ```sql
  CREATE TABLE reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    people INTEGER NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    memo TEXT,
    status TEXT DEFAULT 'reserved' CHECK (status IN ('reserved', 'done', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```
- [ ] Row Level Security (RLS) 정책 설정 (읽기/쓰기 모두 허용)

---

## 🎨 UI 컴포넌트 기본 구조 (10-25분)

### 레이아웃
- [ ] 모바일 우선 반응형 레이아웃 구성
- [ ] 큰 터치 영역을 가진 버튼 스타일 정의
- [ ] 가독성 높은 폰트 크기 설정

### 예약 추가 폼 (/admin)
- [ ] 날짜 입력 필드 (date picker)
- [ ] 시간 입력 필드 (time picker)
- [ ] 인원 수 입력 필드 (number)
- [ ] 예약자 이름 입력 필드 (text)
- [ ] 전화번호 입력 필드 (tel)
- [ ] 메모 입력 필드 (textarea, optional)
- [ ] 저장 버튼
- [ ] 폼 유효성 검사
- [ ] 저장 성공/실패 피드백

---

## 📝 예약 리스트 기능 (25-40분)

### 데이터 조회
- [ ] Supabase 클라이언트로 예약 데이터 가져오기 (`supabase.from('reservations').select('*')`)
- [ ] 날짜 및 시간 순 정렬 (`.order('date', { ascending: true }).order('time', { ascending: true })`)
- [ ] Supabase Realtime 구독 설정 (`.on('postgres_changes', ...)`) 또는 주기적 polling

### 필터링
- [ ] "오늘" 필터 버튼
- [ ] "내일" 필터 버튼
- [ ] "전체" 필터 버튼
- [ ] 필터 상태에 따른 데이터 필터링 로직

### 예약 아이템 표시
- [ ] 예약 정보 카드 컴포넌트
  - [ ] 날짜/시간 표시
  - [ ] 인원 수 표시
  - [ ] 예약자 이름 표시
  - [ ] 전화번호 표시
  - [ ] 메모 표시 (있을 경우)
- [ ] 상태별 시각적 구분
  - [ ] reserved: 기본 색상
  - [ ] done: 회색
  - [ ] cancelled: 연한 빨강

---

## ⚙️ 상태 관리 및 수정 기능 (40-50분)

### 상태 변경
- [ ] 상태 변경 버튼 UI
  - [ ] "예약" 버튼
  - [ ] "완료" 버튼
  - [ ] "취소" 버튼
- [ ] Supabase update 쿼리로 상태 변경 (`supabase.from('reservations').update({ status }).eq('id', id)`)
- [ ] 상태 변경 후 UI 업데이트 (Realtime 또는 refetch)

### 예약 삭제
- [ ] 삭제 버튼 (선택사항)
- [ ] 삭제 확인 모달
- [ ] Supabase delete 쿼리 실행 (`supabase.from('reservations').delete().eq('id', id)`)

### /admin 페이지
- [ ] 예약 추가 폼 + 예약 리스트 통합
- [ ] 수정 가능한 인터페이스

---

## 👀 읽기 전용 페이지 (50-60분)

### /view 페이지
- [ ] 예약 리스트만 표시 (폼 제외)
- [ ] 읽기 전용 모드
- [ ] 필터 기능 포함
- [ ] 자동 새로고침 또는 실시간 업데이트

---

## 📱 모바일 최적화 및 테스트

### 반응형 디자인
- [ ] 모바일 화면 레이아웃 확인
- [ ] 터치 영역 크기 확인 (최소 44x44px)
- [ ] 가로/세로 모드 테스트

### UX 원칙 검증
- [ ] 한 손 조작 가능 확인
- [ ] 오늘 예약이 상단에 표시되는지 확인
- [ ] 텍스트 가독성 확인
- [ ] 불필요한 애니메이션 제거

### 기능 테스트
- [ ] 예약 추가 테스트
- [ ] 예약 조회 테스트
- [ ] 필터링 테스트
- [ ] 상태 변경 테스트
- [ ] 실시간 동기화 테스트 (여러 기기)
- [ ] 삭제 기능 테스트

---

## 🚀 Vercel 배포

### Vercel 프로젝트 설정
- [ ] GitHub 저장소에 코드 푸시
- [ ] Vercel 계정 로그인 (vercel.com)
- [ ] 새 프로젝트 import (GitHub 저장소 연결)
- [ ] Framework Preset: Next.js 자동 감지 확인

### 환경 변수 설정
- [ ] Vercel Dashboard → Settings → Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 추가
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가
- [ ] Production, Preview, Development 환경 모두 체크

### 배포 및 확인
- [ ] Deploy 버튼 클릭
- [ ] 빌드 로그 확인
- [ ] 프로덕션 URL 확인 (*.vercel.app)
- [ ] 실제 매장 환경에서 테스트 (모바일 기기)
- [ ] Supabase 연결 확인

### 도메인 설정 (선택사항)
- [ ] 커스텀 도메인 연결 (필요 시)

---

## ✅ 성공 기준 확인

- [ ] 종이 예약 장부 없이 사용 가능한가?
- [ ] 직원이 5초 내 오늘 예약을 파악할 수 있는가?
- [ ] 모바일 환경에서 무리 없이 사용 가능한가?
- [ ] 카운터와 주방에서 동시에 접근 가능한가?

---

## 📌 추가 고려사항

### 선택적 기능
- [ ] 단순 PIN 인증 (보안 필요 시)
- [ ] 예약 수정 기능
- [ ] 예약 검색 기능

### 에러 처리
- [ ] 네트워크 오류 처리
- [ ] Supabase 연결 실패 처리
- [ ] 유효하지 않은 입력 처리
- [ ] Supabase 에러 응답 처리

### 성능
- [ ] 로딩 상태 표시
- [ ] 데이터 캐싱 전략
- [ ] 이미지 최적화 (필요 시)

---

## 🎯 핵심 원칙 체크

> **종이 장부를 그대로 웹으로 옮긴다. 그 이상도, 그 이하도 아니다.**

- [ ] 복잡한 기능 추가하지 않았는가?
- [ ] 매장 직원이 직관적으로 사용할 수 있는가?
- [ ] 1시간 내 개발 가능한 범위인가?
