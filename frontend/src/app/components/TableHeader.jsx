import React from "react";

function TableHeader({ data, onSort }) {
  return (
    <thead>
      <tr>
        {data.map((d) => (
          <th
            className="table-head"
            key={d.id}
            onClick={() => onSort(d.key)}
            scope="col"
          >
            {d.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
