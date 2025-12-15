'use client';

import { useEffect, useState } from 'react';

export default function SnowEffect() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 모바일 환경 감지
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.innerHTML = '❄';
      snowflake.style.left = Math.random() * 100 + 'vw';
      
      const duration = Math.random() * 5 + 8;
      snowflake.style.animationDuration = duration + 's';
      snowflake.style.opacity = (Math.random() * 0.6 + 0.4).toString();
      
      // 모바일에서는 눈송이 크기를 절반으로
      const baseSize = isMobile ? 5 : 10;
      const sizeVariation = isMobile ? 5 : 10;
      snowflake.style.fontSize = Math.random() * sizeVariation + baseSize + 'px';
      
      document.getElementById('snow-container')?.appendChild(snowflake);
      
      setTimeout(() => {
        snowflake.remove();
      }, duration * 1000);
    };

    // 모바일에서는 눈송이 생성 빈도를 절반으로 (400ms)
    const interval = setInterval(createSnowflake, isMobile ? 400 : 200);
    
    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <div 
      id="snow-container" 
      className="fixed top-0 left-0 w-full pointer-events-none z-50"
      style={{ height: '100%' }}
    />
  );
}
