import { useEffect, useRef, useState } from 'react';
import './CoreCursor.css';

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, label, [role="button"], [data-cursor-interactive]';

const CoreCursor = () => {
  const frameRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return;

    const root = document.documentElement;
    root.classList.add('core-cursor-enabled');

    const handlePointerMove = (event: PointerEvent) => {
      const frame = frameRef.current;
      const dot = dotRef.current;
      if (!frame || !dot) return;

      frame.style.transform = `translate3d(${event.clientX - frame.offsetWidth / 2}px, ${event.clientY - frame.offsetHeight / 2}px, 0) rotate(${isInteractive ? 45 : 0}deg)`;
      dot.style.transform = `translate3d(${event.clientX - 2}px, ${event.clientY - 2}px, 0)`;
      setIsVisible(true);
      setIsInteractive(event.target instanceof Element && Boolean(event.target.closest(INTERACTIVE_SELECTOR)));
    };

    const handlePointerLeave = () => setIsVisible(false);
    const handlePointerDown = () => setIsPressed(true);
    const handlePointerUp = () => setIsPressed(false);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    return () => {
      root.classList.remove('core-cursor-enabled');
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isInteractive]);

  const frameClasses = [
    'core-cursor',
    isVisible && 'core-cursor-visible',
    isInteractive && 'core-cursor-active',
    isPressed && 'core-cursor-pressed',
  ].filter(Boolean).join(' ');

  return (
    <>
      <div ref={frameRef} className={frameClasses} aria-hidden="true" />
      <div ref={dotRef} className={`core-cursor-dot${isVisible ? ' core-cursor-visible' : ''}`} aria-hidden="true" />
    </>
  );
};

export default CoreCursor;