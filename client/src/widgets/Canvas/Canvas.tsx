import React, { useRef, useState } from 'react';
import styles from './Canvas.module.scss';

interface CanvasProps {
  onDrop: (id: string | null, position: { x: number; y: number }) => void;
  elements: {
    id: string;
    component: React.ReactNode;
    position: { x: number; y: number };
  }[];
  onElementMove: (id: string, position: { x: number; y: number }) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  onDrop,
  elements,
  onElementMove,
}) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [lastMousePosition, setLastMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [draggedElementOffset, setDraggedElementOffset] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const combinedRef = (node: HTMLDivElement | null) => {
    canvasRef.current = node;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(`.${styles.element}`)) {
      return;
    }

    setIsPanning(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && lastMousePosition) {
      const dx = e.clientX - lastMousePosition.x;
      const dy = e.clientY - lastMousePosition.y;

      setCanvasOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
    if (isDragging && draggedElementId && draggedElementOffset) {
      const canvas = canvasRef.current?.getBoundingClientRect();
      if (canvas) {
        const position = {
          x: e.clientX - canvas.left - canvasOffset.x - draggedElementOffset.x,
          y: e.clientY - canvas.top - canvasOffset.y - draggedElementOffset.y,
        };

        onElementMove(draggedElementId, position);
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setLastMousePosition(null);
  };

  const handleElementMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDraggedElementId(id);

    const element = (e.target as HTMLElement).getBoundingClientRect();
    const offset = {
      x: e.clientX - element.left,
      y: e.clientY - element.top,
    };

    setDraggedElementOffset(offset);
  };

  const handleElementMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(false);
    setDraggedElementId(null);
    setDraggedElementOffset(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    const canvas = canvasRef.current?.getBoundingClientRect();
    if (canvas) {
      const position = {
        x: e.clientX - canvas.left - canvasOffset.x,
        y: e.clientY - canvas.top - canvasOffset.y,
      };
      onDrop(id, position);
    }
  };

  return (
    <div
      ref={combinedRef}
      className={styles.canvas}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div
        className={styles.canvasContent}
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
        }}
      >
        {elements.map(({ id, component, position }) => (
          <div
            key={id}
            className={styles.element}
            style={{
              left: position.x,
              top: position.y,
              position: 'absolute',
            }}
            onMouseUp={(e) => handleElementMouseUp(e)}
            onMouseDown={(e) => handleElementMouseDown(id, e)}
          >
            {component}
          </div>
        ))}
      </div>
    </div>
  );
};
