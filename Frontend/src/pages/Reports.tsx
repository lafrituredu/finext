import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { jsPDF } from 'jspdf'

import InfoIcon from '/src/assets/icons/Info.svg?react'
import FileIcon from '/src/assets/icons/File.svg?react'

import { getCurrentUser, type UserProfile } from '../api/AuthServices'
import { useTransactions, type TransactionsContextType } from '../contexts/TransactionContext'
import ReportPage from './ReportPage'

type ReportType = 'both' | 'incomes' | 'outcomes'
type CategoryBreakdown = 'all' | 'none'

const periodOptions = [12, 9, 6, 3]
const fallbackColors = ['#84A2EB', '#641895', '#D440E1', '#16A34A', '#DC2626', '#F59E0B', '#0EA5E9']

const sanitizeFileNamePart = (value: string) => {
  const sanitized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  return sanitized || 'Finext'
}

const getFileDate = () => {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = today.getFullYear()

  return `${day}-${month}-${year}`
}

function Reports() {
  const { t, i18n } = useTranslation('reports')
  const { transactions } = useTransactions() as TransactionsContextType
  const [months, setMonths] = useState(12)
  const [types, setTypes] = useState<ReportType>('both')
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown>('all')
  const [generating, setGenerating] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    getCurrentUser()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
  }, [])

  const buildReportFileName = () => {
    const filePrefix = t('filePrefix')
    const fullName = currentUser?.full_name || localStorage.getItem('user') || 'Finext'
    const cleanName = sanitizeFileNamePart(fullName)
    const date = getFileDate()

    return `${filePrefix}_${cleanName}_${date}.pdf`
  }

  const downloadPDF = (pdf: jsPDF) => {
    pdf.save(buildReportFileName())
  }

  const getLocale = () => i18n.language?.startsWith('es') ? 'es-ES' : 'en-US'

  const getCurrency = () => new Intl.NumberFormat(getLocale(), {
    style: 'currency',
    currency: 'EUR'
  })

  const getPeriodData = () => {
    const today = new Date()
    const reportMonths = Array.from({ length: months }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth() - months + 1 + index, 1)
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        name: new Intl.DateTimeFormat(getLocale(), { month: 'long', year: 'numeric' }).format(date),
        incomes: 0,
        expenses: 0
      }
    })

    const monthMap = new Map(reportMonths.map((month) => [month.key, month]))
    const periodTransactions = transactions.filter((transaction) => {
      const date = new Date(transaction.date)
      return monthMap.has(`${date.getFullYear()}-${date.getMonth()}`)
    })

    periodTransactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      const month = monthMap.get(`${date.getFullYear()}-${date.getMonth()}`)
      if (!month) return

      if (transaction.type == 'income') {
        month.incomes += Number(transaction.total_amount)
      } else {
        month.expenses += Number(transaction.total_amount)
      }
    })

    const categoryMap = new Map<string, { color: string; incomes: number; expenses: number }>()

    periodTransactions.forEach((transaction) => {
      const name = transaction.category?.name ?? t('noCategory')
      const current = categoryMap.get(name) ?? {
        color: transaction.category?.color ?? fallbackColors[categoryMap.size % fallbackColors.length],
        incomes: 0,
        expenses: 0
      }

      if (transaction.type == 'income') {
        current.incomes += Number(transaction.total_amount)
      } else {
        current.expenses += Number(transaction.total_amount)
      }

      categoryMap.set(name, current)
    })

    return {
      months: reportMonths,
      categories: Array.from(categoryMap.entries()).map(([name, data]) => ({ name, ...data }))
    }
  }

  const addRows = (
    pdf: jsPDF,
    rows: string[][],
    startY: number,
    columnX: number[],
    rowHeight = 8
  ) => {
    let y = startY

    rows.forEach((row) => {
      if (y > 280) {
        pdf.addPage()
        y = 20
      }

      row.forEach((cell, index) => {
        pdf.text(cell, columnX[index], y)
      })
      y += rowHeight
    })

    return y
  }

  const generateNativePDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const currency = getCurrency()
    const reportData = getPeriodData()
    const fullName = currentUser?.full_name || localStorage.getItem('user') || 'Finext'
    const totalIncomes = reportData.months.reduce((acc, month) => acc + month.incomes, 0)
    const totalExpenses = reportData.months.reduce((acc, month) => acc + month.expenses, 0)
    const cashFlow = totalIncomes - totalExpenses

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(20)
    pdf.text(t('reportTitle'), 16, 20)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.text(fullName, 16, 29)
    pdf.text(t('generatedAt', { date: new Intl.DateTimeFormat(getLocale(), { dateStyle: 'medium' }).format(new Date()) }), 16, 35)

    pdf.setDrawColor(226, 232, 240)
    pdf.line(16, 42, 194, 42)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(13)
    pdf.text(t('sections.overall'), 16, 55)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    let y = addRows(
      pdf,
      [
        [t('summary.incomes'), currency.format(totalIncomes)],
        [t('summary.outcomes'), currency.format(totalExpenses)],
        [t('summary.cashFlow'), currency.format(cashFlow)]
      ],
      65,
      [16, 70]
    )

    y += 8
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(13)
    pdf.text(t('sections.monthly'), 16, y)
    y += 10

    pdf.setFontSize(10)
    pdf.text(t('table.month'), 16, y)
    pdf.text(t('table.incomes'), 82, y)
    pdf.text(t('table.outcomes'), 122, y)
    pdf.text(t('table.cashFlow'), 162, y)
    y += 7

    pdf.setFont('helvetica', 'normal')
    y = addRows(
      pdf,
      reportData.months.map((month) => [
        month.name,
        currency.format(month.incomes),
        currency.format(month.expenses),
        currency.format(month.incomes - month.expenses)
      ]),
      y,
      [16, 82, 122, 162],
      7
    )

    if (categoryBreakdown != 'none') {
      y += 8
      if (y > 260) {
        pdf.addPage()
        y = 20
      }

      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(13)
      pdf.text(t('sections.categories'), 16, y)
      y += 10

      pdf.setFontSize(10)
      pdf.text(t('table.category'), 16, y)
      pdf.text(t('table.incomes'), 82, y)
      pdf.text(t('table.outcomes'), 122, y)
      y += 7

      pdf.setFont('helvetica', 'normal')
      addRows(
        pdf,
        reportData.categories.map((category) => [
          category.name,
          currency.format(category.incomes),
          currency.format(category.expenses)
        ]),
        y,
        [16, 82, 122],
        7
      )
    }

    downloadPDF(pdf)
  }

  const generatePDF = async () => {
    setGenerating(true)

    try {
      generateNativePDF()
    } catch (error) {
      console.error('Error generating report PDF:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <div className='min-h-full w-full p-10 inter'>
        <div className='flex sm:flex-row flex-col justify-between sm:items-center items-start gap-6 mb-10'>
          <div>
            <p className='mont_semibold text-4xl'>{t('title')}</p>
            <p className='text-gray-500 dark:text-dark-text mt-2'>{t('subtitle')}</p>
          </div>

          <button
            onClick={generatePDF}
            disabled={generating}
            className='inter relative w-50 h-10 bg-primary text-white rounded-full overflow-hidden group cursor-pointer shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed'>
            <span className='absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full'>
              {t('downloadPdf')}
            </span>
            <span className='absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0'>
              {t('generate')}
            </span>
          </button>
        </div>

        <div className='grid xl:grid-cols-[340px_1fr] grid-cols-1 gap-6 items-start'>
          <section className='bg-[#F9F9FA] dark:bg-dark-card rounded-2xl border border-[#0000001a] dark:border-[#1d2344] p-5 flex flex-col gap-6'>
            <div className='flex gap-3 text-sm text-gray-600 dark:text-dark-text bg-[#84A2EB26] rounded-2xl p-4'>
              <InfoIcon className='size-5 min-w-5 text-primary' />
              <p>{t('helper')}</p>
            </div>

            <div className='flex flex-col gap-2'>
              <label className='montserrat text-sm text-gray-500 dark:text-dark-text'>{t('period')}</label>
              <select
                value={months}
                onChange={(e) => setMonths(Number(e.currentTarget.value))}
                className='h-11 rounded-xl border border-[#0000001a] dark:border-[#1d2344] bg-white dark:bg-[#070d22] px-3 outline-none focus:ring-2 focus:ring-primary'>
                {periodOptions.map((option) => (
                  <option key={option} value={option}>
                    {t('months', { count: option })}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex flex-col gap-2'>
              <p className='montserrat text-sm text-gray-500 dark:text-dark-text'>{t('data')}</p>
              <div className='relative bg-[#EFEFEF] dark:bg-[#070d22] w-full px-2 py-1 rounded-3xl flex items-center gap-2 border border-[#0000001a] dark:border-[#1d2344] montserrat'>
                {(['both', 'incomes', 'outcomes'] as ReportType[]).map((option) => (
                  <button
                    key={option}
                    type='button'
                    onClick={() => setTypes(option)}
                    className={`${types == option ? 'bg-white dark:bg-[#1a2957]' : ''} flex-1 px-2 py-1 rounded-2xl transition-all ease-in-out duration-200 cursor-pointer text-sm`}>
                    {t(`types.${option}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <p className='montserrat text-sm text-gray-500 dark:text-dark-text'>{t('categoryBreakdown')}</p>
              <div className='relative bg-[#EFEFEF] dark:bg-[#070d22] w-full px-2 py-1 rounded-3xl flex items-center gap-2 border border-[#0000001a] dark:border-[#1d2344] montserrat'>
                {(['all', 'none'] as CategoryBreakdown[]).map((option) => (
                  <button
                    key={option}
                    type='button'
                    onClick={() => setCategoryBreakdown(option)}
                    className={`${categoryBreakdown == option ? 'bg-white dark:bg-[#1a2957]' : ''} flex-1 px-2 py-1 rounded-2xl transition-all ease-in-out duration-200 cursor-pointer text-sm`}>
                    {t(`categoryOptions.${option}`)}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className='bg-[#F9F9FA] dark:bg-dark-card rounded-2xl border border-[#0000001a] dark:border-[#1d2344] p-4'>
            <div className='flex sm:flex-row flex-col sm:items-center justify-between gap-3 mb-4 px-1'>
              <div>
                <p className='montserrat font-semibold flex items-center gap-2'>
                  <FileIcon className='size-5 text-primary' />
                  {t('preview')}
                </p>
                <p className='text-sm text-gray-500 dark:text-dark-text'>{t('previewHint')}</p>
              </div>
              <p className='text-sm text-gray-400'>{t('periodSummary', { count: months })}</p>
            </div>

            <div className='overflow-x-auto rounded-xl bg-white dark:bg-[#070d22] ring-1 ring-[#0000001a] dark:ring-[#1d2344]'>
              <div className='min-w-[820px]'>
                <ReportPage
                  monthCounter={months}
                  types={types}
                  categories={categoryBreakdown}
                  userFullName={currentUser?.full_name}
                  locale={i18n.language}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {generating && (
        <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-md'>
          <div className='flex flex-col items-center gap-4 px-8 py-6 rounded-2xl bg-white/90 shadow-2xl border border-black/10'>
            <div className='w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin' />

            <div className='text-center'>
              <p className='text-lg font-semibold text-gray-800'>{t('generatingTitle')}</p>
              <p className='text-sm text-gray-500 mt-1'>{t('generatingText')}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Reports
