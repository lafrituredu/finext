import Chart from 'react-apexcharts'

function LineChart() {
  const state = {
      options: {},
      series: [44, 55, 41, 17, 15],
      labels: ['A', 'B', 'C', 'D', 'E']
    }

  const state2 = {
      options: {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        }
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ]
    };
  return (
    <>
    <div className='bg-[#ffffff] h-fit shadow-[#dadada] shadow-2xl rounded-2xl px-8 py-5 font-inter grid grid-rows-1 gap-4'>
      <Chart options={state.options} series={state.series} type="donut" width="380" />
      <Chart
        options={state2.options}
        series={state2.series}
        type="bar"
        width="500"
      />

      <Chart
        options={state2.options}
        series={state2.series}
        type="line"
        width="500"
      />
    </div>
    </>
  )
}

export default LineChart