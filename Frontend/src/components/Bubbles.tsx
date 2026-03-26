
import React, { type MouseEventHandler } from 'react'
import { Link } from 'react-router';
type IconType = React.FC<React.SVGProps<SVGSVGElement>>

function Bubbles(
  {icon: Icon,size = '12',iconSize = '5',isButton = false,link = '',onClick}:
  {icon: IconType, size?: string, bgColor?: string, iconSize?: string,HoverBgColor?:string,isButton?:boolean,link?:string, onClick?:MouseEventHandler<HTMLAnchorElement>}
){

  const sizeClasses:Record<string,string> = {
    '8': 'size-8',
    '9': 'size-9',
    '10': 'size-10',
    '11': 'size-11',
    '12': 'size-12',
  }

  if (isButton) {
    if (link != '') {
      return (
        <Link to={link} onClick={onClick} className={`flex items-center justify-center rounded-full transition-colors duration-200 bg-[#E9EAFF] hover:bg-[#586FFFcc] ${sizeClasses[size]}`} >
            {Icon && <Icon className={`size-${iconSize}`} />}
        </Link>
      );
    }else{
      return (
        <a onClick={onClick} className={`flex items-center justify-center rounded-full transition-colors duration-200 bg-[#E9EAFF] hover:bg-[#586FFFcc] ${sizeClasses[size]}`}>
            {Icon && <Icon className={`size-${iconSize}`} />}
        </a>
      );
    }
  }

  return (
    <div className={`flex items-center justify-center rounded-full bg-[#E9EAFF] ${sizeClasses[size]}`}>
        {Icon && <Icon className={`size-${iconSize}`} />}
    </div>
  )
}

export default Bubbles
