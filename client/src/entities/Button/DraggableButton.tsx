import React from 'react';
import { useDrag } from 'react-dnd';
import styles from './Button.module.scss';

interface DraggableButtonProps {
  text: string;
  id: string | null;
}

export const DraggableButton: React.FC<DraggableButtonProps> = ({
  text,
  id,
}) => {
  const [, dragRef] = useDrag({
    type: 'BUTTON',
    item: { id },
  });

  return (
    <button ref={dragRef} className={styles.draggableButton}>
      {text}
    </button>
  );
};
