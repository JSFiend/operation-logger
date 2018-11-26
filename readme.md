
## 运营日志
运营日志，除了打印日志信息，额外打印信息的触发时间，触发文件名，文件行数、列数，触发的上下文函数名。方便精准定位问题。
#### USAGE 
```
const Logger = require("./index.js");

let logger = new Logger("test");

logger.log('message', [1,2,3], {a:1, b:2});

function testFunction () {
    logger.log('message2', [1,2,3], {a:1, b:2});
}

testFunction();
```
#### OUTPUT
> 2018-11-26 20:06:05.120 test.js:6|8 message [1,2,3] {"a":1,"b":2}

> 2018-11-26 20:06:05.130 test.js:9|12 testFunction message2 [1,2,3] {"a":1,"b":2}
