import React from 'react';

export const JobStatusPanel: React.FC<{jobId?:string; status?:string; progress?:number}> = ({jobId, status, progress}) => {
  return (
    <section aria-labelledby="job-status">
      <h4 id="job-status">Job {jobId}</h4>
      <p>Status: {status}</p>
      <progress value={progress || 0} max={100} />
    </section>
  );
};

export default JobStatusPanel;
