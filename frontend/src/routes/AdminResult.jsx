import {useNavigate} from "react-router-dom";

export default function AdminResult(){

  const navigate = useNavigate();

  return (
      <div className={"h-full flex flex-col gap-8 justify-center items-center bg-red-400"}>
        <div className={"font-bold text-white s"}>Movie uploaded to database successfully.</div>
        <div className={"flex justify-center items-center gap-4"}>

          <button
              className={"bg-red-200 p-3 px-9 rounded-lg"}
              onClick={() => navigate("/")}
          >
            Go Home
          </button>

          <button
              className={"bg-red-200 p-3 px-9 rounded-lg"}
              onClick={() => navigate("/admin/upsert")}
          >
            Upload More
          </button>
        </div>
      </div>
  )
}