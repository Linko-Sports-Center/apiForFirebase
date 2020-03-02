var version ="V1.1";

var express = require('express');
var request = require("request");
var app = express();
var port = process.env.PORT || 5000

var response;
var inputParam;
var memberData = [];
var courseMember = [];
var memberAlreadyExist = false;


console.log("Version:", version);

// express 設定
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
});

// 處理 API
//   API:00 ?API=00&UserId=Uxxx..xxx 
//          檢查會員 成功回應 "API:00 會員已存在" 或 "API:00 會員不存在"
//   API:01 ?API=01&UserId=12345&Name=小王&Gender=男&Birth=2019-01-01&Phone=095555555&ID=A120000000&Address=新竹市 東區 中央路
//          加入會員 成功回應 "API:01 會員已存在" 或 "API:01 會員寫入成功"
//
//   API:02 ?API=02&UserId=12345&Name=小王&Gender=男&Birth=2019-01-01&Phone=095555555&ID=A120000000&Address=新竹市 東區 中央路
//          更新資料 成功回應 "API:02 更新資料成功" 或 "API:02 更新資料失敗"
//
//   API:10 ?API=10
//          讀取 courseData, 成功回應 JSON.stringify(courseData), 失敗回應 "API:10 courseData 讀取失敗"
//   API:11 ?API=11
//          讀取 courseHistory, 成功回應 JSON.stringify(courseHistory), 失敗回應 "API:11 courseHistory 讀取失敗"
//   API:12 ?API=12
//          讀取 courseMember, JSON.stringify(courseMember), 失敗回應 "API:12 courseHistory 讀取失敗"
//
//   API:13 ?API=13&UserId=U10...CDEF
//          從 UserId 查得 PhoneNumber JSON.stringify(phoneNumber), 失敗 API:13 找不到 inputParam.UserId
//
//   API:14 ?API=14&UserId=U10...CDEF
//          讀取 user profile JSON.stringify(memberData[userId]), 失敗回應 "API:14 單一客戶資料讀取失敗"
//
//   API:20 ?API=20&UserName&CourseId&UserId&PhoneNumber
//          報名寫入 courseMember with  ["courseID", ["userName", "未繳費", "未簽到", UserId, PhoneNumber]], 成功回應 "API:20 會員報名成功" 或 "API:20 會員報名失敗"
//
//   API:21 ?API=21&UserName&CourseId&UserId&PhoneNumber
//          更新簽到欄 courseMember with  ["courseID", ["userName", "未繳費", "已簽到", UserId, PhoneNumber]], 成功回應 "API:21 會員簽到成功" 或 "API:21 會員簽到失敗"
//
//   API:30 ?API=30
//          讀取 couponData, 成功回應 JSON.stringify(couponData), 失敗回應 "API:30 couponData 讀取失敗"
//   API:31 ?API=31
//          讀取 couponHistory, 成功回應 JSON.stringify(couponHistory), 失敗回應 "API:31 couponHistory 讀取失敗"
//   API:32 ?API=32
//          讀取 couponMember, JSON.stringify(couponMember), 失敗回應 "API:32 couponHistory 讀取失敗"
//
//   API:40 ?API=40&UserName&CouponId&UserId&PhoneNumber
//          報名寫入 couponMember with  ["couponID", ["userName", "已使用", "未確認", UserId, PhoneNumber]], 成功回應 "API:40 優惠券使用成功" 或 "API:40 優惠券使用失敗"
//
//   API:50 ?API=50&UserId&ExerciseId&DataType&DateStart&DateEnd
//          取得 UserId 在 DateStart 到 DateEnd 其間 ExerciseId 的 DataType 總運動量
//          ExerciseId: 00:jogging, 01:biking, 02:Rowing, 03:Weights          
//   API:60 ?API=60&UserName&ChallengeId&UserId&PhoneNumber&Fee
//          報名寫入 challengeMember with  ["challengeId", ["userName", "日期 已參加", "未繳費"/或"免費"]], 成功回應 "API:60 挑戰賽參加成功" 或 "API:60 挑戰賽參加失敗"


