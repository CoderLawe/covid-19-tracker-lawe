import React from 'react';
import numeral from "numeral"; // To format numbers in a certain way
import { Circle, Popup } from "react-leaflet";
// This is a helper function to sort the cases 


const casesTypeColors = {
    cases: {
      hex: "#CC1034",
       
      mulitiplier: 800, //Multiplier represents the size
    },
  
    recovered: {
      hex: "#7DD71D",
      
      mulitiplier: 1200,
    },
  
    deaths: {
      hex: "#C0C0C0",
      mulitiplier: 2000,
    },
  };
  
export const sortData = (data) =>{
    const sortedData = [...data];

    return sortedData.sort((a,b) => (a.cases > b.cases ? -1 : 1));
        //If a cases are greater than b cases, then return false, or true .sort os actually an in-built ES6 function
};

//This function draws circles on the map with interactive tooltips(things that pop up when you hover over)

export const prettyPrintStat = (stat) => //Takes a stat and returns a better looking string

stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, casesType='cases') =>

    data.map(country =>(
        <Circle
            center = {[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            pathOptions={{
                color: casesTypeColors[casesType].hex,
                fillColor: casesTypeColors[casesType].hex,
              }}
              //To change the color based on the type of case. The default is case, there's also recovery rates, and death rates
            radius={
                Math.sqrt(country[casesType]/10) * casesTypeColors[casesType].mulitiplier
                //Multiplies it based on the multipliers. The hgher the multiplier, the larger the circle.
            }// This is a circle. The bigger the circle the higher the number of cases
        >
            
            <Popup>
                <div className="info-container"> 
                    <div
                        className="info-flag"
                        style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                    
                    />
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
                
            </Popup>
        </Circle>
    ));
