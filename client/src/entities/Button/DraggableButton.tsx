import React, { useRef, useState, useEffect } from 'react';
import styles from './DraggableButton.module.scss';

interface DraggableButtonProps {
    text: string;
    id: string | null;
    draggable?: boolean;
    size?: {
        width: string;
        height: string;
    };
    onDragStart?: (e: React.DragEvent) => void;
}

export const DraggableButton: React.FC<DraggableButtonProps> = ({
    text,
    id,
    draggable,
    onDragStart,
    size,
}) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    useEffect(() => {
        if (ref.current) {
            const { width, height } = ref.current.getBoundingClientRect();
            setDimensions({ width, height });
        }
    }, []);
    return (
        <div className={styles.container}>
            <button
                ref={ref}
                id={id ? id : undefined}
                draggable={draggable}
                onDragStart={onDragStart}
                className={styles.draggableButton}
                style={{ width: size?.width, height: size?.height }}
            >
                {text}
            </button>
            {!draggable && (
                <div className={styles.draggableButton_size}>
                    <h6>
                        {dimensions.width.toFixed(2)} x {dimensions.height}
                    </h6>
                </div>
            )}
        </div>
    );
};
