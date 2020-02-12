# apiForFirebase
原本是在 SABG 上的 ugym-api-for-firebase, copy 到 Linko-Sports-Center 做 beta 測試，然後再 fork 回 SABG 做開發測試

APIs <br>
  * API:00 ?API=00&UserId=Uxxx..xxx 
    * 檢查會員 成功回應 "API:00 會員已存在" 或 "API:00 會員不存在" 
    <br>
  * API:01 ?API=01&Name&Gender&Birth&Phone&ID&Address&UserId&PicURL&Height&Weight&EmergencyContact&EmergencyPhone
    * 加入會員 成功回應 "API:01 會員已存在" 或 "API:01 會員寫入成功"
    <br>
  * API:02 ?API=02&Name&Gender&Birth&Phone&ID&Address&UserId&PicURL&Height&Weight&EmergencyContact&EmergencyPhone
    * 更新資料 成功回應 "API:02 更新資料成功" 或 "API:02 更新資料失敗" 
    <br>
  * API:10 ?API=10
    * 讀取 courseData, 成功回應 JSON.stringify(courseData), 失敗回應 "API:10 courseData 讀取失敗"
    <br>
  * API:11 ?API=11
    * 讀取 courseHistory, 成功回應 JSON.stringify(courseHistory), 失敗回應 "API:11 courseHistory 讀取失敗"
    <br>
  * API:12 ?API=12
    * 讀取 courseMember, JSON.stringify(courseMember), 失敗回應 "API:12 courseHistory 讀取失敗"
    <br>
  * API:13 ?API=13&UserId=U10...CDEF
    * UserId 查得 PhoneNumber, JSON.stringify(memberData[userId]), 失敗回應 "API:13 courseHistory 讀取失敗"
    <br>
  * API:14 ?API=14
    * 讀取 單一客戶資料, JSON.stringify(memberData[userId]), 失敗回應 "API:14 單一客戶資料讀取失敗"
    <br> 
  * API:20 ?API=20&UserName&CourseId&UserId&PhoneNumber
    * 報名寫入 courseMember with  ["courseID", ["userName", "未繳費", "未簽到"]], 成功回應 "API:20 會員報名成功" 或 "API:20 會員報名失敗"
    <br>
  * API:21 ?API=21&UserName&CourseId&UserId&PhoneNumber
    * 更新簽到欄 courseMember with  ["courseID", ["userName", "未繳費", "已簽到", UserId, PhoneNumber]], 成功回應 "API:21 會員簽到成功" 或 "API:21 會員簽到失敗"
    <br>
  * API:30 ?API=30
    * 讀取 couponData, 成功回應 JSON.stringify(couponData), 失敗回應 "API:30 couponData 讀取失敗"
    <br>
  * API:31 ?API=31
    * 讀取 couponHistory, 成功回應 JSON.stringify(couponHistory), 失敗回應 "API:31 couponHistory 讀取失敗"
    <br>
  * API:32 ?API=32
    * 讀取 couponMember, JSON.stringify(couponMember), 失敗回應 "API:32 couponHistory 讀取失敗"
    <br>
  * API:40 ?API=40&UserName&CouponId&UserId&PhoneNumber
    * 報名寫入 couponMember with  ["courseID", ["userName", "已使用", "未確認"]], 成功回應 "API:40 優惠券使用成功" 或 "API:40 優惠券使用失敗"
    <br>
  * API:50 ?API=50&UserId&SiteId&ExerciseId&DataType&DateStart&DateEnd
    * 取得 UserId 在 DateStart 到 DateEnd 其間 ExerciseId 的 DataType 總運動量
      * ExerciseId: 00:jogging, 01:biking, 02:Rowing, 03:Weights
    <br>
  * API:51 ?API=51 ==> read 挑戰賽/現在挑戰賽 --> challengeData
    * 讀取 challengeData, 成功回應 JSON.stringify(couponData), 失敗回應 "API:51 challengeData 讀取失敗"
    <br>
  * API:52 ?API=52 ==> read 挑戰賽/過去挑戰賽 --> challengeHistory
    * 讀取 challengeHistory, 成功回應 JSON.stringify(challengeHistory), 失敗回應 "API:52 challengeHistory 讀取失敗"
    <br>  
  * API:53 ?API=53 ==> read 挑戰賽管理/挑戰賽會員 --> challengeMember 
    * 讀取 challengeMember, 成功回應 JSON.stringify(challengeMember), 失敗回應 "API:53 challengeMember 讀取失敗"
    <br> 
  * API:60 ?API=60&UserName&ChallengeId&UserId&PhoneNumber&Fee
    * 報名寫入 challengeMember with  ["challengeId", ["userName", "日期 已參加", "未繳費"/或"免費"]], 成功回應 "API:60 挑戰賽參加成功" 或 "API:60 挑戰賽參加失敗"
    <br>    