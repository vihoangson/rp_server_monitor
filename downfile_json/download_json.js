var myArgs = process.argv.slice(2);
	console.log(myArgs[0]);
//	return;

// var date_get_data = '2020/06/26';
if(typeof myArgs[0] === 'undefined'){
	console.log(1);
	return;
}

//var date_get_data = myArgs[0]

const daies =[

	'2020/07/27',
	'2020/07/24',
	'2020/07/23',
	'2020/07/22',
	'2020/07/21',
	'2020/07/20',
	'2020/07/19',
	'2020/07/18',
	'2020/07/17',
	'2020/07/16',
	'2020/07/15',
	'2020/07/14',
	'2020/07/13',
	'2020/07/12',
	'2020/07/11',
	'2020/07/10',
	'2020/07/09',
	'2020/07/08',
	'2020/07/07',
	'2020/07/06',
	'2020/07/05',
	'2020/07/04',
	'2020/07/03',
	'2020/07/02',
	'2020/07/01',

];
daies.forEach((dv)=>{

	var date_get_data = dv;

	var timestamp_start = Number(new Date(date_get_data+' 00:00:01'));
	console.log(Math.round(timestamp_start/1000));
	const startTime = Math.round(timestamp_start/1000);

	var timestamp = Number(new Date(date_get_data+' 23:59:59'));
	console.log(Math.round(timestamp/1000));
	const endTime = Math.round(timestamp/1000);


	const query = 'cadvisor_version_info';
	const time_step = '30s';

	// This works perfectly well!
	const axios = require('axios');
	const fs = require('fs');


	// let array_query = [
	// 'cadvisor_version_info',
	// 'container_cpu_load_average_10s',
	// 'container_cpu_system_seconds_total',
	// 'container_cpu_usage_seconds_total',
	// 'container_cpu_user_seconds_total',
	// 'container_fs_inodes_free',
	// 'container_fs_inodes_total',
	// 'container_fs_io_current',
	// 'container_fs_io_time_seconds_total',
	// 'container_fs_io_time_weighted_seconds_total',
	// 'container_fs_limit_bytes',
	// 'container_fs_read_seconds_total',
	// 'container_fs_reads_bytes_total',
	// 'container_fs_reads_merged_total',
	// 'container_fs_reads_total',
	// 'container_fs_sector_reads_total',
	// 'container_fs_sector_writes_total',
	// 'container_fs_usage_bytes',
	// 'container_fs_write_seconds_total',
	// 'container_fs_writes_bytes_total',
	// 'container_fs_writes_merged_total',
	// 'container_fs_writes_total',
	// 'container_last_seen',
	// 'container_memory_cache',
	// 'container_memory_failcnt',
	// 'container_memory_failures_total',
	// 'container_memory_mapped_file',
	// 'container_memory_max_usage_bytes',
	// 'container_memory_rss',
	// 'container_memory_swap',
	// 'container_memory_usage_bytes',
	// 'container_memory_working_set_bytes',
	// 'container_network_receive_bytes_total',
	// 'container_network_receive_errors_total',
	// 'container_network_receive_packets_dropped_total',
	// 'container_network_receive_packets_total',
	// 'container_network_transmit_bytes_total',
	// 'container_network_transmit_errors_total',
	// 'container_network_transmit_packets_dropped_total',
	// 'container_network_transmit_packets_total',
	// 'container_scrape_error',
	// 'container_spec_cpu_period',
	// 'container_spec_cpu_shares',
	// 'container_spec_memory_limit_bytes',
	// 'container_spec_memory_reservation_limit_bytes',
	// 'container_spec_memory_swap_limit_bytes',
	// 'container_start_time_seconds',
	// 'container_tasks_state'
	// ];
	let array_query = [
	'container_network_transmit_bytes_total',
	'container_cpu_usage_seconds_total',
	'container_memory_working_set_bytes',
	'container_network_receive_bytes_total'
	];
	array_query.forEach((v,k)=>{
		let query = v;
		let link = 'http://172.16.2.7:9090/api/v1/query_range?query='+query+'{instance="172.16.2.37:8001"}&start='+startTime+'&end='+(endTime)+'&step='+time_step;	
		axios.get(link, {responseType: "stream"} )
		.then(response => {
		// Saving file to working directory
			date_get_data.replace('/','');

			let datetrim = date_get_data.replace(/(\/)/gi,'')

			var dir = './file_json/'+datetrim;
			if (!fs.existsSync(dir)){
			    fs.mkdirSync(dir);
			}

		    response.data.pipe(fs.createWriteStream(dir+'/'+query+".json"));
		})
		    .catch(error => {
		    console.log(error);
		});
	})

})

return;
