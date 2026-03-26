import React from 'react';

export const CodeEditor: React.FC<{value?:string; onChange?: (v:string)=>void}> = ({value = '', onChange}) => {
  // Placeholder: integrate Monaco or similar in future
  return (
    <textarea value={value} onChange={(e)=>onChange && onChange(e.target.value)} style={{fontFamily: 'monospace', minHeight: 200}} />
  );
};

export default CodeEditor;
