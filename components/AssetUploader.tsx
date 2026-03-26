import React from 'react';

export const AssetUploader: React.FC<{onUpload?: (file:File)=>void}> = ({onUpload}) => {
  return (
    <label>
      Upload
      <input type="file" onChange={(e)=>{const f = e.target.files?.[0]; if (f) onUpload && onUpload(f);}} />
    </label>
  );
};

export default AssetUploader;
