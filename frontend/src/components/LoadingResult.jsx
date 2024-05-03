// eslint-disable-next-line react/prop-types
export default function LoadingResult({ title, match }){
  return (
      <div className={"h-full flex flex-col justify-center items-center bg-orange-100"}>
        <div>{title}</div>
        <div>{match}% match</div>
      </div>
  )
}