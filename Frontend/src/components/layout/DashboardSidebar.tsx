import { useEffect, useState } from 'react'
import SidebarItem from './SidebarItem'

//i8n
import { useTranslation } from 'react-i18next'
import Language from '../buttons/Lang'

//ICONOS
import UsersIcon from '/src/assets/icons/Profile-icon.svg?react'
import DashboardIcon from '/src/assets/icons/Dashboard.svg?react'
import ArrowsLeftRight from '/src/assets/icons/ArrowsLeftRight.svg?react'
import Goals from '/src/assets/icons/Goals.svg?react'
import Calculator from '/src/assets/icons/Calculator.svg?react'
import File from '/src/assets/icons/File.svg?react'
import FinextIcon from '/src/assets/icons/finext.svg?react'
import DarkModeToggle from '../buttons/DarkButton'
import ExitIcon from '/src/assets/icons/Exit-icon.svg?react'
import TaxesIcon from '/src/assets/icons/Taxes-Icon.svg?react'
import Recurrent from '/src/assets/icons/Recurrent.svg?react'
import Tag from '/src/assets/icons/Tag.svg?react'
import LoadingIcon from '/src/assets/icons/Loading.svg?react';
import { getCurrentUser, logoutUser, type UserProfile } from '../../api/AuthServices'

interface DashboardSidebar {
  opened?: boolean;
  onClose?: () => void;
}

function DashboardSidebar({opened = true, onClose}:DashboardSidebar) {
const [openId, setOpenId] = useState();
const [user, setUser] = useState<UserProfile | null>(null);
const { t } = useTranslation("sidebar");
const avatarUrl = user?.avatar_url || user?.avatar;
const username = user?.username || localStorage.getItem('user') || '[username]';
const [loading,setLoading] = useState(true);

useEffect(() => {
  getCurrentUser()
    .then(setUser)
    .catch(() => setUser(null));
    setLoading(false)

  const handleUserProfileUpdated = (event: Event) => {
    setUser((event as CustomEvent<UserProfile>).detail);
  };

  window.addEventListener("user-profile-updated", handleUserProfileUpdated);

  return () => {
    window.removeEventListener("user-profile-updated", handleUserProfileUpdated);
  };
}, []);


const menuItems = [{
  name: t('overview'),
  items: [{
    id: 'dashboard',
    label: t('dashboard'),
    icon: DashboardIcon,
    to: '/dashboard',
  },
  {
    id: 'transactions',
    label: t('transactions'),
    icon: ArrowsLeftRight,
    to: '/dashboard/transactions'
  },
  {
    id: 'bill',
    label: t('bills'),
    icon: Calculator,
    to: '/dashboard/bills'
  },
  {
    id: 'categories',
    label: t('categories'),
    icon: Tag,
    to: '/dashboard/categories'
  },
  {
    id: 'goals',
    label: t('goals'),
    icon: Goals,
    to: '/dashboard/goals'
  },
  {
    id: 'recurrent',
    label: t('recurrent'),
    icon: Recurrent,
    to: '/dashboard/recurrent'
  },
  {
    id: 'reports',
    label: t('reports'),
    icon: File,
    to: '/dashboard/reports'
  },
  {
    id: 'taxes',
    label: t('taxes'),
    icon: TaxesIcon,
    to: '/dashboard/taxes'
  },
  ]},
  {
    name: t('utils'),
    items: [
        {
          id: 'profile',
          label: t('profile'),
          icon: UsersIcon,
          children: [
          { label: 'Edit', to: '/dashboard/profile' },
          ]
        }
    ]
  }
];

  return (
    <>
      <div id="sidebar" className={`
        lg:block h-full bg-[#fafafa] px-5 py-10
        lg:relative fixed
        lg:transition-none overflow-hidden
        border-r border-[#0000001a]
        dark:border-dark-background
        dark:bg-[#070d22] flex flex-col justify-between
        ${opened
          ? 'duration-150 z-50 sm:w-75 w-2/3 opacity-100 pointer-events-auto'
          : 'z-50 w-0 opacity-0 pointer-events-none lg:w-75 lg:opacity-100 lg:pointer-events-auto'}
      `}>
          {/* <div className='fixed'><DarkModeToggle /></div> */}
          <div>
          <div className='lg:flex flex-col items-center justify-center hidden pt-4'>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="w-24 h-24 m-2 rounded-full object-cover ring-1 ring-gray-400 dark:ring-[#1d2344] shadow-md"/>
            ) : (
              <FinextIcon className='w-16 h-16 m-4' />
            )}
            <p className='inter'> {t('welcome')} {username}!</p>
            <Language/>
          </div>
          {!loading && menuItems.map((item,key) => (
          <div key={key} id={`${key}`} className=" pt-14">
              <p className="text-[#00000066] dark:text-[#ffffffc5] text-base">{item.name}</p>
              <ul>
                  {item.items.map( (el,key) => {
                    if(el.id ==  'taxes' && user?.rol == "particular"){
                      return;
                    }
                    return ( 
                        <SidebarItem
                        key={key}
                        id={el.id}
                        icon={el.icon}
                        label={el.label}
                        to={el.to}
                        children={el.children}
                        openId={openId}
                        setOpenId={setOpenId}
                        onNavigate={onClose}
                    />);
                  })}
              </ul>
          </div>
          ))}
          <div className='flex flex-row justify-between items-center pt-10' >
            <button onClick={() => logoutUser()}>
              <SidebarItem
              id={'logout'}
              icon={ExitIcon }
              label={t('logout')}
              to='/'
              />
            </button>
              <div className='flex'><DarkModeToggle /></div>
          </div>
          
        </div>
      </div>
    </>
  )
}

export default DashboardSidebar
