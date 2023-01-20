import { useState } from "react";

export default function useSearch(data) {
  const [filteredData, setFilteredData] = useState([]);

  const filterData = (search) => {
    setFilteredData(data);
    if (search) {
      const filtered = filteredData.filter((data) =>
        data.firstname.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  return {
    filteredData,
    filterData,
    setFilteredData,
  };
}
