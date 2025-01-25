import React, { useState } from 'react';
import { Canvas } from '@/widgets/Canvas/Canvas';
import { DraggableButton } from '@/entities/Button/DraggableButton';
import { DraggableTitle } from '@/entities/Title/DraggableTitle';
import styles from './App.module.scss';
import { Aside } from '@/widgets/Aside/Aside';
import { Position } from '@/widgets/Canvas/types/Position.types';

interface Element {
    id: string;
    component: React.ReactNode;
    position: Position;
}

const elementFactory = {
    dragStartButton: (id: string, index: number): JSX.Element => (
        <DraggableButton text={`Button ${index}`} id={id} />
    ),
    dragStartTitle: (id: string, index: number): JSX.Element => (
        <DraggableTitle text={`Title ${index}`} id={id} />
    ),
};

export const App: React.FC = () => {
    const [elements, setElements] = useState<Element[]>([]);

    const createNewElement = (
        id: string | null,
        position: Position,
    ): Element | null => {
        if (!id || !(id in elementFactory)) return null;

        const newId = `element-${elements.length + 1}`;
        const newComponent = elementFactory[id as keyof typeof elementFactory](
            newId,
            elements.length + 1,
        );

        return {
            id: newId,
            component: newComponent,
            position,
        };
    };

    const handleDrop = (id: string | null, position: Position) => {
        const newElement = createNewElement(id, position);
        if (newElement) {
            setElements((prev) => [...prev, newElement]);
        }
    };

    const handleElementMove = (id: string, position: Position) => {
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
