SET @daydelete = '2020-07-20';
DELETE FROM container_cpu_usage_seconds_total WHERE log_date = @daydelete;
DELETE FROM container_memory_working_set_bytes WHERE log_date = @daydelete;
DELETE FROM container_network_receive_bytes_total WHERE log_date = @daydelete;
DELETE FROM container_network_transmit_bytes_total WHERE log_date = @daydelete;