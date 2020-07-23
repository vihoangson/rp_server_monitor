const mysql = require('mysql');

var con = mysql.createConnection({
    host: "172.16.2.7",
    user: "report_monitor",
    password: "lampart",
    database : 'report_monitor'
});
console.log(con);
let sql = "INSERT INTO `report_monitor`.`container_cpu_usage_seconds_total` (`log_date`, `log_time`, `value`,`process`,`instance`,`job`) " +
    "VALUES ('2020-07-23', '14:40:56', '1', '1','1','1');";
con.query(sql,(error, results, fields)=>{
    console.log(results[0]);
})

con.query('select * from container_cpu_usage_seconds_total',(error, results, fields)=>{
    console.log(results[0]);
})
