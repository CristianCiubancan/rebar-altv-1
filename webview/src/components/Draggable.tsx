import React, { useRef, useEffect } from 'react';

type ClickType = 'none' | 'left' | 'middle' | 'right';

interface DraggableProps {
  children: any;
  onLeftClick?: (id: string) => void;
  onDblClick?: (id: string) => void;
  onMiddleClick?: (id: string) => void;
  onRightClick?: (id: string) => void;
  onDragStart?: (id: string) => void;
  onDrag?: (id: string, endId: string) => void;
  onDragStop?: (id: string) => void;
}

export default function Draggable({
  children,
  onLeftClick,
  onDblClick,
  onMiddleClick,
  onRightClick,
  onDragStart,
  onDrag,
  onDragStop,
}: DraggableProps) {
  const slotRef = useRef(null as HTMLDivElement | null);
  const clonedRef = useRef(null as HTMLElement | null);
  const lastClickTime = useRef(Date.now());
  const clickType = useRef('none' as ClickType);
  const idRef = useRef('');
  const isDragged = useRef(false);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;

    const clickTypes: ClickType[] = ['none', 'left', 'middle', 'right'];

    const handleMouseMove = (ev: MouseEvent) => {
      if (!clonedRef.current) return;
      clonedRef.current.style.left = `${ev.clientX}px`;
      clonedRef.current.style.top = `${ev.clientY}px`;
    };

    const stop = (ev: MouseEvent) => {
      const totalDragTime = Date.now() - lastClickTime.current;
      isDragged.current = false;
      if (clonedRef.current) {
        clonedRef.current.remove();
        clonedRef.current = null;
      }
      document.removeEventListener('mouseup', stop);
      document.removeEventListener('mousemove', handleMouseMove);
      if (totalDragTime <= 120) {
        onLeftClick?.(idRef.current);
      } else {
        const target = ev.target as HTMLElement;
        if (target && target.id && target.id !== idRef.current) {
          onDrag?.(idRef.current, target.id);
        }
        onDragStop?.(idRef.current);
      }
    };

    const handleClick = (ev: MouseEvent) => {
      if (isDragged.current) return;
      clickType.current = clickTypes[ev.button] ?? 'none';
      if (!slot) return;
      const child = Array.from(slot.childNodes).find(
        (n) => (n as HTMLElement).id
      ) as HTMLElement | undefined;
      if (!child) return;
      idRef.current = child.id;
      // handle right/middle/double click
      if (clickType.current === 'right') {
        onRightClick?.(idRef.current);
        lastClickTime.current = Date.now();
        return;
      }
      if (clickType.current === 'middle') {
        onMiddleClick?.(idRef.current);
        lastClickTime.current = Date.now();
        return;
      }
      if (Date.now() - lastClickTime.current <= 250) {
        onDblClick?.(idRef.current);
        lastClickTime.current = Date.now();
        return;
      }
      // start drag
      clonedRef.current = child.cloneNode(true) as HTMLElement;
      clonedRef.current.classList.add('pointer-events-none', 'bg-opacity-75', 'fixed');
      slot.appendChild(clonedRef.current);
      document.addEventListener('mouseup', stop);
      document.addEventListener('mousemove', handleMouseMove);
      lastClickTime.current = Date.now();
      isDragged.current = true;
      onDragStart?.(idRef.current);
    };

    slot.addEventListener('mousedown', handleClick);
    slot.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      slot.removeEventListener('mousedown', handleClick);
      slot.removeEventListener('contextmenu', (e) => e.preventDefault());
      document.removeEventListener('mouseup', stop);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onLeftClick, onDblClick, onMiddleClick, onRightClick, onDragStart, onDrag, onDragStop]);

  return (
    <div ref={slotRef} className="select-none">
      {children}
    </div>
  );
}