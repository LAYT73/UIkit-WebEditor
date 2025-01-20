import React, { useRef, useState } from 'react';
import styles from './Canvas.module.scss';
import { ICanvasProps } from './types/ICanvasProps.types';
import { MagneticLine, Position } from './types/Position.types';

const SNAP_THRESHOLD = 10;

export const Canvas: React.FC<ICanvasProps> = ({
    onDrop,
    elements,
    onElementMove,
}) => {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [isPanning, setIsPanning] = useState<boolean>(false);
    const [canvasOffset, setCanvasOffset] = useState<Position>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [draggedElementId, setDraggedElementId] = useState<string | null>(
        null,
    );
    const [lastMousePosition, setLastMousePosition] = useState<Position | null>(
        null,
    );
    const [draggedElementOffset, setDraggedElementOffset] =
        useState<Position | null>(null);
    const [magneticLines, setMagneticLines] = useState<MagneticLine[] | null>(
        null,
    );

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
                    x:
                        e.clientX -
                        canvas.left -
                        canvasOffset.x -
                        draggedElementOffset.x,
                    y:
                        e.clientY -
                        canvas.top -
                        canvasOffset.y -
                        draggedElementOffset.y,
                };

                const newMagneticLines: MagneticLine[] = [];
                const closestPosition = { ...position };

                const draggedElement =
                    document.getElementById(draggedElementId);

                let elementRect = null;
                let draggedWidth = 0;
                let draggedHeight = 0;

                if (draggedElement) {
                    elementRect = draggedElement.getBoundingClientRect();
                    draggedWidth = elementRect.width;
                    draggedHeight = elementRect.height;
                }

                elements.forEach((element) => {
                    if (element.id === draggedElementId) return;
                    const domElement = document.getElementById(element.id);
                    let width = 0;
                    let height = 0;
                    if (domElement) {
                        const rect = domElement.getBoundingClientRect();
                        width = rect.width;
                        height = rect.height;
                    }
                    const { x: targetX, y: targetY } = element.position;
                    const targetWidth = width;
                    const targetHeight = height;

                    const snapX = [
                        targetX,
                        targetX + targetWidth,
                        targetX - draggedWidth,
                        targetX + targetWidth - draggedWidth,
                    ];

                    const snapY = [
                        targetY,
                        targetY + targetHeight,
                        targetY - draggedHeight,
                        targetY + targetHeight - draggedHeight,
                    ];

                    snapX.forEach((snap, i) => {
                        if (Math.abs(position.x - snap) < SNAP_THRESHOLD) {
                            closestPosition.x = snap;

                            newMagneticLines.push({
                                x:
                                    i == 2 || i == 3
                                        ? snap + draggedWidth
                                        : snap,
                                y: position.y,
                                type: 'vertical',
                            });
                        }
                    });

                    snapY.forEach((snap, i) => {
                        if (Math.abs(position.y - snap) < SNAP_THRESHOLD) {
                            closestPosition.y = snap;
                            newMagneticLines.push({
                                x: position.x,
                                y:
                                    i == 2 || i == 3
                                        ? snap + draggedHeight
                                        : snap,
                                type: 'horizontal',
                            });
                        }
                    });
                });

                setMagneticLines(newMagneticLines);
                onElementMove(draggedElementId, closestPosition);
            }
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
        setIsDragging(false);
        setMagneticLines(null);
        setDraggedElementId(null);
        setLastMousePosition(null);
        setDraggedElementOffset(null);
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
        setMagneticLines(null);
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

                {magneticLines &&
                    magneticLines.map((line, index) => (
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                left:
                                    line.type === 'vertical'
                                        ? line.x
                                        : line.x - 1920,
                                top:
                                    line.type === 'horizontal'
                                        ? line.y
                                        : line.y - 1080,
                                width:
                                    line.type === 'vertical' ? '1px' : '100%',
                                height:
                                    line.type === 'horizontal' ? '1px' : '100%',
                                backgroundColor: 'rgba(76, 0, 255, 0.99)',
                                zIndex: -10,
                            }}
                        ></div>
                    ))}
            </div>
        </div>
    );
};
