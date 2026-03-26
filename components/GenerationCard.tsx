import React from 'react';

export const GenerationCard: React.FC<{title?:string; thumbnail?:string; meta?:Record<string, unknown>; children?: React.ReactNode}> = ({title, thumbnail, children}) => {
  return (
    <article>
      {thumbnail && <img src={thumbnail} alt={title || 'thumbnail'} style={{width: '100%'}} />}
      <h4>{title}</h4>
      <div>{children}</div>
    </article>
  );
};

export default GenerationCard;
