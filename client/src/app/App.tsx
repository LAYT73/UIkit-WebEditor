import React, { useState } from 'react';
import { Canvas } from '@/widgets/Canvas/Canvas';
import { DraggableButton } from '@/entities/Button/DraggableButton';
import styles from './App.module.scss';
import { Aside } from '@/widgets/Aside/Aside';
import { DraggableTitle } from '@/entities/Title/DraggableTitle';

export const App: React.FC = () => {
    const [elements, setElements] = useState<
        {
            id: string;
            component: React.ReactNode;
            position: { x: number; y: number };
        }[]
    >([]);

    const handleDrop = (
        id: string | null,
        position: { x: number; y: number },
    ) => {
        if (id == 'dragStartButton') {
            const newElement = {
                id: `element-${elements.length + 1}`,
                component: (
                    <DraggableButton
                        text={`Button ${elements.length + 1}`}
                        id={`element-${elements.length + 1}`}
                    />
                ),
                position,
            };
            setElements((prev) => [...prev, newElement]);
        } else if (id == 'dragStartTitle') {
            const newElement = {
                id: `element-${elements.length + 1}`,
                component: (
                    <DraggableTitle
                        text={`Title ${elements.length + 1}`}
                        id={`element-${elements.length + 1}`}
                    />
                ),
                position,
            };
            setElements((prev) => [...prev, newElement]);
        }
    };

    const handleElementMove = (
        id: string,
        position: { x: number; y: number },
    ) => {
        setElements((prev) =>
            prev.map((el) => (el.id === id ? { ...el, position } : el)),
        );
    };

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('text', id);
    };

    return (
        <div className={styles.app}>
            <Aside handleDragStart={handleDragStart} />
            <div className={styles.canvasContainer}>
                <Canvas
                    elements={elements}
                    onDrop={handleDrop}
                    onElementMove={handleElementMove}
                />
            </div>
        </div>
    );
};
