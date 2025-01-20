import React, { useRef, useState, useEffect } from 'react';
import styles from './DraggableTitle.module.scss';

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
    draggable,
    onDragStart,
    size,
}) => {
    const ref = useRef<HTMLHeadingElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    useEffect(() => {
        if (ref.current) {
            const { width, height } = ref.current.getBoundingClientRect();
            setDimensions({ width, height });
        }
    }, []);
    return (
        <div className={styles.container}>
            <h1
                ref={ref}
                id={id ? id : undefined}
                draggable={draggable}
                onDragStart={onDragStart}
                className={styles.draggableTitle}
                style={{ width: size?.width, height: size?.height }}
            >
                {text}
            </h1>
            {!draggable && (
                <div className={styles.draggableTitle_size}>
                    <h6>
                        {dimensions.width.toFixed(2)} x {dimensions.height}
                    </h6>
                </div>
            )}
        </div>
    );
};
