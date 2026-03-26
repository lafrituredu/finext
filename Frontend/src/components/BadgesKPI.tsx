import UpIcon from '/src/assets/icons/kpi-stats-up.svg?react'
import DownIcon from '/src/assets/icons/kpi-stats-down.svg?react'

function BadgesKPI({ up,percentile }: { up: boolean, percentile: number }) {
  const styles = up
    ? {
        bg: 'bg-[#2bff0026]',
        text: 'text-[#126900]',
      }
    : {
        bg: 'bg-[#ff000026]',
        text: 'text-[#8b0000]',
      }

  return (
    <div className={`flex items-center gap-1 px-2 rounded-sm ${styles.bg} ${styles.text}`}>
      <span className={`font-semibold text-base`}>
        {percentile}%
      </span>
      {up ? <UpIcon className="lg:size-5 size-4" /> : <DownIcon className="lg:size-5 size-4" /> }
    </div>
  )
}

export default BadgesKPI
