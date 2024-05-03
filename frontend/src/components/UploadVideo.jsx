import {useNavigate} from "react-router-dom";
// eslint-disable-next-line react/prop-types
export default function UploadVideo({ path }){

  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const fileInput = event.target.elements.video.files;
    if (fileInput.length === 0) {
      alert("You must upload SOMETHING.");
      return;
    }

    navigate("results");

    await fetch(`http://localhost:3000/${path}/upload`, {
      method: 'POST',
      body: formData,
    }).catch(console.error);
  };

  return (
      <form
          className={"p-9 h-full flex flex-col gap-4 justify-center items-center"}
          onSubmit={handleSubmit}
          encType={"multipart/form-data"}
      >
        <label htmlFor={'video'}>Upload Video</label>
        <input
            id={"uploadVideo"}
            name={"video"}
            type={"file"}
        />
        <input
            type={"submit"}
            className={"bg-sky-100 p-3 px-6 rounded-2xl cursor-pointer select-none"}
        />
      </form>
  )
}