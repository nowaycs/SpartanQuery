// imports
import React from 'react';
import {useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import { mapData, filterUniqueID, sortData, filterID, arrayfilteredIDtotalVolume, calculateTimeStamp } from './reactApp.js';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';
import './styleSheet.css';


// List with ID + description (checked BSC scan and manually fetched them)
export const arrIDdesc = [ 
  {
    "ID": "0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31",
    "Descr": "metamask swap router"
  },
  {
    "ID": "0x1111111254fb6c44bac0bed2854e76f90643097d",
    "Descr": "1inch v4: Router"
  }, 
  {
    "ID": "0x1111111254eeb25477b68fb85ed929f73a960582",
    "Descr": "1 inch v5"
  }, 
  {
    "ID": "0x972C7278ECFdCF97556F9C53075576a8bC6547ab",
    "Descr": "BNB pool"
  }, 
  {
    "ID": "0xf73d255d1e2b184cdb7ee0a8a064500eb3f6b352",
    "Descr": "Router Spartan protocol v2"
  }, 
  {
    "ID": "0xc23e826ec95b2b5cdefa0b1a0d0912d34201befa",
    "Descr": "contract unknown"
  }, 
  {
    "ID": "0x617dee16b86534a5d792a4d7a62fb491b544111e",
    "Descr": "MetaAggregationRouter"
  }, 
  {
    "ID": "0x80531284f27d8b479aca8dba18fd6303b4bf1567",
    "Descr": "Spartan Protocol DAO"
  }, 
  {
    "ID": "0x8f8dd7db1bda5ed3da8c9daf3bfa471c12d58486",
    "Descr": "DODOV2Proxy02"
  }, 
  {
    "ID": "0x7d26f09d4e2d032efa0729fc31a4c2db8a2394b1",
    "Descr": "UUPSProxy"
  }, 
  {
    "ID": "0x11111112542d85b3ef69ae05771c2dccff4faa26",
    "Descr": "AggregationRouterV3"
  }, 
  {
    "ID": "0x2a7813412b8da8d18ce56fe763b9eb264d8e28a8",
    "Descr": "OptimizedTransparentUpgradeableProxy"
  }, 
  {
    "ID": "0x9f2c7e4277e7cc1e6ebb53b8ea949d0938a66730",
    "Descr": "AggregationRouterV4"
  }, 
  {
    "ID": "0x663dc15d3c1ac63ff12e45ab68fea3f0a883c251",
    "Descr": "TransparentUpgradeableProxy"
  }, 
  {
    "ID": "0x362fa9d0bca5d19f743db50738345ce2b40ec99f",
    "Descr": "LiFiDiamond"
  }, 
  {
    "ID": "0x7c5c4af1618220c090a6863175de47afb20fa9df",
    "Descr": "Gelato"
  }, 
  {
    "ID": "0x7c5c4af1618220c090a6863175de47afb20fa9df",
    "Descr": "Gelato"
  }, 
];

// start new apolloclient
const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/spartan-protocol/pool-factory',
  cache: new InMemoryCache(),
});

// function to query data
const queryMessage = gql`
  query getDataOriginDays {
    metricsOriginDays(first: 1000, orderBy: timestamp, orderDirection: desc) {
     timestamp
     origin {
       id
     }
     volSPARTA
     volTOKEN
     volUSD
     fees
     feesUSD
     fees30Day
     txCount
    }
  }
`;

//console.log(queryResponse);

// container, fetches data Parent
function DataFetchContainer(props){
 const dataResponse = useQuery(queryMessage);
 return ( // REACT FRAGMENT IS USED to return multiple elements. Fragments let you group a list of children without adding extra nodes to the DOM.
 <body className='dark-theme'>
  <React.Fragment> 
  <div className='containercolumn'>
  <div className='top'>
    <h1 id="appName">SpartanQuery</h1>
    </div>
    <div className='middle'>
 <DropdownIDs datainput={dataResponse}/>
 </div>
 <div className='bottom'>
 <PrintListVolumePerID datainput={dataResponse}/>
 </div>
 </div>
 </React.Fragment>
 </body>
 ); 
}


//Dropdown list for ID's, sorted, child of container
function DropdownIDs({datainput}){
let arrUniqueIDs = [];
let mapDataFetch = {};
let sortedIDarray = [];
let dataIDvolFound = {};
const [dataIDvolhook, setDataIDvol] = useState(0); // usestate hook to remember value after rerender
const {data, loading} = datainput;
let timespanDAT = 0;
let constructedData = {};

  if (!loading){ // check if data is loaded
  mapDataFetch = mapData(data);
  sortedIDarray = sortData(mapDataFetch.arrID);
  arrUniqueIDs = filterUniqueID(sortedIDarray);
  }
  function HandleClickEvent(e){
   dataIDvolFound = filterID(document.getElementById("dropdownIDs").value, mapDataFetch.arrID, mapDataFetch.arrvolUSD);
   dataIDvolFound.timespanDAT = calculateTimeStamp(mapDataFetch.arrTimestamp);
   console.log(dataIDvolFound);
   setDataIDvol(dataIDvolFound);
}

  return (<><p><select id="dropdownIDs" name="dropdownIDs"><option>Select ID</option>{arrUniqueIDs.map((x) => <option key={x} value={x}>{x}</option>)}</select>
  <button name="Submit" onClick={HandleClickEvent}>Get data</button></p>
  <PrintData datainput={dataIDvolhook}/></>);
}


// functional component that handel the dataprinting of the fetched data
function PrintData({datainput}){
  
  return(
    <>
    <h1 id="dropboxData">Data from dropbox ID</h1>
  <p id="datainputfield1">amount of transactions by ID = {datainput.amountFound}</p>
  <p id="datainputfield2">amount of volume by ID in USD = {datainput.totalVolume}</p>
  <p id="datainputfield2">Timespan in days = {datainput.timespanDAT}</p>
   </>
  );
}

function PrintListVolumePerID({datainput}){
  console.log("executed PrintListVolumePerID")
  let arrUniqueIDs = [];
let mapDataFetch = {};
let sortedIDarray = [];
let arrfilteredIDtotalVolumeSorted = [];
const {data, loading} = datainput;

  if (!loading){ // check if data is loaded
  mapDataFetch = mapData(data);
  sortedIDarray = sortData(mapDataFetch.arrID);
  arrUniqueIDs = filterUniqueID(sortedIDarray);
  arrfilteredIDtotalVolumeSorted = arrayfilteredIDtotalVolume(arrUniqueIDs, mapDataFetch.arrID, mapDataFetch.arrvolUSD, arrIDdesc);
  }
  return(
    <>
      <h1 id="tableTitle">List of unique ID's sorted by volume</h1>
    <table>{arrfilteredIDtotalVolumeSorted.map((x) =><tr><td>ID = {x.ID}</td> <td>Volume = {x.volume} USD</td> <td>Description = {x.descr}</td></tr>)}</table>
    </>
  );
 
}

// main render function to render the DOM
const root = ReactDOM.createRoot(document.getElementById('root')); // createRoot lets you create a root to display React components inside a browser DOM node.
root.render( // render a React element into the DOM with render
  <ApolloProvider client={client}>
<DataFetchContainer />


  </ApolloProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
