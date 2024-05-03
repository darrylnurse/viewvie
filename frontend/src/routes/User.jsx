import UploadVideo from "../components/UploadVideo.jsx";

export default function User() {
  return (
    <div className={"bg-blue-200 h-full"}>
      <UploadVideo path={"user"} navigation={"results"} admin={false}/>
    </div>
  )
}


