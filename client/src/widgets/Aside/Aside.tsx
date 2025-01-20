import styles from './Aside.module.scss';
import React from 'react';

export const Aside: React.FC<{
    handleDragStart: (e: React.DragEvent, id: string) => void;
}> = ({ handleDragStart }) => {
    return (
        <div className={styles.sidebar}>
            <h3>UIkit-WebEditor</h3>
            <hr />
            <h4>Tools</h4>
            <div className={styles.toolbox}>
                <button
                    id="drag-button"
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'dragStartButton')}
                >
                    Кнопка
                </button>
                <button
                    id="drag-title"
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'dragStartTitle')}
                >
                    Заголовок
                </button>
            </div>
        </div>
    );
};
