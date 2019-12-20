// GoogleScript function to paste into script editor to forward new GoogleForm submissions to OpenFn
// A function to create and send a post request to a URL
function makePost(e, url) {
  const payload = JSON.stringify(e);
  const options = {
      'method': 'post',
      "contentType" : 'application/json',
      'payload': payload
  };
  const response = UrlFetchApp.fetch(url, options);
}

// This will compile the data from the last sheet row to send to OpenFn so that new responses will be forwarded 
function sendSheetData() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = SpreadsheetApp.getActiveSheet().getDataRange().getLastRow();
  const lastCol = SpreadsheetApp.getActiveSheet().getDataRange().getLastColumn();
 
  //Takes values from only the last row in the spreadsheet so that we only forward new data (we can change this logic if desired)
  const rows = sheet.getRange(lastRow, 1, 1, lastCol).getValues();  
  
  //**** UPDATE BELOW SECTION IF YOU ADD/REMOVE/RE-ORDER QUESTIONS IN FORM ****//
  //Map data values from last row to JSON key pairs defined below & add to payload to be sent to OpenFn
  const sheetData = { 
    formId : 'SIIAccelerate2020_Malawi', 
    Timestamp : rows[0][0], //'rows[0][columnNumber]' Column A = 0, Column B = 1, Column C = 2
    OrgName : rows[0][1], // 1 = columnB
    Phone : rows[0][2], // 2 = columnC
    YearRegistered : rows[0][3], //columnD
    Email : rows[0][4], //columnE
    Address : rows[0][5], //columnF
    ProgActivities : rows[0][6], //columnG
    DemandServices : rows[0][7], //columnH
    Mission : rows[0][8], //columnI
    CoreActivities : rows[0][9], //columnJ
    ActiveProgramming : rows[0][10], //columnK
    NumberStaff : rows[0][11], //columnL
    Responsibilities : rows[0][12], //columnM
    NumberVolunteers : rows[0][13], //columnN
    Budget2018 : rows[0][14], //columnO
    Budget2019 : rows[0][15], //columnP
    Budget2020 : rows[0][16], //columnQ
    SpecialSauce : rows[0][17], //columnR
    OrgNeeds : rows[0][18], //columnS
    CapacityPriorities : rows[0][19], //columnT
    Networks : rows[0][20], //columnU
    WhyApply : rows[0][21], //columnV
    Expectations : rows[0][22], //columnW
    ContactName : rows[0][23], //columnX
    ContactEmail : rows[0][24], //columnY
    ContactPhone : rows[0][25], //columnZ
    AddressCity : rows[0][26], //columnAA
    AddressCountry : rows[0][27], //columnAB
    AddressZip : rows[0][28], //columnAC
    AddressStreet : rows[0][29], //columnAD
    Website : rows[0][30] //columnAE
    // NewColumnName : rows[0][30]  //column AF <--Format if you added another question to the end of the form
    //<GoogleColumnNameYouDefine?: rows[0][<columnNumber>]  <-- Format for adding another column
    //****************************************************************************************//
  };

  // Builds post request to send data to your OpenFn inbox. Copy the URL from your OpenFn Inbox page. Paste new Inbox URL if connecting to different OpenFn project. 
  const inboxUrl = 'https://www.openfn.org/inbox/your-unique-inbox-url'
  makePost(sheetData, inboxUrl);
}
