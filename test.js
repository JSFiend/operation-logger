
const Logger = require("./index.js");

let logger = new Logger("test");

logger.log('message', [1,2,3], {a:1, b:2});

function testFunction () {
    logger.log('message2', [1,2,3], {a:1, b:2});
}

testFunction();