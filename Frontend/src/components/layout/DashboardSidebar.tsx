import { useState } from 'react'
import SidebarItem from './SidebarItem'

//i8n
import { useTranslation } from 'react-i18next'
import Language from '../buttons/Lang'

//ICONOS
import UsersIcon from '/src/assets/icons/Profile-icon.svg?react'
import GearIcon from '/src/assets/icons/Gear.svg?react'
import ChartPieSlice from '/src/assets/icons/ChartPieSlice.svg?react'
import ArrowsLeftRight from '/src/assets/icons/ArrowsLeftRight.svg?react'
import Goals from '/src/assets/icons/Goals.svg?react'
import Calculator from '/src/assets/icons/Calculator.svg?react'
import File from '/src/assets/icons/File.svg?react'
import FinextIcon from '/src/assets/icons/finext.svg?react'
import DarkModeToggle from '../buttons/DarkButton'
import ExitIcon from '/src/assets/icons/Exit-icon.svg?react'
import Recurrent from '/src/assets/icons/Recurrent.svg?react'
import Tag from '/src/assets/icons/Tag.svg?react'

interface DashboardSidebar {
  opened?: boolean;
}

function DashboardSidebar({opened = true}:DashboardSidebar) {
const [openId, setOpenId] = useState();
const [open,setOpen] = useState(false);
// const toggleOffCanvas = () => {
//     setOpen(!open);
// }
const { t } = useTranslation("sidebar");


const menuItems = [{
  name: t('overview'),
  items: [{
    id: 'dashboard',
    label: t('dashboard'),
    icon: ChartPieSlice,
    to: '/dashboard',
  },
  {
    id: 'transactions',
    label: t('transactions'),
    icon: ArrowsLeftRight,
    to: '/dashboard/transactions'
  },
  {
    id: 'recurrent',
    label: t('recurrent'),
    icon: Recurrent,
    to: '/dashboard/recurrent'
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
    id: 'taxes',
    label: t('taxes'),
    icon: Calculator,
    to: '/dashboard/taxes'
  },
  {
    id: 'reports',
    label: t('reports'),
    icon: File,
    to: '/dashboard/reports'
  },
  ]},
  {
    name: t('utils'),
    items: [
        {
        id: 'config',
        label: t('config'),
        icon: GearIcon,
        to: '/dashboard/comps',
        },
        {
        id: 'profile',
        label: t('profile'),
        icon: UsersIcon,
        children: [
        { label: 'List', to: '/dashboard/users' },{ label: 'Create', to: '/dashboard/users/create' }
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
        dark:bg-dark-card
        ${opened
          ? 'duration-150 z-50 sm:w-75 w-2/3 opacity-100 pointer-events-auto'
          : 'z-50 w-0 opacity-0 pointer-events-none lg:w-75 lg:opacity-100 lg:pointer-events-auto'}
      `}>
          <div className='fixed'><DarkModeToggle /></div>
          <div className='flex flex-col items-center justify-center'>
            <FinextIcon className='w-16 h-16 m-4' />
            <p className='inter'> {t('welcome')} {JSON.parse(localStorage.getItem('user')!)?.username ?? '[username]'}!</p>
          </div>
          {menuItems.map((item,key) => (
          <div key={key} id={`${key}`} className=" pt-10">
              <p className="text-[#00000066] dark:text-[#ffffffc5] text-base">{item.name}</p>
              <ul>
                  {item.items.map( (el,key)=> (
                      <SidebarItem
                      key={key}
                      id={el.id}
                      icon={el.icon}
                      label={el.label}
                      to={el.to}
                      children={el.children}
                      openId={openId}
                      setOpenId={setOpenId}
                  />))}
              </ul>
          </div>
          ))}
          <div className='flex flex-row justify-between items-center pt-10'>
            <SidebarItem
              id={'logout'}
              icon={ExitIcon }
              label={t('logout')}
              to='/'
              />
              <div className='lg:flex hidden'><DarkModeToggle /></div>
          </div>
          
      </div>
    </>
  )
}

export default DashboardSidebar