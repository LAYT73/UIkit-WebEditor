import React, { useState } from 'react';
import { Canvas } from '@/widgets/Canvas/Canvas';
import { DraggableButton } from '@/entities/Button/DraggableButton';
import styles from './App.module.scss';

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
    if (id == 'dragStart') {
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
    console.log(`dragStart`, e.target);
    e.dataTransfer.setData('text', id);
  };

  return (
    <div className={styles.app}>
      <div className={styles.sidebar}>
        <h3>Toolbox</h3>
        <div className={styles.toolbox}>
          <DraggableButton
            text="Drag me"
            id="drag-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'dragStart')}
          />
        </div>
      </div>
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
