import React from 'react';
import Textarea from './Textarea';
import Button from './Button';

export const PromptComposer: React.FC<{initial?:string; onGenerate?: (value:string)=>void}> = ({initial='', onGenerate}) => {
  const [value, setValue] = React.useState(initial);
  return (
    <div>
      <Textarea value={value} onChange={(e)=>setValue((e.target as HTMLTextAreaElement).value)} />
      <Button onClick={()=>onGenerate && onGenerate(value)}>Generate</Button>
    </div>
  );
};

export default PromptComposer;