app.get('/', function (req, res) {
  //console.log(req.query);
  inputParam = req.query;
  response = res;

  // 若無 API 參數，無效退出
  if (typeof inputParam.API == "undefined") {
    console.log("Error: No API");
    response.send("Error: No API");
    return 0;
  }    
  
  //console.log("API is ", inputParam.API);
  
  switch(inputParam.API) {
    case "00":
      console.log("呼叫 API:00 檢查會員");
      checkMember();
      break;
    case "01":
      console.log("呼叫 API:01 加入會員");
      addMember();  
      break; 
    case "02":
      console.log("呼叫 API:02 更新資料");
      updateMember();  
      break;       
    case "10":
      console.log("呼叫 API:10 讀取 courseData");
      readCourseData();  
      break; 
    case "11":
      console.log("呼叫 API:11 讀取 courseHistory");
      readCourseHistory();  
      break;  
    case "12":
      console.log("呼叫 API:12 讀取 courseMember");
      readCourseMember();  
      break;
    case "13":
      console.log("呼叫 API:13 讀取 courseMember");
      getUserPhoneNUmber();  
      break;
    case "14":
      console.log("呼叫 API:14 讀取 user profile");
      getUserProfile();  
      break;      
    case "20":
      console.log("呼叫 API:20 報名寫入 courseMember");
      writeCourseMember();  
      break; 
    case "21":
      console.log("呼叫 API:21 簽到寫入 courseMember");
      signinCourseMember();  
      break;       
    case "30":
      console.log("呼叫 API:30 讀取 couponData");
      readCouponData();  
      break; 
    case "31":
      console.log("呼叫 API:31 讀取 couponHistory");
      readCouponHistory();  
      break;  
    case "32":
      console.log("呼叫 API:32 讀取 couponMember");
      readCouponMember();  
      break; 
    case "40":
      console.log("呼叫 API:40 使用寫入 couponMember");
      writeCouponMember();  
      break;  
    case "50":
      console.log("呼叫 API:50 取得 UserId 運動資料");
      getExerciseData();  
      break;  
    case "51":
      console.log("呼叫 API:51 讀取 挑戰賽/現在挑戰賽 --> challengeData");
      readChallengeData();  
      break; 
    case "52":
      console.log("呼叫 API:52 讀取 挑戰賽/過去挑戰賽 --> challengeHistory");
      readChallengeHistory();  
      break;  
    case "53":
      console.log("呼叫 API:53 讀取 挑戰賽管理/挑戰賽會員 --> challengeMember");
      readChallengeMember();  
      break;  
    case "60":
      console.log("呼叫 API:60 報名寫入 challengeMember");
      writeChallengeMember報名();  
      break;  
    case "61":
      console.log("呼叫 API:61 兌換寫入 challengeMember");
      writeChallengeMember兌換();  
      break;      
    default:
      console.log("呼叫 未知API:"+inputParam.API);
      response.send("呼叫 未知API:"+inputParam.API);
  }

});



app.listen(port, function () {
  console.log('App listening on port: ', port);
});
// express 設定結束

// Firebase 設定
var admin = require("firebase-admin");

var serviceAccount = require("./webchallenge-c16eb-firebase-adminsdk-brsl0-6086bf706f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://webchallenge-c16eb.firebaseio.com"
});


var database = admin.database(); // 初始資料庫
// Firebase 設定結束

// 檢查會員是否已存在
function checkMember(){
  memberAlreadyExist = false;
  // 讀取目前會員資料
  database.ref("users/林口運動中心/客戶管理").once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    console.log("資料庫會員資料讀取完成");
    var result = snapshot.val();
    
    try {
      memberData = JSON.parse(result.會員資料);
      //console.log(memberData);
    } catch (e) {
      console.log("API:00 讀取資料庫失敗");
      response.send("API:00 讀取資料庫失敗");      
      return 0;
    }
    
    memberData.forEach(function(member, index, array){
     if (member[6] == inputParam.UserId) {
       memberAlreadyExist = true;
     }
    });
    
    if (memberAlreadyExist) {
      response.send("API:00 會員已存在");
    } else {
      response.send("API:00 會員不存在");      
    }
  });
}

// 增加新會員到資料庫
function addMember() {
  // 讀取目前會員資料
  database.ref("users/林口運動中心/客戶管理").once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    console.log("資料庫會員資料讀取完成");
    var result = snapshot.val();
    
    try {
      memberData = JSON.parse(result.會員資料);
      //console.log(memberData);
    } catch (e) {
      console.log("API:01 讀取資料庫失敗");
      response.send("API:01 讀取資料庫失敗");      
      return 0;
    }
    
    // 檢查是否有相同的名字及 LineId
    memberAlreadyExist = false;
    memberData.forEach(function(member, index, array){
     if (member[6] == inputParam.UserId) {
       memberAlreadyExist = true;
     }
    });   
    
    if (memberAlreadyExist) {
      response.send("API:01 會員已存在");
    } else {
      // 呼叫寫入資料庫涵式
      console.log("API:01 會員不存在，寫入新會員");
      
      // addAndWriteToFirebase(成功訊息，失敗訊息)
      addAndWriteToFirebase("API:01 會員寫入成功", "API:01 會員寫入失敗");     
    }    
  });
}

