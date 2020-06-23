'use strict';
const fs = require('fs');
const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

const testFolder = '../Files/file_json/'
let f = [];
let rd = new Promise((resolve, reject) => {
	return fs.readdir(testFolder, (err, files) => {
		if(err!==null)
			reject(err);
		else
			resolve(files);

	  // files.forEach(file => {
			// f.push = file;
	  // });
	})
});

rd.then((files)=>{
	console.log(files)

	files.forEach((file)=>{

	if(true){

	  		let reg = /\.json/g;
	  		if(! reg.test(file) ){
	  			return;
	  		}
	  		let reg2 = /container_network_transmit_bytes_total|container_cpu_usage_seconds_total|container_memory_working_set_bytes|container_network_receive_bytes_total/g;
	  		if(! reg2.test(file) ){
	  			return;
	  		}

			let rawdata = fs.readFileSync(testFolder+file);
			let student = JSON.parse(rawdata);
			const createCsvWriter = require('csv-writer').createObjectCsvWriter;
			let csvWriter = createCsvWriter({
			    path: './csv/'+file+'.csv'    ,
			    header: [
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
				//console.log(v1.metric);
				v1.values.forEach((v,k)=>{			
					var patt = /docker/g;
					if(patt.test(v1.metric.id)){
						return null;
					}

					m[i] = {
						id: v1.metric.id,
						instance: v1.metric.instance,
						job: v1.metric.job,
						time:'\''+v[0],value:v[1]
					};
					i++		
				})
			})

			let records = m; 
			csvWriter.writeRecords(records)       // returns a promise
			    .then(() => {
			        console.log('...Done');
			    });

			

	    //console.log(file);


	} 
	})

})
.catch((err)=>{
	console.log(err)	
})

// console.log(f);

