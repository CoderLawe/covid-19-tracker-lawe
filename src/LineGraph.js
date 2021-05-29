import React, { useEffect, useState } from 'react'
import { Line, Bar } from "react-chartjs-2"
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data , casesType) =>{ //If nothing is passed in, it will default to cases by default
        let chartData = [];
        let lastDataPoint;
    //COnverting the data into the type that can actually be input into chart.js
        for(let date in data.cases){ //It will loop through  and get the date. Everytime it finds a new object it will just call it date
            if(lastDataPoint){
               const newDataPoint = {
                   x:date,
                   y:data[casesType][date]-lastDataPoint , //We need to get the lastdata point, so that we can get the actual difference
                                                        //This is because the actual values, are simply the total number of cases, so we would need to 
                                                        //Subtract 2 days to find the actual rise in cases
               } ;
               chartData.push(newDataPoint);
            }
            lastDataPoint = data['cases'][date];
            
        }
        console.log('DATAAAH',data)
        console.log('casestypeeeee',casesType)
         console.log('cHARTY', chartData)
        return chartData;
    };

function LineGraph({ casesType , ...props}) {
    const [data, setData] = useState({})

   // https://disease.sh/v3/covid-19/historical?lastdays=120  
    //Getting data from the past 120 days
    
    

    useEffect(() => {
        const fetchData = async() =>{
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then((response) =>{
              return response.json();
            })
            .then((data) =>{
                //"Clever stuff here..."
                let chartData = buildChartData(data, casesType);
              setData(chartData)
             console.log('chart dattaaaaahhhhh!!!!!',chartData)
             console.log('dataaaaa!',data)
            //  const chartData = buildChartData(data);
            });
        };
       fetchData();
    }, [casesType]);
    

    return (
      <div className={props.className}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
    )
}

export default LineGraph
