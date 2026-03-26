
function Button({text}: {text:string}) {

  return (
    <>
          <button className='
          px-5 py-1 border rounded-sm bg-[#003670] text-white font-semibold
          hover:bg-[#001D3D] hover:cursor-pointer
          ease-in-out transition duration-200 '>
            {text}
        </button>
    </>
  )
}

export default Button