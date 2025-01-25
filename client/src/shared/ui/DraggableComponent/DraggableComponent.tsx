import React, { useRef, useState, useEffect } from 'react';
import styles from './DraggableComponent.module.scss';

import { IDraggableComponentProps } from './IDraggableComponentProps';

const DraggableComponent: React.FC<IDraggableComponentProps> = ({
    draggable = true,
    size,
    renderContent,
}) => {
    const ref = useRef<HTMLElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (ref.current) {
            const { width, height } = ref.current.getBoundingClientRect();
            setDimensions({ width, height });
        }
    }, []);

    return (
        <div className={styles.container}>
            {renderContent(ref, { width: size?.width, height: size?.height })}
            {!draggable && (
                <div className={styles.draggableSizeInfo}>
                    <h6>
                        {dimensions.width.toFixed(2)} x{' '}
                        {dimensions.height.toFixed(2)}
                    </h6>
                </div>
            )}
        </div>
    );
};

export default DraggableComponent;
