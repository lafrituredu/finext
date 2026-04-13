import HamburgerMenuIcon from '/src/assets/icons/Hamburger-menu.svg?react'
import CloseIcon from '/src/assets/icons/Close.svg?react'

interface HamburgerMenu {
  opened: boolean;
  onToggle: () => void;
}

export default function HamburgerMenu({ opened, onToggle }: HamburgerMenu) {
    
  return (
    <>
        { opened ?
            (<CloseIcon onClick={onToggle} className="w-10 h-10 text-text dark:text-dark-text cursor-pointer"/>):
            (<HamburgerMenuIcon onClick={onToggle} className="w-10 h-10 text-text dark:text-dark-text cursor-pointer"/>)
        }
    </>
  )
}