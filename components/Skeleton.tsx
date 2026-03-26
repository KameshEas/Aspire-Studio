import React from 'react';

export const Skeleton: React.FC<{width?: string | number; height?: string | number}> = ({width='100%', height=16}) => {
  return <div style={{background: 'var(--color-surface-2, #eee)', width, height, borderRadius: 4}} />;
};

export default Skeleton;
