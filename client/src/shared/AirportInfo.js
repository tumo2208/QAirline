import { useState, useEffect } from 'react';
import axios from "axios";

const FetchAirportInfo = () => {
    const [suggestions, setSuggestions] = useState([]);
  
    useEffect(() => {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/airportAircraft/allAirports`);
          setSuggestions(response.data.map((airport) => ({
              name: airport.name,
              city: airport.city,
              country: airport.country,
              airport_code: airport.airport_code
          })));
        } catch (error) {
          console.error("Lỗi lấy thông tin sân bay:", error);
        }
      };
  
      fetchSuggestions();
    }, []);
  
    return suggestions;
};

export default FetchAirportInfo;