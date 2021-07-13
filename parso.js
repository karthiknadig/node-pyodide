var fsapi = require("fs-extra");
var pathApi = require("path");
var Module = typeof pyodide._module !== "undefined" ? pyodide._module : {};
if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function () {
    var loadPackage = function (metadata) {
        var PACKAGE_PATH;
        // if (typeof window === 'object') {
        //     PACKAGE_PATH = window['encodeURIComponent'](
        //         window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) +
        //             '/',
        //     );
        // } else if (typeof location !== 'undefined') {
        //     PACKAGE_PATH = encodeURIComponent(
        //         location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/',
        //     );
        // } else {
        //     throw 'using preloaded data can only be done on a web page or in a web worker';
        // }
        var PACKAGE_NAME = "parso.data";
        var REMOTE_PACKAGE_BASE = "parso.data";
        if (
            typeof Module["locateFilePackage"] === "function" &&
            !Module["locateFile"]
        ) {
            Module["locateFile"] = Module["locateFilePackage"];
            err(
                "warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)"
            );
        }
        var REMOTE_PACKAGE_NAME = Module["locateFile"]
            ? Module["locateFile"](REMOTE_PACKAGE_BASE, "")
            : REMOTE_PACKAGE_BASE;
        var REMOTE_PACKAGE_SIZE = metadata["remote_package_size"];
        var PACKAGE_UUID = metadata["package_uuid"];
        function fetchRemotePackage(
            packageName,
            packageSize,
            callback,
            errback
        ) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", packageName, true);
            xhr.responseType = "arraybuffer";
            xhr.onprogress = function (event) {
                var url = packageName;
                var size = packageSize;
                if (event.total) size = event.total;
                if (event.loaded) {
                    if (!xhr.addedTotal) {
                        xhr.addedTotal = true;
                        if (!Module.dataFileDownloads)
                            Module.dataFileDownloads = {};
                        Module.dataFileDownloads[url] = {
                            loaded: event.loaded,
                            total: size,
                        };
                    } else {
                        Module.dataFileDownloads[url].loaded = event.loaded;
                    }
                    var total = 0;
                    var loaded = 0;
                    var num = 0;
                    for (var download in Module.dataFileDownloads) {
                        var data = Module.dataFileDownloads[download];
                        total += data.total;
                        loaded += data.loaded;
                        num++;
                    }
                    total = Math.ceil(
                        (total * Module.expectedDataFileDownloads) / num
                    );
                    if (Module["setStatus"])
                        Module["setStatus"](
                            "Downloading data... (" + loaded + "/" + total + ")"
                        );
                } else if (!Module.dataFileDownloads) {
                    if (Module["setStatus"])
                        Module["setStatus"]("Downloading data...");
                }
            };
            xhr.onerror = function (event) {
                throw new Error("NetworkError for: " + packageName);
            };
            xhr.onload = function (event) {
                if (
                    xhr.status == 200 ||
                    xhr.status == 304 ||
                    xhr.status == 206 ||
                    (xhr.status == 0 && xhr.response)
                ) {
                    var packageData = xhr.response;
                    callback(packageData);
                } else {
                    throw new Error(xhr.statusText + " : " + xhr.responseURL);
                }
            };
            xhr.send(null);
        }
        function handleError(error) {
            console.error("package error:", error);
        }
        var fetchedCallback = null;
        var fetched = Module["getPreloadedPackage"]
            ? Module["getPreloadedPackage"](
                  REMOTE_PACKAGE_NAME,
                  REMOTE_PACKAGE_SIZE
              )
            : null;
        if (!fetched) {
            var pkgPath = pathApi.join(
                __dirname,
                "..",
                "..",
                "data",
                REMOTE_PACKAGE_BASE
            );
            fetched = fsapi.readFileSync(pkgPath).buffer;
            // fetchRemotePackage(
            //     REMOTE_PACKAGE_NAME,
            //     REMOTE_PACKAGE_SIZE,
            //     function (data) {
            //         if (fetchedCallback) {
            //             fetchedCallback(data);
            //             fetchedCallback = null;
            //         } else {
            //             fetched = data;
            //         }
            //     },
            //     handleError,
            // );
        }
        function runWithFS() {
            function assert(check, msg) {
                if (!check) throw msg + new Error().stack;
            }
            Module["FS_createPath"]("/", "lib", true, true);
            Module["FS_createPath"]("/lib", "python3.8", true, true);
            Module["FS_createPath"](
                "/lib/python3.8",
                "site-packages",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages",
                "parso",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/parso",
                "pgen2",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/parso",
                "python",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages",
                "parso-0.8.2-py3.8.egg-info",
                true,
                true
            );
            function processPackageData(arrayBuffer) {
                assert(arrayBuffer, "Loading data file failed.");
                assert(
                    arrayBuffer instanceof ArrayBuffer,
                    "bad input to processPackageData"
                );
                var byteArray = new Uint8Array(arrayBuffer);
                var curr;
                var compressedData = {
                    data: null,
                    cachedOffset: 174939,
                    cachedIndexes: [-1, -1],
                    cachedChunks: [null, null],
                    offsets: [
                        0, 1475, 2966, 4137, 5332, 6610, 7966, 9257, 10531,
                        11531, 12596, 13822, 14967, 16004, 17450, 18741, 19889,
                        21238, 22269, 23071, 24269, 25338, 26466, 27952, 29252,
                        30501, 31757, 33208, 34472, 35848, 37005, 38199, 39350,
                        40388, 41561, 42593, 43854, 45220, 46341, 47685, 48877,
                        50111, 51288, 52341, 53560, 54662, 55724, 56881, 57951,
                        59083, 60232, 61342, 62418, 63775, 64731, 65908, 66986,
                        68127, 69171, 70254, 71437, 72513, 73576, 74749, 75926,
                        77027, 78039, 79135, 80148, 81040, 82145, 83081, 84018,
                        84985, 86109, 87065, 88170, 89250, 90507, 91670, 92889,
                        94149, 95116, 96197, 97328, 98275, 99344, 100463,
                        101569, 102485, 103088, 103712, 104793, 105682, 106569,
                        107509, 108645, 109934, 111132, 112485, 113701, 114889,
                        116117, 117209, 118413, 119828, 120781, 121714, 122722,
                        123720, 124748, 126100, 127452, 128682, 129801, 130768,
                        131882, 133045, 134363, 135446, 136437, 137576, 138696,
                        139828, 141012, 142153, 143211, 144324, 145347, 146634,
                        147691, 148991, 150349, 151627, 152856, 154235, 155655,
                        156825, 158174, 159617, 160467, 161677, 163054, 164486,
                        165423, 166686, 168051, 169212, 170436, 171679, 172788,
                        173982, 174745,
                    ],
                    sizes: [
                        1475, 1491, 1171, 1195, 1278, 1356, 1291, 1274, 1e3,
                        1065, 1226, 1145, 1037, 1446, 1291, 1148, 1349, 1031,
                        802, 1198, 1069, 1128, 1486, 1300, 1249, 1256, 1451,
                        1264, 1376, 1157, 1194, 1151, 1038, 1173, 1032, 1261,
                        1366, 1121, 1344, 1192, 1234, 1177, 1053, 1219, 1102,
                        1062, 1157, 1070, 1132, 1149, 1110, 1076, 1357, 956,
                        1177, 1078, 1141, 1044, 1083, 1183, 1076, 1063, 1173,
                        1177, 1101, 1012, 1096, 1013, 892, 1105, 936, 937, 967,
                        1124, 956, 1105, 1080, 1257, 1163, 1219, 1260, 967,
                        1081, 1131, 947, 1069, 1119, 1106, 916, 603, 624, 1081,
                        889, 887, 940, 1136, 1289, 1198, 1353, 1216, 1188, 1228,
                        1092, 1204, 1415, 953, 933, 1008, 998, 1028, 1352, 1352,
                        1230, 1119, 967, 1114, 1163, 1318, 1083, 991, 1139,
                        1120, 1132, 1184, 1141, 1058, 1113, 1023, 1287, 1057,
                        1300, 1358, 1278, 1229, 1379, 1420, 1170, 1349, 1443,
                        850, 1210, 1377, 1432, 937, 1263, 1365, 1161, 1224,
                        1243, 1109, 1194, 763, 194,
                    ],
                    successes: [
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1,
                    ],
                };
                compressedData["data"] = byteArray;
                assert(
                    typeof Module.LZ4 === "object",
                    "LZ4 not present - was your app build with  -s LZ4=1  ?"
                );
                Module.LZ4.loadPackage(
                    { metadata: metadata, compressedData: compressedData },
                    true
                );
                Module["removeRunDependency"]("datafile_parso.data");
            }
            Module["addRunDependency"]("datafile_parso.data");
            if (!Module.preloadResults) Module.preloadResults = {};
            Module.preloadResults[PACKAGE_NAME] = { fromCache: false };
            if (fetched) {
                processPackageData(fetched);
                fetched = null;
            } else {
                fetchedCallback = processPackageData;
            }
        }
        if (Module["calledRun"]) {
            runWithFS();
        } else {
            if (!Module["preRun"]) Module["preRun"] = [];
            Module["preRun"].push(runWithFS);
        }
    };
    loadPackage({
        files: [
            {
                filename: "/lib/python3.8/site-packages/parso/__init__.py",
                start: 0,
                end: 1607,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso/_compatibility.py",
                start: 1607,
                end: 1677,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/parso/cache.py",
                start: 1677,
                end: 10129,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/parso/file_io.py",
                start: 10129,
                end: 11152,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/parso/grammar.py",
                start: 11152,
                end: 21635,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/parso/normalizer.py",
                start: 21635,
                end: 27232,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/parso/parser.py",
                start: 27232,
                end: 34437,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/parso/tree.py",
                start: 34437,
                end: 46035,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/parso/utils.py",
                start: 46035,
                end: 52641,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso/pgen2/__init__.py",
                start: 52641,
                end: 53023,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso/pgen2/generator.py",
                start: 53023,
                end: 67593,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso/pgen2/grammar_parser.py",
                start: 67593,
                end: 73108,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso/python/__init__.py",
                start: 73108,
                end: 73108,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/parso/python/diff.py",
                start: 73108,
                end: 107314,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/parso/python/errors.py",
                start: 107314,
                end: 155317,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/parso/python/parser.py",
                start: 155317,
                end: 163544,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/parso/python/pep8.py",
                start: 163544,
                end: 197109,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/parso/python/prefix.py",
                start: 197109,
                end: 199568,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/parso/python/token.py",
                start: 199568,
                end: 200477,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso/python/tokenize.py",
                start: 200477,
                end: 226243,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/parso/python/tree.py",
                start: 226243,
                end: 262950,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso/python/grammar310.txt",
                start: 262950,
                end: 270558,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso/python/grammar36.txt",
                start: 270558,
                end: 277506,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso/python/grammar37.txt",
                start: 277506,
                end: 284310,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso/python/grammar38.txt",
                start: 284310,
                end: 291901,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso/python/grammar39.txt",
                start: 291901,
                end: 299497,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso-0.8.2-py3.8.egg-info/PKG-INFO",
                start: 299497,
                end: 308671,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso-0.8.2-py3.8.egg-info/SOURCES.txt",
                start: 308671,
                end: 311681,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso-0.8.2-py3.8.egg-info/dependency_links.txt",
                start: 311681,
                end: 311682,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso-0.8.2-py3.8.egg-info/requires.txt",
                start: 311682,
                end: 311745,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/parso-0.8.2-py3.8.egg-info/top_level.txt",
                start: 311745,
                end: 311751,
                audio: 0,
            },
        ],
        remote_package_size: 179035,
        package_uuid: "67a36b2d-a8d1-445b-bda6-56398e4889a6",
    });
})();