// 更新會員資料到資料庫
function updateMember() {
  // 讀取目前會員資料
  database.ref("users/林口運動中心/客戶管理").once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    console.log("資料庫會員資料讀取完成");
    var result = snapshot.val();
    
    try {
      memberData = JSON.parse(result.會員資料);
      //console.log(memberData);
    } catch (e) {
      console.log("API:02 讀取資料庫失敗");
      response.send("API:02 讀取資料庫失敗");      
      return 0;
    }
    
    // 檢查是否有相同的名字及 LineId
    var memberIdex=-1;
    memberAlreadyExist = false;
    memberData.forEach(function(member, index, array){
     if (member[6] == inputParam.UserId) {
       memberAlreadyExist = true;
       memberIdex = index;
     }
    });   
    
    if (memberAlreadyExist) {
      console.log("API:02 會員存在，更新資料");
      // 刪除 舊會員
      console.log(memberIdex);
      memberData.splice(memberIdex,1);
      console.log(memberData);
      // 新增 新會員
      addAndWriteToFirebase("API:02 資料更新成功", "API:02 資料更新失敗");
    } else {
      response.send("API:02 會員不存在");
    }    
  });
}

//?API=01&Name&Gender&Birth&Phone&ID&Address&UserId&PicURL&Height&Weight&EmergencyContact&EmergencyPhone
//會員資料格式
//[
//  '盧小宏',
//  '男',
//  '1966-03-03',
//  '09XXXXXXXX',
//  'A1XXXXXXXX',
//  '新竹市',
//  'Tony',// LineId
//  'www.xxx.com', // Line URL
//  '175' cm
//  '70' kg
//  '緊急連絡人'
//  '緊急連絡電話'
//]
function addAndWriteToFirebase(成功訊息, 失敗訊息) {
  var dataToAdd =[];
  dataToAdd = [
    inputParam.Name,
    inputParam.Gender,
    inputParam.Birth,
    inputParam.Phone,
    inputParam.ID,
    inputParam.Address,
    inputParam.UserId,    
    inputParam.PicURL, 
    inputParam.Height,
    inputParam.Weight,
    inputParam.EmergencyContact,
    inputParam.EmergencyPhone,     
  ];

  memberData.push(dataToAdd);

  console.log(memberData);
    
  database.ref('users/林口運動中心/客戶管理').set({
    會員資料: JSON.stringify(memberData),
  }, function (error) {
    if (error) {
      console.log(失敗訊息);
      response.send(失敗訊息);      
    } else {
      console.log(成功訊息);
      response.send(成功訊息);
    }

  });
}

// 課程管理 APIs ====================================================================
function readCourseData(){
  // 讀取目前 courseData
  database.ref("users/林口運動中心/團課課程").once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    console.log("資料庫團課課程讀取完成");
    var result = snapshot.val();
    //console.log(result);
    try {
      //var courseData = JSON.parse(result.現在課程);
      //console.log(courseData);
      response.send(result.現在課程);     
    } catch (e) {
      console.log("API:10 courseData 讀取失敗");
      response.send("API:10 courseData 讀取失敗");      
      return 0;
    }
    console.log("API:10 courseData 讀取成功");   
  });  
}

function readCourseHistory(){
  // 讀取目前 courseData
  database.ref("users/林口運動中心/團課課程").once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    console.log("資料庫團課課程讀取完成");
    var result = snapshot.val();
    //console.log(result);
    try {
      response.send(result.過去課程);     
    } catch (e) {
      console.log("API:11 courseHistory 讀取失敗");
      response.send("API:11 courseHistory 讀取失敗");      
      return 0;
    }
    console.log("API:11 courseHistory 讀取成功");   
  });  
}

function readCourseMember(){
  // 讀取目前 courseMember
  database.ref("users/林口運動中心/課程管理").once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    //console.log("資料庫課程管理讀取完成");
    var result = snapshot.val();
    //console.log(result);
    try {      
      response.send(result.課程會員);
    } catch (e) {
      console.log("API:12 courseMember 讀取失敗");
      response.send("API:12 courseMember 讀取失敗");      
      return 0;
    }
    console.log("API:12 courseMember 讀取成功");
       
  });  
}


function getUserPhoneNUmber() {
  // 讀取目前會員資料
  database.ref("users/林口運動中心/客戶管理").once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    console.log("資料庫會員資料讀取完成");
    var result = snapshot.val();
    
    try {
      memberData = JSON.parse(result.會員資料);
      //console.log(memberData);
    } catch (e) {
      console.log("API:13 讀取資料庫失敗");
      response.send("API:13 讀取資料庫失敗");      
      return 0;
    }
    
    var userFound=false;
    memberData.forEach(function(member, index, array){
     if (member[6] == inputParam.UserId) {
       response.send(member[3]);
       userFound = true;
       return 0;
     }
    });
    
    if (!userFound) response.send("API:13 找不到 "+inputParam.UserId); 
    
  });  
}

