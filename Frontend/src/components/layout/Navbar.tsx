import { Link } from "react-router-dom"
import DarkButton from '../buttons/DarkButton.tsx'

function Navbar() {
  return (
    <nav className="flex justify-between items-center fixed w-full bg-white dark:bg-[#040919] text-white h-18 shadow-md dark:shadow-gray-800 dark:shadow-md px-10">
        
        {/* Left */}
        <div className="flex flex-row">
            <img src="icons/finext.svg" alt="" className="w-12 h-12"/>
        </div>

        {/* Right */}
        <div className="flex flex-row justify-center items-center">
            <DarkButton/>

            <div className="ring-2 ring-white dark:ring-[#0F1732] rounded-full shadow-lg">
                <Link to="/login">
                    <button className="bg-linear-to-r from-[#B6C3F2] to-[#DC94EE] p-2 w-40 rounded-full cursor-pointer">
                        Sign in
                    </button>
                </Link>
            </div>
        </div>
    </nav>
  )
}

export default Navbar