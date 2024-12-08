import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pagination = () => {
  const [placeResults, setPlaceResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchResults = async () => {
        const response = await axios.post("http://localhost:3001/api/flights/getFlightByArrival", {
            arrivalCity: "Hà Nội",
        });
      setPlaceResults(response.data);
      setTotalPages(Math.ceil(response.data.length / pageSize));
    };
    fetchResults();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderResults = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const results = placeResults.slice(startIndex, endIndex);
    return results.map((result) => (
      <div>{startIndex}:{result.departure_airport_id} ==|== {result.arrival_airport_id}</div>
    ));
  };

  return (
    <div>
      {renderResults()}
      <div>
        <button onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
};

export default Pagination;