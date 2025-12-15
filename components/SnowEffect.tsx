'use client';

import { useEffect } from 'react';

export default function SnowEffect() {
  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.innerHTML = '❄';
      snowflake.style.left = Math.random() * 100 + 'vw';
      
      const duration = Math.random() * 5 + 8;
      snowflake.style.animationDuration = duration + 's';
      snowflake.style.opacity = (Math.random() * 0.6 + 0.4).toString();
      snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
      
      document.getElementById('snow-container')?.appendChild(snowflake);
      
      setTimeout(() => {
        snowflake.remove();
      }, duration * 1000);
    };

    const interval = setInterval(createSnowflake, 200);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="snow-container" 
      className="fixed top-0 left-0 w-full pointer-events-none z-50"
      style={{ height: '100%' }}
    />
  );
}