function getUserProfile(){
  // 讀取目前會員資料
  database.ref("users/林口運動中心/客戶管理").once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    console.log("資料庫會員資料讀取完成");
    var result = snapshot.val();
    
    try {
      memberData = JSON.parse(result.會員資料);
      //console.log(memberData);
    } catch (e) {
      console.log("API:14 讀取資料庫失敗");
      response.send("API:14 讀取資料庫失敗");      
      return 0;
    }
    
    var userFound=false;
    memberData.forEach(function(member, index, array){
     if (member[6] == inputParam.UserId) {
       response.send(member);
       userFound = true;
       return 0;
     }
    });
    
    if (!userFound) response.send("API:14 找不到 "+inputParam.UserId); 
    
  });  
}

//?API=20&UserName=小林&CourseId=U0002&UserId=U12345678901234567890123456789012&PhoneNumber=0932000000
function writeCourseMember() {
  
  // 檢查 UserName, CourseId, UserId, PhoneNumber
  var errMsg = "";
  if ( inputParam.UserName == undefined ||
       inputParam.CourseId == undefined ||
       inputParam.UserId == undefined   ||
       inputParam.PhoneNumber == undefined )
  {
    console.log("API:20 參數錯誤"); 
    response.send("API:20 參數錯誤");
    return 1;
  }  

  更新課程及報名人數();
}

//?API=21&UserName=小白&CourseId=U0001&UserId=U001&PhoneNumber=09XXXXX222
function signinCourseMember() {
  
  // 檢查 UserName, CourseId, UserId, PhoneNumber
  var errMsg = "";
  if ( inputParam.UserName == undefined ||
       inputParam.CourseId == undefined ||
       inputParam.UserId == undefined   ||
       inputParam.PhoneNumber == undefined )
  {
    console.log("API:21 參數錯誤"); 
    response.send("API:21 參數錯誤");
    return 1;
  }  

  更新課程會員報名狀態();
}

async function 更新課程及報名人數(){
  var databaseRef = database.ref("users/林口運動中心/課程管理");
  try {
    const snapshot = await databaseRef.once('value');
    const result = snapshot.val();
    courseMember = JSON.parse(result.課程會員);   
  } catch (e) {
    console.log("API:20 courseMember 讀取失敗");
    response.send("API:20 courseMember 讀取失敗"); 
    return 1;
  }  
  
  // 檢查是否已報名
  var courseIndex=-1;
  var userInCourse = false;
  courseMember.forEach(function(course, index, array){
    if (course[0]==inputParam.CourseId ){
      //console.log("Course matched:", course[0]);
      courseIndex = index;
      if (course.length>1) {
        for (var i=1; i< course.length; i++) {
          //console.log(i, course[i]);
          if (course[i][4]== inputParam.PhoneNumber){
            //console.log(inputParam.UserName, "已經報名過 ", inputParam.CourseId);
            //response.send("API:20 "+inputParam.UserName+" 已經報名過 "+inputParam.CourseId);   
            userInCourse = true;
            break;
          }
        }
      }
    }
  });
  // 結束: 檢查是否已報名  
   
  // 已經報名過
  if (userInCourse) {
    console.log(inputParam.UserName, "已經報名過 ", inputParam.CourseId);
    response.send("API:20 "+inputParam.UserName+" 已經報名過 "+inputParam.CourseId); 
    return 1;
  };
  
  // CourseId 還沒被 UserPhoneNumber 報名過
  // push to courseMember    
  courseMember[courseIndex].push([inputParam.UserName, "未繳費", "未簽到", inputParam.UserId, inputParam.PhoneNumber]);  
  
  databaseRef = database.ref("users/林口運動中心/課程管理");
  try {
    const snapshot = await databaseRef.set({
      課程會員: JSON.stringify(courseMember),
    }); 
  } catch (e) {
    console.log("API:20 courseMember 寫入失敗");
    response.send("API:20 courseMember 寫入失敗"); 
    return 1;
  }
  
  // 讀取 課程資料，
  databaseRef = database.ref("users/林口運動中心/團課課程");
  try {
    const snapshot = await databaseRef.once('value');
    const result = snapshot.val();
    var courseData = JSON.parse(result.現在課程);
    var courseHistory = JSON.parse(result.過去課程);     
  }  catch (e) {
    console.log("API:20 courseData 讀取失敗");
    response.send("API:20 courseData 讀取失敗"); 
    return 1;
  }
  
  // 課程報名人數 加 1
  courseData.forEach(function(course, index, array){
    if (course[0]==inputParam.CourseId) {
      course[7]= String(parseInt(course[7])+1);
    }
  });
  //console.log(courseData);  
  
  // 將 課程資料 寫回資料庫
  try {
    const snapshot = await databaseRef.set({
      現在課程: JSON.stringify(courseData),
      過去課程: JSON.stringify(courseHistory),
    }); 
  } catch (e) {
    console.log("API:20 courseData 寫入失敗");
    response.send("API:20 courseData 寫入失敗"); 
    return 1;
  }  
   
  response.send("API:20 會員報名成功");
}

