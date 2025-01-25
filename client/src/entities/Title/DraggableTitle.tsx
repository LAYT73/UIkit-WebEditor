import React from 'react';
import styles from './DraggableTitle.module.scss';
import { DraggableComponent } from '@/shared/ui';

interface DraggableTitleProps {
    text: string;
    id: string | null;
    draggable?: boolean;
    size?: {
        width: string;
        height: string;
    };
    onDragStart?: (e: React.DragEvent) => void;
}

export const DraggableTitle: React.FC<DraggableTitleProps> = ({
    text,
    id,
    draggable = true,
    size,
    onDragStart,
}) => {
    return (
        <DraggableComponent
            draggable={draggable}
            size={size}
            renderContent={(ref, style) => (
                <h1
                    ref={ref as React.RefObject<HTMLHeadingElement>}
                    id={id ? id : undefined}
                    draggable={draggable}
                    onDragStart={onDragStart}
                    className={styles.draggableTitle}
                    style={style}
                >
                    {text}
                </h1>
            )}
        />
    );
};
