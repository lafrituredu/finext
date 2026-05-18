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

  const setFill = (pdf: jsPDF, color: [number, number, number]) => {
    pdf.setFillColor(color[0], color[1], color[2])
  }

  const setDraw = (pdf: jsPDF, color: [number, number, number]) => {
    pdf.setDrawColor(color[0], color[1], color[2])
  }

  const setText = (pdf: jsPDF, color: [number, number, number]) => {
    pdf.setTextColor(color[0], color[1], color[2])
  }

  const reportColors = {
    text: [4, 9, 25] as [number, number, number],
    muted: [100, 116, 139] as [number, number, number],
    border: [226, 232, 240] as [number, number, number],
    soft: [248, 250, 252] as [number, number, number],
    primary: [132, 162, 235] as [number, number, number],
    income: [22, 163, 74] as [number, number, number],
    incomeSoft: [240, 253, 244] as [number, number, number],
    expense: [220, 38, 38] as [number, number, number],
    expenseSoft: [254, 242, 242] as [number, number, number],
    primarySoft: [238, 243, 253] as [number, number, number],
    white: [255, 255, 255] as [number, number, number]
  }

  const drawFooter = (pdf: jsPDF, page: number, total: number) => {
    setDraw(pdf, reportColors.border)
    pdf.line(14, 282, 196, 282)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7)
    setText(pdf, reportColors.muted)
    pdf.text(t('footerLine1'), 14, 288)
    pdf.text(t('footerLine2'), 14, 292)
    pdf.text(`${page} / ${total}`, 196, 290, { align: 'right' })
  }

  const drawHeader = (pdf: jsPDF, title: string, subtitle: string, userName: string, periodLabel: string) => {
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7)
    setText(pdf, reportColors.muted)
    pdf.text('FINEXT', 14, 16)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(20)
    setText(pdf, reportColors.text)
    pdf.text(title, 14, 27)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    setText(pdf, reportColors.muted)
    pdf.text(subtitle, 14, 34)

    pdf.setFontSize(8)
    pdf.text(userName, 196, 20, { align: 'right' })
    pdf.text(t('generatedAt', { date: new Intl.DateTimeFormat(getLocale(), { dateStyle: 'medium' }).format(new Date()) }), 196, 26, { align: 'right' })
    pdf.text(periodLabel, 196, 32, { align: 'right' })

    setDraw(pdf, reportColors.border)
    pdf.line(14, 42, 196, 42)
  }

  const drawCard = (
    pdf: jsPDF,
    x: number,
    y: number,
    width: number,
    label: string,
    value: string,
    caption: string,
    accent: [number, number, number],
    background: [number, number, number]
  ) => {
    setFill(pdf, background)
    setDraw(pdf, reportColors.border)
    pdf.roundedRect(x, y, width, 25, 2.5, 2.5, 'FD')

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7)
    setText(pdf, reportColors.muted)
    pdf.text(label, x + 4, y + 6)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(14)
    setText(pdf, accent)
    pdf.text(value, x + 4, y + 15)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(6.5)
    setText(pdf, reportColors.muted)
    pdf.text(caption, x + 4, y + 21, { maxWidth: width - 8 })
  }

  const drawSectionTitle = (pdf: jsPDF, title: string, subtitle: string, y: number) => {
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(11)
    setText(pdf, reportColors.text)
    pdf.text(title, 14, y)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    setText(pdf, reportColors.muted)
    pdf.text(subtitle, 14, y + 5)
  }

  const drawMonthlyTable = (
    pdf: jsPDF,
    monthsData: ReturnType<typeof getPeriodData>['months'],
    currency: Intl.NumberFormat,
    showIncomes: boolean,
    showExpenses: boolean,
    includeCashFlow: boolean,
    y: number
  ) => {
    const rowHeight = monthsData.length >= 12 ? 7.4 : 8.5
    const tableHeight = 10 + monthsData.length * rowHeight
    const columns = includeCashFlow
      ? [
          { label: t('table.month'), x: 18, align: 'left' as const },
          ...(showIncomes ? [{ label: t('table.incomes'), x: 92, align: 'right' as const }] : []),
          ...(showExpenses ? [{ label: t('table.outcomes'), x: 139, align: 'right' as const }] : []),
          { label: t('table.cashFlow'), x: 188, align: 'right' as const }
        ]
      : [
          { label: t('table.month'), x: 18, align: 'left' as const },
          ...(showIncomes ? [{ label: t('table.incomes'), x: 188, align: 'right' as const }] : []),
          ...(showExpenses ? [{ label: t('table.outcomes'), x: 188, align: 'right' as const }] : [])
        ]

    setFill(pdf, reportColors.white)
    setDraw(pdf, reportColors.border)
    pdf.roundedRect(14, y, 182, tableHeight, 2.5, 2.5, 'S')
    setFill(pdf, reportColors.soft)
    pdf.roundedRect(14, y, 182, 10, 2.5, 2.5, 'F')
    setDraw(pdf, reportColors.border)
    pdf.line(14, y + 10, 196, y + 10)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7.5)
    setText(pdf, reportColors.muted)
    columns.forEach((column) => pdf.text(column.label, column.x, y + 6.5, { align: column.align }))

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7.2)
    monthsData.forEach((month, index) => {
      const rowY = y + 10 + index * rowHeight
      if (index > 0) {
        setDraw(pdf, [241, 245, 249])
        pdf.line(14, rowY, 196, rowY)
      }

      setText(pdf, reportColors.text)
      pdf.text(month.name, 18, rowY + 5)

      if (showIncomes) {
        setText(pdf, reportColors.income)
        pdf.text(currency.format(month.incomes), includeCashFlow ? 92 : 188, rowY + 5, { align: 'right' })
      }

      if (showExpenses) {
        setText(pdf, reportColors.expense)
        pdf.text(currency.format(month.expenses), includeCashFlow ? 139 : 188, rowY + 5, { align: 'right' })
      }

      if (includeCashFlow) {
        const cashFlow = month.incomes - month.expenses
        setText(pdf, cashFlow >= 0 ? reportColors.primary : reportColors.expense)
        pdf.text(currency.format(cashFlow), 188, rowY + 5, { align: 'right' })
      }
    })

    return y + tableHeight
  }

  const drawLineChart = (
    pdf: jsPDF,
    monthsData: ReturnType<typeof getPeriodData>['months'],
    currency: Intl.NumberFormat,
    showIncomes: boolean,
    showExpenses: boolean,
    y: number
  ) => {
    const chartX = 14
    const chartY = y
    const chartWidth = 182
    const chartHeight = 52
    const plotX = chartX + 25
    const plotY = chartY + 13
    const plotWidth = chartWidth - 33
    const plotHeight = chartHeight - 27
    const values = monthsData.flatMap((month) => [
      showIncomes ? month.incomes : 0,
      showExpenses ? month.expenses : 0
    ])
    const maxValue = Math.max(1, ...values)

    setDraw(pdf, reportColors.border)
    setFill(pdf, reportColors.white)
    pdf.roundedRect(chartX, chartY, chartWidth, chartHeight, 2.5, 2.5, 'S')

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    setText(pdf, reportColors.text)
    pdf.text(t('sections.chart'), chartX + 5, chartY + 7)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(6)
    setText(pdf, reportColors.muted)

    for (let i = 0; i <= 4; i += 1) {
      const tickValue = maxValue - (maxValue / 4) * i
      const gridY = plotY + (plotHeight / 4) * i
      setDraw(pdf, [226, 232, 240])
      pdf.line(plotX, gridY, plotX + plotWidth, gridY)
      setText(pdf, reportColors.muted)
      pdf.text(currency.format(tickValue), plotX - 3, gridY + 1.5, { align: 'right' })
    }

    setDraw(pdf, reportColors.border)
    pdf.line(plotX, plotY, plotX, plotY + plotHeight)
    pdf.line(plotX, plotY + plotHeight, plotX + plotWidth, plotY + plotHeight)

    const drawSerie = (field: 'incomes' | 'expenses', color: [number, number, number]) => {
      const points = monthsData.map((month, index) => {
        const x = plotX + (monthsData.length == 1 ? plotWidth / 2 : (plotWidth / (monthsData.length - 1)) * index)
        const yPoint = plotY + plotHeight - (month[field] / maxValue) * plotHeight
        return { x, y: yPoint }
      })

      setDraw(pdf, color)
      pdf.setLineWidth(0.7)
      points.forEach((point, index) => {
        if (index > 0) {
          pdf.line(points[index - 1].x, points[index - 1].y, point.x, point.y)
        }
        setFill(pdf, color)
        pdf.circle(point.x, point.y, 0.8, 'F')
      })
      pdf.setLineWidth(0.2)
    }

    if (showIncomes) drawSerie('incomes', reportColors.income)
    if (showExpenses) drawSerie('expenses', reportColors.expense)

    pdf.setFontSize(5.8)
    setText(pdf, reportColors.muted)
    monthsData.forEach((month, index) => {
      if (monthsData.length > 9 && index % 2 != 0) return
      const x = plotX + (monthsData.length == 1 ? plotWidth / 2 : (plotWidth / (monthsData.length - 1)) * index)
      pdf.text(month.name.split(' ')[0].slice(0, 3), x, chartY + chartHeight - 5, { align: 'center' })
    })

    return chartY + chartHeight
  }

  const drawCategoriesPage = (
    pdf: jsPDF,
    rows: ReturnType<typeof getPeriodData>['categories'],
    currency: Intl.NumberFormat,
    showIncomes: boolean,
    showExpenses: boolean,
    userName: string,
    periodLabel: string,
    page: number,
    totalPages: number
  ) => {
    drawHeader(pdf, t('sections.categories'), t('sections.categoriesHint'), userName, periodLabel)

    const rowHeight = 8.2
    const tableY = 56
    const tableHeight = 10 + rows.length * rowHeight
    setDraw(pdf, reportColors.border)
    pdf.roundedRect(14, tableY, 182, Math.max(26, tableHeight), 2.5, 2.5, 'S')
    setFill(pdf, reportColors.soft)
    pdf.roundedRect(14, tableY, 182, 10, 2.5, 2.5, 'F')
    setDraw(pdf, reportColors.border)
    pdf.line(14, tableY + 10, 196, tableY + 10)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7.5)
    setText(pdf, reportColors.muted)
    pdf.text(t('table.category'), 18, tableY + 6.5)
    if (showIncomes) pdf.text(t('table.incomes'), showExpenses ? 126 : 188, tableY + 6.5, { align: 'right' })
    if (showExpenses) pdf.text(t('table.outcomes'), 188, tableY + 6.5, { align: 'right' })

    if (rows.length == 0) {
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      setText(pdf, reportColors.muted)
      pdf.text(t('emptyCategories'), 18, tableY + 21)
      drawFooter(pdf, page, totalPages)
      return
    }

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7.2)
    rows.forEach((category, index) => {
      const rowY = tableY + 10 + index * rowHeight
      if (index > 0) {
        setDraw(pdf, [241, 245, 249])
        pdf.line(14, rowY, 196, rowY)
      }

      const color = category.color || fallbackColors[index % fallbackColors.length]
      const dot = /^#[0-9A-F]{6}$/i.test(color)
        ? [
            parseInt(color.slice(1, 3), 16),
            parseInt(color.slice(3, 5), 16),
            parseInt(color.slice(5, 7), 16)
          ] as [number, number, number]
        : reportColors.primary

      setFill(pdf, dot)
      pdf.circle(18, rowY + 5, 1.2, 'F')
      setText(pdf, reportColors.text)
      pdf.text(category.name, 22, rowY + 5)
      if (showIncomes) {
        setText(pdf, reportColors.income)
        pdf.text(currency.format(category.incomes), showExpenses ? 126 : 188, rowY + 5, { align: 'right' })
      }
      if (showExpenses) {
        setText(pdf, reportColors.expense)
        pdf.text(currency.format(category.expenses), 188, rowY + 5, { align: 'right' })
      }
    })

    drawFooter(pdf, page, totalPages)
  }

  const generateNativePDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const currency = getCurrency()
    const reportData = getPeriodData()
    const fullName = currentUser?.full_name || localStorage.getItem('user') || 'Finext'
    const periodLabel = `${reportData.months[0]?.name ?? ''} - ${reportData.months[reportData.months.length - 1]?.name ?? ''}`
    const showIncomes = types == 'both' || types == 'incomes'
    const showExpenses = types == 'both' || types == 'outcomes'
    const includeCashFlow = types == 'both'
    const totalIncomes = reportData.months.reduce((acc, month) => acc + month.incomes, 0)
    const totalExpenses = reportData.months.reduce((acc, month) => acc + month.expenses, 0)
    const cashFlow = totalIncomes - totalExpenses
    const visibleCategories = reportData.categories.filter((category) => {
      const hasIncome = showIncomes && category.incomes > 0
      const hasExpense = showExpenses && category.expenses > 0
      return hasIncome || hasExpense
    })
    const categoriesPerPage = 24
    const categoryPages = categoryBreakdown == 'none'
      ? []
      : visibleCategories.length > 0
        ? Array.from({ length: Math.ceil(visibleCategories.length / categoriesPerPage) }, (_, index) =>
            visibleCategories.slice(index * categoriesPerPage, (index + 1) * categoriesPerPage)
          )
        : [[] as typeof visibleCategories]
    const totalPages = 1 + categoryPages.length

    setFill(pdf, reportColors.white)
    pdf.rect(0, 0, 210, 297, 'F')
    drawHeader(pdf, t('reportTitle'), t('reportSubtitle'), fullName, periodLabel)

    drawSectionTitle(pdf, t('sections.overall'), t('sections.overallHint', { count: months }), 55)
    const cardCount = [showIncomes, showExpenses, includeCashFlow].filter(Boolean).length
    const cardWidth = cardCount == 1 ? 182 : cardCount == 2 ? 88 : 58
    const cardGap = cardCount == 3 ? 4 : 6
    let cardX = 14

    if (showIncomes) {
      drawCard(pdf, cardX, 63, cardWidth, t('summary.incomes'), currency.format(totalIncomes), t('summary.incomesCaption'), reportColors.income, reportColors.incomeSoft)
      cardX += cardWidth + cardGap
    }
    if (showExpenses) {
      drawCard(pdf, cardX, 63, cardWidth, t('summary.outcomes'), currency.format(totalExpenses), t('summary.outcomesCaption'), reportColors.expense, reportColors.expenseSoft)
      cardX += cardWidth + cardGap
    }
    if (includeCashFlow) {
      drawCard(pdf, cardX, 63, cardWidth, t('summary.cashFlow'), currency.format(cashFlow), t('summary.cashFlowCaption'), cashFlow >= 0 ? reportColors.primary : reportColors.expense, reportColors.primarySoft)
    }

    drawSectionTitle(pdf, t('sections.monthly'), t('periodSummary', { count: months }), 103)
    const tableBottom = drawMonthlyTable(pdf, reportData.months, currency, showIncomes, showExpenses, includeCashFlow, 113)
    drawLineChart(pdf, reportData.months, currency, showIncomes, showExpenses, tableBottom + 10)
    drawFooter(pdf, 1, totalPages)

    categoryPages.forEach((categoryPage, index) => {
      pdf.addPage()
      setFill(pdf, reportColors.white)
      pdf.rect(0, 0, 210, 297, 'F')
      drawCategoriesPage(
        pdf,
        categoryPage,
        currency,
        showIncomes,
        showExpenses,
        fullName,
        periodLabel,
        index + 2,
        totalPages
      )
    })

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
