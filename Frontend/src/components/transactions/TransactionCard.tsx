import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { type Transaction } from '../../api/TransactionService'
import Trending_up from '/src/assets/icons/Trending-up.svg?react'
import Trending_down from '/src/assets/icons/Trending-down.svg?react'
import TrashcanIcon from '/src/assets/icons/Trashcan.svg?react'
import TagIcon from '/src/assets/icons/Tag.svg?react'
import PencilIcon from '/src/assets/icons/Pencil.svg?react'
import CardIcon from '/src/assets/icons/Credit-card.svg?react'
import CoinIcon from '/src/assets/icons/Coin.svg?react'
import BankIcon from '/src/assets/icons/Bank.svg?react'

interface TransactionCardProps {
    transaction: Transaction
    onEdit: () => void   
    onDelete: () => void
}

function calculateAmountWithoutIVA(amount: number, ivaPercent: number) {
  return amount * (1 - ivaPercent / 100)
}

export default function TransactionCard({ transaction, onEdit, onDelete }: TransactionCardProps) {
const { t } = useTranslation("transactions")
return (
    <div key={transaction.id} className= {`flex flex-col ${transaction.bill_id != null ? "bg-gray-100 ring-gray-200" : "bg-white ring-gray-200"} dark:bg-dark-card rounded-2xl p-4 ring-1 dark:ring-[#1d2344]
    hover:scale-102 transition-transform ease-in-out w-full h-full`}>
    <div className='flex flex-row justify-between items-center w-full pb-6'>
    <div className='flex flex-row items-center truncate gap-2'>
    <div>
        {transaction.payment_method == "card" && (<CardIcon className='text-text dark:text-dark-text'/>)}
        {transaction.payment_method == "cash" && (<CoinIcon className='text-text dark:text-dark-text'/>)}
        {transaction.payment_method =="transfer" && (<BankIcon className='text-text dark:text-dark-text'/>)}
    </div>
    <p className='mont_semibold text-xl truncate mr-2'>{transaction.name}</p>
    </div>
    <div className='flex flex-row gap-2 items-center'>
        <div className={transaction.type == 'income' ?
        'inter bg-green-200 ring-1 ring-green-500 rounded-full text-green-600 text-xs px-2' : 
        'inter bg-red-200 ring-1 ring-red-500 rounded-full text-red-600 text-xs px-2'}>
        <p className='flex justify-center items-center capitalize'>
            {transaction.type == 'income'?<Trending_up className='lg:mr-2 text-green-600 w-5'/>:
            <Trending_down className='lg:mr-2 text-red-600 w-5'/>}<span className='lg:flex hidden'>{transaction.type == 'income' ? t('income') : t('expense')}</span>
        </p>
        </div>
        {transaction.bill_id == null && (
        <div className='flex flex-row justify-center items-center gap-2'>
        <PencilIcon className='cursor-pointer text-gray-800 hover:scale-110 transition-all ease-in-out dark:text-dark-text'
        onClick={onEdit}/>
        <TrashcanIcon className='cursor-pointer text-red-600 hover:scale-104 transition-all ease-in-out hover:bg-red-200 hover:rotate-15 rounded-full'
        onClick={onDelete}/>
        </div>
        )}
    </div>
    
    </div>
    <div className={transaction.type == 'income'?'text-green-400':'text-red-400'}>
    <p className='inter text-4xl'>{transaction.type != 'income' && <span>-</span>}{transaction.total_amount}€</p>
        <div className='flex flex-row gap-2'>
        {transaction.iva_percent > 0 &&
        <p className={transaction.type == 'income'?'text-green-400':'text-red-400'}>{calculateAmountWithoutIVA(transaction.total_amount, transaction.iva_percent).toFixed(2)}€</p>
        }
        <span className='text-gray-400'>{t('IVA')} {Math.round(transaction.iva_percent)}%</span>
        </div>
    </div>
    <div className='flex flex-row justify-between items-center w-full pt-1'>
    <p className='inter text-gray-400 text-lg '>{dayjs(transaction.date).format('DD-MM-YYYY')}</p>
    {transaction.category !== null && (
    <div className={`inter capitalize rounded-full text-blue-400 text-sm py-[2px] px-3 flex flex-row items-center`}
    style={{ backgroundColor: transaction.category.color.concat(`30`), color: `${transaction.category?.color}`}}>
        <TagIcon className='w-4 mr-1 h-4'/><p>{transaction.category.name}</p>
    </div>)}
    </div>
</div>
)
}