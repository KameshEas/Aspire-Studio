import React from 'react';

export const ReviewQueueItem: React.FC<{id?:string; title?:string; onApprove?: ()=>void; onReject?: ()=>void}> = ({id, title, onApprove, onReject}) => {
  return (
    <div>
      <h5>{title || `Item ${id}`}</h5>
      <button onClick={onApprove}>Approve</button>
      <button onClick={onReject}>Reject</button>
    </div>
  );
};

export default ReviewQueueItem;
