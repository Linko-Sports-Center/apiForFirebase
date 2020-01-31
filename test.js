var request = require("request");

// jogging API url
//url = "http://ugym3dbiking.azurewebsites.net/api/SQL_JoggingTrainingResult?Code=debug123"

// biking API url
//url = "http://ugym3dbiking.azurewebsites.net/api/SQL_BikingTrainingResult?Code=debug123";

// SQL command API url 
url = "http://ugym3dbiking.azurewebsites.net/api/SQL_CmdReadCols?Code=debug123"

//var requestData = { "sqlCmd": "SELECT * FROM JoggingTrainingResult" } // all jogging data

//var requestData = {
//
//  "sqlCmd": "SELECT SUM(distance) AS A1, AVG(distance) AS A2 FROM BikingTrainingResult WHERE userId = 'U527960def4078372836e9ec7434ac7a0' AND　(trainingDate BETWEEN '2019-03-10' AND '2019-03-13') ",
//
//  "sqlCols": [
//		"A1",
//		"A2"
//	]
//}

var requestData = {

  "sqlCmd": "SELECT SUM(distance) AS A1, AVG(distance) AS A2 FROM JoggingTrainingResult WHERE userId = 'U722be0c9c9d36e011c0e556bd2047819' AND　(trainingDate BETWEEN '2020-01-28' AND '2020-01-31')",

  "sqlCols": [
		"A1",
		"A2"
	]
}

var requestData = {
  "sqlCmd": "SELECT SUM(distance) AS A1, AVG(distance) AS A2 FROM JoggingTrainingResult WHERE userId='U722be0c9c9d36e011c0e556bd2047819' AND site='LINKOU' AND　(trainingDate BETWEEN '2019-10-29' AND '2020-01-31')",

  "sqlCols": [
		"A1",
		"A2"
	]
}


// fire request
request({
  url: url,
  method: "POST",
  json: requestData
}, function (error, response, body) {
  if (!error && response.statusCode === 200) {
    console.log(body);
  } else {

    console.log("error: " + error)
    console.log("response.statusCode: " + response.statusCode)
    console.log("response.statusText: " + response.statusText)
  }
})