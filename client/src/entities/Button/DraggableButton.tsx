import React from 'react';
import styles from './Button.module.scss';

interface DraggableButtonProps {
  text: string;
  id: string | null;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

export const DraggableButton: React.FC<DraggableButtonProps> = ({
  text,
  id,
  draggable,
  onDragStart,
}) => {
  return (
    <button
      id={id ? id : undefined}
      draggable={draggable}
      onDragStart={onDragStart}
      className={styles.draggableButton}
    >
      {text}
    </button>
  );
};
