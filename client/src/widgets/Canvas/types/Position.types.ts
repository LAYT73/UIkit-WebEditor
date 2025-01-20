export type Position = {
    x: number;
    y: number;
};

export type MagneticLine = Position & {
    type: 'vertical' | 'horizontal';
};
