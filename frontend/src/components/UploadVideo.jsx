import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
// eslint-disable-next-line react/prop-types
export default function UploadVideo({ path, navigation, admin }){

  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const fileInput = event.target.elements.video.files;
    if (fileInput.length === 0) {
      alert("You must upload SOMETHING.");
      return;
    }

    //send metadata title to backend
    if (admin) {
      const titleValue = title.trim(); // Trim any whitespace from the title
      if (!titleValue) {
        alert("You must enter a title.");
        return;
      }
      formData.append('title', titleValue);
    }

    try {
      const response = await fetch(`http://localhost:3000/${path}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) navigate(navigation);
      else return new Error('Failed to upload file');
    } catch (error) { console.error(error) }
  };


  return (
      <form
          className={"p-9 h-full flex flex-col gap-4 justify-center items-center"}
          onSubmit={handleSubmit}
          encType={"multipart/form-data"}
      >
        <label htmlFor={'video'}>Upload Movie</label>
        <input
            id={"uploadVideo"}
            name={"video"}
            type={"file"}
        />

        {admin &&
            <div className={"flex gap-2 flex-col justify-center items-center"}>
              <label htmlFor={"title"}>Add movie title.</label>
              <input
                type={"text"}
                name={"title"}
                className={"p-2 rounded-lg"}
                onChange={event => setTitle(event.target.value)}
              />
          </div>
        }

        <input
            type={"submit"}
            className={"bg-sky-100 p-3 px-6 rounded-2xl cursor-pointer select-none"}
        />
      </form>
  )
}