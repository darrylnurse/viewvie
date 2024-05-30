import LoadingResult from "../components/LoadingResult.jsx";
import {useEffect, useState} from "react";

export default function UserResults() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataFinished, setDataFinished] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setData([]);
      setDataFinished(false);
      try {
        const response = await fetch("http://localhost:3000/user-results");
        if (response.ok) {
          const newData = await response.json();
          setData(newData);
        } else return new Error('Failed to fetch results');
      } catch (error) {
        console.error('Error:', error);
        setData([]);
      }
      setLoading(false);
      setDataFinished(true);
    }
    fetchData().catch(console.error);
  }, [loading]);

  if (loading) return <div className={"h-full bg-orange-200 flex justify-center items-center"}>Loading results...</div>;

  return (
      <div className={"bg-orange-300 h-full p-4 grid grid-cols-3 gap-4"}>
        {dataFinished ? (data.length > 0 ? data.map((movie, index) => (
                    <div key={index}>
                      <LoadingResult
                          title={movie.title}
                          match={movie.percentage.toString()}
                      />
                    </div>
                ))
                : <div className={"col-span-3 flex justify-center items-center"}>No matches.</div>)
            : <div className={"h-full bg-orange-200 flex justify-center items-center"}>Loading results...</div>
        }
      </div>
  );
}