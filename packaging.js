var Module=typeof pyodide._module!=="undefined"?pyodide._module:{};if(!Module.expectedDataFileDownloads){Module.expectedDataFileDownloads=0}Module.expectedDataFileDownloads++;(function(){var loadPackage=function(metadata){var PACKAGE_PATH;if(typeof window==="object"){PACKAGE_PATH=window["encodeURIComponent"](window.location.pathname.toString().substring(0,window.location.pathname.toString().lastIndexOf("/"))+"/")}else if(typeof location!=="undefined"){PACKAGE_PATH=encodeURIComponent(location.pathname.toString().substring(0,location.pathname.toString().lastIndexOf("/"))+"/")}else{throw"using preloaded data can only be done on a web page or in a web worker"}var PACKAGE_NAME="packaging.data";var REMOTE_PACKAGE_BASE="packaging.data";if(typeof Module["locateFilePackage"]==="function"&&!Module["locateFile"]){Module["locateFile"]=Module["locateFilePackage"];err("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)")}var REMOTE_PACKAGE_NAME=Module["locateFile"]?Module["locateFile"](REMOTE_PACKAGE_BASE,""):REMOTE_PACKAGE_BASE;var REMOTE_PACKAGE_SIZE=metadata["remote_package_size"];var PACKAGE_UUID=metadata["package_uuid"];function fetchRemotePackage(packageName,packageSize,callback,errback){var xhr=new XMLHttpRequest;xhr.open("GET",packageName,true);xhr.responseType="arraybuffer";xhr.onprogress=function(event){var url=packageName;var size=packageSize;if(event.total)size=event.total;if(event.loaded){if(!xhr.addedTotal){xhr.addedTotal=true;if(!Module.dataFileDownloads)Module.dataFileDownloads={};Module.dataFileDownloads[url]={loaded:event.loaded,total:size}}else{Module.dataFileDownloads[url].loaded=event.loaded}var total=0;var loaded=0;var num=0;for(var download in Module.dataFileDownloads){var data=Module.dataFileDownloads[download];total+=data.total;loaded+=data.loaded;num++}total=Math.ceil(total*Module.expectedDataFileDownloads/num);if(Module["setStatus"])Module["setStatus"]("Downloading data... ("+loaded+"/"+total+")")}else if(!Module.dataFileDownloads){if(Module["setStatus"])Module["setStatus"]("Downloading data...")}};xhr.onerror=function(event){throw new Error("NetworkError for: "+packageName)};xhr.onload=function(event){if(xhr.status==200||xhr.status==304||xhr.status==206||xhr.status==0&&xhr.response){var packageData=xhr.response;callback(packageData)}else{throw new Error(xhr.statusText+" : "+xhr.responseURL)}};xhr.send(null)}function handleError(error){console.error("package error:",error)}var fetchedCallback=null;var fetched=Module["getPreloadedPackage"]?Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME,REMOTE_PACKAGE_SIZE):null;if(!fetched)fetchRemotePackage(REMOTE_PACKAGE_NAME,REMOTE_PACKAGE_SIZE,function(data){if(fetchedCallback){fetchedCallback(data);fetchedCallback=null}else{fetched=data}},handleError);function runWithFS(){function assert(check,msg){if(!check)throw msg+(new Error).stack}Module["FS_createPath"]("/","lib",true,true);Module["FS_createPath"]("/lib","python3.8",true,true);Module["FS_createPath"]("/lib/python3.8","site-packages",true,true);Module["FS_createPath"]("/lib/python3.8/site-packages","packaging",true,true);Module["FS_createPath"]("/lib/python3.8/site-packages","packaging-20.9-py3.8.egg-info",true,true);function processPackageData(arrayBuffer){assert(arrayBuffer,"Loading data file failed.");assert(arrayBuffer instanceof ArrayBuffer,"bad input to processPackageData");var byteArray=new Uint8Array(arrayBuffer);var curr;var compressedData={data:null,cachedOffset:66439,cachedIndexes:[-1,-1],cachedChunks:[null,null],offsets:[0,1019,1817,3234,4509,5526,6775,7906,9222,10483,11675,12893,13939,14809,15970,17193,18191,18991,20186,21292,22219,23262,24447,25537,26515,27611,28748,30218,31409,32799,34047,35143,36260,37390,38403,39537,41001,42231,43155,44355,45479,46817,47974,49249,50244,51028,52370,53430,54171,55290,56513,57814,58924,60095,61011,62090,63114,64294,65455],sizes:[1019,798,1417,1275,1017,1249,1131,1316,1261,1192,1218,1046,870,1161,1223,998,800,1195,1106,927,1043,1185,1090,978,1096,1137,1470,1191,1390,1248,1096,1117,1130,1013,1134,1464,1230,924,1200,1124,1338,1157,1275,995,784,1342,1060,741,1119,1223,1301,1110,1171,916,1079,1024,1180,1161,984],successes:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]};compressedData["data"]=byteArray;assert(typeof Module.LZ4==="object","LZ4 not present - was your app build with  -s LZ4=1  ?");Module.LZ4.loadPackage({metadata:metadata,compressedData:compressedData},true);Module["removeRunDependency"]("datafile_packaging.data")}Module["addRunDependency"]("datafile_packaging.data");if(!Module.preloadResults)Module.preloadResults={};Module.preloadResults[PACKAGE_NAME]={fromCache:false};if(fetched){processPackageData(fetched);fetched=null}else{fetchedCallback=processPackageData}}if(Module["calledRun"]){runWithFS()}else{if(!Module["preRun"])Module["preRun"]=[];Module["preRun"].push(runWithFS)}};loadPackage({files:[{filename:"/lib/python3.8/site-packages/packaging/__about__.py",start:0,end:726,audio:0},{filename:"/lib/python3.8/site-packages/packaging/__init__.py",start:726,end:1288,audio:0},{filename:"/lib/python3.8/site-packages/packaging/_compat.py",start:1288,end:2416,audio:0},{filename:"/lib/python3.8/site-packages/packaging/_structures.py",start:2416,end:4438,audio:0},{filename:"/lib/python3.8/site-packages/packaging/_typing.py",start:4438,end:6250,audio:0},{filename:"/lib/python3.8/site-packages/packaging/markers.py",start:6250,end:15710,audio:0},{filename:"/lib/python3.8/site-packages/packaging/requirements.py",start:15710,end:20808,audio:0},{filename:"/lib/python3.8/site-packages/packaging/specifiers.py",start:20808,end:53016,audio:0},{filename:"/lib/python3.8/site-packages/packaging/tags.py",start:53016,end:82577,audio:0},{filename:"/lib/python3.8/site-packages/packaging/utils.py",start:82577,end:86962,audio:0},{filename:"/lib/python3.8/site-packages/packaging/version.py",start:86962,end:102936,audio:0},{filename:"/lib/python3.8/site-packages/packaging/py.typed",start:102936,end:102936,audio:0},{filename:"/lib/python3.8/site-packages/packaging-20.9-py3.8.egg-info/PKG-INFO",start:102936,end:119315,audio:0},{filename:"/lib/python3.8/site-packages/packaging-20.9-py3.8.egg-info/SOURCES.txt",start:119315,end:120803,audio:0},{filename:"/lib/python3.8/site-packages/packaging-20.9-py3.8.egg-info/dependency_links.txt",start:120803,end:120804,audio:0},{filename:"/lib/python3.8/site-packages/packaging-20.9-py3.8.egg-info/requires.txt",start:120804,end:120821,audio:0},{filename:"/lib/python3.8/site-packages/packaging-20.9-py3.8.egg-info/top_level.txt",start:120821,end:120831,audio:0}],remote_package_size:70535,package_uuid:"541b1f1b-8bd7-4954-8f8a-44c18e1b65b7"})})();