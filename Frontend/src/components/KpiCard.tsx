import BadgesKPI from './BadgesKPI'
import Bubbles from './Bubbles'

type IconType = React.FC<React.SVGProps<SVGSVGElement>>

function KpiCard({ title, icon, kpi, subtitle, percentile, up }:{ title: string, icon: IconType, kpi: string, subtitle: string, percentile: number, up: boolean}) {
  return (
    <div className='bg-[#ffffff] w-full h-fit shadow-[#dadada] shadow-2xl rounded-2xl xl:px-4 xl:py-5 px-4 py-2 font-inter grid grid-rows-1 xl:gap-4 gap-2'>
        <div className='flex justify-between'>
            <p className='text-[#666666] text-xl font-medium'>{title}</p>
            <Bubbles icon={icon} iconSize='6'/>
        </div>

        <div>
            <p className='text-4xl text-[#001022] font-semibold mb-1'>{kpi}</p>
            <div className='flex justify-between items-center'>
                <p className='text-[#999CA2] text-xl font-semibold'>{subtitle}</p>
                <BadgesKPI up={up} percentile={percentile} />
            </div>
        </div>
    </div>
  )
}

export default KpiCard
