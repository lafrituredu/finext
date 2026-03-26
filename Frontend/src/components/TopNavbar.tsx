import Bubbles from './Bubbles'
import SearchIcon from '/src/assets/icons/Search-icon.svg?react'
import ChatIcon from '/src/assets/icons/Chat-icon.svg?react'
import ProfileIcon from '/src/assets/icons/Profile-icon.svg?react'
import NotificationIcon from '/src/assets/icons/Notification-icon.svg?react'
import ProfileNav from './ProfileNav'
import BarsIcon from '/src/assets/icons/Bars.svg?react'

function TopNavbar({setOpen,open}: {setOpen:any,open:boolean}) {

  return (
    <>
      <div className="h-17.5 sticky top-0 bg-white w-full xl:px-20 px-5 flex items-center justify-between font-inter">
        <div className="flex items-center w-fit sm:gap-5 gap-3 ">
          <BarsIcon className='lg:hidden block hover:cursor-pointer' onClick={() => setOpen(!open)}/>
          <label className='hover:cursor-pointer' htmlFor="search">
            <Bubbles icon={SearchIcon} size='9' iconSize='4' isButton={true}/>
          </label>
          <input type="text" name="search" id="search" placeholder="Type to search..." className='placeholder:text-[#898989] appearance-none focus:outline-none text-lg sm:block hidden' />
        </div>

        <div className='flex gap-2.5 items-center'>
          <div className='sm:flex gap-2.5 items-center hidden '>
            <Bubbles icon={ChatIcon} size='9'/>
            <Bubbles icon={NotificationIcon} size='9' isButton={true} onClick={() => alert('Clickaste')} link='/dashboard' />
          </div>
          
          <ProfileNav />
        </div>
      </div>
    </>
  )
}

export default TopNavbar