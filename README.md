
## Example

    var tools = require('signing-helper');
    
    tools.loadProfile("./test/Test.mobileprovision")
        .then(function(data) {
            console.log(data);
        })
        .catch(function (err) {
            console.log("ERROR", err);
        });
