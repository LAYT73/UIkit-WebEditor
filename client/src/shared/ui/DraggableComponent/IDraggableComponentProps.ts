import { ReactNode } from 'react';

export interface IDraggableComponentProps {
    draggable?: boolean;
    size?: {
        width: string;
        height: string;
    };
    renderContent: (
        ref: React.RefObject<HTMLElement>,
        style: React.CSSProperties,
    ) => ReactNode;
}
