import React from 'react';

export const DataTable: React.FC<{columns?:string[]; rows?:Record<string, unknown>[]}> = ({columns = [], rows = []}) => {
  return (
    <table>
      <thead>
        <tr>{columns.map(c=> <th key={c}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>{columns.map((c)=> <td key={c}>{String(r[c] ?? '')}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
