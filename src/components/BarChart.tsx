import Chart from 'react-apexcharts'

function BarChart({width,id,categories,series}:{width:number,id:string,categories:Number[],series:any}) {
    const state2 = {
      options: {
        chart: {
          id: id,
          toolbar: {
            show:false
          }
        },
        xaxis: {
          categories: categories
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: {
                height: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
          {
            breakpoint: 480,
            options: {
              chart: {
                height: 250,
              },
              xaxis: {
                labels: {
                  rotate: -45,
                },
              },
            },
          },
        ]
      },
      series: series
    };
  return (
    <div style={{ width: "100%" }}>
        <Chart
            options={state2.options}
            series={state2.series}
            type="line"
            width="100%"
            height={400}
        />
    </div>
  )
}

export default BarChart
