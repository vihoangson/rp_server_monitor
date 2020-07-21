'use strict';

var myArgs = process.argv.slice(2);
const fs = require('fs');
const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');
const exportDate = myArgs[0];
// const testFolder = '../Files/file_json/'
const testFolder = '../downfile_json/file_json/'+exportDate+'/';

var date_get_data = myArgs[0]
		let datetrim = date_get_data.replace(/(\/)/gi,'')
let f = [];
let rd = new Promise((resolve, reject) => {
	return fs.readdir(testFolder, (err, files) => {
		if(err!==null)
			reject(err);
		else
			resolve(files);
	})
});


let getDateYesterday = function (){
	let ObjNowDate = new Date()
	// Hours part from the timestamp
	let day_now ="0" + (ObjNowDate.getDate()-3); // Trừ ngày từ thời điểm hiện tại 	
	// Minutes part from the timestamp
	let Month_now ="0" +   (ObjNowDate.getMonth()+1);
	// Seconds part from the timestamp
	let Year_now =  ObjNowDate.getFullYear();	
	let formattedTimeNow = Year_now + '-' + Month_now.substr(-2) + '-' + day_now.substr(-2);
	return formattedTimeNow;
}



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

rd.then((files)=>{
	console.log(files)

	files.forEach((file)=>{

	if(true){

	  		let reg = /\.json/g;
	  		if(! reg.test(file) ){
	  			return;
	  		}
	  		let reg2 = /container_network_transmit_bytes_total|container_cpu_usage_seconds_total|container_memory_working_set_bytes|container_network_receive_bytes_total/g;
//			let reg2 = /container_memory_working_set_bytes/g;
	  		// let reg2 = /container_network_transmit_bytes_total/g;
	  		if(! reg2.test(file) ){
	  			return;
	  		}

			let rawdata = fs.readFileSync(testFolder+file);
			let student = JSON.parse(rawdata);
			const createCsvWriter = require('csv-writer').createObjectCsvWriter;


			var dir = './csv/'+datetrim;
			if (!fs.existsSync(dir)){
			    fs.mkdirSync(dir);
			}


			let fileName = dir+'/'+file+'.csv';

			let csvWriter = createCsvWriter({
			    path:   fileName  ,
			    header: [
			    	{id: 'date', title: 'Date'},
			        {id: 'time', title: 'Time'},
			        {id: 'value', title: 'Value'},
					{id: 'id', title: 'id'},
					{id: 'instance', title: 'instance'},
					{id: 'job', title: 'job'},
			    ]
			});
			let m = [];
			let i = 0;
						
			student.data.result.forEach((v1,k1)=>{
				
				v1.values.forEach((v,k)=>{			
					var patt = /docker/g;
					if(patt.test(v1.metric.id)){
						return null;
					}

					let time = formatTime(v[0]);
					
					let instance = v1.metric.instance.replace(':8001','');									
					m[i] = {
						id: v1.metric.id,
						instance: instance,
						job: v1.metric.job,
						time:time.time,
						date:time.day,
						value:v[1]					
					};
					i++								
				})
			})

			let records = m; 
			csvWriter.writeRecords(records)       // returns a promise
			    .then(() => {
			        console.log('...Done: ' + fileName);
			    });				    

	} 
	})

})
.catch((err)=>{
	console.log(err)	
})
