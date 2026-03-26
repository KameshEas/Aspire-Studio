import React from 'react';

export const UsageMeter: React.FC<{used:number; limit:number}> = ({used, limit}) => {
  const pct = Math.min(100, Math.round((used/limit)*100));
  return (
    <div>
      <div style={{width: '100%', background: 'var(--color-surface-2, #eee)', height: 8, borderRadius: 4}}>
        <div style={{width: `${pct}%`, background: 'var(--color-primary-600, #06b6d4)', height: 8, borderRadius: 4}} />
      </div>
      <small>{used}/{limit} used</small>
    </div>
  );
};

export default UsageMeter;
