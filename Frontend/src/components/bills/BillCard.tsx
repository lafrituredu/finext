import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { type Bill } from '../../api/BillService'

import ReceiptIcon from '/src/assets/icons/Receipt.svg?react'
import ProfileIcon from '/src/assets/icons/Profile-icon.svg?react'
import CardIcon from '/src/assets/icons/Credit-card.svg?react'
import CoinIcon from '/src/assets/icons/Coin.svg?react'
import BankIcon from '/src/assets/icons/Bank.svg?react'
import InfoIcon from '/src/assets/icons/Info.svg?react'
import CalendarIcon from '/src/assets/icons/Calendar.svg?react'
import MoveUpIcon from '/src/assets/icons/Move-up.svg?react'
import TagIcon from '/src/assets/icons/Tag.svg?react'
import PencilIcon from '/src/assets/icons/Pencil.svg?react'
import TrashcanIcon from '/src/assets/icons/Trashcan.svg?react'
import { useState } from 'react'

interface BillCardProps {
    bill: Bill
    billPaid: number | null
    onEdit: () => void   
    onDelete: () => void
}

function calculateBaseAmount(amount: number, ivaPercent: number): number {
return amount * (1 - ivaPercent / 100)
}

export default function BillCard({ bill, billPaid, onEdit, onDelete }: BillCardProps) {
    const { t } = useTranslation("bills")
    const { t:ct } = useTranslation("catTrans")

    const isPending = billPaid !== null && billPaid < Number(bill.total_amount)
    const isHigher = billPaid !== null && billPaid > Number(bill.total_amount)

    return ( 
        <div key={bill.id}
            className="flex flex-col bg-background dark:bg-dark-card rounded-2xl ring-1 
            ring-gray-300 dark:ring-[#1d2344] p-5 gap-2 inter">
                <div className='flex flex-row w-full justify-between items-center gap-2'>
                <div className='flex gap-2 items-center'>
                    <ReceiptIcon className='text-gray-700 dark:text-dark-text'/>
                    <span className='text-gray-700 dark:text-dark-text font-semibold text-2xl'>{bill.name}</span>
                </div>
                <div className='flex flex-row gap-4 items-center'>
                    {bill.type == 'emitida' ? 
                    (<div className='bg-green-200 rounded-full px-3 py-1 text-sm text-green-700'>{t('type.emitida')}</div>):
                    (<div className='bg-red-200 rounded-full px-3 py-1 text-sm text-red-700'>{t('type.recibida')}</div>)}
                    <div className='flex flex-row items-center gap-2'>
                    <PencilIcon className='cursor-pointer text-gray-800 hover:scale-110 transition-all ease-in-out dark:text-dark-text'
                    onClick={ onEdit } />
                    <TrashcanIcon className='cursor-pointer text-red-600 hover:scale-104 transition-all ease-in-out hover:bg-red-200 hover:rotate-15 rounded-full'
                    onClick={ onDelete } />
                    </div>
                </div>
                </div>
                {bill.category !== null && (
                <div className={`inter capitalize rounded-full text-blue-400 text-sm py-[2px] px-3 flex flex-row items-center w-fit`}
                style={{ backgroundColor: bill.category.color.concat(`30`), color: `${bill.category?.color}`}}>
                <TagIcon className='w-4 mr-1 h-4'/><p>        
                    {bill.category.user_id == null
                        ? ct(`categoryNames.${bill.category.name}`, bill.category.name)
                        : bill.category.name
                    }</p>
                </div>)}
                <div className='grid grid-cols-2 gap-2 py-8'>
                <div className='flex flex-col'>
                    <div className='flex flex-row items-center gap-1'>
                    <CalendarIcon className='text-gray-500 dark:text-dark-text w-4 h-4'/>
                    <span className='text-gray-500 dark:text-dark-text text-sm'>{t('fields.date')}</span>
                    </div>
                    <span className='text-gray-800 dark:text-dark-text text-md pl-1'>{dayjs(bill.date).format('DD-MM-YYYY')}</span>
                </div>
                <div className='flex flex-col'>
                    <div className='flex flex-row items-center gap-1'>
                    <span className='text-gray-500 dark:text-dark-text text-sm'>{t('fields.iva')}</span>
                    </div>
                    <span className='text-gray-800 dark:text-dark-text text-md pl-1'>{bill.iva_percent}</span>
                </div>
                {bill.plazos != null && (
                <div className='flex flex-col'>
                    <div className='flex flex-row items-center gap-1'>
                    <MoveUpIcon className='text-gray-500 dark:text-dark-text w-4 h-4'/>
                    <span className='text-gray-500 dark:text-dark-text text-sm'>{t('fields.plazos')}</span>
                    </div>
                    <span className='text-gray-800 dark:text-dark-text text-md pl-1'>{bill.plazos} {bill.plazos > 1 ? t('fields.plazos_plural') : t('fields.plazo_singular')}</span>
                </div>
                )}
                {bill.client != null && (
                <div className='flex flex-col'>
                    <div className='flex flex-row items-center gap-1'>
                    <ProfileIcon className='text-gray-500 dark:text-dark-text w-4 h-4'/>
                    <span className='text-gray-500 dark:text-dark-text text-sm'>{t('fields.client')}</span>
                    </div>
                    <span className='text-gray-800 dark:text-dark-text text-md pl-1'>{bill.client}</span>
                </div>
                )}
                </div>
                
                <div className='flex flex-row items-center bg-gray-100 dark:bg-dark-card w-full rounded-sm py-1 px-2 gap-2 ring-1 ring-gray-200 dark:ring-gray-700'>
                <InfoIcon className='text-gray-500 dark:text-dark-text w-5 h-5 min-w-5 min-h-5'/>
                {bill.description != null ? (
                <span className='text-gray-500 dark:text-dark-text text-sm truncate'>{bill.description}</span>):(
                    <span className='text-gray-500 dark:text-dark-text text-sm truncate'>{t('no_description')}</span>)}
                </div>
                <hr className="border-t border-gray-300 my-4 dark:border-gray-700"></hr>
                <div className='flex flex-row justify-between items-end'>
                <div className='flex flex-col'>
                    <span className='text-gray-500 dark:text-dark-text text-sm'>{t('fields.base_imponible')} {bill.type == 'recibida' && '-'}{Number(calculateBaseAmount(bill.total_amount, bill.iva_percent))} €</span>
                    <span className='text-primary font-medium text-3xl'>{bill.type == 'recibida' && '-'}{bill.total_amount}€</span>
                </div>
                <div className='flex flex-col items-end'>
                    <div className='ring-1 ring-gray-300 rounded-md px-2 w-fit'>
                    {bill.payment_method == 'card' && (<div className='flex flex-row gap-2 text-gray-600 dark:text-dark-text items-center'><CardIcon className='w-5 h-5'/><span>{t('payment.card')}</span></div>)}
                    {bill.payment_method == 'cash' && (<div className='flex flex-row gap-2 text-gray-600 dark:text-dark-text items-center'><CoinIcon className='w-5 h-5'/><span>{t('payment.cash')}</span></div>)}
                    {bill.payment_method == 'transfer' && (<div className='flex flex-row gap-2 text-gray-600 dark:text-dark-text items-center'><BankIcon className='w-5 h-5'/><span>{t('payment.transfer')}</span></div>)}
                    </div>
                    <div className='flex w-full justify-start items-center text-xs select-none pt-2 gap-2'>
                    {isPending ? (
                    <div className="cursor-pointer flex flex-row items-center gap-2" onClick={ onEdit }>
                        <div className='relative w-2.5 h-2.5 bg-indigo-500 rounded-full'>
                        <div className='w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping absolute'></div>
                        </div>
                        <div className='text-indigo-300 hover:text-indigo-500 transition-colors ease-in-out duration-200'>
                        <p>{t('status.pending_plazos')}</p>
                        </div></div>
                    ) : null}
                    {isHigher ? (
                    <div className="cursor-pointer flex flex-row items-center gap-2" onClick={ onDelete }>
                        <div className='relative w-2.5 h-2.5 bg-red-500 rounded-full'>
                        <div className='w-2.5 h-2.5 bg-red-500 rounded-full animate-ping absolute'></div>
                        </div>
                        <div className='text-red-300 hover:text-red-500 transition-colors ease-in-out duration-200'>
                        <p>{t('status.overpaid')}</p>
                        </div></div>
                    ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}