var childProcess = require('child_process');
var plist = require('plist');
var Q = require('q');

/**
 * load plist profile from a mobile provisioning file
 * @param {String} filename
 * @return {Promise}
 */
exports.loadProfile = function (filename) {
    var deferred = Q.defer();
    var process = childProcess.spawn('security', ['cms', '-D', '-i', filename]);

    var profile = '';
    process.stdout.on('close', function (data) {
        if ( profile ) {
            var result = plist.parse(profile);
            deferred.resolve(result);
        }
        else {
            deferred.reject("could not extract profile");
        }
    });

    process.stdout.on('data', function (data) {
        profile += String(data);
    });

    process.stderr.on('data', function (data) {
        deferred.reject(String(data));
    });

    return deferred.promise;
};

/**
 * tries to unlock the given keychain
 * @param {String} keychain filename
 * @param {String} password
 * @return {Promise}
 */
exports.unlockKeychain = function (keychain, password) {
    var deferred = Q.defer();


    addKeychain(keychain)
      .then(function () {

        var process = childProcess.spawn('security', ['unlock-keychain', '-p', password, keychain]);

        process.stdout.on('close', function (data) {
            deferred.resolve();
        });

        process.stdout.on('data', function (data) {
        });

        process.stderr.on('data', function (data) {
            deferred.reject(String(data));
        });
      })
      .catch(deferred.reject);

    return deferred.promise;
};


/**
 * adds the given keychain to the lookup list
 * @param {String} keychain filename
 * @return {Promise}
 */
function addKeychain (keychain) {
    var deferred = Q.defer();
    var process = childProcess.spawn('security', ['list-keychains', '-s', keychain]);

    process.stdout.on('close', function (data) {
        deferred.resolve();
    });

    process.stdout.on('data', function (data) {
    });

    process.stderr.on('data', function (data) {
        deferred.reject(String(data));
    });

    return deferred.promise;
};