async function 更新課程會員報名狀態(){
  var databaseRef = database.ref("users/林口運動中心/課程管理");
  try {
    const snapshot = await databaseRef.once('value');
    const result = snapshot.val();
    courseMember = JSON.parse(result.課程會員);   
  } catch (e) {
    console.log("API:20 courseMember 讀取失敗");
    response.send("API:20 courseMember 讀取失敗"); 
    return 1;
  }  
  
  // 檢查 user 是否已簽到
  var courseIndex=-1;
  var memberIndex=-1;
  var userInCourse = false;
  var userSigned = false;
  courseMember.forEach(function(course, index, array){
    if (course[0]==inputParam.CourseId ){
      //console.log("Course matched:", course[0]);
      courseIndex = index;
      if (course.length>1) {
        for (var i=1; i< course.length; i++) {
          //console.log(i, course[i][2]);
          if (course[i][4]== inputParam.PhoneNumber){  
            userInCourse = true;
            memberIndex  = i;
          }
          if (course[i][2]== "已簽到"){ 
            userSigned = true;
          }
          
          if (userInCourse == true) break;
        }
      }
    }
  });
  // 結束: 檢查是否已報名  
   
  // 已經簽名過
  if (userInCourse && userSigned) {
    console.log(inputParam.UserName, "已經簽到過 ", inputParam.CourseId);
    response.send("API:21 "+inputParam.UserName+" 已經簽到過 "+inputParam.CourseId); 
    return 1;
  };
  
  // CourseId 還沒被 UserPhoneNumber 簽名過
  courseMember[courseIndex][memberIndex][2]= "已簽到";
  console.log(courseMember[courseIndex][memberIndex]);
  

  //測試時，先不要寫入資料庫
  databaseRef = database.ref("users/林口運動中心/課程管理");
  try {
    const snapshot = await databaseRef.set({
      課程會員: JSON.stringify(courseMember),
    }); 
  } catch (e) {
    console.log("API:20 courseMember 寫入失敗");
    response.send("API:20 courseMember 寫入失敗"); 
    return 1;
  }
     
  response.send("API:21 會員簽名成功");
}

// 課程管理 APIs END=================================================================

// 優惠券管理 APIs ====================================================================
function readCouponData(){
  // 讀取目前 coupoData
  database.ref("users/林口運動中心/優惠券").once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    console.log("資料庫優惠券讀取完成");
    var result = snapshot.val();
    //console.log(result);
    try {
      response.send(result.現在優惠券);     
    } catch (e) {
      console.log("API:30 couponData 讀取失敗");
      response.send("API:30 coupoData 讀取失敗");      
      return 0;
    }
    console.log("API:30 coupoData 讀取成功");   
  });  
}

function readCouponHistory(){
  // 讀取目前 coupoData
  database.ref("users/林口運動中心/優惠券").once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    console.log("資料庫優惠券讀取完成");
    var result = snapshot.val();
    //console.log(result);
    try {
      response.send(result.過去優惠券);     
    } catch (e) {
      console.log("API:31 coupoHistory 讀取失敗");
      response.send("API:31 coupoHistory 讀取失敗");      
      return 0;
    }
    console.log("API:31 coupoHistory 讀取成功");   
  });  
}

function readCouponMember(){
  // 讀取目前 couponMember
  database.ref("users/林口運動中心/優惠券管理").once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    console.log("資料庫優惠券管理讀取完成");
    var result = snapshot.val();
    //console.log(result);
    try {      
      response.send(result.優惠券會員);
    } catch (e) {
      console.log("API:32 couponMember 讀取失敗");
      response.send("API:32 couponMember 讀取失敗");      
      return 0;
    }
    console.log("API:32 couponMember 讀取成功");
       
  });  
}

