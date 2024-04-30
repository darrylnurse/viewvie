import {useNavigate} from "react-router-dom";

export default function (){

  const navigate = useNavigate();

  return (
      <div className={"h-screen bg-blue-300 flex flex-col gap-5 justify-center items-center"}>
        <div className={"italic text-xl"}>Total error dude...</div>
        <button
            className={"text-white bg-blue-500 p-3 px-6 rounded-xl"}
            onClick={() => navigate("/")}
        >Go home...</button>
      </div>
  )
}