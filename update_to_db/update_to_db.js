const mysql = require('mysql');
const fs = require('fs');
var myArgs = process.argv.slice(2);
const exportDate = myArgs[0];
const formatTime = function(unix_timestamp){

    unix_timestamp = Math.round(unix_timestamp)

    var date = new Date(unix_timestamp * 1000);

    let returnResult = {day:'',time:''};

    if(true){
        // Hours part from the timestamp
        var day ="0" + date.getDate();
        // Minutes part from the timestamp
        var Month ="0" +   (date.getMonth()+1);
        // Seconds part from the timestamp
        var Year =  date.getFullYear();

        var formattedTime = Year + '-' + Month.substr(-2) + '-' + day.substr(-2);

        returnResult.day = formattedTime;



        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        returnResult.time = formattedTime;
        // console.log(formattedTime);
    }
    return returnResult;
}

var con = mysql.createConnection({
    host: "172.16.2.7",
    user: "report_monitor",
    password: "lampart",
    database : 'report_monitor'
});
//console.log(con);

let container = ['container_network_transmit_bytes_total',
    'container_cpu_usage_seconds_total',
    'container_memory_working_set_bytes',
    'container_network_receive_bytes_total'];
container.forEach((containerName)=>{
    let file_path = '../downfile_json/file_json/'+exportDate+'/'+containerName+'.json';
    let obj = JSON.parse(fs.readFileSync(file_path));
    let total = obj.data.result.length;
    obj.data.result.forEach((v1,k1)=> {

        // todo: progress 1
        var patt = /docker/g;
        if(patt.test(v1.metric.id)){
            return null;
        }
        let process = v1.metric.id;
        // todo: progress 2
        let instance = v1.metric.instance.replace(':8001','');
        let job = v1.metric.job;
        let sql = "INSERT INTO `report_monitor`."+containerName+" (`log_date`, `log_time`, `value`,`process`,`instance`,`job`) " +
            "VALUES ";
        v1.values.forEach((vk,kk)=>{
            let formatTime2 = formatTime(vk[0]);
            let date = formatTime2.day;
            let time = formatTime2.time;
            let value = vk[1];
            if(kk !== 0){
                sql = sql + ','
            }
            sql = sql + "('" + date + "', '" + time + "', '" + value + "', '" + process + "','" + instance + "','" + job + "')"
        })

        con.query(sql,(error, results, fields)=>{
            console.log('Done: '+exportDate+' : '+k1+'/'+total+':' + sql.length);
        })        

    });
})

var https = require('https');
var axios = require('axios');
var data = JSON.stringify({ "room_id": 2061, "type": 0, "message": "Autoscript 172.16.2.8: Report monitor completetly" });

var config = {
    method: 'post',
    url: 'https://172.16.2.38:8443/api/v1/message/sent',
    headers: {
        'secret': 'c87f99f610928a03b57ca00c7ffb2750',
        'userid': '90',
        'Content-Type': 'application/json'
    },
    data: data,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
};

axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });



return;
// LOAD DATA LOCAL INFILE '"+file_name+"' INTO TABLE container_cpu_usage_seconds_total FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n';
// console.log(sql);
//let file_name = dir+'/'+query+".json";
// let file_name = '../downfile_json/file_json/20200723/container_cpu_usage_seconds_total.json'
// var obj = JSON.parse(fs.readFileSync(file_name, 'utf8'));
// console.log(obj.data.result);




// let file_name = dir+'/'+query+".json";
// var obj = JSON.parse(fs.readFileSync(file_name, 'utf8'));
// console.log(obj);


// let sql = "INSERT INTO `report_monitor`.`container_cpu_usage_seconds_total` (`log_date`, `log_time`, `value`,`process`,`instance`,`job`) " +
//     "VALUES ('2020-07-23', '14:40:56', '1', '1','1','1');";
// con.query(sql,(error, results, fields)=>{
//     console.log(results[0]);
// })

// con.query('select * from container_cpu_usage_seconds_total',(error, results, fields)=>{
//     console.log(results[0]);
// })
