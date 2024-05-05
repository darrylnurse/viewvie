import LoadingResult from "../components/LoadingResult.jsx";
import {useEffect, useState} from "react";

export default function UserResults() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);  // Added loading state

  useEffect(() => {
    async function fetchData() {
      setLoading(true);  // Start loading before fetching
      try {
        const response = await fetch("http://localhost:3000/user-results");
        if (response.ok) {
          const newData = await response.json();
          setData(newData);
        } else return new Error('Failed to fetch results');
      } catch (error) {
        console.error('Error:', error);
        setData([]);  // Reset data on error
      }
      setLoading(false);  // Stop loading after fetching
    }

    fetchData().catch(console.error);
  }, [loading]);  // Dependencies array might include state that indicates data is ready

  if (loading) {
    return <div>Loading results...</div>;  // Loading indicator
  }

  return (
      <div className={"bg-orange-300 h-full p-4 grid grid-cols-3 gap-4"}>
        {data.map((movie, index) => (
            <div key={index}>
              <LoadingResult
                  title={movie.title}
                  match={movie.percentage.toString()}
              />
            </div>
        ))}
      </div>
  );
}
