import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { type Bill } from '../../api/BillService'
import Trending_up from '/src/assets/icons/Trending-up.svg?react'
import Trending_down from '/src/assets/icons/Trending-down.svg?react'
import TrashcanIcon from '/src/assets/icons/Trashcan.svg?react'
import TagIcon from '/src/assets/icons/Tag.svg?react'
import PencilIcon from '/src/assets/icons/Pencil.svg?react'
import CardIcon from '/src/assets/icons/Credit-card.svg?react'
import CoinIcon from '/src/assets/icons/Coin.svg?react'
import BankIcon from '/src/assets/icons/Bank.svg?react'

interface BillCardProps {
    bill: Bill
    onEdit: () => void   
    onDelete: () => void
}

function calculateAmountWithoutIVA(amount: number, ivaPercent: number) {
  return amount * (1 - ivaPercent / 100)
}

export default function BillCard({ bill, onEdit, onDelete }: BillCardProps) {
const { t } = useTranslation("bills")
const { t:ct } = useTranslation("catTrans")
return ( 
)
}