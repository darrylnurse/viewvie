import {useEffect, useState} from "react";
import LoadingResult from "../components/LoadingResult.jsx";

export default function UserResults(){

  const [data, setData] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/user-results")
        .then(response => response.json())
        .then(data => setData(data))
  }, []);

  return (
      <div className={"bg-orange-300 h-full p-4 grid grid-cols-3 gap-4"}>
        { data &&
          Object.keys(data).map((movie, index) => {
            return (
                <div key={index}>
                  <LoadingResult
                    title={data[movie].title}
                    match={data[movie].percentage.toString()}
                  />
                </div>
            )
          })
        }
      </div>
  )
}