import React, { useEffect, useState } from "react";
import { Card,CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import './App.css'
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph'
import { sortData, prettyPrintStat } from './util'
import "leaflet/dist/leaflet.css";
//https://disease.sh/v3/covid-19/countries

function App() {

  const [countries,setCountries] = useState([]);  //Default value that gets initialized, in this case an empty array
  const [country, setCountry] = useState('worldwide'); //To store the default value for the country selected in the dropdown
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries,setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796}); //Passing in the starting co-ordinates for the map as an object
  //SO the map center will start out as the given value, then it will be changed to the center based on the actual country later
  const [mapZoom, setMapZoom] = useState(3); //Zooms out to the point where we can see the whole map
  const [casesType, setCasesType] = useState("cases");

  
  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data =>{
      setCountryInfo(data)
    })
  },[])  
  
  useEffect(() => {   //A useEffect runs a piece of code based on a given condition

      const getCountriesData = async () =>{
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) =>response.json()) //When it comes back with the respinse, first get the entire response, and just take the json from it
        .then((data)=>{
          const countries = data.map((country) =>(
            {                       //Map through this data, and get the values we need, countryname, no.of cases e.t.c
              name:country.country,  //Getting the country data
              value:country.countryInfo.iso2,
              active:country.active //UK, USA KE, UAE e.t.c.
            }
          ));
          //Sorted by the highest number downwards
          const sortedData = sortData(data)
          setTableData(sortedData); //Defining table data, which is what gets passed into the table component, renamed as countries
          // console.log('td',tableData)
          setMapCountries(data);
          console.log('data',data);
          setCountries(countries);
          console.log('Map countries',mapCountries)
          

        })
      }
      getCountriesData(); // Now calling the function
      //async code because we are sending a request to a server and we need to wait for it, and do something with it
    }, [countries]); //If the dependency is empty the code will run only once when the component loads
          //If we put in a variable in for example countries, then it will run oce when the page loads AND when the countries
          //variable changes

  //State is basically how to write a variable in react

  const onCountryChange =async(event)=>{
    const countryCode = event.target.value

    setCountry(countryCode) //Actually setting the country

    const url = countryCode === 'worldwide' 
    ?'https://disease.sh/v3/covid-19/countries/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}` 

    await fetch(url)
    .then(response => response.json())   //Fetching the individual country info from the url
    .then((data) =>{

      //All of the data from the country response
      setCountry(countryCode);
      setCountryInfo(data);
      if(data.countryInfo){
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      }else{
        setMapCenter(mapCenter)
      }
      // { data.countryInfo.lat, data.countryInfo.long ?  : setMapCenter([data.countryInfo.lat, data.countryInfo.long])}
      

    });
    //https://disease.sh/v3/covid-19/countries/all
    //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    console.log('Country info', countryInfo)

  };
  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
              {/* Header */}

        <h1>Covid 19 Tracker </h1>
              {/* Title + select input dropdown field */}

        <FormControl className="app__dropdown">
        <Select
        // Loop through all the countries and show a dropdown list of all the countries
        variant="outlined" 
        value={country}
        onChange={onCountryChange}//Defines what to do when a country is clicked
        >
          <MenuItem value="worldwide"> Worldwide</MenuItem>
          {countries.map((country) =>(
             <MenuItem value={country.value}>{country.name}</MenuItem> //The country.value, and country.name, were actually mapped earlier in the useEffect
            
          ))}
        </Select>
      </FormControl>

      </div>

      <div className="app__stats">
      {/* {
        countryInfo.map((info)=>{
          <InfoBox title="Rona cases" total={info.cases} cases={1234}/>

        })
      } */}

      {/* Setcases type will be used in the component to change the color and case data when clicked */}
        <InfoBox  
        isRed
        active={casesType === 'cases'} //Active evaluates to True or False, if the casesType = the case type given
        onClick={(e) => setCasesType("cases")} 
        title="Rona cases" 
        cases={prettyPrintStat(countryInfo.todayCases)}
         total={prettyPrintStat(countryInfo.cases)}/>

        <InfoBox 
        active={casesType === 'recovered'} 
        onClick={(e) => setCasesType("recovered")} 
        title="Recovered" total = {prettyPrintStat(countryInfo.recovered)} 
        cases={prettyPrintStat(countryInfo.todayRecovered)}/>

        <InfoBox  
        isRed
        title="Deaths"
        active={casesType === 'deaths'} onClick={(e) => setCasesType("deaths")} total = {prettyPrintStat(countryInfo.deaths)} cases = {prettyPrintStat(countryInfo.todayDeaths)}/> 

        {/* CoronaVirus Cases */}   {/* CoronaVirus recoveries */}  {/* Info boxes*/}

      </div>

     
      <Map
      casesType={casesType}
       center={mapCenter}
       zoom={mapZoom}
       countries={mapCountries}
       casesType={casesType}
      />
      {/* Map */}
      </div>
      

  <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData}/>
        {/* Table */}
            <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
            <LineGraph className="app__graph" casesType={casesType}/>
      {/* Graph */}
        </CardContent>

  </Card>
    </div>

    
  );
}

export default App;
