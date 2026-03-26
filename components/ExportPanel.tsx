import React from 'react';

export const ExportPanel: React.FC<{onExport?: (type:string)=>void}> = ({onExport}) => {
  return (
    <div>
      <button onClick={()=>onExport && onExport('figma')}>Export to Figma</button>
      <button onClick={()=>onExport && onExport('zip')}>Download ZIP</button>
    </div>
  );
};

export default ExportPanel;
