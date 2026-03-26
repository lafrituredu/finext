import ProfileIcon from '/src/assets/icons/Profile-icon.svg?react'
import ChevronIcon from '/src/assets/icons/Chevron-down.svg?react';

function ProfileNav() {
  return (
    <div className='flex h-full items-center gap-2 ms-5 text-inter hover:cursor-pointer'>
      <div className='text-end sm:block hidden'>
        <p className='text-sm mb-0'>Username</p>
        <p className='text-xs text-[#898989]'>Subtitle</p>
      </div>
      <ProfileIcon className='size-8 '/>
      <ChevronIcon className='text-[#898989] sm:block hidden'/>
    </div>
  )
}

export default ProfileNav
