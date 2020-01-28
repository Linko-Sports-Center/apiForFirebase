var request = require("request");

// jogging API url
// url = "http://ugym3dbiking.azurewebsites.net/api/SQL_JoggingTrainingResult?Code=debug123"

// biking API url
//url = "http://ugym3dbiking.azurewebsites.net/api/SQL_BikingTrainingResult?Code=debug123";

// SQL command API url 
url = "http://ugym3dbiking.azurewebsites.net/api/SQL_CmdReadCols?Code=debug123"

//var requestData = { "sqlCmd": "SELECT * FROM JoggingTrainingResult" } // all jogging data

//var requestData = {
//
//  "sqlCmd": "SELECT SUM(distance) AS A1, AVG(distance) AS A2 FROM BikingTrainingResult WHERE userId = 'oxyoO1eNcR300-DRcfU4vrhyTigo' AND　(trainingDate BETWEEN '2018-02-01' AND '2018-03-02') ",
//
//  "sqlCols": [
//		"A1",
//		"A2"
//	]
//}

var requestData = {

  "sqlCmd": "SELECT SUM(distance) AS A1 FROM BikingTrainingResult WHERE userId = 'oxyoO1eNcR300-DRcfU4vrhyTigo' AND　(trainingDate BETWEEN '2018-02-01' AND '2018-03-02') ",

  "sqlCols": [
		"A1",
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