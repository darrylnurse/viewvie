import {Outlet, useNavigate} from "react-router-dom";

export default function Root(){

  const navigate = useNavigate();

  const handleAdmin = () => {
    // fake user session 😭
    if(!window.location.pathname.toString().endsWith("upsert")) navigate("admin");
  }

  return (
      <div className={"flex flex-col h-screen"}>
        <header className={"h-[10%] bg-sky-400 flex justify-between items-center px-12"}>
          <div className={"font-bold text-2xl"}>Viewvie</div>
          <nav className={"flex flex-row gap-3"}>
            <button
                className={"bg-sky-200 p-2 rounded-lg"}
                onClick={() => navigate("/")}
            >
              Home
            </button>
            <button
                className={"bg-sky-200 p-2 rounded-lg"}
                onClick={handleAdmin}
            >
              Admin {/*we should check if user-output is already logged in and if yes this button does nothing*/}
            </button>
          </nav>
        </header>
        <main className={"h-[90%]"}>
          <Outlet/>
        </main>
      </div>
  )
}