function writeCouponMember() {
  
  // 檢查 UserName, CouponId, UserId, PhoneNumber
  var errMsg = "";
  if ( inputParam.UserName == undefined ||
       inputParam.CouponId == undefined ||
       inputParam.UserId == undefined   ||
       inputParam.PhoneNumber == undefined )
  {
    console.log("API:40 參數錯誤"); 
    response.send("API:40 參數錯誤");
    return 1;
  }   
  // ====================================================================================
  
  // 讀取目前 couponMember
  database.ref("users/林口運動中心/優惠券管理").once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    //console.log("資料庫優惠券管理讀取完成");
    console.log("API:40 couponMember 讀取成功");
    var result = snapshot.val();
    //console.log(result);
    try {      
      couponMember=[];
      couponMember = JSON.parse(result.優惠券會員);
      //console.log(couponMember);   
    } catch (e) {
      console.log("API:40 couponMember 讀取失敗");
      response.send("API:40 couponMember 讀取失敗");      
      return 0;
    }
    
    var couponIndex=-1;
    var userInCoupon = false;
    couponMember.forEach(function(coupon, index, array){
      if (coupon[0]==inputParam.CouponId){
        //console.log("coupon matched:", coupon[0]);
        couponIndex = index;
        if (coupon.length>1) {
          for (var i=1; i< coupon.length; i++) {
            //console.log(i, coupon[i]);
            if (coupon[i][4]== inputParam.PhoneNumber){
              //console.log(inputParam.UserName, "已經報名過 ", inputParam.CouponId);
              //response.send("API:40 "+inputParam.UserName+" 已經報名過 "+inputParam.CouponId);   
              userInCoupon = true;
              break;
            }
          }
        }
      }
    });

    if (userInCoupon) {
      console.log("API:40", inputParam.UserName, "已使用過 ", inputParam.CouponId);
      response.send("API:40 "+inputParam.UserName+" 已使用過 "+inputParam.CouponId); 
      return 0;
    };
    
    console.log(couponIndex);
    // CouponId 還沒被 UserName 使用過
    // push to courseMember    
    // 加上使用日期
    var useDate = new Date()
    var useDateLocal = useDate.toLocaleDateString();
    couponMember[couponIndex].push([inputParam.UserName, useDateLocal+" 已使用", "未確認", inputParam.UserId, inputParam.PhoneNumber]);
    //console.log(couponMember);

    // Write to Database
    database.ref('users/林口運動中心/優惠券管理').set({
      優惠券會員: JSON.stringify(couponMember),
    }, function (error) {
      if (error) {
        console.log("API:40 會員使用優惠券失敗");
        response.send("API:40 會員使用優惠券失敗");      
      } else {
        console.log("API:20 會員使用優惠券成功");
        response.send("API:40 會員使用優惠券成功");
      }

    });
    
    
    
  });    
}
// 優惠券管理 APIs END=================================================================

// 挑戰賽管理 APIs ====================================================================
//   API:50 ?API=50&UserId&SiteId&ExerciseId&DataType&DateStart&DateEnd
//          取得 UserId 於 SiteId 在 DateStart 到 DateEnd 其間 ExerciseId 的 DataType 總運動量
//          ExerciseId: 00:jogging, 01:biking, 02:Rowing, 03:Weights 

// ?API=50&UserId=U722be0c9c9d36e011c0e556bd2047819&SiteId=LINKOU&ExerciseId=00&DataType=distance&DateStart=2019-10-01&DateEnd=2020-01-31 

function getExerciseData() {
  // 檢查 UserId, ExerciseId, DataType, DateStart, DateEnd
  //console.log(inputParam);
  
  var errMsg = "";
  if ( 
       inputParam.UserId == undefined     ||
       inputParam.SiteId == undefined     ||  
       inputParam.ExerciseId == undefined ||
       inputParam.DataType == undefined   ||  
       inputParam.DateStart == undefined  ||
       inputParam.DateEnd == undefined 
    )
  {
    console.log("API:50 參數錯誤"); 
    response.send("API:50 參數錯誤");
    return 1;
  }  
  
  var exerciseId;
  switch (inputParam.ExerciseId) {
    case "00": 
      exerciseId = "JoggingTrainingResult";
      break;
    case "01":
      exerciseId = "BikingTrainingResult";
      break
    default:
      console.log("ExerciseId is unkonown");
      
  }

//  inputParam.UserId =     "U722be0c9c9d36e011c0e556bd2047819";
//  inputParam.SiteId =     "LINKOU";
//  inputParam.ExerciseId = "JoggingTrainingResult";
//  inputParam.DataType =   "distance";
//  inputParam.DateStart =  "2019-10-01";
//  inputParam.DateEnd =    "2020-01-31";

  // API to uGym with SQL command
  // SQL command API url 
  url = "http://ugym3dbiking.azurewebsites.net/api/SQL_CmdReadCols?Code=debug123";  

  
  var requestData = {
    "sqlCmd": "SELECT SUM("       + inputParam.DataType + 
              " ) AS A1 FROM "    + exerciseId + 
              " WHERE userId = '" + inputParam.UserId +
              "' AND　site = '"   + inputParam.SiteId +     
              "' AND　(trainingDate BETWEEN '" + inputParam.DateStart + 
              "' AND '" + inputParam.DateEnd +
              "') ",
    "sqlCols": [
              "A1",
      ]
  }

  //console.log(requestData);
  
  // fire request
  request({
    url: url,
    method: "POST",
    json: requestData
  }, function (error, res, body) {
    if (!error && res.statusCode === 200) {
      console.log(body);
      response.send("API:50 取得"+JSON.stringify(body));
    } else {
      console.log("error: " + error)
      console.log("res.statusCode: " + response.statusCode)
      console.log("res.statusText: " + response.statusText)
      response.send("API:50 失敗"+JSON.stringify(body));
    }
  })  
  
}

