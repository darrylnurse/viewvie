import UploadVideo from "../components/UploadVideo.jsx";

export default function Upsert(){
  return (
      <div className={"bg-red-400 flex justify-center items-center h-full"}>
        <UploadVideo path={"admin"} navigation={"/admin/results"} admin={true}/>
      </div>
  )
}