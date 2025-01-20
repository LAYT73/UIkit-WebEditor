export interface ICanvasProps {
    onDrop: (id: string | null, position: { x: number; y: number }) => void;
    elements: {
        id: string;
        component: React.ReactNode;
        position: { x: number; y: number };
    }[];
    onElementMove: (id: string, position: { x: number; y: number }) => void;
}
