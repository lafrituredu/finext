//Import de componentes
import KpiCard from "../components/KpiCard";
import BarChart from "../components/BarChart";

//Import de iconos
import ChatIcon from '/src/assets/icons/Chat-icon.svg?react'
import Button from "../components/Button";

function DashboardHome() {
let username = "Jeremy";

const KpiItems = [
{
  title: 'Ingresos',
  icon: ChatIcon,
  kpi: '10.000€',
  subtitle: 'Ingresos',
  percentile: 8,
  up: true
},{
  title: 'Clicks',
  icon: ChatIcon,
  kpi: '25K',
  subtitle: 'Subtitle',
  percentile: 4.32,
  up: false
},{
  title: 'Retencion',
  icon: ChatIcon,
  kpi: '73.28%',
  subtitle: 'Subtitle',
  percentile: 0.18,
  up: true
},{
  title: 'Users',
  icon: ChatIcon,
  kpi: '100.000',
  subtitle: 'Subtitle',
  percentile: 18,
  up: false
}
];


  return (
    <>
      <div>
        <p className="text-3xl font-semibold">Dashboard PRO</p>
        <p className="text-2xl">Bienvenid@ {username}!</p>
      </div>

      <div className="grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 w-full justify-between mt-5 xl:gap-10 gap-5">
        {KpiItems.map( (element,key) => ( key <= 3 &&
          <KpiCard
          title={element.title}
          icon={element.icon}
          kpi={element.kpi}
          subtitle={element.subtitle}
          percentile={element.percentile}
          up={element.up} />
        ))}
      </div>
      
      <div className="flex xl:flex-row flex-col justify-between xl:gap-20 gap-10 mt-15">
        <div className="col-auto flex flex-col items-start justify-center px-8 py-5 bg-[#FFFFFF] xl:w-7/12 w-12/12 h-fit shadow-[#dadada] shadow-2xl rounded-2xl">
          <p className='text-[#666666] text-xl font-medium'>Hola</p>
          <BarChart
          width={700}
          id="chart-1"
          categories={[1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]}
          series={
            [
              { name: "Users",data: [30, 40, 45, 50, 49, 60, 70, 91] },
              { name: "Pedidos mensuales", data: [25, 38, 48, 45, 53, 59, 60, 81]}
            ]}
          />

        </div>
        <div className="col-auto flex flex-col items-start justify-center px-8 py-5 bg-[#FFFFFF] xl:w-5/12 w-12/12 h-fit shadow-[#dadada] shadow-2xl rounded-2xl">
          <p className='text-[#666666] text-xl font-medium'>Hola</p>
          <BarChart
          width={400}
          id="chart-2"
          categories={[1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]}
          series={
            [
              { name: "Users",data: [30, 40, 45, 50, 49, 60, 70, 91] },
              { name: "Pedidos mensuales", data: [25, 38, 48, 45, 53, 59, 60, 81]}
            ]}
          />
          <Button text="assa" />
        </div>
      </div>
    </>
  )
}

export default DashboardHome
