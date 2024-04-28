export default function UploadVideo(){
  const handleSubmit = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log(formData);

    await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    }).catch(console.error);
  };

  return (
      <form
          className={"p-9 bg-sky-200 h-screen flex flex-col gap-4 justify-center items-center"}
          onSubmit={handleSubmit}
          encType={"multipart/form-data"}
      >
        <label htmlFor={'video'}>Upload Video</label>
        <input
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