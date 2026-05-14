import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'

import { useTransactions, type TransactionsContextType } from '../contexts/TransactionContext'

type ReportType = 'both' | 'incomes' | 'outcomes'
type CategoryBreakdown = 'all' | 'none'

type ReportPageProps = {
  monthCounter: number
  types: ReportType
  categories: CategoryBreakdown
  userFullName?: string
  locale?: string
}

type MonthSummary = {
  key: string
  name: string
  incomes: number
  expenses: number
}

type CategorySummary = {
  name: string
  color: string
  incomes: number
  expenses: number
}

const monthKeys = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
]

const fallbackColors = ['#84A2EB', '#641895', '#D440E1', '#16A34A', '#DC2626', '#F59E0B', '#0EA5E9']

const getMonthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`

function ReportPage({ monthCounter, types, categories: categoryBreakdown, userFullName, locale: reportLocale }: ReportPageProps) {
  const { t, i18n } = useTranslation('reports')
  const { t: tUtils } = useTranslation('utils')
  const { transactions } = useTransactions() as TransactionsContextType

  const locale = (reportLocale ?? i18n.language)?.startsWith('es') ? 'es-ES' : 'en-US'

  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }),
    [locale]
  )

  const generatedAt = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()),
    [locale]
  )

  const data = useMemo(() => {
    const today = new Date()
    const months: MonthSummary[] = Array.from({ length: monthCounter }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth() - monthCounter + 1 + index, 1)
      const name = `${tUtils(`months.${monthKeys[date.getMonth()]}`)} ${date.getFullYear()}`

      return {
        key: getMonthKey(date),
        name,
        incomes: 0,
        expenses: 0
      }
    })

    const monthsMap = new Map(months.map((month) => [month.key, month]))
    const periodTransactions = transactions.filter((transaction) =>
      monthsMap.has(getMonthKey(new Date(transaction.date)))
    )

    periodTransactions.forEach((transaction) => {
      const month = monthsMap.get(getMonthKey(new Date(transaction.date)))
      if (!month) return

      if (transaction.type == 'income') {
        month.incomes += Number(transaction.total_amount)
      } else {
        month.expenses += Number(transaction.total_amount)
      }
    })

    const categoriesMap = new Map<string, CategorySummary>()

    periodTransactions.forEach((transaction) => {
      const categoryName = transaction.category?.name ?? t('noCategory')
      const current = categoriesMap.get(categoryName) ?? {
        name: categoryName,
        color: transaction.category?.color ?? fallbackColors[categoriesMap.size % fallbackColors.length],
        incomes: 0,
        expenses: 0
      }

      if (transaction.type == 'income') {
        current.incomes += Number(transaction.total_amount)
      } else {
        current.expenses += Number(transaction.total_amount)
      }

      categoriesMap.set(categoryName, current)
    })

    return {
      months,
      categories: Array.from(categoriesMap.values())
    }
  }, [monthCounter, t, tUtils, transactions])

  const showIncomes = types == 'both' || types == 'incomes'
  const showExpenses = types == 'both' || types == 'outcomes'

  const totalIncomes = data.months.reduce((acc, month) => acc + month.incomes, 0)
  const totalExpenses = data.months.reduce((acc, month) => acc + month.expenses, 0)
  const cashflow = totalIncomes - totalExpenses

  const userName = userFullName || transactions[0]?.user?.username || localStorage.getItem('user') || 'Finext'
  const periodLabel = `${data.months[0]?.name ?? ''} - ${data.months[data.months.length - 1]?.name ?? ''}`

  const selectedSeries = [
    showIncomes
      ? {
          name: t('summary.incomes'),
          color: '#16A34A',
          data: data.months.map((month) => Number(month.incomes.toFixed(2)))
        }
      : null,
    showExpenses
      ? {
          name: t('summary.outcomes'),
          color: '#DC2626',
          data: data.months.map((month) => Number(month.expenses.toFixed(2)))
        }
      : null
  ].filter(Boolean) as Array<{ name: string; color: string; data: number[] }>

  const lineConfig: { options: ApexOptions; series: { name: string; data: number[] }[] } = {
    options: {
      chart: {
        id: 'report-line-chart',
        type: 'line',
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'Inter, sans-serif',
        foreColor: '#64748B'
      },
      colors: selectedSeries.map((serie) => serie.color),
      dataLabels: { enabled: false },
      grid: {
        borderColor: '#E2E8F0',
        strokeDashArray: 4
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      },
      markers: {
        size: 4,
        hover: { size: 6 }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (value) => currencyFormatter.format(Number(value))
        }
      },
      xaxis: {
        categories: data.months.map((month) => month.name),
        labels: {
          trim: true,
          rotate: -30
        }
      },
      yaxis: {
        labels: {
          formatter: (value) => currencyFormatter.format(Number(value))
        }
      }
    },
    series: selectedSeries.map((serie) => ({ name: serie.name, data: serie.data }))
  }

  const visibleCategories = data.categories.filter((category) => {
    const hasIncome = showIncomes && category.incomes > 0
    const hasExpense = showExpenses && category.expenses > 0
    return hasIncome || hasExpense
  })

  const buildPieConfig = (entries: CategorySummary[], field: 'incomes' | 'expenses') => ({
    options: {
      chart: {
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif',
        foreColor: '#64748B'
      },
      colors: entries.map((entry) => entry.color),
      dataLabels: { enabled: false },
      labels: entries.map((entry) => entry.name),
      legend: {
        position: 'bottom'
      },
      stroke: {
        colors: ['#FFFFFF']
      },
      tooltip: {
        y: {
          formatter: (value: number) => currencyFormatter.format(value)
        }
      }
    } as ApexOptions,
    series: entries.map((entry) => Number(entry[field].toFixed(2)))
  })

  const incomePieEntries = visibleCategories.filter((category) => category.incomes > 0)
  const expensePieEntries = visibleCategories.filter((category) => category.expenses > 0)
  const incomePieConfig = buildPieConfig(incomePieEntries, 'incomes')
  const expensePieConfig = buildPieConfig(expensePieEntries, 'expenses')

  const summaryCards = [
    showIncomes
      ? {
          label: t('summary.incomes'),
          value: totalIncomes,
          valueClass: 'text-green-600',
          bgClass: 'bg-green-50',
          caption: t('summary.incomesCaption')
        }
      : null,
    showExpenses
      ? {
          label: t('summary.outcomes'),
          value: totalExpenses,
          valueClass: 'text-red-600',
          bgClass: 'bg-red-50',
          caption: t('summary.outcomesCaption')
        }
      : null,
    types == 'both'
      ? {
          label: t('summary.cashFlow'),
          value: cashflow,
          valueClass: cashflow >= 0 ? 'text-[#84A2EB]' : 'text-red-600',
          bgClass: 'bg-[#84A2EB1F]',
          caption: t('summary.cashFlowCaption')
        }
      : null
  ].filter(Boolean) as Array<{
    label: string
    value: number
    valueClass: string
    bgClass: string
    caption: string
  }>

  return (
    <article id='report-content' className='bg-white text-[#040919] inter min-h-[1120px] p-12 flex flex-col gap-8'>
      <header className='flex justify-between items-start gap-8 border-b border-[#E2E8F0] pb-6'>
        <div>
          <p className='text-sm text-[#64748B] mb-1'>Finext</p>
          <h1 className='mont_semibold text-4xl'>{t('reportTitle')}</h1>
          <p className='text-[#64748B] mt-2'>{t('reportSubtitle')}</p>
        </div>

        <div className='text-right text-sm text-[#64748B] min-w-55'>
          <p className='montserrat text-[#040919]'>{userName}</p>
          <p>{t('generatedAt', { date: generatedAt })}</p>
          <p>{t('periodRange', { period: periodLabel })}</p>
        </div>
      </header>

      <section>
        <div className='flex items-end justify-between gap-5 mb-4'>
          <div>
            <p className='montserrat text-xl font-semibold'>{t('sections.overall')}</p>
            <p className='text-sm text-[#64748B]'>{t('sections.overallHint', { count: monthCounter })}</p>
          </div>
        </div>

        <div className={`${summaryCards.length == 1 ? 'grid-cols-1' : summaryCards.length == 2 ? 'grid-cols-2' : 'grid-cols-3'} grid gap-4`}>
          {summaryCards.map((card) => (
            <div key={card.label} className={`${card.bgClass} rounded-xl border border-[#E2E8F0] p-5`}>
              <p className='text-sm text-[#64748B]'>{card.label}</p>
              <p className={`${card.valueClass} text-3xl mt-2`}>{currencyFormatter.format(card.value)}</p>
              <p className='text-xs text-[#64748B] mt-3'>{card.caption}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='rounded-xl border border-[#E2E8F0] overflow-hidden'>
        <div className='bg-[#F8FAFC] px-5 py-4 border-b border-[#E2E8F0]'>
          <p className='montserrat font-semibold'>{t('sections.monthly')}</p>
        </div>

        <table className='w-full text-sm'>
          <thead>
            <tr className='*:text-start *:px-5 *:py-3 text-[#64748B] border-b border-[#E2E8F0]'>
              <th>{t('table.month')}</th>
              {showIncomes && <th>{t('table.incomes')}</th>}
              {showExpenses && <th>{t('table.outcomes')}</th>}
              {types == 'both' && <th>{t('table.cashFlow')}</th>}
            </tr>
          </thead>

          <tbody>
            {data.months.map((month) => (
              <tr key={month.key} className='*:px-5 *:py-3 border-b border-[#F1F5F9] last:border-0'>
                <td className='montserrat'>{month.name}</td>
                {showIncomes && <td className='text-green-600'>{currencyFormatter.format(month.incomes)}</td>}
                {showExpenses && <td className='text-red-600'>{currencyFormatter.format(month.expenses)}</td>}
                {types == 'both' && (
                  <td className={month.incomes - month.expenses >= 0 ? 'text-[#84A2EB]' : 'text-red-600'}>
                    {currencyFormatter.format(month.incomes - month.expenses)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className='rounded-xl border border-[#E2E8F0] p-5'>
        <div className='flex justify-between items-start gap-4 mb-5'>
          <div>
            <p className='montserrat font-semibold'>{t('sections.chart')}</p>
            <p className='text-sm text-[#64748B]'>{t('sections.chartHint')}</p>
          </div>
        </div>

        <Chart options={lineConfig.options} series={lineConfig.series} type='line' width='100%' height={330} />
      </section>

      {categoryBreakdown != 'none' && (
        <section className='flex flex-col gap-5'>
          <div className='rounded-xl border border-[#E2E8F0] overflow-hidden'>
            <div className='bg-[#F8FAFC] px-5 py-4 border-b border-[#E2E8F0]'>
              <p className='montserrat font-semibold'>{t('sections.categories')}</p>
              <p className='text-sm text-[#64748B]'>{t('sections.categoriesHint')}</p>
            </div>

            {visibleCategories.length > 0 ? (
              <table className='w-full text-sm'>
                <thead>
                  <tr className='*:text-start *:px-5 *:py-3 text-[#64748B] border-b border-[#E2E8F0]'>
                    <th>{t('table.category')}</th>
                    {showIncomes && <th>{t('table.incomes')}</th>}
                    {showExpenses && <th>{t('table.outcomes')}</th>}
                  </tr>
                </thead>

                <tbody>
                  {visibleCategories.map((category) => (
                    <tr key={category.name} className='*:px-5 *:py-3 border-b border-[#F1F5F9] last:border-0'>
                      <td>
                        <span className='inline-flex items-center gap-2'>
                          <span className='size-3 rounded-full' style={{ backgroundColor: category.color }} />
                          <span className='montserrat'>{category.name}</span>
                        </span>
                      </td>
                      {showIncomes && <td className='text-green-600'>{currencyFormatter.format(category.incomes)}</td>}
                      {showExpenses && <td className='text-red-600'>{currencyFormatter.format(category.expenses)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className='px-5 py-6 text-sm text-[#64748B]'>{t('emptyCategories')}</p>
            )}
          </div>

          {visibleCategories.length > 0 && (
            <div className={`${types == 'both' ? 'grid-cols-2' : 'grid-cols-1'} grid gap-5`}>
              {showIncomes && incomePieEntries.length > 0 && (
                <div className='rounded-xl border border-[#E2E8F0] p-4'>
                  <p className='montserrat font-semibold mb-3'>{t('charts.incomeCategories')}</p>
                  <Chart options={incomePieConfig.options} series={incomePieConfig.series} type='donut' width='100%' height={260} />
                </div>
              )}

              {showExpenses && expensePieEntries.length > 0 && (
                <div className='rounded-xl border border-[#E2E8F0] p-4'>
                  <p className='montserrat font-semibold mb-3'>{t('charts.outcomeCategories')}</p>
                  <Chart options={expensePieConfig.options} series={expensePieConfig.series} type='donut' width='100%' height={260} />
                </div>
              )}
            </div>
          )}
        </section>
      )}

      <footer className='mt-auto border-t border-[#E2E8F0] pt-4 text-xs text-[#64748B]'>
        <p>{t('footerLine1')}</p>
        <p>{t('footerLine2')}</p>
      </footer>
    </article>
  )
}

export default ReportPage
