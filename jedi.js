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
        var PACKAGE_NAME = "jedi.data";
        var REMOTE_PACKAGE_BASE = "jedi.data";
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
                "jedi",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi",
                "api",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/api",
                "refactoring",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi",
                "inference",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/inference",
                "compiled",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/inference/compiled",
                "subprocess",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/inference",
                "gradual",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/inference",
                "value",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi",
                "plugins",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi",
                "third_party",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party",
                "django-stubs",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs",
                "django-stubs",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs",
                "apps",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs",
                "conf",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/conf",
                "locale",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/conf",
                "urls",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs",
                "contrib",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib",
                "admin",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin",
                "templatetags",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin",
                "views",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib",
                "admindocs",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib",
                "auth",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth",
                "handlers",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth",
                "management",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/management",
                "commands",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib",
                "contenttypes",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/contenttypes",
                "management",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/contenttypes/management",
                "commands",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib",
                "flatpages",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/flatpages",
                "templatetags",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib",
                "gis",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/gis",
                "db",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/gis/db",
                "models",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib",
                "humanize",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/humanize",
                "templatetags",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib",
                "messages",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/messages",
                "storage",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib",
                "postgres",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres",
                "aggregates",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres",
                "fields",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib",
                "redirects",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib",
                "sessions",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions",
                "backends",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions",
                "management",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/management",
                "commands",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib",
                "sitemaps",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sitemaps",
                "management",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sitemaps/management",
                "commands",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib",
                "sites",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib",
                "staticfiles",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles",
                "management",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/management",
                "commands",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles",
                "templatetags",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib",
                "syndication",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs",
                "core",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core",
                "cache",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/cache",
                "backends",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core",
                "checks",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/checks",
                "security",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core",
                "files",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core",
                "handlers",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core",
                "mail",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/mail",
                "backends",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core",
                "management",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/management",
                "commands",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core",
                "serializers",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core",
                "servers",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs",
                "db",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db",
                "backends",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends",
                "base",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends",
                "dummy",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends",
                "mysql",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends",
                "postgresql",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends",
                "sqlite3",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db",
                "migrations",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations",
                "operations",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db",
                "models",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models",
                "fields",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models",
                "functions",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models",
                "sql",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs",
                "dispatch",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs",
                "forms",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs",
                "http",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs",
                "middleware",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs",
                "template",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template",
                "backends",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template",
                "loaders",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs",
                "templatetags",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs",
                "test",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs",
                "urls",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs",
                "utils",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils",
                "translation",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs",
                "views",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views",
                "decorators",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views",
                "generic",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party",
                "typeshed",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed",
                "stdlib",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib",
                "2",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2",
                "distutils",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2",
                "email",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email",
                "mime",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2",
                "encodings",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2",
                "multiprocessing",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/multiprocessing",
                "dummy",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2",
                "os",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib",
                "2and3",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3",
                "ctypes",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3",
                "curses",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3",
                "distutils",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils",
                "command",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3",
                "ensurepip",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3",
                "lib2to3",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/lib2to3",
                "pgen2",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3",
                "logging",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3",
                "pyexpat",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3",
                "sqlite3",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3",
                "wsgiref",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3",
                "xml",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml",
                "etree",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml",
                "parsers",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml/parsers",
                "expat",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml",
                "sax",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib",
                "3",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3",
                "asyncio",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3",
                "collections",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3",
                "concurrent",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/concurrent",
                "futures",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3",
                "email",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email",
                "mime",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3",
                "encodings",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3",
                "html",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3",
                "http",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3",
                "importlib",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3",
                "json",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3",
                "multiprocessing",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/multiprocessing",
                "dummy",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3",
                "os",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3",
                "tkinter",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3",
                "unittest",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3",
                "urllib",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib",
                "3.6",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib",
                "3.7",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed",
                "third_party",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party",
                "2",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2",
                "OpenSSL",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2",
                "concurrent",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/concurrent",
                "futures",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2",
                "fb303",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2",
                "kazoo",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/kazoo",
                "recipe",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2",
                "routes",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2",
                "scribe",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2",
                "six",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six",
                "moves",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves",
                "urllib",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2",
                "tornado",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party",
                "2and3",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "Crypto",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto",
                "Cipher",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto",
                "Hash",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto",
                "Protocol",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto",
                "PublicKey",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto",
                "Random",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Random",
                "Fortuna",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Random",
                "OSRNG",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto",
                "Signature",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto",
                "Util",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "atomicwrites",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "attr",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "backports",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "bleach",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "boto",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto",
                "ec2",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto",
                "elb",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto",
                "kms",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto",
                "s3",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "characteristic",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "click",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "cryptography",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography",
                "hazmat",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat",
                "backends",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat",
                "bindings",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/bindings",
                "openssl",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat",
                "primitives",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives",
                "asymmetric",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives",
                "ciphers",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives",
                "kdf",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives",
                "serialization",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives",
                "twofactor",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "dateutil",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/dateutil",
                "tz",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "flask",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask",
                "json",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "geoip2",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "google",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google",
                "protobuf",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf",
                "compiler",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf",
                "internal",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf",
                "util",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "jinja2",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "markupsafe",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "maxminddb",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "pymysql",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql",
                "constants",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "pynamodb",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pynamodb",
                "connection",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "pytz",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "redis",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "requests",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests",
                "packages",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages",
                "urllib3",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3",
                "contrib",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3",
                "packages",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/packages",
                "ssl_match_hostname",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3",
                "util",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "simplejson",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "werkzeug",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug",
                "contrib",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug",
                "debug",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug",
                "middleware",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3",
                "yaml",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party",
                "3",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3",
                "docutils",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/docutils",
                "parsers",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/docutils/parsers",
                "rst",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3",
                "jwt",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/jwt",
                "contrib",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/jwt/contrib",
                "algorithms",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3",
                "pkg_resources",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3",
                "six",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six",
                "moves",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves",
                "urllib",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3",
                "typed_ast",
                true,
                true
            );
            Module["FS_createPath"](
                "/lib/python3.8/site-packages",
                "jedi-0.18.0-py3.8.egg-info",
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
                    cachedOffset: 1848106,
                    cachedIndexes: [-1, -1],
                    cachedChunks: [null, null],
                    offsets: [
                        0, 1444, 2812, 4217, 5357, 6667, 7899, 9056, 10372,
                        11609, 12909, 14044, 15225, 16481, 17878, 19263, 20588,
                        21945, 23316, 24899, 26083, 27312, 28544, 29813, 30941,
                        32178, 33280, 34457, 35587, 36672, 37625, 38992, 40361,
                        41583, 42863, 44037, 44898, 46131, 47419, 48585, 49925,
                        51108, 52414, 53601, 54544, 55652, 56759, 57913, 59065,
                        60198, 61325, 62357, 63515, 64550, 65619, 66895, 68057,
                        69173, 70497, 71603, 72791, 74027, 75202, 76627, 77948,
                        79248, 80426, 81603, 83006, 84152, 85485, 86572, 87535,
                        88811, 90103, 91378, 92430, 93422, 94400, 95711, 96884,
                        98141, 99310, 100645, 101949, 103256, 104384, 105441,
                        106738, 107826, 108844, 110148, 111679, 112799, 114066,
                        115268, 116438, 117482, 118852, 119972, 121146, 122418,
                        123625, 124754, 125901, 127482, 128977, 130167, 131264,
                        132377, 133449, 134738, 135771, 137121, 138289, 139537,
                        140580, 141754, 142799, 144096, 145176, 146336, 147285,
                        148540, 149805, 150903, 151907, 152825, 154049, 155159,
                        156334, 157411, 158399, 159238, 160269, 161303, 162237,
                        163550, 165043, 166135, 167348, 168755, 170014, 171368,
                        172673, 173908, 175054, 176233, 177200, 178327, 179362,
                        180565, 181647, 183097, 184326, 185614, 186783, 187950,
                        189437, 190510, 191924, 193066, 194305, 195691, 196767,
                        197974, 198992, 200114, 201272, 202307, 203507, 204749,
                        205828, 207106, 208329, 209426, 210411, 211430, 212628,
                        213708, 214777, 215759, 216872, 218143, 219306, 220730,
                        221858, 222885, 224161, 225561, 226690, 227810, 229034,
                        230207, 231394, 232409, 233603, 234619, 235606, 236773,
                        237998, 238863, 240007, 241261, 242566, 243461, 244582,
                        245687, 247035, 248236, 249508, 250706, 251945, 253146,
                        254229, 255360, 256518, 257745, 258983, 260193, 261558,
                        262751, 263850, 265232, 266589, 267957, 269174, 270474,
                        271811, 273e3, 274072, 275101, 276250, 277451, 278573,
                        279725, 280963, 282180, 283528, 284538, 285617, 287027,
                        288441, 289630, 290562, 291505, 292523, 293599, 294543,
                        295525, 296595, 297835, 299219, 300432, 301687, 302795,
                        303914, 304958, 306086, 307368, 308636, 309845, 311181,
                        312428, 313830, 315096, 316265, 317439, 318575, 319651,
                        320837, 322061, 323202, 324375, 325620, 326778, 327828,
                        329093, 329960, 331041, 332166, 333146, 334152, 335410,
                        336406, 337406, 338654, 339665, 340899, 342134, 343083,
                        344124, 345177, 346291, 347445, 348382, 349445, 350507,
                        351633, 352717, 353932, 355032, 356312, 357704, 358888,
                        360021, 361046, 362151, 363250, 364272, 365436, 366598,
                        367628, 368622, 369769, 370919, 371807, 372924, 373930,
                        375163, 376236, 377566, 378591, 379654, 380696, 381792,
                        383040, 384290, 385218, 386360, 387440, 388557, 389790,
                        390833, 392022, 392969, 394081, 395437, 396564, 397720,
                        398878, 400137, 401188, 402452, 403585, 404705, 405879,
                        407094, 408265, 409515, 410679, 411783, 412862, 414022,
                        415336, 416455, 417422, 418574, 419527, 420664, 421956,
                        423179, 424455, 425543, 426768, 428147, 429182, 430360,
                        431589, 432641, 433794, 434811, 435972, 437100, 438363,
                        439923, 440813, 441824, 443065, 444513, 445992, 447304,
                        448569, 449255, 450767, 452161, 453570, 454727, 455833,
                        456874, 457715, 458743, 459523, 460605, 461797, 462827,
                        463607, 464533, 465410, 466234, 467219, 468207, 469018,
                        470189, 471384, 472367, 473425, 474318, 475420, 476457,
                        477591, 478622, 479675, 480821, 481902, 482836, 483828,
                        484755, 485839, 486853, 487747, 488653, 489619, 490632,
                        491716, 492706, 493754, 494827, 495899, 496924, 497865,
                        498775, 499735, 500703, 501065, 501911, 502832, 503704,
                        504769, 505750, 506728, 507809, 508661, 509737, 510779,
                        511898, 512957, 513985, 515003, 516035, 517056, 518099,
                        519117, 520111, 521179, 521953, 522980, 523812, 524602,
                        525341, 526440, 527364, 528246, 528839, 529827, 530938,
                        531944, 532869, 533774, 534933, 535943, 536878, 538040,
                        539113, 540119, 541222, 542349, 543406, 544441, 545151,
                        546290, 547230, 548111, 549151, 550074, 551185, 552270,
                        553181, 554165, 555181, 556032, 556910, 557851, 558919,
                        559811, 560769, 561667, 562651, 563575, 564569, 565457,
                        566517, 567511, 568485, 569376, 570195, 571243, 572349,
                        573511, 574443, 575467, 576348, 577244, 578190, 579026,
                        580043, 581077, 581980, 583083, 584187, 585193, 586305,
                        587314, 588236, 589070, 590138, 591244, 592385, 593525,
                        594546, 595482, 596158, 597012, 597676, 598680, 599693,
                        600710, 601863, 602594, 603481, 604452, 605391, 606462,
                        607565, 608482, 609545, 610563, 611301, 612215, 613267,
                        614241, 615419, 616420, 617432, 618486, 619422, 620399,
                        621334, 622314, 623291, 624234, 625143, 626154, 626733,
                        627392, 628015, 628580, 629238, 630218, 631258, 632140,
                        633257, 634229, 635143, 636127, 637080, 638037, 639162,
                        640071, 641037, 642149, 643213, 644294, 645368, 646389,
                        647427, 648271, 649137, 650158, 651167, 652193, 653311,
                        654283, 655339, 656066, 657073, 657884, 658700, 659579,
                        660489, 661375, 662264, 663232, 664339, 665376, 666394,
                        667366, 668194, 668911, 669744, 670674, 671774, 672542,
                        673413, 674543, 675372, 676388, 677461, 678400, 679193,
                        680237, 681398, 682384, 683467, 684562, 685604, 686518,
                        687559, 688643, 689720, 690792, 691845, 692737, 693752,
                        694723, 695372, 696288, 697307, 698394, 699479, 700570,
                        701645, 702799, 703919, 705119, 706252, 707214, 708331,
                        709338, 710443, 711569, 712483, 713504, 714618, 715627,
                        716365, 717109, 717991, 718910, 719892, 721315, 722685,
                        724072, 725385, 726890, 728442, 729687, 730600, 731458,
                        732362, 733396, 734428, 735292, 736383, 737356, 738030,
                        739153, 740225, 741188, 742009, 742787, 743547, 744313,
                        744950, 745826, 746608, 747274, 748195, 748993, 749788,
                        750576, 751278, 752135, 753008, 753777, 754621, 755523,
                        756407, 756974, 757796, 758934, 759817, 760466, 760848,
                        761462, 762511, 763187, 764116, 765058, 765965, 766822,
                        767746, 768662, 769524, 770556, 771710, 772561, 773696,
                        774816, 775324, 776338, 777423, 778310, 779272, 780423,
                        781665, 782843, 783958, 784927, 785587, 786657, 787351,
                        788321, 789291, 790078, 791252, 792365, 793229, 794317,
                        795398, 796512, 797355, 798729, 799805, 800645, 801748,
                        802899, 803515, 804041, 804877, 805609, 806672, 807730,
                        808601, 809502, 810573, 811549, 812434, 813309, 814297,
                        815257, 816331, 816986, 817795, 818781, 819785, 820333,
                        821248, 822238, 823277, 824355, 825411, 826361, 827351,
                        828179, 829024, 830081, 830929, 832028, 833346, 834563,
                        835721, 836520, 837286, 838506, 839674, 840715, 841824,
                        843023, 843959, 844984, 845733, 846686, 847546, 848697,
                        849700, 851070, 852084, 852593, 853106, 853761, 854597,
                        855589, 856788, 857511, 858618, 859670, 860565, 861341,
                        862372, 863321, 864599, 865629, 866314, 867250, 868218,
                        869247, 870169, 871021, 872089, 873025, 874058, 874769,
                        875809, 877084, 878282, 879423, 880349, 881256, 882208,
                        883033, 884208, 884977, 885957, 886806, 887739, 888139,
                        889063, 890095, 890959, 891829, 892577, 893264, 893917,
                        894838, 895816, 896646, 897591, 898571, 899680, 900583,
                        901365, 902192, 903160, 904068, 904964, 905536, 906735,
                        907620, 908747, 909744, 910801, 911625, 912488, 913453,
                        914339, 915397, 916380, 917499, 918446, 919209, 919998,
                        920664, 921399, 922067, 922916, 923692, 924304, 925211,
                        926034, 926766, 927531, 928359, 929226, 930075, 930888,
                        931681, 932592, 933461, 934019, 934783, 935958, 936801,
                        937541, 937942, 938414, 939389, 940135, 940756, 941792,
                        942689, 943545, 944494, 945533, 946219, 946991, 948040,
                        948996, 950056, 951115, 952123, 953091, 954179, 955072,
                        956026, 957010, 958151, 959319, 960264, 961150, 962180,
                        963217, 964232, 965050, 965784, 966381, 967094, 967857,
                        968842, 969627, 970045, 970608, 971067, 971845, 972633,
                        973097, 974152, 974881, 976049, 977068, 978007, 978945,
                        979876, 981044, 981976, 982818, 983690, 984298, 985369,
                        986158, 987212, 988165, 989083, 990197, 991148, 991923,
                        992830, 993967, 995021, 995627, 996677, 997485, 998562,
                        999395, 1000231, 1001221, 1002026, 1002912, 1003903,
                        1004839, 1005794, 1006828, 1007787, 1008694, 1009527,
                        1010444, 1011041, 1011933, 1012545, 1013286, 1014246,
                        1015052, 1015949, 1016848, 1017679, 1018669, 1019578,
                        1020434, 1021457, 1022178, 1023254, 1024254, 1025377,
                        1026548, 1027167, 1028213, 1029036, 1029961, 1031013,
                        1032083, 1033152, 1034063, 1034876, 1035556, 1036556,
                        1037621, 1038529, 1039530, 1040390, 1041561, 1042261,
                        1043263, 1044418, 1045414, 1046768, 1047705, 1048749,
                        1049698, 1050729, 1051739, 1052820, 1053731, 1054634,
                        1055710, 1056869, 1057895, 1059049, 1060086, 1061108,
                        1062106, 1063118, 1064034, 1064868, 1065873, 1066839,
                        1067893, 1068666, 1069363, 1070442, 1071510, 1072568,
                        1073684, 1074572, 1075147, 1076147, 1076906, 1077875,
                        1078740, 1079846, 1080505, 1081182, 1082122, 1083465,
                        1084377, 1085327, 1086219, 1087147, 1088326, 1089311,
                        1090302, 1091360, 1092368, 1093244, 1094154, 1095186,
                        1096178, 1097188, 1098146, 1098850, 1099584, 1100478,
                        1101436, 1102463, 1103507, 1104647, 1105843, 1107020,
                        1108186, 1108972, 1110314, 1111517, 1112519, 1113441,
                        1114437, 1115216, 1115819, 1116369, 1117311, 1118219,
                        1119154, 1120052, 1120819, 1121814, 1122860, 1123620,
                        1124528, 1125559, 1126591, 1127497, 1128564, 1129558,
                        1130760, 1131975, 1132383, 1133057, 1133942, 1134777,
                        1135138, 1135750, 1136237, 1137195, 1138208, 1138943,
                        1139897, 1140663, 1141643, 1142472, 1143585, 1144764,
                        1145635, 1146705, 1147575, 1148120, 1149279, 1150243,
                        1151261, 1152506, 1153517, 1154658, 1155945, 1156906,
                        1157579, 1158408, 1158997, 1160196, 1161254, 1162262,
                        1163070, 1163819, 1164824, 1165544, 1166520, 1167356,
                        1168541, 1169710, 1170966, 1172165, 1173381, 1174683,
                        1175912, 1176996, 1178181, 1179306, 1180224, 1181067,
                        1181914, 1182903, 1184003, 1185275, 1186394, 1187605,
                        1188596, 1189646, 1190679, 1191425, 1192440, 1193493,
                        1194633, 1195772, 1196697, 1197598, 1198604, 1199387,
                        1200584, 1201617, 1202552, 1203515, 1204710, 1205509,
                        1206282, 1207302, 1207911, 1208936, 1209690, 1210859,
                        1211674, 1212616, 1213513, 1214502, 1215424, 1216621,
                        1217515, 1218573, 1219754, 1220486, 1221111, 1222098,
                        1223256, 1223708, 1224523, 1225529, 1226505, 1227671,
                        1228658, 1229489, 1230406, 1231162, 1232260, 1232950,
                        1234065, 1235099, 1236256, 1236972, 1238028, 1239412,
                        1239913, 1240513, 1241117, 1241671, 1242306, 1242962,
                        1243554, 1244005, 1244573, 1245108, 1245563, 1246064,
                        1246513, 1247454, 1247907, 1248395, 1248914, 1249343,
                        1249858, 1250305, 1251196, 1252214, 1253623, 1254923,
                        1256010, 1257041, 1257687, 1258658, 1259567, 1260237,
                        1261462, 1262552, 1263857, 1264373, 1265273, 1266284,
                        1267155, 1268449, 1269313, 1270130, 1271052, 1271802,
                        1272507, 1273419, 1274560, 1275444, 1276412, 1277601,
                        1278638, 1279639, 1280755, 1281536, 1282420, 1282963,
                        1283661, 1284345, 1285321, 1286445, 1287344, 1288265,
                        1288779, 1289452, 1290189, 1290932, 1291695, 1292506,
                        1293569, 1294499, 1295363, 1296256, 1297249, 1298198,
                        1299214, 1300120, 1301068, 1302255, 1302661, 1303352,
                        1304312, 1305394, 1306334, 1307526, 1308374, 1309271,
                        1309991, 1311011, 1311927, 1312559, 1313742, 1314640,
                        1315372, 1316298, 1317255, 1318111, 1319019, 1319908,
                        1320917, 1321704, 1322482, 1323208, 1324016, 1324907,
                        1325692, 1326732, 1327921, 1329155, 1329893, 1330921,
                        1331785, 1332611, 1333692, 1334647, 1335803, 1336681,
                        1337713, 1338449, 1339609, 1340406, 1341348, 1342315,
                        1343131, 1344276, 1345311, 1346431, 1347553, 1348322,
                        1349267, 1350413, 1351519, 1352230, 1353200, 1354260,
                        1355371, 1356392, 1357588, 1358625, 1359814, 1361013,
                        1361860, 1362830, 1363800, 1364600, 1365325, 1366152,
                        1367008, 1367935, 1368832, 1369874, 1370696, 1371622,
                        1372414, 1373302, 1373949, 1374749, 1375526, 1376416,
                        1377228, 1378082, 1378884, 1379527, 1380334, 1381223,
                        1382116, 1383341, 1384116, 1384890, 1385572, 1386364,
                        1387466, 1388574, 1389148, 1389753, 1390432, 1391272,
                        1392025, 1392913, 1394002, 1394824, 1395808, 1396676,
                        1397731, 1398756, 1399606, 1400662, 1401668, 1402407,
                        1403123, 1404015, 1405165, 1406337, 1407478, 1408800,
                        1409900, 1410872, 1411979, 1412938, 1413664, 1414455,
                        1415290, 1416060, 1417092, 1417966, 1418873, 1419894,
                        1420995, 1421821, 1422755, 1423741, 1424644, 1425370,
                        1426288, 1426856, 1427166, 1427468, 1427888, 1428763,
                        1429621, 1430557, 1431496, 1432462, 1433741, 1434787,
                        1435828, 1436691, 1437449, 1438491, 1439228, 1440326,
                        1441393, 1442470, 1443532, 1444260, 1445178, 1446262,
                        1447273, 1448206, 1449067, 1450094, 1451068, 1452215,
                        1453228, 1454120, 1455127, 1455883, 1456681, 1457482,
                        1458665, 1459503, 1460354, 1461646, 1462781, 1463818,
                        1464952, 1465936, 1467034, 1468027, 1469220, 1470259,
                        1471504, 1472441, 1473004, 1473665, 1474418, 1474703,
                        1475681, 1476577, 1477598, 1478560, 1479421, 1480616,
                        1481960, 1482523, 1483463, 1484600, 1485623, 1486693,
                        1487200, 1487520, 1487859, 1488566, 1489283, 1490350,
                        1491306, 1492238, 1493028, 1493648, 1494608, 1495617,
                        1496751, 1497897, 1498858, 1499869, 1500423, 1501408,
                        1502334, 1503063, 1503633, 1504154, 1504892, 1505753,
                        1506724, 1507579, 1508585, 1509347, 1509850, 1510358,
                        1511237, 1511923, 1512709, 1513386, 1514147, 1515425,
                        1516645, 1517801, 1518790, 1519588, 1520489, 1521470,
                        1522378, 1523469, 1524086, 1524618, 1525181, 1526111,
                        1527056, 1528091, 1529130, 1529812, 1530864, 1531716,
                        1532512, 1533201, 1534215, 1535191, 1535867, 1536564,
                        1537433, 1538283, 1539176, 1540031, 1540801, 1541514,
                        1542223, 1542984, 1543759, 1544554, 1545406, 1546315,
                        1547183, 1547405, 1548155, 1548920, 1549525, 1550418,
                        1551320, 1551961, 1552658, 1553108, 1553713, 1554462,
                        1555093, 1555791, 1556776, 1557822, 1558612, 1559466,
                        1560131, 1561170, 1561628, 1562705, 1563626, 1564849,
                        1565783, 1566654, 1567538, 1568489, 1569369, 1570497,
                        1571520, 1572615, 1573739, 1574695, 1575819, 1576974,
                        1578106, 1578849, 1579816, 1580696, 1581684, 1582523,
                        1583303, 1584136, 1584943, 1585856, 1586562, 1587270,
                        1588079, 1588869, 1589629, 1590347, 1590982, 1591826,
                        1592716, 1593519, 1594067, 1594430, 1594838, 1595573,
                        1595949, 1596493, 1597167, 1597689, 1598079, 1598640,
                        1599374, 1600369, 1601606, 1602548, 1603570, 1604166,
                        1604596, 1605287, 1606016, 1606560, 1607094, 1607676,
                        1608567, 1609017, 1609504, 1610138, 1610727, 1611271,
                        1611885, 1612412, 1613012, 1613762, 1614629, 1615464,
                        1616308, 1616945, 1617649, 1618353, 1619046, 1619781,
                        1620529, 1621148, 1621705, 1622217, 1623052, 1623683,
                        1624304, 1624971, 1625475, 1626030, 1626718, 1627270,
                        1628028, 1628760, 1629500, 1630266, 1630858, 1631557,
                        1632298, 1632784, 1633463, 1634158, 1634661, 1635464,
                        1636261, 1637030, 1637610, 1638108, 1638682, 1639193,
                        1639881, 1640895, 1641643, 1642399, 1643235, 1644111,
                        1644999, 1645840, 1646445, 1646909, 1647550, 1648158,
                        1648734, 1649703, 1650790, 1651822, 1652737, 1653336,
                        1654364, 1655366, 1656161, 1657040, 1658026, 1658898,
                        1659939, 1660886, 1661906, 1662586, 1663554, 1664080,
                        1664798, 1665637, 1666700, 1667594, 1668637, 1669676,
                        1670499, 1671546, 1672443, 1673578, 1674766, 1675698,
                        1676720, 1677707, 1678886, 1680080, 1681355, 1682666,
                        1683918, 1685231, 1686548, 1687450, 1688251, 1689402,
                        1690402, 1691513, 1692295, 1693243, 1694332, 1695089,
                        1695632, 1696323, 1697173, 1697984, 1699015, 1700009,
                        1700897, 1701675, 1702501, 1703247, 1704237, 1705320,
                        1706134, 1707140, 1708229, 1709187, 1710081, 1711100,
                        1712117, 1713235, 1714216, 1715383, 1716380, 1717289,
                        1718512, 1719574, 1720644, 1721648, 1722536, 1723706,
                        1724678, 1725834, 1726985, 1728017, 1728903, 1729897,
                        1730935, 1731914, 1732844, 1733689, 1734424, 1735302,
                        1736142, 1737040, 1737849, 1738921, 1739734, 1740624,
                        1741565, 1742735, 1743621, 1744547, 1745502, 1746451,
                        1747304, 1748124, 1749069, 1750154, 1751097, 1752169,
                        1753168, 1753497, 1754429, 1755351, 1756631, 1757612,
                        1758715, 1759706, 1760531, 1761585, 1762541, 1763302,
                        1764009, 1764835, 1766010, 1766974, 1768021, 1769079,
                        1770171, 1771154, 1772075, 1773046, 1774100, 1774548,
                        1775364, 1776170, 1776636, 1777376, 1778176, 1778947,
                        1779912, 1780634, 1781376, 1782319, 1783125, 1783865,
                        1784654, 1785298, 1786582, 1787619, 1788615, 1789881,
                        1790746, 1791797, 1792723, 1793591, 1794420, 1795472,
                        1796583, 1797655, 1798822, 1799571, 1800357, 1801015,
                        1802266, 1803082, 1803981, 1804955, 1805893, 1806746,
                        1807559, 1808604, 1809782, 1810983, 1812103, 1813312,
                        1814419, 1815687, 1817058, 1818456, 1819704, 1821014,
                        1822382, 1823580, 1824378, 1824802, 1825173, 1825551,
                        1825925, 1826300, 1826650, 1827028, 1827407, 1827778,
                        1828143, 1828527, 1828912, 1829340, 1829711, 1830137,
                        1830560, 1831023, 1831486, 1831935, 1832380, 1832816,
                        1833237, 1833655, 1834062, 1834431, 1834846, 1835350,
                        1835834, 1836295, 1836746, 1837214, 1837654, 1838055,
                        1838484, 1838841, 1839263, 1839650, 1840021, 1840313,
                        1840707, 1841093, 1841486, 1841921, 1842331, 1842715,
                        1843062, 1843440, 1843842, 1844282, 1844646, 1845434,
                        1846061, 1846663, 1847427,
                    ],
                    sizes: [
                        1444, 1368, 1405, 1140, 1310, 1232, 1157, 1316, 1237,
                        1300, 1135, 1181, 1256, 1397, 1385, 1325, 1357, 1371,
                        1583, 1184, 1229, 1232, 1269, 1128, 1237, 1102, 1177,
                        1130, 1085, 953, 1367, 1369, 1222, 1280, 1174, 861,
                        1233, 1288, 1166, 1340, 1183, 1306, 1187, 943, 1108,
                        1107, 1154, 1152, 1133, 1127, 1032, 1158, 1035, 1069,
                        1276, 1162, 1116, 1324, 1106, 1188, 1236, 1175, 1425,
                        1321, 1300, 1178, 1177, 1403, 1146, 1333, 1087, 963,
                        1276, 1292, 1275, 1052, 992, 978, 1311, 1173, 1257,
                        1169, 1335, 1304, 1307, 1128, 1057, 1297, 1088, 1018,
                        1304, 1531, 1120, 1267, 1202, 1170, 1044, 1370, 1120,
                        1174, 1272, 1207, 1129, 1147, 1581, 1495, 1190, 1097,
                        1113, 1072, 1289, 1033, 1350, 1168, 1248, 1043, 1174,
                        1045, 1297, 1080, 1160, 949, 1255, 1265, 1098, 1004,
                        918, 1224, 1110, 1175, 1077, 988, 839, 1031, 1034, 934,
                        1313, 1493, 1092, 1213, 1407, 1259, 1354, 1305, 1235,
                        1146, 1179, 967, 1127, 1035, 1203, 1082, 1450, 1229,
                        1288, 1169, 1167, 1487, 1073, 1414, 1142, 1239, 1386,
                        1076, 1207, 1018, 1122, 1158, 1035, 1200, 1242, 1079,
                        1278, 1223, 1097, 985, 1019, 1198, 1080, 1069, 982,
                        1113, 1271, 1163, 1424, 1128, 1027, 1276, 1400, 1129,
                        1120, 1224, 1173, 1187, 1015, 1194, 1016, 987, 1167,
                        1225, 865, 1144, 1254, 1305, 895, 1121, 1105, 1348,
                        1201, 1272, 1198, 1239, 1201, 1083, 1131, 1158, 1227,
                        1238, 1210, 1365, 1193, 1099, 1382, 1357, 1368, 1217,
                        1300, 1337, 1189, 1072, 1029, 1149, 1201, 1122, 1152,
                        1238, 1217, 1348, 1010, 1079, 1410, 1414, 1189, 932,
                        943, 1018, 1076, 944, 982, 1070, 1240, 1384, 1213, 1255,
                        1108, 1119, 1044, 1128, 1282, 1268, 1209, 1336, 1247,
                        1402, 1266, 1169, 1174, 1136, 1076, 1186, 1224, 1141,
                        1173, 1245, 1158, 1050, 1265, 867, 1081, 1125, 980,
                        1006, 1258, 996, 1e3, 1248, 1011, 1234, 1235, 949, 1041,
                        1053, 1114, 1154, 937, 1063, 1062, 1126, 1084, 1215,
                        1100, 1280, 1392, 1184, 1133, 1025, 1105, 1099, 1022,
                        1164, 1162, 1030, 994, 1147, 1150, 888, 1117, 1006,
                        1233, 1073, 1330, 1025, 1063, 1042, 1096, 1248, 1250,
                        928, 1142, 1080, 1117, 1233, 1043, 1189, 947, 1112,
                        1356, 1127, 1156, 1158, 1259, 1051, 1264, 1133, 1120,
                        1174, 1215, 1171, 1250, 1164, 1104, 1079, 1160, 1314,
                        1119, 967, 1152, 953, 1137, 1292, 1223, 1276, 1088,
                        1225, 1379, 1035, 1178, 1229, 1052, 1153, 1017, 1161,
                        1128, 1263, 1560, 890, 1011, 1241, 1448, 1479, 1312,
                        1265, 686, 1512, 1394, 1409, 1157, 1106, 1041, 841,
                        1028, 780, 1082, 1192, 1030, 780, 926, 877, 824, 985,
                        988, 811, 1171, 1195, 983, 1058, 893, 1102, 1037, 1134,
                        1031, 1053, 1146, 1081, 934, 992, 927, 1084, 1014, 894,
                        906, 966, 1013, 1084, 990, 1048, 1073, 1072, 1025, 941,
                        910, 960, 968, 362, 846, 921, 872, 1065, 981, 978, 1081,
                        852, 1076, 1042, 1119, 1059, 1028, 1018, 1032, 1021,
                        1043, 1018, 994, 1068, 774, 1027, 832, 790, 739, 1099,
                        924, 882, 593, 988, 1111, 1006, 925, 905, 1159, 1010,
                        935, 1162, 1073, 1006, 1103, 1127, 1057, 1035, 710,
                        1139, 940, 881, 1040, 923, 1111, 1085, 911, 984, 1016,
                        851, 878, 941, 1068, 892, 958, 898, 984, 924, 994, 888,
                        1060, 994, 974, 891, 819, 1048, 1106, 1162, 932, 1024,
                        881, 896, 946, 836, 1017, 1034, 903, 1103, 1104, 1006,
                        1112, 1009, 922, 834, 1068, 1106, 1141, 1140, 1021, 936,
                        676, 854, 664, 1004, 1013, 1017, 1153, 731, 887, 971,
                        939, 1071, 1103, 917, 1063, 1018, 738, 914, 1052, 974,
                        1178, 1001, 1012, 1054, 936, 977, 935, 980, 977, 943,
                        909, 1011, 579, 659, 623, 565, 658, 980, 1040, 882,
                        1117, 972, 914, 984, 953, 957, 1125, 909, 966, 1112,
                        1064, 1081, 1074, 1021, 1038, 844, 866, 1021, 1009,
                        1026, 1118, 972, 1056, 727, 1007, 811, 816, 879, 910,
                        886, 889, 968, 1107, 1037, 1018, 972, 828, 717, 833,
                        930, 1100, 768, 871, 1130, 829, 1016, 1073, 939, 793,
                        1044, 1161, 986, 1083, 1095, 1042, 914, 1041, 1084,
                        1077, 1072, 1053, 892, 1015, 971, 649, 916, 1019, 1087,
                        1085, 1091, 1075, 1154, 1120, 1200, 1133, 962, 1117,
                        1007, 1105, 1126, 914, 1021, 1114, 1009, 738, 744, 882,
                        919, 982, 1423, 1370, 1387, 1313, 1505, 1552, 1245, 913,
                        858, 904, 1034, 1032, 864, 1091, 973, 674, 1123, 1072,
                        963, 821, 778, 760, 766, 637, 876, 782, 666, 921, 798,
                        795, 788, 702, 857, 873, 769, 844, 902, 884, 567, 822,
                        1138, 883, 649, 382, 614, 1049, 676, 929, 942, 907, 857,
                        924, 916, 862, 1032, 1154, 851, 1135, 1120, 508, 1014,
                        1085, 887, 962, 1151, 1242, 1178, 1115, 969, 660, 1070,
                        694, 970, 970, 787, 1174, 1113, 864, 1088, 1081, 1114,
                        843, 1374, 1076, 840, 1103, 1151, 616, 526, 836, 732,
                        1063, 1058, 871, 901, 1071, 976, 885, 875, 988, 960,
                        1074, 655, 809, 986, 1004, 548, 915, 990, 1039, 1078,
                        1056, 950, 990, 828, 845, 1057, 848, 1099, 1318, 1217,
                        1158, 799, 766, 1220, 1168, 1041, 1109, 1199, 936, 1025,
                        749, 953, 860, 1151, 1003, 1370, 1014, 509, 513, 655,
                        836, 992, 1199, 723, 1107, 1052, 895, 776, 1031, 949,
                        1278, 1030, 685, 936, 968, 1029, 922, 852, 1068, 936,
                        1033, 711, 1040, 1275, 1198, 1141, 926, 907, 952, 825,
                        1175, 769, 980, 849, 933, 400, 924, 1032, 864, 870, 748,
                        687, 653, 921, 978, 830, 945, 980, 1109, 903, 782, 827,
                        968, 908, 896, 572, 1199, 885, 1127, 997, 1057, 824,
                        863, 965, 886, 1058, 983, 1119, 947, 763, 789, 666, 735,
                        668, 849, 776, 612, 907, 823, 732, 765, 828, 867, 849,
                        813, 793, 911, 869, 558, 764, 1175, 843, 740, 401, 472,
                        975, 746, 621, 1036, 897, 856, 949, 1039, 686, 772,
                        1049, 956, 1060, 1059, 1008, 968, 1088, 893, 954, 984,
                        1141, 1168, 945, 886, 1030, 1037, 1015, 818, 734, 597,
                        713, 763, 985, 785, 418, 563, 459, 778, 788, 464, 1055,
                        729, 1168, 1019, 939, 938, 931, 1168, 932, 842, 872,
                        608, 1071, 789, 1054, 953, 918, 1114, 951, 775, 907,
                        1137, 1054, 606, 1050, 808, 1077, 833, 836, 990, 805,
                        886, 991, 936, 955, 1034, 959, 907, 833, 917, 597, 892,
                        612, 741, 960, 806, 897, 899, 831, 990, 909, 856, 1023,
                        721, 1076, 1e3, 1123, 1171, 619, 1046, 823, 925, 1052,
                        1070, 1069, 911, 813, 680, 1e3, 1065, 908, 1001, 860,
                        1171, 700, 1002, 1155, 996, 1354, 937, 1044, 949, 1031,
                        1010, 1081, 911, 903, 1076, 1159, 1026, 1154, 1037,
                        1022, 998, 1012, 916, 834, 1005, 966, 1054, 773, 697,
                        1079, 1068, 1058, 1116, 888, 575, 1e3, 759, 969, 865,
                        1106, 659, 677, 940, 1343, 912, 950, 892, 928, 1179,
                        985, 991, 1058, 1008, 876, 910, 1032, 992, 1010, 958,
                        704, 734, 894, 958, 1027, 1044, 1140, 1196, 1177, 1166,
                        786, 1342, 1203, 1002, 922, 996, 779, 603, 550, 942,
                        908, 935, 898, 767, 995, 1046, 760, 908, 1031, 1032,
                        906, 1067, 994, 1202, 1215, 408, 674, 885, 835, 361,
                        612, 487, 958, 1013, 735, 954, 766, 980, 829, 1113,
                        1179, 871, 1070, 870, 545, 1159, 964, 1018, 1245, 1011,
                        1141, 1287, 961, 673, 829, 589, 1199, 1058, 1008, 808,
                        749, 1005, 720, 976, 836, 1185, 1169, 1256, 1199, 1216,
                        1302, 1229, 1084, 1185, 1125, 918, 843, 847, 989, 1100,
                        1272, 1119, 1211, 991, 1050, 1033, 746, 1015, 1053,
                        1140, 1139, 925, 901, 1006, 783, 1197, 1033, 935, 963,
                        1195, 799, 773, 1020, 609, 1025, 754, 1169, 815, 942,
                        897, 989, 922, 1197, 894, 1058, 1181, 732, 625, 987,
                        1158, 452, 815, 1006, 976, 1166, 987, 831, 917, 756,
                        1098, 690, 1115, 1034, 1157, 716, 1056, 1384, 501, 600,
                        604, 554, 635, 656, 592, 451, 568, 535, 455, 501, 449,
                        941, 453, 488, 519, 429, 515, 447, 891, 1018, 1409,
                        1300, 1087, 1031, 646, 971, 909, 670, 1225, 1090, 1305,
                        516, 900, 1011, 871, 1294, 864, 817, 922, 750, 705, 912,
                        1141, 884, 968, 1189, 1037, 1001, 1116, 781, 884, 543,
                        698, 684, 976, 1124, 899, 921, 514, 673, 737, 743, 763,
                        811, 1063, 930, 864, 893, 993, 949, 1016, 906, 948,
                        1187, 406, 691, 960, 1082, 940, 1192, 848, 897, 720,
                        1020, 916, 632, 1183, 898, 732, 926, 957, 856, 908, 889,
                        1009, 787, 778, 726, 808, 891, 785, 1040, 1189, 1234,
                        738, 1028, 864, 826, 1081, 955, 1156, 878, 1032, 736,
                        1160, 797, 942, 967, 816, 1145, 1035, 1120, 1122, 769,
                        945, 1146, 1106, 711, 970, 1060, 1111, 1021, 1196, 1037,
                        1189, 1199, 847, 970, 970, 800, 725, 827, 856, 927, 897,
                        1042, 822, 926, 792, 888, 647, 800, 777, 890, 812, 854,
                        802, 643, 807, 889, 893, 1225, 775, 774, 682, 792, 1102,
                        1108, 574, 605, 679, 840, 753, 888, 1089, 822, 984, 868,
                        1055, 1025, 850, 1056, 1006, 739, 716, 892, 1150, 1172,
                        1141, 1322, 1100, 972, 1107, 959, 726, 791, 835, 770,
                        1032, 874, 907, 1021, 1101, 826, 934, 986, 903, 726,
                        918, 568, 310, 302, 420, 875, 858, 936, 939, 966, 1279,
                        1046, 1041, 863, 758, 1042, 737, 1098, 1067, 1077, 1062,
                        728, 918, 1084, 1011, 933, 861, 1027, 974, 1147, 1013,
                        892, 1007, 756, 798, 801, 1183, 838, 851, 1292, 1135,
                        1037, 1134, 984, 1098, 993, 1193, 1039, 1245, 937, 563,
                        661, 753, 285, 978, 896, 1021, 962, 861, 1195, 1344,
                        563, 940, 1137, 1023, 1070, 507, 320, 339, 707, 717,
                        1067, 956, 932, 790, 620, 960, 1009, 1134, 1146, 961,
                        1011, 554, 985, 926, 729, 570, 521, 738, 861, 971, 855,
                        1006, 762, 503, 508, 879, 686, 786, 677, 761, 1278,
                        1220, 1156, 989, 798, 901, 981, 908, 1091, 617, 532,
                        563, 930, 945, 1035, 1039, 682, 1052, 852, 796, 689,
                        1014, 976, 676, 697, 869, 850, 893, 855, 770, 713, 709,
                        761, 775, 795, 852, 909, 868, 222, 750, 765, 605, 893,
                        902, 641, 697, 450, 605, 749, 631, 698, 985, 1046, 790,
                        854, 665, 1039, 458, 1077, 921, 1223, 934, 871, 884,
                        951, 880, 1128, 1023, 1095, 1124, 956, 1124, 1155, 1132,
                        743, 967, 880, 988, 839, 780, 833, 807, 913, 706, 708,
                        809, 790, 760, 718, 635, 844, 890, 803, 548, 363, 408,
                        735, 376, 544, 674, 522, 390, 561, 734, 995, 1237, 942,
                        1022, 596, 430, 691, 729, 544, 534, 582, 891, 450, 487,
                        634, 589, 544, 614, 527, 600, 750, 867, 835, 844, 637,
                        704, 704, 693, 735, 748, 619, 557, 512, 835, 631, 621,
                        667, 504, 555, 688, 552, 758, 732, 740, 766, 592, 699,
                        741, 486, 679, 695, 503, 803, 797, 769, 580, 498, 574,
                        511, 688, 1014, 748, 756, 836, 876, 888, 841, 605, 464,
                        641, 608, 576, 969, 1087, 1032, 915, 599, 1028, 1002,
                        795, 879, 986, 872, 1041, 947, 1020, 680, 968, 526, 718,
                        839, 1063, 894, 1043, 1039, 823, 1047, 897, 1135, 1188,
                        932, 1022, 987, 1179, 1194, 1275, 1311, 1252, 1313,
                        1317, 902, 801, 1151, 1e3, 1111, 782, 948, 1089, 757,
                        543, 691, 850, 811, 1031, 994, 888, 778, 826, 746, 990,
                        1083, 814, 1006, 1089, 958, 894, 1019, 1017, 1118, 981,
                        1167, 997, 909, 1223, 1062, 1070, 1004, 888, 1170, 972,
                        1156, 1151, 1032, 886, 994, 1038, 979, 930, 845, 735,
                        878, 840, 898, 809, 1072, 813, 890, 941, 1170, 886, 926,
                        955, 949, 853, 820, 945, 1085, 943, 1072, 999, 329, 932,
                        922, 1280, 981, 1103, 991, 825, 1054, 956, 761, 707,
                        826, 1175, 964, 1047, 1058, 1092, 983, 921, 971, 1054,
                        448, 816, 806, 466, 740, 800, 771, 965, 722, 742, 943,
                        806, 740, 789, 644, 1284, 1037, 996, 1266, 865, 1051,
                        926, 868, 829, 1052, 1111, 1072, 1167, 749, 786, 658,
                        1251, 816, 899, 974, 938, 853, 813, 1045, 1178, 1201,
                        1120, 1209, 1107, 1268, 1371, 1398, 1248, 1310, 1368,
                        1198, 798, 424, 371, 378, 374, 375, 350, 378, 379, 371,
                        365, 384, 385, 428, 371, 426, 423, 463, 463, 449, 445,
                        436, 421, 418, 407, 369, 415, 504, 484, 461, 451, 468,
                        440, 401, 429, 357, 422, 387, 371, 292, 394, 386, 393,
                        435, 410, 384, 347, 378, 402, 440, 364, 788, 627, 602,
                        764, 679,
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
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
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
                Module["removeRunDependency"]("datafile_jedi.data");
            }
            Module["addRunDependency"]("datafile_jedi.data");
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
                filename: "/lib/python3.8/site-packages/jedi/__init__.py",
                start: 0,
                end: 1486,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/__main__.py",
                start: 1486,
                end: 3436,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/_compatibility.py",
                start: 3436,
                end: 4866,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/cache.py",
                start: 4866,
                end: 8540,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/common.py",
                start: 8540,
                end: 9208,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/debug.py",
                start: 9208,
                end: 12772,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/file_io.py",
                start: 12772,
                end: 15109,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/parser_utils.py",
                start: 15109,
                end: 25562,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/settings.py",
                start: 25562,
                end: 29088,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/utils.py",
                start: 29088,
                end: 33792,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/api/__init__.py",
                start: 33792,
                end: 64936,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/api/classes.py",
                start: 64936,
                end: 94417,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/api/completion.py",
                start: 94417,
                end: 121310,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/api/completion_cache.py",
                start: 121310,
                end: 122264,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/api/environment.py",
                start: 122264,
                end: 139212,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/api/errors.py",
                start: 139212,
                end: 140465,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/api/exceptions.py",
                start: 140465,
                end: 141456,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/api/file_name.py",
                start: 141456,
                end: 147076,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/api/helpers.py",
                start: 147076,
                end: 166079,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/api/interpreter.py",
                start: 166079,
                end: 168494,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/api/keywords.py",
                start: 168494,
                end: 169777,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/api/project.py",
                start: 169777,
                end: 186369,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/api/replstartup.py",
                start: 186369,
                end: 187319,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/api/strings.py",
                start: 187319,
                end: 190935,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/api/refactoring/__init__.py",
                start: 190935,
                end: 199728,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/api/refactoring/extract.py",
                start: 199728,
                end: 213661,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/__init__.py",
                start: 213661,
                end: 222160,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/analysis.py",
                start: 222160,
                end: 229923,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/arguments.py",
                start: 229923,
                end: 242141,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/base_value.py",
                start: 242141,
                end: 260388,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/cache.py",
                start: 260388,
                end: 264579,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/context.py",
                start: 264579,
                end: 281613,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/docstrings.py",
                start: 281613,
                end: 292009,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/dynamic_params.py",
                start: 292009,
                end: 300131,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/filters.py",
                start: 300131,
                end: 311329,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/finder.py",
                start: 311329,
                end: 316655,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/flow_analysis.py",
                start: 316655,
                end: 321238,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/helpers.py",
                start: 321238,
                end: 327181,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/imports.py",
                start: 327181,
                end: 350521,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/lazy_value.py",
                start: 350521,
                end: 352188,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/names.py",
                start: 352188,
                end: 375001,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/param.py",
                start: 375001,
                end: 385451,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/parser_cache.py",
                start: 385451,
                end: 385642,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/recursion.py",
                start: 385642,
                end: 390573,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/references.py",
                start: 390573,
                end: 400842,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/signature.py",
                start: 400842,
                end: 405701,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/star_args.py",
                start: 405701,
                end: 413287,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/syntax_tree.py",
                start: 413287,
                end: 448212,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/sys_path.py",
                start: 448212,
                end: 458452,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/utils.py",
                start: 458452,
                end: 461158,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/compiled/__init__.py",
                start: 461158,
                end: 463809,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/compiled/access.py",
                start: 463809,
                end: 481385,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/compiled/getattr_static.py",
                start: 481385,
                end: 485247,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/compiled/mixed.py",
                start: 485247,
                end: 496591,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/compiled/value.py",
                start: 496591,
                end: 517225,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/compiled/subprocess/__init__.py",
                start: 517225,
                end: 530690,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/compiled/subprocess/__main__.py",
                start: 530690,
                end: 531857,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/compiled/subprocess/functions.py",
                start: 531857,
                end: 539657,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/gradual/__init__.py",
                start: 539657,
                end: 539800,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/gradual/annotation.py",
                start: 539800,
                end: 554868,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/gradual/base.py",
                start: 554868,
                end: 570290,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/gradual/conversion.py",
                start: 570290,
                end: 577891,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/gradual/generics.py",
                start: 577891,
                end: 581035,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/gradual/stub_value.py",
                start: 581035,
                end: 584364,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/gradual/type_var.py",
                start: 584364,
                end: 588468,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/gradual/typeshed.py",
                start: 588468,
                end: 599992,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/gradual/typing.py",
                start: 599992,
                end: 617070,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/gradual/utils.py",
                start: 617070,
                end: 618217,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/value/__init__.py",
                start: 618217,
                end: 618633,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/value/decorator.py",
                start: 618633,
                end: 619278,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/value/dynamic_arrays.py",
                start: 619278,
                end: 626804,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/value/function.py",
                start: 626804,
                end: 644123,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/value/instance.py",
                start: 644123,
                end: 666750,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/value/iterable.py",
                start: 666750,
                end: 689966,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/value/klass.py",
                start: 689966,
                end: 706703,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/value/module.py",
                start: 706703,
                end: 714843,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/inference/value/namespace.py",
                start: 714843,
                end: 717035,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/plugins/__init__.py",
                start: 717035,
                end: 718480,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/plugins/django.py",
                start: 718480,
                end: 729375,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/plugins/flask.py",
                start: 729375,
                end: 730291,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/plugins/pytest.py",
                start: 730291,
                end: 736309,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/plugins/registry.py",
                start: 736309,
                end: 736616,
                audio: 0,
            },
            {
                filename: "/lib/python3.8/site-packages/jedi/plugins/stdlib.py",
                start: 736616,
                end: 766533,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/LICENSE.txt",
                start: 766533,
                end: 767608,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/__init__.pyi",
                start: 767608,
                end: 768040,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/shortcuts.pyi",
                start: 768040,
                end: 770012,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/apps/__init__.pyi",
                start: 770012,
                end: 770091,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/apps/config.pyi",
                start: 770091,
                end: 770925,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/apps/registry.pyi",
                start: 770925,
                end: 772975,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/conf/__init__.pyi",
                start: 772975,
                end: 773874,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/conf/global_settings.pyi",
                start: 773874,
                end: 791336,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/conf/locale/__init__.pyi",
                start: 791336,
                end: 791398,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/conf/urls/__init__.pyi",
                start: 791398,
                end: 792431,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/conf/urls/i18n.pyi",
                start: 792431,
                end: 792728,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/conf/urls/static.pyi",
                start: 792728,
                end: 792900,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/__init__.pyi",
                start: 792900,
                end: 792900,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/__init__.pyi",
                start: 792900,
                end: 793781,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/actions.pyi",
                start: 793781,
                end: 794132,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/apps.pyi",
                start: 794132,
                end: 794274,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/checks.pyi",
                start: 794274,
                end: 795123,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/decorators.pyi",
                start: 795123,
                end: 795293,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/filters.pyi",
                start: 795293,
                end: 798780,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/forms.pyi",
                start: 798780,
                end: 799029,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/helpers.pyi",
                start: 799029,
                end: 803819,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/models.pyi",
                start: 803819,
                end: 805039,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/options.pyi",
                start: 805039,
                end: 818867,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/sites.pyi",
                start: 818867,
                end: 822155,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/tests.pyi",
                start: 822155,
                end: 823572,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/utils.pyi",
                start: 823572,
                end: 826679,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/widgets.pyi",
                start: 826679,
                end: 830054,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/templatetags/__init__.pyi",
                start: 830054,
                end: 830054,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/templatetags/admin_list.pyi",
                start: 830054,
                end: 832082,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/templatetags/admin_modify.pyi",
                start: 832082,
                end: 832772,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/templatetags/admin_static.pyi",
                start: 832772,
                end: 832845,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/templatetags/admin_urls.pyi",
                start: 832845,
                end: 833392,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/templatetags/base.pyi",
                start: 833392,
                end: 833984,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/templatetags/log.pyi",
                start: 833984,
                end: 834438,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/views/__init__.pyi",
                start: 834438,
                end: 834438,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/views/autocomplete.pyi",
                start: 834438,
                end: 834787,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/views/decorators.pyi",
                start: 834787,
                end: 835122,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admin/views/main.pyi",
                start: 835122,
                end: 838512,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admindocs/__init__.pyi",
                start: 838512,
                end: 838512,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admindocs/middleware.pyi",
                start: 838512,
                end: 838921,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admindocs/urls.pyi",
                start: 838921,
                end: 838980,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admindocs/utils.pyi",
                start: 838980,
                end: 839705,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/admindocs/views.pyi",
                start: 839705,
                end: 840557,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/__init__.pyi",
                start: 840557,
                end: 841873,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/admin.pyi",
                start: 841873,
                end: 842400,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/apps.pyi",
                start: 842400,
                end: 842468,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/backends.pyi",
                start: 842468,
                end: 844073,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/base_user.pyi",
                start: 844073,
                end: 845566,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/checks.pyi",
                start: 845566,
                end: 845937,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/context_processors.pyi",
                start: 845937,
                end: 846554,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/decorators.pyi",
                start: 846554,
                end: 847536,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/forms.pyi",
                start: 847536,
                end: 850685,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/hashers.pyi",
                start: 850685,
                end: 852654,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/middleware.pyi",
                start: 852654,
                end: 853428,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/mixins.pyi",
                start: 853428,
                end: 854578,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/models.pyi",
                start: 854578,
                end: 859219,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/password_validation.pyi",
                start: 859219,
                end: 861271,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/signals.pyi",
                start: 861271,
                end: 861391,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/tokens.pyi",
                start: 861391,
                end: 861752,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/urls.pyi",
                start: 861752,
                end: 861811,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/validators.pyi",
                start: 861811,
                end: 861971,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/views.pyi",
                start: 861971,
                end: 864449,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/handlers/__init__.pyi",
                start: 864449,
                end: 864449,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/handlers/modwsgi.pyi",
                start: 864449,
                end: 864653,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/management/__init__.pyi",
                start: 864653,
                end: 865037,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/management/commands/__init__.pyi",
                start: 865037,
                end: 865037,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/management/commands/changepassword.pyi",
                start: 865037,
                end: 865162,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/auth/management/commands/createsuperuser.pyi",
                start: 865162,
                end: 865370,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/contenttypes/__init__.pyi",
                start: 865370,
                end: 865370,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/contenttypes/admin.pyi",
                start: 865370,
                end: 865956,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/contenttypes/apps.pyi",
                start: 865956,
                end: 866032,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/contenttypes/checks.pyi",
                start: 866032,
                end: 866350,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/contenttypes/fields.pyi",
                start: 866350,
                end: 870447,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/contenttypes/forms.pyi",
                start: 870447,
                end: 871606,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/contenttypes/models.pyi",
                start: 871606,
                end: 872691,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/contenttypes/views.pyi",
                start: 872691,
                end: 872948,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/contenttypes/management/__init__.pyi",
                start: 872948,
                end: 874298,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/contenttypes/management/commands/__init__.pyi",
                start: 874298,
                end: 874298,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/contenttypes/management/commands/remove_stale_contenttypes.pyi",
                start: 874298,
                end: 874709,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/flatpages/__init__.pyi",
                start: 874709,
                end: 874709,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/flatpages/forms.pyi",
                start: 874709,
                end: 874851,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/flatpages/middleware.pyi",
                start: 874851,
                end: 875150,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/flatpages/models.pyi",
                start: 875150,
                end: 875595,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/flatpages/sitemaps.pyi",
                start: 875595,
                end: 875676,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/flatpages/urls.pyi",
                start: 875676,
                end: 875735,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/flatpages/views.pyi",
                start: 875735,
                end: 876050,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/flatpages/templatetags/__init__.pyi",
                start: 876050,
                end: 876050,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/flatpages/templatetags/flatpages.pyi",
                start: 876050,
                end: 876568,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/gis/__init__.pyi",
                start: 876568,
                end: 876568,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/gis/db/__init__.pyi",
                start: 876568,
                end: 876568,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/gis/db/models/__init__.pyi",
                start: 876568,
                end: 876986,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/gis/db/models/fields.pyi",
                start: 876986,
                end: 880119,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/humanize/__init__.pyi",
                start: 880119,
                end: 880119,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/humanize/templatetags/__init__.pyi",
                start: 880119,
                end: 880119,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/humanize/templatetags/humanize.pyi",
                start: 880119,
                end: 880738,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/messages/__init__.pyi",
                start: 880738,
                end: 881262,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/messages/api.pyi",
                start: 881262,
                end: 882431,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/messages/constants.pyi",
                start: 882431,
                end: 882618,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/messages/context_processors.pyi",
                start: 882618,
                end: 882867,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/messages/middleware.pyi",
                start: 882867,
                end: 883216,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/messages/utils.pyi",
                start: 883216,
                end: 883285,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/messages/views.pyi",
                start: 883285,
                end: 883593,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/messages/storage/__init__.pyi",
                start: 883593,
                end: 883795,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/messages/storage/base.pyi",
                start: 883795,
                end: 884702,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/messages/storage/cookie.pyi",
                start: 884702,
                end: 885189,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/messages/storage/fallback.pyi",
                start: 885189,
                end: 885429,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/messages/storage/session.pyi",
                start: 885429,
                end: 885911,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/__init__.pyi",
                start: 885911,
                end: 885911,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/constraints.pyi",
                start: 885911,
                end: 886487,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/functions.pyi",
                start: 886487,
                end: 886582,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/indexes.pyi",
                start: 886582,
                end: 888854,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/lookups.pyi",
                start: 888854,
                end: 889433,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/operations.pyi",
                start: 889433,
                end: 890168,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/search.pyi",
                start: 890168,
                end: 892363,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/signals.pyi",
                start: 892363,
                end: 892600,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/validators.pyi",
                start: 892600,
                end: 893253,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/aggregates/__init__.pyi",
                start: 893253,
                end: 893793,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/aggregates/general.pyi",
                start: 893793,
                end: 894131,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/aggregates/mixins.pyi",
                start: 894131,
                end: 894160,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/aggregates/statistics.pyi",
                start: 894160,
                end: 894630,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/fields/__init__.pyi",
                start: 894630,
                end: 895325,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/fields/array.pyi",
                start: 895325,
                end: 897054,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/fields/citext.pyi",
                start: 897054,
                end: 897270,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/fields/hstore.pyi",
                start: 897270,
                end: 897789,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/fields/jsonb.pyi",
                start: 897789,
                end: 898800,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/fields/mixins.pyi",
                start: 898800,
                end: 898913,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/postgres/fields/ranges.pyi",
                start: 898913,
                end: 900255,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/redirects/__init__.pyi",
                start: 900255,
                end: 900255,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/redirects/middleware.pyi",
                start: 900255,
                end: 900646,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/redirects/models.pyi",
                start: 900646,
                end: 900814,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/__init__.pyi",
                start: 900814,
                end: 900814,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/base_session.pyi",
                start: 900814,
                end: 901479,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/exceptions.pyi",
                start: 901479,
                end: 901635,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/middleware.pyi",
                start: 901635,
                end: 902113,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/models.pyi",
                start: 902113,
                end: 902289,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/serializers.pyi",
                start: 902289,
                end: 902600,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/backends/__init__.pyi",
                start: 902600,
                end: 902600,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/backends/base.pyi",
                start: 902600,
                end: 904127,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/backends/cache.pyi",
                start: 904127,
                end: 904426,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/backends/cached_db.pyi",
                start: 904426,
                end: 904731,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/backends/db.pyi",
                start: 904731,
                end: 905308,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/backends/file.pyi",
                start: 905308,
                end: 905591,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/backends/signed_cookies.pyi",
                start: 905591,
                end: 905691,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/management/__init__.pyi",
                start: 905691,
                end: 905691,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/management/commands/__init__.pyi",
                start: 905691,
                end: 905691,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sessions/management/commands/clearsessions.pyi",
                start: 905691,
                end: 905776,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sitemaps/__init__.pyi",
                start: 905776,
                end: 907335,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sitemaps/views.pyi",
                start: 907335,
                end: 908097,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sitemaps/management/__init__.pyi",
                start: 908097,
                end: 908097,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sitemaps/management/commands/__init__.pyi",
                start: 908097,
                end: 908097,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sitemaps/management/commands/ping_google.pyi",
                start: 908097,
                end: 908182,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sites/__init__.pyi",
                start: 908182,
                end: 908182,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sites/apps.pyi",
                start: 908182,
                end: 908251,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sites/management.pyi",
                start: 908251,
                end: 908539,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sites/managers.pyi",
                start: 908539,
                end: 908709,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sites/middleware.pyi",
                start: 908709,
                end: 908918,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sites/models.pyi",
                start: 908918,
                end: 909532,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sites/requests.pyi",
                start: 909532,
                end: 909830,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/sites/shortcuts.pyi",
                start: 909830,
                end: 910096,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/__init__.pyi",
                start: 910096,
                end: 910096,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/apps.pyi",
                start: 910096,
                end: 910222,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/checks.pyi",
                start: 910222,
                end: 910464,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/finders.pyi",
                start: 910464,
                end: 912179,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/handlers.pyi",
                start: 912179,
                end: 912596,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/storage.pyi",
                start: 912596,
                end: 914858,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/testing.pyi",
                start: 914858,
                end: 914958,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/urls.pyi",
                start: 914958,
                end: 915156,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/utils.pyi",
                start: 915156,
                end: 915594,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/views.pyi",
                start: 915594,
                end: 915816,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/management/__init__.pyi",
                start: 915816,
                end: 915816,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/management/commands/__init__.pyi",
                start: 915816,
                end: 915816,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/management/commands/collectstatic.pyi",
                start: 915816,
                end: 916941,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/management/commands/findstatic.pyi",
                start: 916941,
                end: 917028,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/management/commands/runserver.pyi",
                start: 917028,
                end: 917164,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/templatetags/__init__.pyi",
                start: 917164,
                end: 917164,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/staticfiles/templatetags/staticfiles.pyi",
                start: 917164,
                end: 917398,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/syndication/__init__.pyi",
                start: 917398,
                end: 917398,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/contrib/syndication/views.pyi",
                start: 917398,
                end: 918649,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/__init__.pyi",
                start: 918649,
                end: 918649,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/exceptions.pyi",
                start: 918649,
                end: 920192,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/paginator.pyi",
                start: 920192,
                end: 922088,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/signals.pyi",
                start: 922088,
                end: 922251,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/signing.pyi",
                start: 922251,
                end: 923718,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/validators.pyi",
                start: 923718,
                end: 927652,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/wsgi.pyi",
                start: 927652,
                end: 927750,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/cache/__init__.pyi",
                start: 927750,
                end: 928467,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/cache/utils.pyi",
                start: 928467,
                end: 928651,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/cache/backends/__init__.pyi",
                start: 928651,
                end: 928651,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/cache/backends/base.pyi",
                start: 928651,
                end: 930978,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/cache/backends/db.pyi",
                start: 930978,
                end: 931573,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/cache/backends/dummy.pyi",
                start: 931573,
                end: 931755,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/cache/backends/filebased.pyi",
                start: 931755,
                end: 931971,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/cache/backends/locmem.pyi",
                start: 931971,
                end: 932157,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/cache/backends/memcached.pyi",
                start: 932157,
                end: 932509,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/checks/__init__.pyi",
                start: 932509,
                end: 932939,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/checks/caches.pyi",
                start: 932939,
                end: 933206,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/checks/database.pyi",
                start: 933206,
                end: 933309,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/checks/messages.pyi",
                start: 933309,
                end: 934234,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/checks/model_checks.pyi",
                start: 934234,
                end: 934592,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/checks/registry.pyi",
                start: 934592,
                end: 935804,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/checks/templates.pyi",
                start: 935804,
                end: 936195,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/checks/translation.pyi",
                start: 936195,
                end: 936350,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/checks/urls.pyi",
                start: 936350,
                end: 937130,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/checks/security/__init__.pyi",
                start: 937130,
                end: 937130,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/checks/security/base.pyi",
                start: 937130,
                end: 938722,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/checks/security/csrf.pyi",
                start: 938722,
                end: 939101,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/checks/security/sessions.pyi",
                start: 939101,
                end: 939628,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/files/__init__.pyi",
                start: 939628,
                end: 939696,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/files/base.pyi",
                start: 939696,
                end: 941131,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/files/images.pyi",
                start: 941131,
                end: 941440,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/files/locks.pyi",
                start: 941440,
                end: 941748,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/files/move.pyi",
                start: 941748,
                end: 941878,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/files/storage.pyi",
                start: 941878,
                end: 943647,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/files/temp.pyi",
                start: 943647,
                end: 943747,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/files/uploadedfile.pyi",
                start: 943747,
                end: 945233,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/files/uploadhandler.pyi",
                start: 945233,
                end: 948428,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/files/utils.pyi",
                start: 948428,
                end: 948975,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/handlers/__init__.pyi",
                start: 948975,
                end: 948975,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/handlers/base.pyi",
                start: 948975,
                end: 949547,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/handlers/exception.pyi",
                start: 949547,
                end: 950117,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/handlers/wsgi.pyi",
                start: 950117,
                end: 951442,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/mail/__init__.pyi",
                start: 951442,
                end: 952946,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/mail/message.pyi",
                start: 952946,
                end: 957040,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/mail/utils.pyi",
                start: 957040,
                end: 957135,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/mail/backends/__init__.pyi",
                start: 957135,
                end: 957135,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/mail/backends/base.pyi",
                start: 957135,
                end: 957739,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/mail/backends/console.pyi",
                start: 957739,
                end: 957842,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/mail/backends/dummy.pyi",
                start: 957842,
                end: 957945,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/mail/backends/filebased.pyi",
                start: 957945,
                end: 958048,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/mail/backends/locmem.pyi",
                start: 958048,
                end: 958151,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/mail/backends/smtp.pyi",
                start: 958151,
                end: 958661,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/management/__init__.pyi",
                start: 958661,
                end: 959502,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/management/base.pyi",
                start: 959502,
                end: 962424,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/management/color.pyi",
                start: 962424,
                end: 963476,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/management/sql.pyi",
                start: 963476,
                end: 963905,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/management/templates.pyi",
                start: 963905,
                end: 964529,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/management/utils.pyi",
                start: 964529,
                end: 965056,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/management/commands/__init__.pyi",
                start: 965056,
                end: 965056,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/management/commands/dumpdata.pyi",
                start: 965056,
                end: 965179,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/management/commands/loaddata.pyi",
                start: 965179,
                end: 965804,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/management/commands/makemessages.pyi",
                start: 965804,
                end: 966938,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/management/commands/runserver.pyi",
                start: 966938,
                end: 967132,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/management/commands/testserver.pyi",
                start: 967132,
                end: 967217,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/serializers/__init__.pyi",
                start: 967217,
                end: 968594,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/serializers/base.pyi",
                start: 968594,
                end: 971982,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/serializers/json.pyi",
                start: 971982,
                end: 972404,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/serializers/python.pyi",
                start: 972404,
                end: 972939,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/servers/__init__.pyi",
                start: 972939,
                end: 972939,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/core/servers/basehttp.pyi",
                start: 972939,
                end: 974240,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/__init__.pyi",
                start: 974240,
                end: 975176,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/transaction.pyi",
                start: 975176,
                end: 977208,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/utils.pyi",
                start: 977208,
                end: 978452,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/__init__.pyi",
                start: 978452,
                end: 978452,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/ddl_references.pyi",
                start: 978452,
                end: 981109,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/signals.pyi",
                start: 981109,
                end: 981178,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/utils.pyi",
                start: 981178,
                end: 983013,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/base/__init__.pyi",
                start: 983013,
                end: 983013,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/base/base.pyi",
                start: 983013,
                end: 987361,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/base/client.pyi",
                start: 987361,
                end: 987635,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/base/creation.pyi",
                start: 987635,
                end: 988738,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/base/features.pyi",
                start: 988738,
                end: 992982,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/base/introspection.pyi",
                start: 992982,
                end: 994472,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/base/operations.pyi",
                start: 994472,
                end: 1000709,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/base/schema.pyi",
                start: 1000709,
                end: 1004055,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/base/validation.pyi",
                start: 1004055,
                end: 1004441,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/dummy/__init__.pyi",
                start: 1004441,
                end: 1004441,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/dummy/base.pyi",
                start: 1004441,
                end: 1005470,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/mysql/__init__.pyi",
                start: 1005470,
                end: 1005470,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/mysql/client.pyi",
                start: 1005470,
                end: 1005853,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/postgresql/__init__.pyi",
                start: 1005853,
                end: 1005853,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/postgresql/base.pyi",
                start: 1005853,
                end: 1006312,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/postgresql/client.pyi",
                start: 1006312,
                end: 1006593,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/postgresql/creation.pyi",
                start: 1006593,
                end: 1006710,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/postgresql/operations.pyi",
                start: 1006710,
                end: 1006835,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/sqlite3/__init__.pyi",
                start: 1006835,
                end: 1006835,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/sqlite3/base.pyi",
                start: 1006835,
                end: 1007184,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/sqlite3/creation.pyi",
                start: 1007184,
                end: 1007301,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/sqlite3/features.pyi",
                start: 1007301,
                end: 1007418,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/sqlite3/introspection.pyi",
                start: 1007418,
                end: 1007781,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/sqlite3/operations.pyi",
                start: 1007781,
                end: 1007906,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/backends/sqlite3/schema.pyi",
                start: 1007906,
                end: 1008033,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/__init__.pyi",
                start: 1008033,
                end: 1008276,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/autodetector.pyi",
                start: 1008276,
                end: 1011287,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/exceptions.pyi",
                start: 1011287,
                end: 1011996,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/executor.pyi",
                start: 1011996,
                end: 1013675,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/graph.pyi",
                start: 1013675,
                end: 1016206,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/loader.pyi",
                start: 1016206,
                end: 1017753,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/migration.pyi",
                start: 1017753,
                end: 1018817,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/optimizer.pyi",
                start: 1018817,
                end: 1019160,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/questioner.pyi",
                start: 1019160,
                end: 1020316,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/recorder.pyi",
                start: 1020316,
                end: 1021122,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/serializer.pyi",
                start: 1021122,
                end: 1022950,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/state.pyi",
                start: 1022950,
                end: 1025590,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/topological_sort.pyi",
                start: 1025590,
                end: 1025938,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/utils.pyi",
                start: 1025938,
                end: 1026145,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/writer.pyi",
                start: 1026145,
                end: 1027586,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/operations/__init__.pyi",
                start: 1027586,
                end: 1028382,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/operations/base.pyi",
                start: 1028382,
                end: 1029284,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/operations/fields.pyi",
                start: 1029284,
                end: 1030450,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/operations/models.pyi",
                start: 1030450,
                end: 1033604,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/operations/special.pyi",
                start: 1033604,
                end: 1034944,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/migrations/operations/utils.pyi",
                start: 1034944,
                end: 1035161,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/__init__.pyi",
                start: 1035161,
                end: 1038737,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/aggregates.pyi",
                start: 1038737,
                end: 1039238,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/base.pyi",
                start: 1039238,
                end: 1041638,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/constraints.pyi",
                start: 1041638,
                end: 1042727,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/deletion.pyi",
                start: 1042727,
                end: 1043876,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/enums.pyi",
                start: 1043876,
                end: 1044690,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/expressions.pyi",
                start: 1044690,
                end: 1053273,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/indexes.pyi",
                start: 1053273,
                end: 1054514,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/lookups.pyi",
                start: 1054514,
                end: 1058989,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/manager.pyi",
                start: 1058989,
                end: 1060785,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/options.pyi",
                start: 1060785,
                end: 1065778,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/query.pyi",
                start: 1065778,
                end: 1074980,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/query_utils.pyi",
                start: 1074980,
                end: 1077991,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/signals.pyi",
                start: 1077991,
                end: 1078841,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/utils.pyi",
                start: 1078841,
                end: 1078998,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/fields/__init__.pyi",
                start: 1078998,
                end: 1092786,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/fields/files.pyi",
                start: 1092786,
                end: 1096426,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/fields/mixins.pyi",
                start: 1096426,
                end: 1096879,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/fields/proxy.pyi",
                start: 1096879,
                end: 1097040,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/fields/related.pyi",
                start: 1097040,
                end: 1106329,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/fields/related_descriptors.pyi",
                start: 1106329,
                end: 1109513,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/fields/related_lookups.pyi",
                start: 1109513,
                end: 1111013,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/fields/reverse_related.pyi",
                start: 1111013,
                end: 1115058,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/functions/__init__.pyi",
                start: 1115058,
                end: 1117135,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/functions/comparison.pyi",
                start: 1117135,
                end: 1117447,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/functions/datetime.pyi",
                start: 1117447,
                end: 1118419,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/functions/math.pyi",
                start: 1118419,
                end: 1119641,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/functions/mixins.pyi",
                start: 1119641,
                end: 1119741,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/functions/text.pyi",
                start: 1119741,
                end: 1121969,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/functions/window.pyi",
                start: 1121969,
                end: 1122671,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/sql/__init__.pyi",
                start: 1122671,
                end: 1122890,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/sql/compiler.pyi",
                start: 1122890,
                end: 1127602,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/sql/constants.pyi",
                start: 1127602,
                end: 1127864,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/sql/datastructures.pyi",
                start: 1127864,
                end: 1129773,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/sql/query.pyi",
                start: 1129773,
                end: 1138845,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/sql/subqueries.pyi",
                start: 1138845,
                end: 1140673,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/db/models/sql/where.pyi",
                start: 1140673,
                end: 1142591,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/dispatch/__init__.pyi",
                start: 1142591,
                end: 1142669,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/dispatch/dispatcher.pyi",
                start: 1142669,
                end: 1143663,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/forms/__init__.pyi",
                start: 1143663,
                end: 1146620,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/forms/boundfield.pyi",
                start: 1146620,
                end: 1148928,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/forms/fields.pyi",
                start: 1148928,
                end: 1161965,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/forms/forms.pyi",
                start: 1161965,
                end: 1165061,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/forms/formsets.pyi",
                start: 1165061,
                end: 1167458,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/forms/models.pyi",
                start: 1167458,
                end: 1177631,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/forms/renderers.pyi",
                start: 1177631,
                end: 1178355,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/forms/utils.pyi",
                start: 1178355,
                end: 1179612,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/forms/widgets.pyi",
                start: 1179612,
                end: 1185706,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/http/__init__.pyi",
                start: 1185706,
                end: 1186694,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/http/cookie.pyi",
                start: 1186694,
                end: 1186796,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/http/multipartparser.pyi",
                start: 1186796,
                end: 1188782,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/http/request.pyi",
                start: 1188782,
                end: 1192568,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/http/response.pyi",
                start: 1192568,
                end: 1197562,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/middleware/__init__.pyi",
                start: 1197562,
                end: 1197562,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/middleware/cache.pyi",
                start: 1197562,
                end: 1198657,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/middleware/clickjacking.pyi",
                start: 1198657,
                end: 1199044,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/middleware/common.pyi",
                start: 1199044,
                end: 1200031,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/middleware/csrf.pyi",
                start: 1200031,
                end: 1201281,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/middleware/gzip.pyi",
                start: 1201281,
                end: 1201620,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/middleware/http.pyi",
                start: 1201620,
                end: 1201989,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/middleware/locale.pyi",
                start: 1201989,
                end: 1202412,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/middleware/security.pyi",
                start: 1202412,
                end: 1203127,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/__init__.pyi",
                start: 1203127,
                end: 1203775,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/base.pyi",
                start: 1203775,
                end: 1209805,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/context.pyi",
                start: 1209805,
                end: 1213013,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/context_processors.pyi",
                start: 1213013,
                end: 1213653,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/defaultfilters.pyi",
                start: 1213653,
                end: 1217304,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/defaulttags.pyi",
                start: 1217304,
                end: 1224541,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/engine.pyi",
                start: 1224541,
                end: 1226699,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/exceptions.pyi",
                start: 1226699,
                end: 1227295,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/library.pyi",
                start: 1227295,
                end: 1230374,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/loader.pyi",
                start: 1230374,
                end: 1230994,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/loader_tags.pyi",
                start: 1230994,
                end: 1233357,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/response.pyi",
                start: 1233357,
                end: 1235701,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/smartif.pyi",
                start: 1235701,
                end: 1236968,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/utils.pyi",
                start: 1236968,
                end: 1237526,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/backends/__init__.pyi",
                start: 1237526,
                end: 1237526,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/backends/base.pyi",
                start: 1237526,
                end: 1238127,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/backends/django.pyi",
                start: 1238127,
                end: 1238833,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/backends/dummy.pyi",
                start: 1238833,
                end: 1239311,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/backends/jinja2.pyi",
                start: 1239311,
                end: 1239892,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/backends/utils.pyi",
                start: 1239892,
                end: 1240103,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/loaders/__init__.pyi",
                start: 1240103,
                end: 1240103,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/loaders/app_directories.pyi",
                start: 1240103,
                end: 1240191,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/loaders/base.pyi",
                start: 1240191,
                end: 1240667,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/loaders/cached.pyi",
                start: 1240667,
                end: 1241231,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/loaders/filesystem.pyi",
                start: 1241231,
                end: 1241664,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/template/loaders/locmem.pyi",
                start: 1241664,
                end: 1242018,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/templatetags/__init__.pyi",
                start: 1242018,
                end: 1242018,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/templatetags/cache.pyi",
                start: 1242018,
                end: 1242700,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/templatetags/i18n.pyi",
                start: 1242700,
                end: 1245876,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/templatetags/l10n.pyi",
                start: 1245876,
                end: 1246305,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/templatetags/static.pyi",
                start: 1246305,
                end: 1247475,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/templatetags/tz.pyi",
                start: 1247475,
                end: 1248641,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/test/__init__.pyi",
                start: 1248641,
                end: 1249312,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/test/client.pyi",
                start: 1249312,
                end: 1254905,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/test/html.pyi",
                start: 1254905,
                end: 1256108,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/test/runner.pyi",
                start: 1256108,
                end: 1261318,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/test/selenium.pyi",
                start: 1261318,
                end: 1261686,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/test/signals.pyi",
                start: 1261686,
                end: 1262672,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/test/testcases.pyi",
                start: 1262672,
                end: 1270945,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/test/utils.pyi",
                start: 1270945,
                end: 1276381,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/urls/__init__.pyi",
                start: 1276381,
                end: 1277578,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/urls/base.pyi",
                start: 1277578,
                end: 1278465,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/urls/conf.pyi",
                start: 1278465,
                end: 1278689,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/urls/converters.pyi",
                start: 1278689,
                end: 1279516,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/urls/exceptions.pyi",
                start: 1279516,
                end: 1279618,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/urls/resolvers.pyi",
                start: 1279618,
                end: 1283647,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/urls/utils.pyi",
                start: 1283647,
                end: 1283815,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/__init__.pyi",
                start: 1283815,
                end: 1283815,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/_os.pyi",
                start: 1283815,
                end: 1284122,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/archive.pyi",
                start: 1284122,
                end: 1285165,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/autoreload.pyi",
                start: 1285165,
                end: 1287867,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/baseconv.pyi",
                start: 1287867,
                end: 1288460,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/cache.pyi",
                start: 1288460,
                end: 1289798,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/crypto.pyi",
                start: 1289798,
                end: 1290341,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/datastructures.pyi",
                start: 1290341,
                end: 1292965,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/dateformat.pyi",
                start: 1292965,
                end: 1294747,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/dateparse.pyi",
                start: 1294747,
                end: 1295172,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/dates.pyi",
                start: 1295172,
                end: 1295353,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/datetime_safe.pyi",
                start: 1295353,
                end: 1295694,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/deconstruct.pyi",
                start: 1295694,
                end: 1295799,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/decorators.pyi",
                start: 1295799,
                end: 1296734,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/deprecation.pyi",
                start: 1296734,
                end: 1298079,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/duration.pyi",
                start: 1298079,
                end: 1298277,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/encoding.pyi",
                start: 1298277,
                end: 1300693,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/feedgenerator.pyi",
                start: 1300693,
                end: 1303370,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/formats.pyi",
                start: 1303370,
                end: 1304641,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/functional.pyi",
                start: 1304641,
                end: 1306564,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/hashable.pyi",
                start: 1306564,
                end: 1306630,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/html.pyi",
                start: 1306630,
                end: 1307996,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/http.pyi",
                start: 1307996,
                end: 1309540,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/inspect.pyi",
                start: 1309540,
                end: 1309931,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/ipv6.pyi",
                start: 1309931,
                end: 1310099,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/itercompat.pyi",
                start: 1310099,
                end: 1310160,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/jslex.pyi",
                start: 1310160,
                end: 1310908,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/log.pyi",
                start: 1310908,
                end: 1312409,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/lorem_ipsum.pyi",
                start: 1312409,
                end: 1312657,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/module_loading.pyi",
                start: 1312657,
                end: 1312904,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/numberformat.pyi",
                start: 1312904,
                end: 1313248,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/regex_helper.pyi",
                start: 1313248,
                end: 1313906,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/safestring.pyi",
                start: 1313906,
                end: 1314535,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/six.pyi",
                start: 1314535,
                end: 1317943,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/termcolors.pyi",
                start: 1317943,
                end: 1318460,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/text.pyi",
                start: 1318460,
                end: 1320043,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/timesince.pyi",
                start: 1320043,
                end: 1320405,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/timezone.pyi",
                start: 1320405,
                end: 1323119,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/topological_sort.pyi",
                start: 1323119,
                end: 1323416,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/tree.pyi",
                start: 1323416,
                end: 1324215,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/version.pyi",
                start: 1324215,
                end: 1324731,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/xmlutils.pyi",
                start: 1324731,
                end: 1325164,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/translation/__init__.pyi",
                start: 1325164,
                end: 1327396,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/translation/reloader.pyi",
                start: 1327396,
                end: 1327695,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/translation/template.pyi",
                start: 1327695,
                end: 1327930,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/translation/trans_null.pyi",
                start: 1327930,
                end: 1328659,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/utils/translation/trans_real.pyi",
                start: 1328659,
                end: 1330474,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/__init__.pyi",
                start: 1330474,
                end: 1330513,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/csrf.pyi",
                start: 1330513,
                end: 1330787,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/debug.pyi",
                start: 1330787,
                end: 1333568,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/defaults.pyi",
                start: 1333568,
                end: 1334382,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/i18n.pyi",
                start: 1334382,
                end: 1335639,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/static.pyi",
                start: 1335639,
                end: 1336100,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/decorators/__init__.pyi",
                start: 1336100,
                end: 1336100,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/decorators/cache.pyi",
                start: 1336100,
                end: 1336403,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/decorators/clickjacking.pyi",
                start: 1336403,
                end: 1336650,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/decorators/csrf.pyi",
                start: 1336650,
                end: 1337127,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/decorators/debug.pyi",
                start: 1337127,
                end: 1337284,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/decorators/gzip.pyi",
                start: 1337284,
                end: 1337413,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/decorators/http.pyi",
                start: 1337413,
                end: 1337989,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/decorators/vary.pyi",
                start: 1337989,
                end: 1338170,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/generic/__init__.pyi",
                start: 1338170,
                end: 1338807,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/generic/base.pyi",
                start: 1338807,
                end: 1341046,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/generic/dates.pyi",
                start: 1341046,
                end: 1344817,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/generic/detail.pyi",
                start: 1344817,
                end: 1345907,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/generic/edit.pyi",
                start: 1345907,
                end: 1348141,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/django-stubs/django-stubs/views/generic/list.pyi",
                start: 1348141,
                end: 1349766,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/LICENSE",
                start: 1349766,
                end: 1362424,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/BaseHTTPServer.pyi",
                start: 1362424,
                end: 1364288,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/CGIHTTPServer.pyi",
                start: 1364288,
                end: 1364515,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/ConfigParser.pyi",
                start: 1364515,
                end: 1368397,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/Cookie.pyi",
                start: 1368397,
                end: 1369739,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/HTMLParser.pyi",
                start: 1369739,
                end: 1370806,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/Queue.pyi",
                start: 1370806,
                end: 1371731,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/SimpleHTTPServer.pyi",
                start: 1371731,
                end: 1372420,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/SocketServer.pyi",
                start: 1372420,
                end: 1376370,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/StringIO.pyi",
                start: 1376370,
                end: 1377549,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/UserDict.pyi",
                start: 1377549,
                end: 1379181,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/UserList.pyi",
                start: 1379181,
                end: 1379811,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/UserString.pyi",
                start: 1379811,
                end: 1383655,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/__builtin__.pyi",
                start: 1383655,
                end: 1454296,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/_ast.pyi",
                start: 1454296,
                end: 1460073,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/_collections.pyi",
                start: 1460073,
                end: 1461551,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/_functools.pyi",
                start: 1461551,
                end: 1462196,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/_hotshot.pyi",
                start: 1462196,
                end: 1463067,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/_io.pyi",
                start: 1463067,
                end: 1470198,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/_json.pyi",
                start: 1470198,
                end: 1470431,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/_md5.pyi",
                start: 1470431,
                end: 1470731,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/_sha.pyi",
                start: 1470731,
                end: 1471079,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/_sha256.pyi",
                start: 1471079,
                end: 1471711,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/_sha512.pyi",
                start: 1471711,
                end: 1472343,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/_socket.pyi",
                start: 1472343,
                end: 1478652,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/_sre.pyi",
                start: 1478652,
                end: 1480628,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/_struct.pyi",
                start: 1480628,
                end: 1481439,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/_symtable.pyi",
                start: 1481439,
                end: 1482121,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/_threading_local.pyi",
                start: 1482121,
                end: 1482513,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/abc.pyi",
                start: 1482513,
                end: 1483660,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/ast.pyi",
                start: 1483660,
                end: 1484861,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/atexit.pyi",
                start: 1484861,
                end: 1484978,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/cPickle.pyi",
                start: 1484978,
                end: 1485779,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/cStringIO.pyi",
                start: 1485779,
                end: 1487812,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/collections.pyi",
                start: 1487812,
                end: 1492798,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/commands.pyi",
                start: 1492798,
                end: 1493129,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/compileall.pyi",
                start: 1493129,
                end: 1493789,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/cookielib.pyi",
                start: 1493789,
                end: 1498310,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/copy_reg.pyi",
                start: 1498310,
                end: 1499036,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/dircache.pyi",
                start: 1499036,
                end: 1499375,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/dummy_thread.pyi",
                start: 1499375,
                end: 1500169,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/exceptions.pyi",
                start: 1500169,
                end: 1502809,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/fcntl.pyi",
                start: 1502809,
                end: 1504370,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/fnmatch.pyi",
                start: 1504370,
                end: 1504718,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/functools.pyi",
                start: 1504718,
                end: 1505980,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/future_builtins.pyi",
                start: 1505980,
                end: 1506206,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/gc.pyi",
                start: 1506206,
                end: 1506993,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/getopt.pyi",
                start: 1506993,
                end: 1507441,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/getpass.pyi",
                start: 1507441,
                end: 1507633,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/gettext.pyi",
                start: 1507633,
                end: 1509917,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/glob.pyi",
                start: 1509917,
                end: 1510292,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/gzip.pyi",
                start: 1510292,
                end: 1511292,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/hashlib.pyi",
                start: 1511292,
                end: 1512296,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/heapq.pyi",
                start: 1512296,
                end: 1513042,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/htmlentitydefs.pyi",
                start: 1513042,
                end: 1513156,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/httplib.pyi",
                start: 1513156,
                end: 1519093,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/imp.pyi",
                start: 1519093,
                end: 1520418,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/importlib.pyi",
                start: 1520418,
                end: 1520552,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/inspect.pyi",
                start: 1520552,
                end: 1525141,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/io.pyi",
                start: 1525141,
                end: 1526604,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/itertools.pyi",
                start: 1526604,
                end: 1533103,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/json.pyi",
                start: 1533103,
                end: 1536880,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/markupbase.pyi",
                start: 1536880,
                end: 1537145,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/md5.pyi",
                start: 1537145,
                end: 1537263,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/mimetools.pyi",
                start: 1537263,
                end: 1537966,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/mutex.pyi",
                start: 1537966,
                end: 1538392,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/nturl2path.pyi",
                start: 1538392,
                end: 1538507,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/os2emxpath.pyi",
                start: 1538507,
                end: 1544735,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/pipes.pyi",
                start: 1544735,
                end: 1545188,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/platform.pyi",
                start: 1545188,
                end: 1546797,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/popen2.pyi",
                start: 1546797,
                end: 1547797,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/posix.pyi",
                start: 1547797,
                end: 1554160,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/random.pyi",
                start: 1554160,
                end: 1557471,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/re.pyi",
                start: 1557471,
                end: 1561275,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/repr.pyi",
                start: 1561275,
                end: 1562369,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/resource.pyi",
                start: 1562369,
                end: 1563245,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/rfc822.pyi",
                start: 1563245,
                end: 1565479,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/robotparser.pyi",
                start: 1565479,
                end: 1565709,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/runpy.pyi",
                start: 1565709,
                end: 1566250,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/sets.pyi",
                start: 1566250,
                end: 1569253,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/sha.pyi",
                start: 1569253,
                end: 1569530,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/shelve.pyi",
                start: 1569530,
                end: 1571115,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/shlex.pyi",
                start: 1571115,
                end: 1572115,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/signal.pyi",
                start: 1572115,
                end: 1573686,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/smtplib.pyi",
                start: 1573686,
                end: 1576228,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/spwd.pyi",
                start: 1576228,
                end: 1576536,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/sre_constants.pyi",
                start: 1576536,
                end: 1578350,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/sre_parse.pyi",
                start: 1578350,
                end: 1580727,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/stat.pyi",
                start: 1580727,
                end: 1581720,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/string.pyi",
                start: 1581720,
                end: 1585426,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/stringold.pyi",
                start: 1585426,
                end: 1587503,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/strop.pyi",
                start: 1587503,
                end: 1588701,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/subprocess.pyi",
                start: 1588701,
                end: 1592520,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/symbol.pyi",
                start: 1592520,
                end: 1593892,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/sys.pyi",
                start: 1593892,
                end: 1597558,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/tempfile.pyi",
                start: 1597558,
                end: 1601316,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/textwrap.pyi",
                start: 1601316,
                end: 1603292,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/thread.pyi",
                start: 1603292,
                end: 1604249,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/toaiff.pyi",
                start: 1604249,
                end: 1604586,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/tokenize.pyi",
                start: 1604586,
                end: 1607356,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/types.pyi",
                start: 1607356,
                end: 1612672,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/typing.pyi",
                start: 1612672,
                end: 1629966,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/unittest.pyi",
                start: 1629966,
                end: 1643525,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/urllib.pyi",
                start: 1643525,
                end: 1648291,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/urllib2.pyi",
                start: 1648291,
                end: 1656628,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/urlparse.pyi",
                start: 1656628,
                end: 1658661,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/user.pyi",
                start: 1658661,
                end: 1658885,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/whichdb.pyi",
                start: 1658885,
                end: 1659035,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/xmlrpclib.pyi",
                start: 1659035,
                end: 1668690,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/distutils/__init__.pyi",
                start: 1668690,
                end: 1668690,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/distutils/emxccompiler.pyi",
                start: 1668690,
                end: 1668806,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/MIMEText.pyi",
                start: 1668806,
                end: 1668965,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/__init__.pyi",
                start: 1668965,
                end: 1669235,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/_parseaddr.pyi",
                start: 1669235,
                end: 1670307,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/base64mime.pyi",
                start: 1670307,
                end: 1670607,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/charset.pyi",
                start: 1670607,
                end: 1671509,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/encoders.pyi",
                start: 1671509,
                end: 1671652,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/feedparser.pyi",
                start: 1671652,
                end: 1672189,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/generator.pyi",
                start: 1672189,
                end: 1672567,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/header.pyi",
                start: 1672567,
                end: 1673041,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/iterators.pyi",
                start: 1673041,
                end: 1673297,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/message.pyi",
                start: 1673297,
                end: 1675247,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/parser.pyi",
                start: 1675247,
                end: 1675662,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/quoprimime.pyi",
                start: 1675662,
                end: 1676152,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/utils.pyi",
                start: 1676152,
                end: 1676975,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/mime/__init__.pyi",
                start: 1676975,
                end: 1676975,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/mime/application.pyi",
                start: 1676975,
                end: 1677402,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/mime/audio.pyi",
                start: 1677402,
                end: 1677579,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/mime/base.pyi",
                start: 1677579,
                end: 1677707,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/mime/image.pyi",
                start: 1677707,
                end: 1677884,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/mime/message.pyi",
                start: 1677884,
                end: 1678032,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/mime/multipart.pyi",
                start: 1678032,
                end: 1678191,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/mime/nonmultipart.pyi",
                start: 1678191,
                end: 1678298,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/email/mime/text.pyi",
                start: 1678298,
                end: 1678457,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/encodings/__init__.pyi",
                start: 1678457,
                end: 1678551,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/encodings/utf_8.pyi",
                start: 1678551,
                end: 1679124,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/multiprocessing/__init__.pyi",
                start: 1679124,
                end: 1681055,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/multiprocessing/pool.pyi",
                start: 1681055,
                end: 1683442,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/multiprocessing/process.pyi",
                start: 1683442,
                end: 1684351,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/multiprocessing/util.pyi",
                start: 1684351,
                end: 1685109,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/multiprocessing/dummy/__init__.pyi",
                start: 1685109,
                end: 1686526,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/multiprocessing/dummy/connection.pyi",
                start: 1686526,
                end: 1687200,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/os/__init__.pyi",
                start: 1687200,
                end: 1700599,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2/os/path.pyi",
                start: 1700599,
                end: 1706827,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/__future__.pyi",
                start: 1706827,
                end: 1707414,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/_bisect.pyi",
                start: 1707414,
                end: 1708039,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/_codecs.pyi",
                start: 1708039,
                end: 1713057,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/_csv.pyi",
                start: 1713057,
                end: 1714494,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/_curses.pyi",
                start: 1714494,
                end: 1727792,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/_heapq.pyi",
                start: 1727792,
                end: 1728333,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/_random.pyi",
                start: 1728333,
                end: 1728826,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/_warnings.pyi",
                start: 1728826,
                end: 1729889,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/_weakref.pyi",
                start: 1729889,
                end: 1730917,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/_weakrefset.pyi",
                start: 1730917,
                end: 1733156,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/aifc.pyi",
                start: 1733156,
                end: 1736473,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/argparse.pyi",
                start: 1736473,
                end: 1753974,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/array.pyi",
                start: 1753974,
                end: 1756835,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/asynchat.pyi",
                start: 1756835,
                end: 1758392,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/asyncore.pyi",
                start: 1758392,
                end: 1764019,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/audioop.pyi",
                start: 1764019,
                end: 1766010,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/base64.pyi",
                start: 1766010,
                end: 1767596,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/bdb.pyi",
                start: 1767596,
                end: 1772070,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/binascii.pyi",
                start: 1772070,
                end: 1773528,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/binhex.pyi",
                start: 1773528,
                end: 1774697,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/bisect.pyi",
                start: 1774697,
                end: 1775303,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/builtins.pyi",
                start: 1775303,
                end: 1845944,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/bz2.pyi",
                start: 1845944,
                end: 1847536,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/cProfile.pyi",
                start: 1847536,
                end: 1848820,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/calendar.pyi",
                start: 1848820,
                end: 1854592,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/cgi.pyi",
                start: 1854592,
                end: 1859590,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/cgitb.pyi",
                start: 1859590,
                end: 1861126,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/chunk.pyi",
                start: 1861126,
                end: 1861881,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/cmath.pyi",
                start: 1861881,
                end: 1863088,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/cmd.pyi",
                start: 1863088,
                end: 1864782,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/code.pyi",
                start: 1864782,
                end: 1866428,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/codecs.pyi",
                start: 1866428,
                end: 1877499,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/codeop.pyi",
                start: 1877499,
                end: 1878132,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/colorsys.pyi",
                start: 1878132,
                end: 1878732,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/contextlib.pyi",
                start: 1878732,
                end: 1883538,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/copy.pyi",
                start: 1883538,
                end: 1883881,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/crypt.pyi",
                start: 1883881,
                end: 1884529,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/csv.pyi",
                start: 1884529,
                end: 1887342,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/datetime.pyi",
                start: 1887342,
                end: 1899348,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/decimal.pyi",
                start: 1899348,
                end: 1915385,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/difflib.pyi",
                start: 1915385,
                end: 1919238,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/dis.pyi",
                start: 1919238,
                end: 1922132,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/doctest.pyi",
                start: 1922132,
                end: 1928984,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/errno.pyi",
                start: 1928984,
                end: 1931025,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/filecmp.pyi",
                start: 1931025,
                end: 1932646,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/fileinput.pyi",
                start: 1932646,
                end: 1935318,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/formatter.pyi",
                start: 1935318,
                end: 1939973,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/fractions.pyi",
                start: 1939973,
                end: 1943249,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/ftplib.pyi",
                start: 1943249,
                end: 1949234,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/genericpath.pyi",
                start: 1949234,
                end: 1949887,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/grp.pyi",
                start: 1949887,
                end: 1950182,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/hmac.pyi",
                start: 1950182,
                end: 1951257,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/imaplib.pyi",
                start: 1951257,
                end: 1957664,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/imghdr.pyi",
                start: 1957664,
                end: 1958067,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/keyword.pyi",
                start: 1958067,
                end: 1958202,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/linecache.pyi",
                start: 1958202,
                end: 1958792,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/locale.pyi",
                start: 1958792,
                end: 1961388,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/macpath.pyi",
                start: 1961388,
                end: 1968019,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/mailbox.pyi",
                start: 1968019,
                end: 1975881,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/mailcap.pyi",
                start: 1975881,
                end: 1976206,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/marshal.pyi",
                start: 1976206,
                end: 1976446,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/math.pyi",
                start: 1976446,
                end: 1979718,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/mimetypes.pyi",
                start: 1979718,
                end: 1981293,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/mmap.pyi",
                start: 1981293,
                end: 1984979,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/modulefinder.pyi",
                start: 1984979,
                end: 1987929,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/netrc.pyi",
                start: 1987929,
                end: 1988395,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/nis.pyi",
                start: 1988395,
                end: 1988718,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/ntpath.pyi",
                start: 1988718,
                end: 1994946,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/numbers.pyi",
                start: 1994946,
                end: 1999011,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/opcode.pyi",
                start: 1999011,
                end: 1999474,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/operator.pyi",
                start: 1999474,
                end: 2005993,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/optparse.pyi",
                start: 2005993,
                end: 2016009,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/pdb.pyi",
                start: 2016009,
                end: 2018392,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/pickle.pyi",
                start: 2018392,
                end: 2022089,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/pickletools.pyi",
                start: 2022089,
                end: 2026484,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/pkgutil.pyi",
                start: 2026484,
                end: 2027853,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/plistlib.pyi",
                start: 2027853,
                end: 2030312,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/poplib.pyi",
                start: 2030312,
                end: 2032804,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/posixpath.pyi",
                start: 2032804,
                end: 2039032,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/pprint.pyi",
                start: 2039032,
                end: 2040731,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/profile.pyi",
                start: 2040731,
                end: 2042020,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/pstats.pyi",
                start: 2042020,
                end: 2043984,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/pty.pyi",
                start: 2043984,
                end: 2044607,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/pwd.pyi",
                start: 2044607,
                end: 2044957,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/py_compile.pyi",
                start: 2044957,
                end: 2046193,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/pyclbr.pyi",
                start: 2046193,
                end: 2047124,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/pydoc.pyi",
                start: 2047124,
                end: 2056910,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/quopri.pyi",
                start: 2056910,
                end: 2057290,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/readline.pyi",
                start: 2057290,
                end: 2058815,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/rlcompleter.pyi",
                start: 2058815,
                end: 2059149,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/sched.pyi",
                start: 2059149,
                end: 2060481,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/select.pyi",
                start: 2060481,
                end: 2064417,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/shutil.pyi",
                start: 2064417,
                end: 2070612,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/site.pyi",
                start: 2070612,
                end: 2071094,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/smtpd.pyi",
                start: 2071094,
                end: 2073950,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/sndhdr.pyi",
                start: 2073950,
                end: 2074585,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/socket.pyi",
                start: 2074585,
                end: 2096280,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/sre_compile.pyi",
                start: 2096280,
                end: 2096915,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/ssl.pyi",
                start: 2096915,
                end: 2108597,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/stringprep.pyi",
                start: 2108597,
                end: 2109455,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/struct.pyi",
                start: 2109455,
                end: 2111131,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/sunau.pyi",
                start: 2111131,
                end: 2114217,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/symtable.pyi",
                start: 2114217,
                end: 2115862,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/sysconfig.pyi",
                start: 2115862,
                end: 2116735,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/syslog.pyi",
                start: 2116735,
                end: 2117557,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/tabnanny.pyi",
                start: 2117557,
                end: 2118150,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/tarfile.pyi",
                start: 2118150,
                end: 2124985,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/telnetlib.pyi",
                start: 2124985,
                end: 2127708,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/termios.pyi",
                start: 2127708,
                end: 2131111,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/threading.pyi",
                start: 2131111,
                end: 2137940,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/time.pyi",
                start: 2137940,
                end: 2141829,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/timeit.pyi",
                start: 2141829,
                end: 2143463,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/token.pyi",
                start: 2143463,
                end: 2144624,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/trace.pyi",
                start: 2144624,
                end: 2146672,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/traceback.pyi",
                start: 2146672,
                end: 2152524,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/tty.pyi",
                start: 2152524,
                end: 2152829,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/turtle.pyi",
                start: 2152829,
                end: 2171149,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/unicodedata.pyi",
                start: 2171149,
                end: 2173049,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/uu.pyi",
                start: 2173049,
                end: 2173611,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/uuid.pyi",
                start: 2173611,
                end: 2176441,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/warnings.pyi",
                start: 2176441,
                end: 2178227,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/wave.pyi",
                start: 2178227,
                end: 2180881,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/weakref.pyi",
                start: 2180881,
                end: 2185169,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/webbrowser.pyi",
                start: 2185169,
                end: 2188327,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xdrlib.pyi",
                start: 2188327,
                end: 2190680,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/zipfile.pyi",
                start: 2190680,
                end: 2195554,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/zipimport.pyi",
                start: 2195554,
                end: 2196243,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/zlib.pyi",
                start: 2196243,
                end: 2197897,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/ctypes/__init__.pyi",
                start: 2197897,
                end: 2209658,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/ctypes/util.pyi",
                start: 2209658,
                end: 2209845,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/ctypes/wintypes.pyi",
                start: 2209845,
                end: 2214411,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/curses/__init__.pyi",
                start: 2214411,
                end: 2214779,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/curses/ascii.pyi",
                start: 2214779,
                end: 2216001,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/curses/panel.pyi",
                start: 2216001,
                end: 2216800,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/curses/textpad.pyi",
                start: 2216800,
                end: 2217229,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/__init__.pyi",
                start: 2217229,
                end: 2217229,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/archive_util.pyi",
                start: 2217229,
                end: 2217754,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/bcppcompiler.pyi",
                start: 2217754,
                end: 2217869,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/ccompiler.pyi",
                start: 2217869,
                end: 2224830,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/cmd.pyi",
                start: 2224830,
                end: 2227420,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/core.pyi",
                start: 2227420,
                end: 2229379,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/cygwinccompiler.pyi",
                start: 2229379,
                end: 2229557,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/debug.pyi",
                start: 2229557,
                end: 2229598,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/dep_util.pyi",
                start: 2229598,
                end: 2229901,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/dir_util.pyi",
                start: 2229901,
                end: 2230539,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/dist.pyi",
                start: 2230539,
                end: 2231031,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/errors.pyi",
                start: 2231031,
                end: 2231883,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/extension.pyi",
                start: 2231883,
                end: 2233596,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/fancy_getopt.pyi",
                start: 2233596,
                end: 2234558,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/file_util.pyi",
                start: 2234558,
                end: 2235052,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/filelist.pyi",
                start: 2235052,
                end: 2235104,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/log.pyi",
                start: 2235104,
                end: 2235880,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/msvccompiler.pyi",
                start: 2235880,
                end: 2235995,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/spawn.pyi",
                start: 2235995,
                end: 2236281,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/sysconfig.pyi",
                start: 2236281,
                end: 2236973,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/text_file.pyi",
                start: 2236973,
                end: 2237733,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/unixccompiler.pyi",
                start: 2237733,
                end: 2237850,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/util.pyi",
                start: 2237850,
                end: 2238742,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/version.pyi",
                start: 2238742,
                end: 2240626,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/__init__.pyi",
                start: 2240626,
                end: 2240626,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/bdist.pyi",
                start: 2240626,
                end: 2240626,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/bdist_dumb.pyi",
                start: 2240626,
                end: 2240626,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/bdist_msi.pyi",
                start: 2240626,
                end: 2240808,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/bdist_packager.pyi",
                start: 2240808,
                end: 2240808,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/bdist_rpm.pyi",
                start: 2240808,
                end: 2240808,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/bdist_wininst.pyi",
                start: 2240808,
                end: 2240808,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/build.pyi",
                start: 2240808,
                end: 2240808,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/build_clib.pyi",
                start: 2240808,
                end: 2240808,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/build_ext.pyi",
                start: 2240808,
                end: 2240808,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/build_py.pyi",
                start: 2240808,
                end: 2241085,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/build_scripts.pyi",
                start: 2241085,
                end: 2241085,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/check.pyi",
                start: 2241085,
                end: 2241085,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/clean.pyi",
                start: 2241085,
                end: 2241085,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/config.pyi",
                start: 2241085,
                end: 2241085,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/install.pyi",
                start: 2241085,
                end: 2241425,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/install_data.pyi",
                start: 2241425,
                end: 2241425,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/install_headers.pyi",
                start: 2241425,
                end: 2241425,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/install_lib.pyi",
                start: 2241425,
                end: 2241425,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/install_scripts.pyi",
                start: 2241425,
                end: 2241425,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/register.pyi",
                start: 2241425,
                end: 2241425,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/distutils/command/sdist.pyi",
                start: 2241425,
                end: 2241425,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/ensurepip/__init__.pyi",
                start: 2241425,
                end: 2241869,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/lib2to3/__init__.pyi",
                start: 2241869,
                end: 2241902,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/lib2to3/pygram.pyi",
                start: 2241902,
                end: 2244174,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/lib2to3/pytree.pyi",
                start: 2244174,
                end: 2247428,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/lib2to3/pgen2/__init__.pyi",
                start: 2247428,
                end: 2247612,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/lib2to3/pgen2/driver.pyi",
                start: 2247612,
                end: 2248662,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/lib2to3/pgen2/grammar.pyi",
                start: 2248662,
                end: 2249447,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/lib2to3/pgen2/literals.pyi",
                start: 2249447,
                end: 2249668,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/lib2to3/pgen2/parse.pyi",
                start: 2249668,
                end: 2250828,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/lib2to3/pgen2/pgen.pyi",
                start: 2250828,
                end: 2252993,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/lib2to3/pgen2/token.pyi",
                start: 2252993,
                end: 2254104,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/lib2to3/pgen2/tokenize.pyi",
                start: 2254104,
                end: 2255092,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/logging/__init__.pyi",
                start: 2255092,
                end: 2273535,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/logging/config.pyi",
                start: 2273535,
                end: 2274698,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/logging/handlers.pyi",
                start: 2274698,
                end: 2282729,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/pyexpat/__init__.pyi",
                start: 2282729,
                end: 2286044,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/pyexpat/errors.pyi",
                start: 2286044,
                end: 2287319,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/pyexpat/model.pyi",
                start: 2287319,
                end: 2287524,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/sqlite3/__init__.pyi",
                start: 2287524,
                end: 2287567,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/sqlite3/dbapi2.pyi",
                start: 2287567,
                end: 2298327,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/wsgiref/__init__.pyi",
                start: 2298327,
                end: 2298327,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/wsgiref/handlers.pyi",
                start: 2298327,
                end: 2301427,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/wsgiref/headers.pyi",
                start: 2301427,
                end: 2302677,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/wsgiref/simple_server.pyi",
                start: 2302677,
                end: 2304200,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/wsgiref/types.pyi",
                start: 2304200,
                end: 2305942,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/wsgiref/util.pyi",
                start: 2305942,
                end: 2306828,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/wsgiref/validate.pyi",
                start: 2306828,
                end: 2308689,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml/__init__.pyi",
                start: 2308689,
                end: 2308719,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml/etree/ElementInclude.pyi",
                start: 2308719,
                end: 2309384,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml/etree/ElementPath.pyi",
                start: 2309384,
                end: 2310987,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml/etree/ElementTree.pyi",
                start: 2310987,
                end: 2323576,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml/etree/__init__.pyi",
                start: 2323576,
                end: 2323576,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml/etree/cElementTree.pyi",
                start: 2323576,
                end: 2323675,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml/parsers/__init__.pyi",
                start: 2323675,
                end: 2323709,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml/parsers/expat/__init__.pyi",
                start: 2323709,
                end: 2323731,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml/parsers/expat/errors.pyi",
                start: 2323731,
                end: 2323760,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml/parsers/expat/model.pyi",
                start: 2323760,
                end: 2323788,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml/sax/__init__.pyi",
                start: 2323788,
                end: 2325177,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml/sax/handler.pyi",
                start: 2325177,
                end: 2326568,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml/sax/saxutils.pyi",
                start: 2326568,
                end: 2328925,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/2and3/xml/sax/xmlreader.pyi",
                start: 2328925,
                end: 2331252,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/_ast.pyi",
                start: 2331252,
                end: 2339376,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/_compression.pyi",
                start: 2339376,
                end: 2339812,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/_dummy_thread.pyi",
                start: 2339812,
                end: 2340612,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/_imp.pyi",
                start: 2340612,
                end: 2341329,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/_importlib_modulespec.pyi",
                start: 2341329,
                end: 2342886,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/_json.pyi",
                start: 2342886,
                end: 2343818,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/_markupbase.pyi",
                start: 2343818,
                end: 2344075,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/_operator.pyi",
                start: 2344075,
                end: 2345418,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/_posixsubprocess.pyi",
                start: 2345418,
                end: 2346018,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/_stat.pyi",
                start: 2346018,
                end: 2347240,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/_subprocess.pyi",
                start: 2347240,
                end: 2348519,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/_thread.pyi",
                start: 2348519,
                end: 2349854,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/_threading_local.pyi",
                start: 2349854,
                end: 2350424,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/_tracemalloc.pyi",
                start: 2350424,
                end: 2351033,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/_winapi.pyi",
                start: 2351033,
                end: 2355139,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/abc.pyi",
                start: 2355139,
                end: 2355752,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/ast.pyi",
                start: 2355752,
                end: 2358085,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/atexit.pyi",
                start: 2358085,
                end: 2358398,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/compileall.pyi",
                start: 2358398,
                end: 2360635,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/configparser.pyi",
                start: 2360635,
                end: 2369010,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/copyreg.pyi",
                start: 2369010,
                end: 2369736,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/enum.pyi",
                start: 2369736,
                end: 2372603,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/faulthandler.pyi",
                start: 2372603,
                end: 2373282,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/fcntl.pyi",
                start: 2373282,
                end: 2375070,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/fnmatch.pyi",
                start: 2375070,
                end: 2375436,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/functools.pyi",
                start: 2375436,
                end: 2378996,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/gc.pyi",
                start: 2378996,
                end: 2379948,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/getopt.pyi",
                start: 2379948,
                end: 2380379,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/getpass.pyi",
                start: 2380379,
                end: 2380582,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/gettext.pyi",
                start: 2380582,
                end: 2383649,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/glob.pyi",
                start: 2383649,
                end: 2384289,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/gzip.pyi",
                start: 2384289,
                end: 2386341,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/hashlib.pyi",
                start: 2386341,
                end: 2388694,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/heapq.pyi",
                start: 2388694,
                end: 2389431,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/imp.pyi",
                start: 2389431,
                end: 2391569,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/inspect.pyi",
                start: 2391569,
                end: 2401591,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/io.pyi",
                start: 2401591,
                end: 2410057,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/ipaddress.pyi",
                start: 2410057,
                end: 2415176,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/itertools.pyi",
                start: 2415176,
                end: 2419542,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/lzma.pyi",
                start: 2419542,
                end: 2422815,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/msvcrt.pyi",
                start: 2422815,
                end: 2422963,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/nntplib.pyi",
                start: 2422963,
                end: 2427195,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/nturl2path.pyi",
                start: 2427195,
                end: 2427271,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/pathlib.pyi",
                start: 2427271,
                end: 2432779,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/pipes.pyi",
                start: 2432779,
                end: 2433374,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/platform.pyi",
                start: 2433374,
                end: 2435219,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/posix.pyi",
                start: 2435219,
                end: 2437453,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/queue.pyi",
                start: 2437453,
                end: 2439123,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/random.pyi",
                start: 2439123,
                end: 2442606,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/re.pyi",
                start: 2442606,
                end: 2447732,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/reprlib.pyi",
                start: 2447732,
                end: 2448991,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/resource.pyi",
                start: 2448991,
                end: 2450159,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/runpy.pyi",
                start: 2450159,
                end: 2450853,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/selectors.pyi",
                start: 2450853,
                end: 2454467,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/shelve.pyi",
                start: 2454467,
                end: 2456045,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/shlex.pyi",
                start: 2456045,
                end: 2457597,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/signal.pyi",
                start: 2457597,
                end: 2460966,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/smtplib.pyi",
                start: 2460966,
                end: 2466570,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/socketserver.pyi",
                start: 2466570,
                end: 2470520,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/spwd.pyi",
                start: 2470520,
                end: 2470830,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/sre_constants.pyi",
                start: 2470830,
                end: 2474236,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/sre_parse.pyi",
                start: 2474236,
                end: 2477655,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/stat.pyi",
                start: 2477655,
                end: 2479540,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/statistics.pyi",
                start: 2479540,
                end: 2482430,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/string.pyi",
                start: 2482430,
                end: 2484001,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/subprocess.pyi",
                start: 2484001,
                end: 2530403,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/symbol.pyi",
                start: 2530403,
                end: 2531863,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/sys.pyi",
                start: 2531863,
                end: 2537812,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/tempfile.pyi",
                start: 2537812,
                end: 2544151,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/textwrap.pyi",
                start: 2544151,
                end: 2547608,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/tokenize.pyi",
                start: 2547608,
                end: 2550047,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/tracemalloc.pyi",
                start: 2550047,
                end: 2552191,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/types.pyi",
                start: 2552191,
                end: 2562274,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/typing.pyi",
                start: 2562274,
                end: 2584745,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/zipapp.pyi",
                start: 2584745,
                end: 2585408,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/__init__.pyi",
                start: 2585408,
                end: 2589565,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/base_events.pyi",
                start: 2589565,
                end: 2602773,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/constants.pyi",
                start: 2602773,
                end: 2603051,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/coroutines.pyi",
                start: 2603051,
                end: 2603277,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/events.pyi",
                start: 2603277,
                end: 2621062,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/exceptions.pyi",
                start: 2621062,
                end: 2621624,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/futures.pyi",
                start: 2621624,
                end: 2624027,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/locks.pyi",
                start: 2624027,
                end: 2626094,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/proactor_events.pyi",
                start: 2626094,
                end: 2630304,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/protocols.pyi",
                start: 2630304,
                end: 2631357,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/queues.pyi",
                start: 2631357,
                end: 2632439,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/runners.pyi",
                start: 2632439,
                end: 2632616,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/selector_events.pyi",
                start: 2632616,
                end: 2634375,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/streams.pyi",
                start: 2634375,
                end: 2638274,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/subprocess.pyi",
                start: 2638274,
                end: 2640472,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/tasks.pyi",
                start: 2640472,
                end: 2647349,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/transports.pyi",
                start: 2647349,
                end: 2649221,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/windows_events.pyi",
                start: 2649221,
                end: 2652025,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/asyncio/windows_utils.pyi",
                start: 2652025,
                end: 2652705,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/collections/__init__.pyi",
                start: 2652705,
                end: 2667136,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/collections/abc.pyi",
                start: 2667136,
                end: 2668081,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/concurrent/__init__.pyi",
                start: 2668081,
                end: 2668081,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/concurrent/futures/__init__.pyi",
                start: 2668081,
                end: 2668189,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/concurrent/futures/_base.pyi",
                start: 2668189,
                end: 2672112,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/concurrent/futures/process.pyi",
                start: 2672112,
                end: 2672811,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/concurrent/futures/thread.pyi",
                start: 2672811,
                end: 2673973,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/__init__.pyi",
                start: 2673973,
                end: 2674762,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/charset.pyi",
                start: 2674762,
                end: 2675918,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/contentmanager.pyi",
                start: 2675918,
                end: 2676498,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/encoders.pyi",
                start: 2676498,
                end: 2676753,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/errors.pyi",
                start: 2676753,
                end: 2677616,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/feedparser.pyi",
                start: 2677616,
                end: 2678188,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/generator.pyi",
                start: 2678188,
                end: 2679314,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/header.pyi",
                start: 2679314,
                end: 2680457,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/headerregistry.pyi",
                start: 2680457,
                end: 2683434,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/iterators.pyi",
                start: 2683434,
                end: 2683769,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/message.pyi",
                start: 2683769,
                end: 2688853,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/parser.pyi",
                start: 2688853,
                end: 2690288,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/policy.pyi",
                start: 2690288,
                end: 2692604,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/utils.pyi",
                start: 2692604,
                end: 2694234,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/mime/__init__.pyi",
                start: 2694234,
                end: 2694234,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/mime/application.pyi",
                start: 2694234,
                end: 2694686,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/mime/audio.pyi",
                start: 2694686,
                end: 2695135,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/mime/base.pyi",
                start: 2695135,
                end: 2695452,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/mime/image.pyi",
                start: 2695452,
                end: 2695901,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/mime/message.pyi",
                start: 2695901,
                end: 2696143,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/mime/multipart.pyi",
                start: 2696143,
                end: 2696601,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/mime/nonmultipart.pyi",
                start: 2696601,
                end: 2696727,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/email/mime/text.pyi",
                start: 2696727,
                end: 2697002,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/encodings/__init__.pyi",
                start: 2697002,
                end: 2697077,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/encodings/utf_8.pyi",
                start: 2697077,
                end: 2697650,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/html/__init__.pyi",
                start: 2697650,
                end: 2697772,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/html/entities.pyi",
                start: 2697772,
                end: 2697908,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/html/parser.pyi",
                start: 2697908,
                end: 2698944,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/http/__init__.pyi",
                start: 2698944,
                end: 2700633,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/http/client.pyi",
                start: 2700633,
                end: 2706902,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/http/cookiejar.pyi",
                start: 2706902,
                end: 2711790,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/http/cookies.pyi",
                start: 2711790,
                end: 2713070,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/http/server.pyi",
                start: 2713070,
                end: 2716246,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/importlib/__init__.pyi",
                start: 2716246,
                end: 2716843,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/importlib/abc.pyi",
                start: 2716843,
                end: 2720365,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/importlib/machinery.pyi",
                start: 2720365,
                end: 2724301,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/importlib/metadata.pyi",
                start: 2724301,
                end: 2728068,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/importlib/resources.pyi",
                start: 2728068,
                end: 2729077,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/importlib/util.pyi",
                start: 2729077,
                end: 2730948,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/json/__init__.pyi",
                start: 2730948,
                end: 2733214,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/json/decoder.pyi",
                start: 2733214,
                end: 2734266,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/json/encoder.pyi",
                start: 2734266,
                end: 2735008,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/multiprocessing/__init__.pyi",
                start: 2735008,
                end: 2738584,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/multiprocessing/connection.pyi",
                start: 2738584,
                end: 2740677,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/multiprocessing/context.pyi",
                start: 2740677,
                end: 2747062,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/multiprocessing/managers.pyi",
                start: 2747062,
                end: 2749967,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/multiprocessing/pool.pyi",
                start: 2749967,
                end: 2753419,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/multiprocessing/process.pyi",
                start: 2753419,
                end: 2754561,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/multiprocessing/queues.pyi",
                start: 2754561,
                end: 2755670,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/multiprocessing/shared_memory.pyi",
                start: 2755670,
                end: 2756791,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/multiprocessing/spawn.pyi",
                start: 2756791,
                end: 2757478,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/multiprocessing/synchronize.pyi",
                start: 2757478,
                end: 2759550,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/multiprocessing/dummy/__init__.pyi",
                start: 2759550,
                end: 2760715,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/multiprocessing/dummy/connection.pyi",
                start: 2760715,
                end: 2761812,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/os/__init__.pyi",
                start: 2761812,
                end: 2787929,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/os/path.pyi",
                start: 2787929,
                end: 2794157,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/tkinter/__init__.pyi",
                start: 2794157,
                end: 2819867,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/tkinter/commondialog.pyi",
                start: 2819867,
                end: 2820144,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/tkinter/constants.pyi",
                start: 2820144,
                end: 2821024,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/tkinter/dialog.pyi",
                start: 2821024,
                end: 2821315,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/tkinter/filedialog.pyi",
                start: 2821315,
                end: 2823548,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/tkinter/messagebox.pyi",
                start: 2823548,
                end: 2824698,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/tkinter/ttk.pyi",
                start: 2824698,
                end: 2831053,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/unittest/__init__.pyi",
                start: 2831053,
                end: 2832087,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/unittest/async_case.pyi",
                start: 2832087,
                end: 2832458,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/unittest/case.pyi",
                start: 2832458,
                end: 2845460,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/unittest/loader.pyi",
                start: 2845460,
                end: 2846682,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/unittest/mock.pyi",
                start: 2846682,
                end: 2851986,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/unittest/result.pyi",
                start: 2851986,
                end: 2853603,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/unittest/runner.pyi",
                start: 2853603,
                end: 2854813,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/unittest/signals.pyi",
                start: 2854813,
                end: 2855201,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/unittest/suite.pyi",
                start: 2855201,
                end: 2855992,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/unittest/util.pyi",
                start: 2855992,
                end: 2856913,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/urllib/__init__.pyi",
                start: 2856913,
                end: 2856913,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/urllib/error.pyi",
                start: 2856913,
                end: 2857230,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/urllib/parse.pyi",
                start: 2857230,
                end: 2861881,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/urllib/request.pyi",
                start: 2861881,
                end: 2871885,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/urllib/response.pyi",
                start: 2871885,
                end: 2873567,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3/urllib/robotparser.pyi",
                start: 2873567,
                end: 2874262,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3.6/secrets.pyi",
                start: 2874262,
                end: 2874763,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3.7/contextvars.pyi",
                start: 2874763,
                end: 2875886,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/stdlib/3.7/dataclasses.pyi",
                start: 2875886,
                end: 2878257,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/enum.pyi",
                start: 2878257,
                end: 2881124,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/gflags.pyi",
                start: 2881124,
                end: 2891693,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/ipaddress.pyi",
                start: 2891693,
                end: 2896812,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/pathlib2.pyi",
                start: 2896812,
                end: 2902320,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/pymssql.pyi",
                start: 2902320,
                end: 2904196,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/OpenSSL/__init__.pyi",
                start: 2904196,
                end: 2904196,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/OpenSSL/crypto.pyi",
                start: 2904196,
                end: 2911840,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/concurrent/__init__.pyi",
                start: 2911840,
                end: 2911840,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/concurrent/futures/__init__.pyi",
                start: 2911840,
                end: 2911948,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/concurrent/futures/_base.pyi",
                start: 2911948,
                end: 2915871,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/concurrent/futures/process.pyi",
                start: 2915871,
                end: 2916570,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/concurrent/futures/thread.pyi",
                start: 2916570,
                end: 2917732,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/fb303/FacebookService.pyi",
                start: 2917732,
                end: 2926407,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/fb303/__init__.pyi",
                start: 2926407,
                end: 2926407,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/kazoo/__init__.pyi",
                start: 2926407,
                end: 2926407,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/kazoo/client.pyi",
                start: 2926407,
                end: 2929717,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/kazoo/exceptions.pyi",
                start: 2929717,
                end: 2931771,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/kazoo/recipe/__init__.pyi",
                start: 2931771,
                end: 2931771,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/kazoo/recipe/watchers.pyi",
                start: 2931771,
                end: 2932322,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/routes/__init__.pyi",
                start: 2932322,
                end: 2932699,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/routes/mapper.pyi",
                start: 2932699,
                end: 2934993,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/routes/util.pyi",
                start: 2934993,
                end: 2935569,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/scribe/__init__.pyi",
                start: 2935569,
                end: 2935569,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/scribe/scribe.pyi",
                start: 2935569,
                end: 2936768,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/scribe/ttypes.pyi",
                start: 2936768,
                end: 2937151,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/__init__.pyi",
                start: 2937151,
                end: 2940873,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/BaseHTTPServer.pyi",
                start: 2940873,
                end: 2940902,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/CGIHTTPServer.pyi",
                start: 2940902,
                end: 2940930,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/SimpleHTTPServer.pyi",
                start: 2940930,
                end: 2940961,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/__init__.pyi",
                start: 2940961,
                end: 2943344,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/_dummy_thread.pyi",
                start: 2943344,
                end: 2943371,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/_thread.pyi",
                start: 2943371,
                end: 2943392,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/cPickle.pyi",
                start: 2943392,
                end: 2943414,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/configparser.pyi",
                start: 2943414,
                end: 2943441,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/email_mime_base.pyi",
                start: 2943441,
                end: 2943471,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/email_mime_multipart.pyi",
                start: 2943471,
                end: 2943506,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/email_mime_nonmultipart.pyi",
                start: 2943506,
                end: 2943544,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/email_mime_text.pyi",
                start: 2943544,
                end: 2943573,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/html_entities.pyi",
                start: 2943573,
                end: 2943602,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/html_parser.pyi",
                start: 2943602,
                end: 2943627,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/http_client.pyi",
                start: 2943627,
                end: 2943649,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/http_cookiejar.pyi",
                start: 2943649,
                end: 2943673,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/http_cookies.pyi",
                start: 2943673,
                end: 2943694,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/queue.pyi",
                start: 2943694,
                end: 2943714,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/reprlib.pyi",
                start: 2943714,
                end: 2943733,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/socketserver.pyi",
                start: 2943733,
                end: 2943760,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/urllib_error.pyi",
                start: 2943760,
                end: 2943788,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/urllib_parse.pyi",
                start: 2943788,
                end: 2943816,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/urllib_request.pyi",
                start: 2943816,
                end: 2943846,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/urllib_response.pyi",
                start: 2943846,
                end: 2943877,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/urllib_robotparser.pyi",
                start: 2943877,
                end: 2943903,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/xmlrpc_client.pyi",
                start: 2943903,
                end: 2943927,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/urllib/__init__.pyi",
                start: 2943927,
                end: 2944144,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/urllib/error.pyi",
                start: 2944144,
                end: 2944292,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/urllib/parse.pyi",
                start: 2944292,
                end: 2945347,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/urllib/request.pyi",
                start: 2945347,
                end: 2947307,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/urllib/response.pyi",
                start: 2947307,
                end: 2947513,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/six/moves/urllib/robotparser.pyi",
                start: 2947513,
                end: 2947572,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/tornado/__init__.pyi",
                start: 2947572,
                end: 2947572,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/tornado/concurrent.pyi",
                start: 2947572,
                end: 2948588,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/tornado/gen.pyi",
                start: 2948588,
                end: 2951373,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/tornado/httpclient.pyi",
                start: 2951373,
                end: 2954406,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/tornado/httpserver.pyi",
                start: 2954406,
                end: 2955941,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/tornado/httputil.pyi",
                start: 2955941,
                end: 2958622,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/tornado/ioloop.pyi",
                start: 2958622,
                end: 2961419,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/tornado/locks.pyi",
                start: 2961419,
                end: 2962698,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/tornado/netutil.pyi",
                start: 2962698,
                end: 2964047,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/tornado/process.pyi",
                start: 2964047,
                end: 2964709,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/tornado/tcpserver.pyi",
                start: 2964709,
                end: 2965265,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/tornado/testing.pyi",
                start: 2965265,
                end: 2967130,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/tornado/util.pyi",
                start: 2967130,
                end: 2968202,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2/tornado/web.pyi",
                start: 2968202,
                end: 2976911,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/backports_abc.pyi",
                start: 2976911,
                end: 2977131,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/certifi.pyi",
                start: 2977131,
                end: 2977155,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/croniter.pyi",
                start: 2977155,
                end: 2979075,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/decorator.pyi",
                start: 2979075,
                end: 2981882,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/emoji.pyi",
                start: 2981882,
                end: 2982277,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/first.pyi",
                start: 2982277,
                end: 2982759,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/itsdangerous.pyi",
                start: 2982759,
                end: 2991082,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/mock.pyi",
                start: 2991082,
                end: 2996386,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/mypy_extensions.pyi",
                start: 2996386,
                end: 2998437,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pycurl.pyi",
                start: 2998437,
                end: 3011134,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pyre_extensions.pyi",
                start: 3011134,
                end: 3011401,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/singledispatch.pyi",
                start: 3011401,
                end: 3012037,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/tabulate.pyi",
                start: 3012037,
                end: 3013492,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/termcolor.pyi",
                start: 3013492,
                end: 3013944,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/toml.pyi",
                start: 3013944,
                end: 3014760,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/typing_extensions.pyi",
                start: 3014760,
                end: 3017489,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/ujson.pyi",
                start: 3017489,
                end: 3018535,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/__init__.pyi",
                start: 3018535,
                end: 3018644,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/pct_warnings.pyi",
                start: 3018644,
                end: 3019056,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Cipher/AES.pyi",
                start: 3019056,
                end: 3019453,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Cipher/ARC2.pyi",
                start: 3019453,
                end: 3019850,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Cipher/ARC4.pyi",
                start: 3019850,
                end: 3020218,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Cipher/Blowfish.pyi",
                start: 3020218,
                end: 3020625,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Cipher/CAST.pyi",
                start: 3020625,
                end: 3021030,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Cipher/DES.pyi",
                start: 3021030,
                end: 3021427,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Cipher/DES3.pyi",
                start: 3021427,
                end: 3021827,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Cipher/PKCS1_OAEP.pyi",
                start: 3021827,
                end: 3022331,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Cipher/PKCS1_v1_5.pyi",
                start: 3022331,
                end: 3022745,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Cipher/XOR.pyi",
                start: 3022745,
                end: 3023157,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Cipher/__init__.pyi",
                start: 3023157,
                end: 3023299,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Cipher/blockalgo.pyi",
                start: 3023299,
                end: 3023716,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Hash/HMAC.pyi",
                start: 3023716,
                end: 3024136,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Hash/MD2.pyi",
                start: 3024136,
                end: 3024463,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Hash/MD4.pyi",
                start: 3024463,
                end: 3024790,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Hash/MD5.pyi",
                start: 3024790,
                end: 3025117,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Hash/RIPEMD.pyi",
                start: 3025117,
                end: 3025450,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Hash/SHA.pyi",
                start: 3025450,
                end: 3025778,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Hash/SHA224.pyi",
                start: 3025778,
                end: 3026108,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Hash/SHA256.pyi",
                start: 3026108,
                end: 3026438,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Hash/SHA384.pyi",
                start: 3026438,
                end: 3026768,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Hash/SHA512.pyi",
                start: 3026768,
                end: 3027098,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Hash/__init__.pyi",
                start: 3027098,
                end: 3027233,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Hash/hashalgo.pyi",
                start: 3027233,
                end: 3027561,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Protocol/AllOrNothing.pyi",
                start: 3027561,
                end: 3027823,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Protocol/Chaffing.pyi",
                start: 3027823,
                end: 3027967,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Protocol/KDF.pyi",
                start: 3027967,
                end: 3028238,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Protocol/__init__.pyi",
                start: 3028238,
                end: 3028315,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/PublicKey/DSA.pyi",
                start: 3028315,
                end: 3029056,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/PublicKey/ElGamal.pyi",
                start: 3029056,
                end: 3029587,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/PublicKey/RSA.pyi",
                start: 3029587,
                end: 3030679,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/PublicKey/__init__.pyi",
                start: 3030679,
                end: 3030746,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/PublicKey/pubkey.pyi",
                start: 3030746,
                end: 3031357,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Random/__init__.pyi",
                start: 3031357,
                end: 3031387,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Random/random.pyi",
                start: 3031387,
                end: 3031822,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Random/Fortuna/FortunaAccumulator.pyi",
                start: 3031822,
                end: 3032392,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Random/Fortuna/FortunaGenerator.pyi",
                start: 3032392,
                end: 3032749,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Random/Fortuna/SHAd256.pyi",
                start: 3032749,
                end: 3033063,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Random/Fortuna/__init__.pyi",
                start: 3033063,
                end: 3033063,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Random/OSRNG/__init__.pyi",
                start: 3033063,
                end: 3033081,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Random/OSRNG/fallback.pyi",
                start: 3033081,
                end: 3033197,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Random/OSRNG/posix.pyi",
                start: 3033197,
                end: 3033371,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Random/OSRNG/rng_base.pyi",
                start: 3033371,
                end: 3033630,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Signature/PKCS1_PSS.pyi",
                start: 3033630,
                end: 3033916,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Signature/PKCS1_v1_5.pyi",
                start: 3033916,
                end: 3034096,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Signature/__init__.pyi",
                start: 3034096,
                end: 3034164,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Util/Counter.pyi",
                start: 3034164,
                end: 3034380,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Util/RFC1751.pyi",
                start: 3034380,
                end: 3034506,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Util/__init__.pyi",
                start: 3034506,
                end: 3034601,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Util/asn1.pyi",
                start: 3034601,
                end: 3036013,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Util/number.pyi",
                start: 3036013,
                end: 3036814,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Util/randpool.pyi",
                start: 3036814,
                end: 3037347,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/Crypto/Util/strxor.pyi",
                start: 3037347,
                end: 3037415,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/atomicwrites/__init__.pyi",
                start: 3037415,
                end: 3038285,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/attr/__init__.pyi",
                start: 3038285,
                end: 3046054,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/attr/converters.pyi",
                start: 3046054,
                end: 3046405,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/attr/exceptions.pyi",
                start: 3046405,
                end: 3046662,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/attr/filters.pyi",
                start: 3046662,
                end: 3046876,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/attr/validators.pyi",
                start: 3046876,
                end: 3047773,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/backports/__init__.pyi",
                start: 3047773,
                end: 3047773,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/backports/ssl_match_hostname.pyi",
                start: 3047773,
                end: 3047854,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/bleach/__init__.pyi",
                start: 3047854,
                end: 3048731,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/bleach/callbacks.pyi",
                start: 3048731,
                end: 3048937,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/bleach/linkifier.pyi",
                start: 3048937,
                end: 3049915,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/bleach/sanitizer.pyi",
                start: 3049915,
                end: 3051069,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/bleach/utils.pyi",
                start: 3051069,
                end: 3051355,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/__init__.pyi",
                start: 3051355,
                end: 3058341,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/auth.pyi",
                start: 3058341,
                end: 3062481,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/auth_handler.pyi",
                start: 3062481,
                end: 3062731,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/compat.pyi",
                start: 3062731,
                end: 3063044,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/connection.pyi",
                start: 3063044,
                end: 3068274,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/exception.pyi",
                start: 3068274,
                end: 3072842,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/plugin.pyi",
                start: 3072842,
                end: 3073077,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/regioninfo.pyi",
                start: 3073077,
                end: 3073731,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/utils.pyi",
                start: 3073731,
                end: 3079932,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/ec2/__init__.pyi",
                start: 3079932,
                end: 3080102,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/elb/__init__.pyi",
                start: 3080102,
                end: 3082581,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/kms/__init__.pyi",
                start: 3082581,
                end: 3082737,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/kms/exceptions.pyi",
                start: 3082737,
                end: 3083566,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/kms/layer1.pyi",
                start: 3083566,
                end: 3087195,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/__init__.pyi",
                start: 3087195,
                end: 3087690,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/acl.pyi",
                start: 3087690,
                end: 3089312,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/bucket.pyi",
                start: 3089312,
                end: 3097342,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/bucketlistresultset.pyi",
                start: 3097342,
                end: 3099145,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/bucketlogging.pyi",
                start: 3099145,
                end: 3099545,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/connection.pyi",
                start: 3099545,
                end: 3103899,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/cors.pyi",
                start: 3103899,
                end: 3104861,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/deletemarker.pyi",
                start: 3104861,
                end: 3105227,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/key.pyi",
                start: 3105227,
                end: 3113536,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/keyfile.pyi",
                start: 3113536,
                end: 3114220,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/lifecycle.pyi",
                start: 3114220,
                end: 3116094,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/multidelete.pyi",
                start: 3116094,
                end: 3117108,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/multipart.pyi",
                start: 3117108,
                end: 3118941,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/prefix.pyi",
                start: 3118941,
                end: 3119265,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/tagging.pyi",
                start: 3119265,
                end: 3120013,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/user.pyi",
                start: 3120013,
                end: 3120375,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/boto/s3/website.pyi",
                start: 3120375,
                end: 3122867,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/characteristic/__init__.pyi",
                start: 3122867,
                end: 3124190,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/click/__init__.pyi",
                start: 3124190,
                end: 3127062,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/click/_termui_impl.pyi",
                start: 3127062,
                end: 3127538,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/click/core.pyi",
                start: 3127538,
                end: 3139482,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/click/decorators.pyi",
                start: 3139482,
                end: 3148738,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/click/exceptions.pyi",
                start: 3148738,
                end: 3150806,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/click/formatting.pyi",
                start: 3150806,
                end: 3152421,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/click/globals.pyi",
                start: 3152421,
                end: 3152717,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/click/parser.pyi",
                start: 3152717,
                end: 3154858,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/click/termui.pyi",
                start: 3154858,
                end: 3158359,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/click/testing.pyi",
                start: 3158359,
                end: 3160566,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/click/types.pyi",
                start: 3160566,
                end: 3166068,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/click/utils.pyi",
                start: 3166068,
                end: 3167983,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/__init__.pyi",
                start: 3167983,
                end: 3167983,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/exceptions.pyi",
                start: 3167983,
                end: 3168245,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/fernet.pyi",
                start: 3168245,
                end: 3168885,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/x509.pyi",
                start: 3168885,
                end: 3182267,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/__init__.pyi",
                start: 3182267,
                end: 3182330,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/backends/__init__.pyi",
                start: 3182330,
                end: 3182388,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/backends/interfaces.pyi",
                start: 3182388,
                end: 3190626,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/bindings/__init__.pyi",
                start: 3190626,
                end: 3190626,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/bindings/openssl/__init__.pyi",
                start: 3190626,
                end: 3190626,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/bindings/openssl/binding.pyi",
                start: 3190626,
                end: 3190774,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/__init__.pyi",
                start: 3190774,
                end: 3190837,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/cmac.pyi",
                start: 3190837,
                end: 3191253,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/constant_time.pyi",
                start: 3191253,
                end: 3191299,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/hashes.pyi",
                start: 3191299,
                end: 3192597,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/hmac.pyi",
                start: 3192597,
                end: 3193009,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/keywrap.pyi",
                start: 3193009,
                end: 3193527,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/padding.pyi",
                start: 3193527,
                end: 3194067,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/poly1305.pyi",
                start: 3194067,
                end: 3194571,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/asymmetric/__init__.pyi",
                start: 3194571,
                end: 3194634,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/asymmetric/dh.pyi",
                start: 3194634,
                end: 3197124,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/asymmetric/dsa.pyi",
                start: 3197124,
                end: 3200035,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/asymmetric/ec.pyi",
                start: 3200035,
                end: 3207213,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/asymmetric/ed25519.pyi",
                start: 3207213,
                end: 3208198,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/asymmetric/ed448.pyi",
                start: 3208198,
                end: 3209171,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/asymmetric/padding.pyi",
                start: 3209171,
                end: 3209958,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/asymmetric/rsa.pyi",
                start: 3209958,
                end: 3213162,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/asymmetric/utils.pyi",
                start: 3213162,
                end: 3213340,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/asymmetric/x25519.pyi",
                start: 3213340,
                end: 3214259,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/asymmetric/x448.pyi",
                start: 3214259,
                end: 3215164,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/ciphers/__init__.pyi",
                start: 3215164,
                end: 3216462,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/ciphers/aead.pyi",
                start: 3216462,
                end: 3217527,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/ciphers/algorithms.pyi",
                start: 3217527,
                end: 3219766,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/ciphers/modes.pyi",
                start: 3219766,
                end: 3222855,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/kdf/__init__.pyi",
                start: 3222855,
                end: 3223116,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/kdf/concatkdf.pyi",
                start: 3223116,
                end: 3223980,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/kdf/hkdf.pyi",
                start: 3223980,
                end: 3224809,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/kdf/kbkdf.pyi",
                start: 3224809,
                end: 3225660,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/kdf/pbkdf2.pyi",
                start: 3225660,
                end: 3226162,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/kdf/scrypt.pyi",
                start: 3226162,
                end: 3226569,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/kdf/x963kdf.pyi",
                start: 3226569,
                end: 3227084,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/serialization/__init__.pyi",
                start: 3227084,
                end: 3228090,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/serialization/pkcs12.pyi",
                start: 3228090,
                end: 3228203,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/twofactor/__init__.pyi",
                start: 3228203,
                end: 3228238,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/twofactor/hotp.pyi",
                start: 3228238,
                end: 3228778,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/cryptography/hazmat/primitives/twofactor/totp.pyi",
                start: 3228778,
                end: 3229363,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/dateutil/__init__.pyi",
                start: 3229363,
                end: 3229363,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/dateutil/_common.pyi",
                start: 3229363,
                end: 3229708,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/dateutil/parser.pyi",
                start: 3229708,
                end: 3231449,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/dateutil/relativedelta.pyi",
                start: 3231449,
                end: 3234777,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/dateutil/rrule.pyi",
                start: 3234777,
                end: 3238137,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/dateutil/utils.pyi",
                start: 3238137,
                end: 3238419,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/dateutil/tz/__init__.pyi",
                start: 3238419,
                end: 3238759,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/dateutil/tz/_common.pyi",
                start: 3238759,
                end: 3239577,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/dateutil/tz/tz.pyi",
                start: 3239577,
                end: 3243506,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/__init__.pyi",
                start: 3243506,
                end: 3245723,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/app.pyi",
                start: 3245723,
                end: 3254354,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/blueprints.pyi",
                start: 3254354,
                end: 3257796,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/cli.pyi",
                start: 3257796,
                end: 3260138,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/config.pyi",
                start: 3260138,
                end: 3261126,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/ctx.pyi",
                start: 3261126,
                end: 3262689,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/debughelpers.pyi",
                start: 3262689,
                end: 3263416,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/globals.pyi",
                start: 3263416,
                end: 3263854,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/helpers.pyi",
                start: 3263854,
                end: 3265960,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/logging.pyi",
                start: 3265960,
                end: 3266257,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/sessions.pyi",
                start: 3266257,
                end: 3268392,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/signals.pyi",
                start: 3268392,
                end: 3269228,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/templating.pyi",
                start: 3269228,
                end: 3270081,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/testing.pyi",
                start: 3270081,
                end: 3271581,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/views.pyi",
                start: 3271581,
                end: 3272256,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/wrappers.pyi",
                start: 3272256,
                end: 3273509,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/json/__init__.pyi",
                start: 3273509,
                end: 3274198,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/flask/json/tag.pyi",
                start: 3274198,
                end: 3276235,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/geoip2/__init__.pyi",
                start: 3276235,
                end: 3276235,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/geoip2/database.pyi",
                start: 3276235,
                end: 3277329,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/geoip2/errors.pyi",
                start: 3277329,
                end: 3277827,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/geoip2/mixins.pyi",
                start: 3277827,
                end: 3277947,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/geoip2/models.pyi",
                start: 3277947,
                end: 3279817,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/geoip2/records.pyi",
                start: 3279817,
                end: 3281888,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/__init__.pyi",
                start: 3281888,
                end: 3281888,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/__init__.pyi",
                start: 3281888,
                end: 3281907,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/any_pb2.pyi",
                start: 3281907,
                end: 3282218,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/any_test_pb2.pyi",
                start: 3282218,
                end: 3282775,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/api_pb2.pyi",
                start: 3282775,
                end: 3284589,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/descriptor.pyi",
                start: 3284589,
                end: 3291746,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/descriptor_pb2.pyi",
                start: 3291746,
                end: 3310007,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/descriptor_pool.pyi",
                start: 3310007,
                end: 3310751,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/duration_pb2.pyi",
                start: 3310751,
                end: 3311057,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/empty_pb2.pyi",
                start: 3311057,
                end: 3311161,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/field_mask_pb2.pyi",
                start: 3311161,
                end: 3311557,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/json_format.pyi",
                start: 3311557,
                end: 3312470,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/map_proto2_unittest_pb2.pyi",
                start: 3312470,
                end: 3320656,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/map_unittest_pb2.pyi",
                start: 3320656,
                end: 3337121,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/message.pyi",
                start: 3337121,
                end: 3339207,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/message_factory.pyi",
                start: 3339207,
                end: 3339722,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/reflection.pyi",
                start: 3339722,
                end: 3339952,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/service.pyi",
                start: 3339952,
                end: 3341323,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/source_context_pb2.pyi",
                start: 3341323,
                end: 3341521,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/struct_pb2.pyi",
                start: 3341521,
                end: 3343341,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/symbol_database.pyi",
                start: 3343341,
                end: 3343989,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/test_messages_proto2_pb2.pyi",
                start: 3343989,
                end: 3359402,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/test_messages_proto3_pb2.pyi",
                start: 3359402,
                end: 3378786,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/timestamp_pb2.pyi",
                start: 3378786,
                end: 3379094,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/type_pb2.pyi",
                start: 3379094,
                end: 3383777,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/unittest_arena_pb2.pyi",
                start: 3383777,
                end: 3384612,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/unittest_custom_options_pb2.pyi",
                start: 3384612,
                end: 3392316,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/unittest_import_pb2.pyi",
                start: 3392316,
                end: 3393366,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/unittest_import_public_pb2.pyi",
                start: 3393366,
                end: 3393546,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/unittest_mset_pb2.pyi",
                start: 3393546,
                end: 3394573,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/unittest_mset_wire_format_pb2.pyi",
                start: 3394573,
                end: 3394909,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/unittest_no_arena_import_pb2.pyi",
                start: 3394909,
                end: 3395096,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/unittest_no_arena_pb2.pyi",
                start: 3395096,
                end: 3405013,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/unittest_no_generic_services_pb2.pyi",
                start: 3405013,
                end: 3405557,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/unittest_pb2.pyi",
                start: 3405557,
                end: 3446478,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/unittest_proto3_arena_pb2.pyi",
                start: 3446478,
                end: 3457751,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/wrappers_pb2.pyi",
                start: 3457751,
                end: 3458811,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/compiler/__init__.pyi",
                start: 3458811,
                end: 3458811,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/compiler/plugin_pb2.pyi",
                start: 3458811,
                end: 3460404,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/internal/__init__.pyi",
                start: 3460404,
                end: 3460404,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/internal/containers.pyi",
                start: 3460404,
                end: 3463093,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/internal/decoder.pyi",
                start: 3463093,
                end: 3463953,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/internal/encoder.pyi",
                start: 3463953,
                end: 3464998,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/internal/enum_type_wrapper.pyi",
                start: 3464998,
                end: 3465355,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/internal/message_listener.pyi",
                start: 3465355,
                end: 3465503,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/internal/well_known_types.pyi",
                start: 3465503,
                end: 3469199,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/internal/wire_format.pyi",
                start: 3469199,
                end: 3470753,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/util/__init__.pyi",
                start: 3470753,
                end: 3470753,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/google/protobuf/util/json_format_proto3_pb2.pyi",
                start: 3470753,
                end: 3484240,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/__init__.pyi",
                start: 3484240,
                end: 3485611,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/_compat.pyi",
                start: 3485611,
                end: 3486255,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/_stringdefs.pyi",
                start: 3486255,
                end: 3486615,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/bccache.pyi",
                start: 3486615,
                end: 3488011,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/compiler.pyi",
                start: 3488011,
                end: 3494373,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/constants.pyi",
                start: 3494373,
                end: 3494396,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/debug.pyi",
                start: 3494396,
                end: 3495414,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/defaults.pyi",
                start: 3495414,
                end: 3495929,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/environment.pyi",
                start: 3495929,
                end: 3503907,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/exceptions.pyi",
                start: 3503907,
                end: 3504957,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/ext.pyi",
                start: 3504957,
                end: 3506578,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/filters.pyi",
                start: 3506578,
                end: 3509003,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/lexer.pyi",
                start: 3509003,
                end: 3511767,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/loaders.pyi",
                start: 3511767,
                end: 3514500,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/meta.pyi",
                start: 3514500,
                end: 3514838,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/nodes.pyi",
                start: 3514838,
                end: 3519996,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/optimizer.pyi",
                start: 3519996,
                end: 3520656,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/parser.pyi",
                start: 3520656,
                end: 3523171,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/runtime.pyi",
                start: 3523171,
                end: 3526620,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/sandbox.pyi",
                start: 3526620,
                end: 3527765,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/tests.pyi",
                start: 3527765,
                end: 3528326,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/utils.pyi",
                start: 3528326,
                end: 3530353,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/jinja2/visitor.pyi",
                start: 3530353,
                end: 3530659,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/markupsafe/__init__.pyi",
                start: 3530659,
                end: 3533484,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/markupsafe/_compat.pyi",
                start: 3533484,
                end: 3533924,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/markupsafe/_constants.pyi",
                start: 3533924,
                end: 3533991,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/markupsafe/_native.pyi",
                start: 3533991,
                end: 3534246,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/markupsafe/_speedups.pyi",
                start: 3534246,
                end: 3534501,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/maxminddb/__init__.pyi",
                start: 3534501,
                end: 3534679,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/maxminddb/compat.pyi",
                start: 3534679,
                end: 3534921,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/maxminddb/const.pyi",
                start: 3534921,
                end: 3535051,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/maxminddb/decoder.pyi",
                start: 3535051,
                end: 3535266,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/maxminddb/errors.pyi",
                start: 3535266,
                end: 3535312,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/maxminddb/extension.pyi",
                start: 3535312,
                end: 3536434,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/maxminddb/reader.pyi",
                start: 3536434,
                end: 3537665,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql/__init__.pyi",
                start: 3537665,
                end: 3539295,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql/charset.pyi",
                start: 3539295,
                end: 3539622,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql/connections.pyi",
                start: 3539622,
                end: 3544491,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql/converters.pyi",
                start: 3544491,
                end: 3545821,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql/cursors.pyi",
                start: 3545821,
                end: 3547738,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql/err.pyi",
                start: 3547738,
                end: 3548309,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql/times.pyi",
                start: 3548309,
                end: 3548479,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql/util.pyi",
                start: 3548479,
                end: 3548545,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql/constants/CLIENT.pyi",
                start: 3548545,
                end: 3548853,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql/constants/COMMAND.pyi",
                start: 3548853,
                end: 3549260,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql/constants/ER.pyi",
                start: 3549260,
                end: 3560540,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql/constants/FIELD_TYPE.pyi",
                start: 3560540,
                end: 3560894,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql/constants/FLAG.pyi",
                start: 3560894,
                end: 3561120,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql/constants/SERVER_STATUS.pyi",
                start: 3561120,
                end: 3561451,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pymysql/constants/__init__.pyi",
                start: 3561451,
                end: 3561451,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pynamodb/__init__.pyi",
                start: 3561451,
                end: 3561468,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pynamodb/attributes.pyi",
                start: 3561468,
                end: 3565662,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pynamodb/constants.pyi",
                start: 3565662,
                end: 3568700,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pynamodb/exceptions.pyi",
                start: 3568700,
                end: 3569587,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pynamodb/indexes.pyi",
                start: 3569587,
                end: 3570569,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pynamodb/models.pyi",
                start: 3570569,
                end: 3575884,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pynamodb/settings.pyi",
                start: 3575884,
                end: 3576029,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pynamodb/throttle.pyi",
                start: 3576029,
                end: 3576501,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pynamodb/types.pyi",
                start: 3576501,
                end: 3576558,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pynamodb/connection/__init__.pyi",
                start: 3576558,
                end: 3576693,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pynamodb/connection/base.pyi",
                start: 3576693,
                end: 3582381,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pynamodb/connection/table.pyi",
                start: 3582381,
                end: 3585498,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pynamodb/connection/util.pyi",
                start: 3585498,
                end: 3585565,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/pytz/__init__.pyi",
                start: 3585565,
                end: 3587456,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/redis/__init__.pyi",
                start: 3587456,
                end: 3588324,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/redis/client.pyi",
                start: 3588324,
                end: 3603535,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/redis/connection.pyi",
                start: 3603535,
                end: 3607688,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/redis/exceptions.pyi",
                start: 3607688,
                end: 3608257,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/redis/utils.pyi",
                start: 3608257,
                end: 3608393,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/__init__.pyi",
                start: 3608393,
                end: 3609333,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/adapters.pyi",
                start: 3609333,
                end: 3612456,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/api.pyi",
                start: 3612456,
                end: 3613801,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/auth.pyi",
                start: 3613801,
                end: 3615024,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/compat.pyi",
                start: 3615024,
                end: 3615147,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/cookies.pyi",
                start: 3615147,
                end: 3617231,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/exceptions.pyi",
                start: 3617231,
                end: 3618234,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/hooks.pyi",
                start: 3618234,
                end: 3618390,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/models.pyi",
                start: 3618390,
                end: 3623165,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/sessions.pyi",
                start: 3623165,
                end: 3628185,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/status_codes.pyi",
                start: 3628185,
                end: 3628255,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/structures.pyi",
                start: 3628255,
                end: 3629223,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/utils.pyi",
                start: 3629223,
                end: 3630864,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/__init__.pyi",
                start: 3630864,
                end: 3631022,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/__init__.pyi",
                start: 3631022,
                end: 3631936,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/_collections.pyi",
                start: 3631936,
                end: 3633471,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/connection.pyi",
                start: 3633471,
                end: 3635527,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/connectionpool.pyi",
                start: 3635527,
                end: 3638461,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/exceptions.pyi",
                start: 3638461,
                end: 3639874,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/fields.pyi",
                start: 3639874,
                end: 3640398,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/filepost.pyi",
                start: 3640398,
                end: 3640725,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/poolmanager.pyi",
                start: 3640725,
                end: 3642033,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/request.pyi",
                start: 3642033,
                end: 3642553,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/response.pyi",
                start: 3642553,
                end: 3644250,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/contrib/__init__.pyi",
                start: 3644250,
                end: 3644250,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/packages/__init__.pyi",
                start: 3644250,
                end: 3644250,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/packages/ssl_match_hostname/__init__.pyi",
                start: 3644250,
                end: 3644338,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/packages/ssl_match_hostname/_implementation.pyi",
                start: 3644338,
                end: 3644419,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/util/__init__.pyi",
                start: 3644419,
                end: 3645111,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/util/connection.pyi",
                start: 3645111,
                end: 3645299,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/util/request.pyi",
                start: 3645299,
                end: 3645519,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/util/response.pyi",
                start: 3645519,
                end: 3645546,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/util/retry.pyi",
                start: 3645546,
                end: 3646643,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/util/ssl_.pyi",
                start: 3646643,
                end: 3647314,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/util/timeout.pyi",
                start: 3647314,
                end: 3647812,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/requests/packages/urllib3/util/url.pyi",
                start: 3647812,
                end: 3648303,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/simplejson/__init__.pyi",
                start: 3648303,
                end: 3648842,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/simplejson/decoder.pyi",
                start: 3648842,
                end: 3649076,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/simplejson/encoder.pyi",
                start: 3649076,
                end: 3649344,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/simplejson/scanner.pyi",
                start: 3649344,
                end: 3649606,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/__init__.pyi",
                start: 3649606,
                end: 3655145,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/_compat.pyi",
                start: 3655145,
                end: 3656284,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/_internal.pyi",
                start: 3656284,
                end: 3656882,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/_reloader.pyi",
                start: 3656882,
                end: 3657708,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/datastructures.pyi",
                start: 3657708,
                end: 3673363,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/exceptions.pyi",
                start: 3673363,
                end: 3677834,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/filesystem.pyi",
                start: 3677834,
                end: 3678003,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/formparser.pyi",
                start: 3678003,
                end: 3681648,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/http.pyi",
                start: 3681648,
                end: 3687051,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/local.pyi",
                start: 3687051,
                end: 3689366,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/posixemulation.pyi",
                start: 3689366,
                end: 3689564,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/routing.pyi",
                start: 3689564,
                end: 3696113,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/script.pyi",
                start: 3696113,
                end: 3696872,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/security.pyi",
                start: 3696872,
                end: 3697396,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/serving.pyi",
                start: 3697396,
                end: 3701102,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/test.pyi",
                start: 3701102,
                end: 3707059,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/testapp.pyi",
                start: 3707059,
                end: 3707284,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/urls.pyi",
                start: 3707284,
                end: 3710171,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/useragents.pyi",
                start: 3710171,
                end: 3710482,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/utils.pyi",
                start: 3710482,
                end: 3712424,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/wrappers.pyi",
                start: 3712424,
                end: 3721707,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/wsgi.pyi",
                start: 3721707,
                end: 3724789,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/contrib/__init__.pyi",
                start: 3724789,
                end: 3724789,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/contrib/atom.pyi",
                start: 3724789,
                end: 3725925,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/contrib/cache.pyi",
                start: 3725925,
                end: 3729246,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/contrib/fixers.pyi",
                start: 3729246,
                end: 3730906,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/contrib/iterio.pyi",
                start: 3730906,
                end: 3732108,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/contrib/jsrouting.pyi",
                start: 3732108,
                end: 3732433,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/contrib/limiter.pyi",
                start: 3732433,
                end: 3732625,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/contrib/lint.pyi",
                start: 3732625,
                end: 3732657,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/contrib/profiler.pyi",
                start: 3732657,
                end: 3733106,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/contrib/securecookie.pyi",
                start: 3733106,
                end: 3734262,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/contrib/sessions.pyi",
                start: 3734262,
                end: 3736236,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/contrib/testtools.pyi",
                start: 3736236,
                end: 3736447,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/contrib/wrappers.pyi",
                start: 3736447,
                end: 3737050,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/debug/__init__.pyi",
                start: 3737050,
                end: 3738380,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/debug/console.pyi",
                start: 3738380,
                end: 3739587,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/debug/repr.pyi",
                start: 3739587,
                end: 3740433,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/debug/tbtools.pyi",
                start: 3740433,
                end: 3742120,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/middleware/__init__.pyi",
                start: 3742120,
                end: 3742120,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/middleware/dispatcher.pyi",
                start: 3742120,
                end: 3742575,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/middleware/http_proxy.pyi",
                start: 3742575,
                end: 3743259,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/middleware/lint.pyi",
                start: 3743259,
                end: 3745677,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/middleware/profiler.pyi",
                start: 3745677,
                end: 3746245,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/middleware/proxy_fix.pyi",
                start: 3746245,
                end: 3746956,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/werkzeug/middleware/shared_data.pyi",
                start: 3746956,
                end: 3748250,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/__init__.pyi",
                start: 3748250,
                end: 3753826,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/composer.pyi",
                start: 3753826,
                end: 3754421,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/constructor.pyi",
                start: 3754421,
                end: 3758075,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/cyaml.pyi",
                start: 3758075,
                end: 3760375,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/dumper.pyi",
                start: 3760375,
                end: 3761542,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/emitter.pyi",
                start: 3761542,
                end: 3765329,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/error.pyi",
                start: 3765329,
                end: 3765864,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/events.pyi",
                start: 3765864,
                end: 3767526,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/loader.pyi",
                start: 3767526,
                end: 3768293,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/nodes.pyi",
                start: 3768293,
                end: 3768978,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/parser.pyi",
                start: 3768978,
                end: 3770641,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/reader.pyi",
                start: 3770641,
                end: 3771472,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/representer.pyi",
                start: 3771472,
                end: 3773519,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/resolver.pyi",
                start: 3773519,
                end: 3774304,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/scanner.pyi",
                start: 3774304,
                end: 3777876,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/serializer.pyi",
                start: 3777876,
                end: 3778541,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/2and3/yaml/tokens.pyi",
                start: 3778541,
                end: 3780333,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/contextvars.pyi",
                start: 3780333,
                end: 3781456,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/dataclasses.pyi",
                start: 3781456,
                end: 3783827,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/orjson.pyi",
                start: 3783827,
                end: 3784317,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/docutils/__init__.pyi",
                start: 3784317,
                end: 3784375,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/docutils/examples.pyi",
                start: 3784375,
                end: 3784450,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/docutils/nodes.pyi",
                start: 3784450,
                end: 3784711,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/docutils/parsers/__init__.pyi",
                start: 3784711,
                end: 3784769,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/docutils/parsers/rst/__init__.pyi",
                start: 3784769,
                end: 3784827,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/docutils/parsers/rst/nodes.pyi",
                start: 3784827,
                end: 3784885,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/docutils/parsers/rst/roles.pyi",
                start: 3784885,
                end: 3785304,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/docutils/parsers/rst/states.pyi",
                start: 3785304,
                end: 3785436,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/jwt/__init__.pyi",
                start: 3785436,
                end: 3787167,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/jwt/algorithms.pyi",
                start: 3787167,
                end: 3790032,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/jwt/contrib/__init__.pyi",
                start: 3790032,
                end: 3790032,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/jwt/contrib/algorithms/__init__.pyi",
                start: 3790032,
                end: 3790070,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/jwt/contrib/algorithms/py_ecdsa.pyi",
                start: 3790070,
                end: 3790309,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/jwt/contrib/algorithms/pycrypto.pyi",
                start: 3790309,
                end: 3790549,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/pkg_resources/__init__.pyi",
                start: 3790549,
                end: 3802486,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/pkg_resources/py31compat.pyi",
                start: 3802486,
                end: 3802577,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/__init__.pyi",
                start: 3802577,
                end: 3806112,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/BaseHTTPServer.pyi",
                start: 3806112,
                end: 3806138,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/CGIHTTPServer.pyi",
                start: 3806138,
                end: 3806164,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/SimpleHTTPServer.pyi",
                start: 3806164,
                end: 3806190,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/__init__.pyi",
                start: 3806190,
                end: 3808492,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/_dummy_thread.pyi",
                start: 3808492,
                end: 3808520,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/_thread.pyi",
                start: 3808520,
                end: 3808542,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/builtins.pyi",
                start: 3808542,
                end: 3808565,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/cPickle.pyi",
                start: 3808565,
                end: 3808586,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/configparser.pyi",
                start: 3808586,
                end: 3808613,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/email_mime_base.pyi",
                start: 3808613,
                end: 3808643,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/email_mime_multipart.pyi",
                start: 3808643,
                end: 3808678,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/email_mime_nonmultipart.pyi",
                start: 3808678,
                end: 3808716,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/email_mime_text.pyi",
                start: 3808716,
                end: 3808746,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/html_entities.pyi",
                start: 3808746,
                end: 3808774,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/html_parser.pyi",
                start: 3808774,
                end: 3808800,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/http_client.pyi",
                start: 3808800,
                end: 3808826,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/http_cookiejar.pyi",
                start: 3808826,
                end: 3808855,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/http_cookies.pyi",
                start: 3808855,
                end: 3808882,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/queue.pyi",
                start: 3808882,
                end: 3808902,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/reprlib.pyi",
                start: 3808902,
                end: 3808924,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/socketserver.pyi",
                start: 3808924,
                end: 3808951,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/tkinter.pyi",
                start: 3808951,
                end: 3808973,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/tkinter_commondialog.pyi",
                start: 3808973,
                end: 3809008,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/tkinter_constants.pyi",
                start: 3809008,
                end: 3809040,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/tkinter_dialog.pyi",
                start: 3809040,
                end: 3809069,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/tkinter_filedialog.pyi",
                start: 3809069,
                end: 3809102,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/tkinter_tkfiledialog.pyi",
                start: 3809102,
                end: 3809135,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/tkinter_ttk.pyi",
                start: 3809135,
                end: 3809161,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/urllib_error.pyi",
                start: 3809161,
                end: 3809188,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/urllib_parse.pyi",
                start: 3809188,
                end: 3809215,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/urllib_request.pyi",
                start: 3809215,
                end: 3809245,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/urllib_response.pyi",
                start: 3809245,
                end: 3809276,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/urllib_robotparser.pyi",
                start: 3809276,
                end: 3809309,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/urllib/__init__.pyi",
                start: 3809309,
                end: 3809526,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/urllib/error.pyi",
                start: 3809526,
                end: 3809690,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/urllib/parse.pyi",
                start: 3809690,
                end: 3811062,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/urllib/request.pyi",
                start: 3811062,
                end: 3813418,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/urllib/response.pyi",
                start: 3813418,
                end: 3813807,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/six/moves/urllib/robotparser.pyi",
                start: 3813807,
                end: 3813873,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/typed_ast/__init__.pyi",
                start: 3813873,
                end: 3813997,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/typed_ast/ast27.pyi",
                start: 3813997,
                end: 3820982,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/typed_ast/ast3.pyi",
                start: 3820982,
                end: 3828996,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi/third_party/typeshed/third_party/3/typed_ast/conversions.pyi",
                start: 3828996,
                end: 3829080,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi-0.18.0-py3.8.egg-info/PKG-INFO",
                start: 3829080,
                end: 3853364,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi-0.18.0-py3.8.egg-info/SOURCES.txt",
                start: 3853364,
                end: 3968659,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi-0.18.0-py3.8.egg-info/dependency_links.txt",
                start: 3968659,
                end: 3968660,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi-0.18.0-py3.8.egg-info/requires.txt",
                start: 3968660,
                end: 3968763,
                audio: 0,
            },
            {
                filename:
                    "/lib/python3.8/site-packages/jedi-0.18.0-py3.8.egg-info/top_level.txt",
                start: 3968763,
                end: 3968768,
                audio: 0,
            },
        ],
        remote_package_size: 1852202,
        package_uuid: "b5f0b548-5aa3-4561-9987-282cb1fa8e88",
    });
})();
