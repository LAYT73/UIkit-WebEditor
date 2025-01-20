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
  const [magneticLines, setMagneticLines] = useState<
    | {
        x: number;
        y: number;
        type: 'vertical' | 'horizontal';
      }[]
    | null
  >(null);

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
        let position = {
          x: e.clientX - canvas.left - canvasOffset.x - draggedElementOffset.x,
          y: e.clientY - canvas.top - canvasOffset.y - draggedElementOffset.y,
        };
        const snapThreshold = 20;
        let closestElement = null;
        let minDistance = Infinity;
        const newMagneticLines: {
          x: number;
          y: number;
          type: 'vertical' | 'horizontal';
        }[] = [];
        const draggedElement = document.getElementById(draggedElementId);
        // let elementWidth = 0;
        // let elementHeight = 0;
        let elementRect = null;
        if (draggedElement) {
          elementRect = draggedElement.getBoundingClientRect();
          //   elementWidth = elementRect.width;
          //   elementHeight = elementRect.height;
        }
        for (const element of elements) {
          if (element.id !== draggedElementId && elementRect) {
            const domElement = document.getElementById(element.id);
            let width = 0;
            // let height = 0;
            if (domElement) {
              const rect = domElement.getBoundingClientRect();
              width = rect.width;
              //   height = rect.height;
            }
            const distanceY = Math.abs(position.y - element.position.y);
            if (distanceY < snapThreshold + 6 && distanceY < minDistance) {
              newMagneticLines.push({
                x: elementRect.x,
                y: element.position.y,
                type: 'horizontal',
              });
              minDistance = distanceY;
              closestElement = {
                ...element,
                axis: 'y',
                snapPosition: element.position.y,
              };
            }

            const distanceXLeftLeft = Math.abs(position.x - element.position.x);
            const distanceXLeftRight = Math.abs(
              position.x - (element.position.x + width),
            );
            if (
              distanceXLeftLeft < snapThreshold + 12 &&
              distanceXLeftLeft < minDistance
            ) {
              newMagneticLines.push({
                x: element.position.x,
                y: elementRect.y,
                type: 'vertical',
              });
              minDistance = distanceXLeftLeft;
              closestElement = {
                ...element,
                axis: 'x',
                snapPosition: element.position.x,
              };
            } else if (
              distanceXLeftRight < snapThreshold + 12 &&
              distanceXLeftRight < minDistance
            ) {
              newMagneticLines.push({
                x: element.position.x + width,
                y: elementRect.y,
                type: 'vertical',
              });
              minDistance = distanceXLeftRight;
              closestElement = {
                ...element,
                axis: 'x',
                snapPosition: element.position.x + width,
              };
            }
          }
        }

        if (closestElement) {
          position = {
            x:
              closestElement.axis === 'x'
                ? closestElement.snapPosition
                : position.x,
            y:
              closestElement.axis === 'y'
                ? closestElement.snapPosition
                : position.y,
          };
        }

        if (
          newMagneticLines.length == 2 &&
          newMagneticLines.filter((el) => el.type === 'vertical')[0] &&
          newMagneticLines.filter((el) => el.type === 'horizontal')[0]
        ) {
          position = {
            x: newMagneticLines.filter((el) => el.type === 'vertical')[0].x,
            y: newMagneticLines.filter((el) => el.type === 'horizontal')[0].y,
          };
        }

        setMagneticLines(newMagneticLines.length > 0 ? newMagneticLines : null);
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
    setMagneticLines(null);
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

        {magneticLines &&
          magneticLines.map((line, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: line.type === 'vertical' ? line.x : line.x - 1920,
                top: line.type === 'horizontal' ? line.y : line.y - 1080,
                width: line.type === 'vertical' ? '1px' : '100%',
                height: line.type === 'horizontal' ? '1px' : '100%',
                backgroundColor: 'rgba(111, 0, 255, 0.5)',
                zIndex: -10,
              }}
            ></div>
          ))}
      </div>
    </div>
  );
};
