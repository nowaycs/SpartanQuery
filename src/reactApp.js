export {mapData, sortData, filterUniqueID, filterID, arrayfilteredIDtotalVolume, calculateTimeStamp, getIDdescription};

const arrTotalVolumeFilteredbyID = 0;

// function to convert fetched data to arrays
function mapData(dataInput){ 
const arrID = dataInput.metricsOriginDays.map(x => x.origin.id); 
const arrTimestamp = dataInput.metricsOriginDays.map(x => x.timestamp); 
const arrvolSPARTA = dataInput.metricsOriginDays.map(x => x.volSPARTA); 
const arrvolTOKEN = dataInput.metricsOriginDays.map(x => x.volTOKEN); 
const arrvolUSD = dataInput.metricsOriginDays.map(x => x.volUSD); 
const arrfees = dataInput.metricsOriginDays.map(x => x.fees); 
const arrfeesUSD = dataInput.metricsOriginDays.map(x => x.feesUSD); 
const arrfees30Day = dataInput.metricsOriginDays.map(x => x.fees30Day); 
const arrtxCount = dataInput.metricsOriginDays.map(x => x.txCount); 
return ({arrID, arrTimestamp, arrvolSPARTA, arrvolTOKEN, arrvolUSD, arrfees, arrfeesUSD, arrfees30Day, arrtxCount});
}

function sortData(arrayDataInput){
// Sort array according to ID
let arrSorted = arrayDataInput.slice().sort((a, b) => { // get element and next element and sort them according to return value. function returns the original array but now sorted
  const IDa = a.toUpperCase(); //ignore upper and lowercase by putting everything into uppercase
  const IDb = b.toUpperCase();
  // compare sequence of UTF-16 code of provided strings
  if (IDa < IDb) { // sort a before b
    return -1;
  }
  if (IDa > IDb) { //sort a after b
    return 1;
  }

  // names must be equal
  return 0; //keep original order of a and b
})

return (arrSorted);
}

//Calculate timespan by getting timestamp of first array and substracting the timestam of the last array
function calculateTimeStamp(arrTimestamp){

//sort array by timestamp in ascending order
let arrSorted = arrTimestamp.slice().sort((a,b) => a.value-b.value);

const firstTimestamp = arrSorted[0];
const lastTimestamp = arrSorted[arrSorted.length-1];
let timespanDAT = 0;

let firstTimestampTAD = new Date(firstTimestamp * 1000); // convert UNIX to date
let lastTimestampTAD = new Date(lastTimestamp * 1000);  // convert UNIX to date
timespanDAT = (firstTimestampTAD-lastTimestampTAD) / (1000 * 60 * 60 * 24);  // convert ms to days

return(timespanDAT);

}



  // function to filter contracts by ID and returning amount of matches found and total of volume
function filterID(filteredContractID, arrayID, arrayVol){
   let found = 0;
  let volumeInput = 0;
  let USDinWei = 1000000000000000000; 
for (let i = 0; i < arrayID.length; i++){
if (arrayID[i] === filteredContractID ){
found++; // get amount of ID's found
volumeInput += parseFloat(arrayVol[i])/USDinWei; // get toal volume and convert to USD
}}

return ({ amountFound: found, totalVolume: volumeInput }); // return this object
};


//function filter unique id's
function filterUniqueID(arrIDsorted){
  let arrFilteredID = [];
  return (arrFilteredID = [...new Set(arrIDsorted)]);
};



// search for ID in a data array and return a description
function getIDdescription(arrayIDdesc, searchID){
  let returnedSearch = arrayIDdesc.find(element => element.ID === searchID); // Compare an ID with all elements of array that contains descriptions and return the first match

  if (typeof returnedSearch === "undefined" || returnedSearch === null) { // check if match is found, if not or undefined object then return empty array object
    console.log("returnedSearch undefined");
    returnedSearch = [ 
      {
        "ID": "",
        "Descr": ""
      },]
      return returnedSearch;
    }
    else {
      return returnedSearch;
         }
 
}

// get list of transactions per ID
function getTransactionsPerID(arraysortedbyID, findID){
  const sortedArray = arraysortedbyID.filter(x => x.origin.id === findID);
  return sortedArray;
}


// function that returns total volume per unique ID in a array sorted by volume
function arrayfilteredIDtotalVolume(arrFilteredID, arrayID, arrayVol, arrIDdesc){
  const arrfilteredIDtotalVolume = [];
for (let i=0; i < arrFilteredID.length; i++){ // do for entire length of array
  const filteredID =  filterID(arrFilteredID[i], arrayID, arrayVol); // function to filter contracts by ID and returning amount of matches found and total of volume
  const fetchedVolume = filteredID.totalVolume;
  let searchedID = getIDdescription(arrIDdesc, arrFilteredID[i]);  // search for ID in a data array and return a description
  arrfilteredIDtotalVolume.push( { // push data into an array. Array contains Total volume per unique ID
      ID: arrFilteredID[i],
    volume: fetchedVolume,
    descr: searchedID.Descr
    })
}
const arrfilteredIDtotalVolumeSorted = arrfilteredIDtotalVolume.slice().sort((a, b) => b.volume - a.volume); // sort array according to volume number in descending order
return (arrfilteredIDtotalVolumeSorted);
};