function readChallengeData(){
  // 讀取目前 ChallengeData
  database.ref("users/林口運動中心/挑戰賽").once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    console.log("資料庫挑戰賽讀取完成");
    var result = snapshot.val();
    //console.log(result);
    try {
      response.send(result.現在挑戰賽);     
    } catch (e) {
      console.log("API:51 ChallengeData 讀取失敗");
      response.send("API:51 ChallengeData 讀取失敗");      
      return 0;
    }
    console.log("API:51 ChallengeData 讀取成功");   
  });  
}

function readChallengeHistory(){
  // 讀取目前 challengeData
  database.ref("users/林口運動中心/挑戰賽").once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    console.log("資料庫挑戰賽讀取完成");
    var result = snapshot.val();
    //console.log(result);
    try {
      response.send(result.過去挑戰賽);     
    } catch (e) {
      console.log("API:52 challengeHistory 讀取失敗");
      response.send("API:52 challengeHistory 讀取失敗");      
      return 0;
    }
    console.log("API:52 challengeHistory 讀取成功");   
  });  
}

function readChallengeMember(){
  // 讀取目前 challengeMember
  database.ref("users/林口運動中心/挑戰賽管理").once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    console.log("資料庫挑戰賽管理讀取完成");
    var result = snapshot.val();
    //console.log(result);
    try {      
      response.send(result.挑戰賽會員);
    } catch (e) {
      console.log("API:53 challengeMember 讀取失敗");
      response.send("API:53 challengeMember 讀取失敗");      
      return 0;
    }
    console.log("API:53 challengeMember 讀取成功");
       
  });  
}

