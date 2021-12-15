
# Project WafiLife LoadTesting
## Summary Report

Dear Sir,

I’ve completed performance test on frequently used API for test site "https://www.wafilife.com/". 
Test executed for the below mentioned scenario.

300 Concurrent Request with 10 Ramp Up Period and 1 Loop Count; Avg TPS for Total Samples is ~ 95  And Total Concurrent API requested: 5700.  
350 Concurrent Request with 10 Ramp Up Period and 1 Loop Count; Avg TPS for Total Samples is ~ 111 And Total Concurrent API requested: 6650.  
400 Concurrent Request with 10 Ramp Up Period and 1 Loop Count; Avg TPS for Total Samples is ~ 126 And Total Concurrent API requested: 7600.  
450 Concurrent Request with 10 Ramp Up Period and 1 Loop Count; Avg TPS for Total Samples is ~ 110 And Total Concurrent API requested: 8550.  
600 Concurrent Request with 10 Ramp Up Period and 1 Loop Count; Avg TPS for Total Samples is ~ 184 And Total Concurrent API requested: 11410.  
650 Concurrent Request with 10 Ramp Up Period and 1 Loop Count; Avg TPS for Total Samples is ~ 113 And Total Concurrent API requested: 9090.  
700 Concurrent Request with 10 Ramp Up Period and 1 Loop Count; Avg TPS for Total Samples is ~ 179 And Total Concurrent API requested: 13300.  

While executed 650 concurrent request, found  5 request got connection timeout and error rate is .06%.   
While executed 700 concurrent request, found  600 request got connection timeout and error rate is 4.51%.   

Summary: Server can handle almost concurrent 11400 API call with almost zero (0) error rate.  

Please find the details report from the folder  WafiLifeReport and let me know if you have any further queries.   
