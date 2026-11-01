import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [ringPosition, setRingPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(true);

  useEffect(() => {
    // Disable custom cursor on touch devices or reduced motion preference
    const mediaQueryPointer = window.matchMedia('(pointer: fine)');
    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!mediaQueryPointer.matches || mediaQueryMotion.matches) {
      setIsPointerDevice(false);
      return;
    }

    let animationFrameId: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPosition({ x: targetX, y: targetY });

      if (!isVisible) setIsVisible(true);

      // Check if mouse is over interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('a') ||
          target.closest('button') ||
          target.closest('input') ||
          target.closest('select') ||
          target.closest('textarea') ||
          target.closest('[data-cursor="pointer"]')
        );
        setIsHovered(isInteractive);
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Smooth trailing ring lerp loop
    const updateRing = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setRingPosition({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(updateRing);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    animationFrameId = requestAnimationFrame(updateRing);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (!isPointerDevice || !isVisible) return null;

  return (
    <>
      {/* Outer Glowing Trailing Ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 transition-transform duration-75 ease-out rounded-full"
        style={{
          transform: `translate3d(${ringPosition.x - (isHovered ? 28 : 16)}px, ${ringPosition.y - (isHovered ? 28 : 16)}px, 0) scale(${isClicked ? 0.75 : isHovered ? 1.4 : 1})`,
          width: isHovered ? '56px' : '32px',
          height: isHovered ? '56px' : '32px',
          border: isHovered ? '1.5px solid rgba(0, 240, 255, 0.9)' : '1px solid rgba(0, 240, 255, 0.4)',
          backgroundColor: isHovered ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
          boxShadow: isHovered ? '0 0 20px rgba(0, 240, 255, 0.4)' : 'none',
        }}
      />

      {/* Inner Electric Core Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full bg-[#00f0ff]"
        style={{
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0) scale(${isClicked ? 0.6 : isHovered ? 1.8 : 1})`,
          width: '8px',
          height: '8px',
          boxShadow: '0 0 10px #00f0ff, 0 0 20px #00f0ff',
        }}
      />
    </>
  );
};