function writeChallengeMember報名() {
  //?API=61&UserName=小華&ChallengeId=T0003&UserId=U722be0c9c9d36e011c0e556bd2047819&PhoneNumber=09XXXXX333&Fee=free 
  // 檢查 UserName, ChallengeId, UserId, PhoneNumber, Fee
  var errMsg = "";
  if ( inputParam.UserName    == undefined ||
       inputParam.ChallengeId == undefined ||
       inputParam.UserId      == undefined ||
       inputParam.PhoneNumber == undefined ||
       inputParam.Fee         == undefined     )
  {
    console.log("API:60 參數錯誤"); 
    response.send("API:60 參數錯誤");
    return 1;
  }   
  // ====================================================================================
  
  // 讀取目前 couponMember
  database.ref("users/林口運動中心/挑戰賽管理").once("value").then(function (snapshot) {
    console.log("API:60 challengeMember 讀取成功");
    var result = snapshot.val();
    //console.log(result);
    try {      
      challengeMember=[];
      challengeMember = JSON.parse(result.挑戰賽會員);
      //console.log(couponMember);   
    } catch (e) {
      console.log("API:60 challengeMember 讀取失敗");
      response.send("API:60 challengeMember 讀取失敗");      
      return 0;
    }
    
    var challengeIndex=-1;
    var userInChallenge = false;
    challengeMember.forEach(function(challenge, index, array){
      if (challenge[0]==inputParam.ChallengeId){
        //console.log("challenge matched:", challenge[0]);
        challengeIndex = index;
        if (challenge.length>1) {
          for (var i=1; i< challenge.length; i++) {
            //console.log(i, challenge[i]);
            if (challenge[i][3]== inputParam.UserId){
              //console.log(inputParam.UserName, "已經報名過 ", inputParam.ChallengeId);
              //response.send("API:60 "+inputParam.UserName+" 已經報名過 "+inputParam.ChallengeId);   
              userInchallenge = true;
              break;
            }
          }
        }
      }
    });

    if (userInChallenge) {
      console.log("API:60", inputParam.UserName, "已參加過 ", inputParam.ChallengeId);
      response.send("API:60 "+inputParam.UserName+" 已參加過 "+inputParam.ChallengeId); 
      return 0;
    };
    
    console.log(challengeIndex);
    // ChallengeId 還沒被 UserName 使用過
    // push to challengeMember    

    // Conver local date to format "YYYY-MM-DD"
    var nowDate = new Date();
    var localDateStr = nowDate.toLocaleDateString();
    var formatDateStr = localDateStr.replace(/\//g, "-");
    var dateArr = formatDateStr.split("-");
    if (dateArr[1].length == 1) dateArr[1]="0"+dateArr[1]; //若是個位數，前面補 0
    if (dateArr[2].length == 1) dateArr[2]="0"+dateArr[2]; //若是個位數，前面補 0   
    var dateStr = dateArr[0] + "-" + dateArr[1] + "-" + dateArr[2];   
    //console.log(dateStr);
    // End of Conver local date to format "YYYY-MM-DD"     
    
    if (inputParam.Fee == "free" || inputParam.Fee == "0") {
      challengeMember[challengeIndex].push([inputParam.UserName, dateStr+" 已參加", "免費", inputParam.UserId, inputParam.PhoneNumber]); }
    else {
      challengeMember[challengeIndex].push([inputParam.UserName, dateStr+" 已參加", "未繳費", inputParam.UserId, inputParam.PhoneNumber]);       
    }
    console.log(challengeMember);

    // Write to Database
    database.ref('users/林口運動中心/挑戰賽管理').set({
      挑戰賽會員: JSON.stringify(challengeMember),
    }, function (error) {
      if (error) {
        console.log("API:60 會員參加挑戰賽失敗");
        response.send("API:60 會員參加挑戰賽失敗");      
      } else {
        console.log("API:60 會員參加挑戰賽成功");
        response.send("API:60 會員參加挑戰賽成功");
      }

    });
    
  });    
}

function writeChallengeMember兌換() {
  //?API=61&UserName=小華&ChallengeId=T0003&UserId=U722be0c9c9d36e011c0e556bd2047819&PhoneNumber=09XXXXX333&Fee=free 
  // 檢查 UserName, ChallengeId, UserId, PhoneNumber, Fee
  var errMsg = "";
  if ( inputParam.UserName    == undefined ||
       inputParam.ChallengeId == undefined ||
       inputParam.UserId      == undefined ||
       inputParam.PhoneNumber == undefined ||
       inputParam.Fee         == undefined     )
  {
    console.log("API:61 參數錯誤"); 
    response.send("API:61 參數錯誤");
    return 1;
  }   
  // ====================================================================================
  
  // 讀取目前 couponMember
  database.ref("users/林口運動中心/挑戰賽管理").once("value").then(function (snapshot) {
    console.log("API:61 challengeMember 讀取成功");
    var result = snapshot.val();
    //console.log(result);
    try {      
      challengeMember=[];
      challengeMember = JSON.parse(result.挑戰賽會員);
      //console.log(couponMember);   
    } catch (e) {
      console.log("API:61 challengeMember 讀取失敗");
      response.send("API:61 challengeMember 讀取失敗");      
      return 0;
    }
    
    var challengeIndex=-1;
    var memberIndex=-1;
    var userInChallenge = false;
    challengeMember.forEach(function(challenge, index, array){
      if (challenge[0]==inputParam.ChallengeId){
        //console.log("challenge matched:", challenge[0]);
        challengeIndex = index;
        if (challenge.length>1) {
          for (var i=1; i< challenge.length; i++) {
            //console.log(i, challenge[i]);
            if (challenge[i][3]== inputParam.UserId){
              //console.log(inputParam.UserName, "已經報名過 ", inputParam.ChallengeId);
              //response.send("API:60 "+inputParam.UserName+" 已經報名過 "+inputParam.ChallengeId);   
              userInchallenge = true;
              memberIndex = i;
              break;
            }
          }
        }
      }
    });

    //console.log(challengeMember[challengeIndex][0]);
    //console.log(challengeMember[challengeIndex][memberIndex][2]);
    challengeMember[challengeIndex][memberIndex][2]="已兌換";
    //console.log(challengeMember[challengeIndex][memberIndex][2]);
  
    
    
    // ChallengeId 還沒被 UserName 使用過
    // push to challengeMember    

    // Conver local date to format "YYYY-MM-DD"
//    var nowDate = new Date();
//    var localDateStr = nowDate.toLocaleDateString();
//    var formatDateStr = localDateStr.replace(/\//g, "-");
//    var dateArr = formatDateStr.split("-");
//    if (dateArr[1].length == 1) dateArr[1]="0"+dateArr[1]; //若是個位數，前面補 0
//    if (dateArr[2].length == 1) dateArr[2]="0"+dateArr[2]; //若是個位數，前面補 0   
//    var dateStr = dateArr[0] + "-" + dateArr[1] + "-" + dateArr[2];   
    //console.log(dateStr);
    // End of Conver local date to format "YYYY-MM-DD"     
    
//    if (inputParam.Fee == "free" || inputParam.Fee == "0") {
//      challengeMember[challengeIndex].push([inputParam.UserName, dateStr+" 已參加", "免費", inputParam.UserId, inputParam.PhoneNumber]); }
//    else {
//      challengeMember[challengeIndex].push([inputParam.UserName, dateStr+" 已參加", "未繳費", inputParam.UserId, inputParam.PhoneNumber]);       
//    }
    
    
    
    //console.log(challengeMember);

    // Write to Database
    database.ref('users/林口運動中心/挑戰賽管理').set({
      挑戰賽會員: JSON.stringify(challengeMember),
    }, function (error) {
      if (error) {
        console.log("API:61 會員挑戰賽兌換失敗");
        response.send("API:61 會員挑戰賽兌換失敗");      
      } else {
        console.log("API:61 會員挑戰賽兌換成功");
        response.send("API:61 會員挑戰賽兌換成功");
      }

    });
    
  });    
}
// 挑戰賽管理 APIs END=================================================================
