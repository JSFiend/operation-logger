const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label, splat, printf} = format;
const is = require('is');
const callsites = require('callsites');
const path = require('path');
require('winston-daily-rotate-file');

const Logger = function (name, opts = {}) {

    const transport = new transports.DailyRotateFile({
        filename: `${name}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: false,
        dirname: opts.dirname || '.',
        maxFiles: opts.maxFiles || '7d'
    });

    const printfFn = function (info) {
        let {timestamp, message, meta} = info;
        // 时间、地点、人物、事件
        let log = `${timestamp} `;
        let fileInfo = meta.pop();
        let {fileName, lineNumber, columnNumber, functionName} = fileInfo;
        log += formatMessage(fileName) + ':';
        log += formatMessage(lineNumber) + '|';
        log += formatMessage(columnNumber) + ' ';
        if (functionName) log += formatMessage(functionName) + ' ';
        log += formatMessage(message) + ' ';
        meta.forEach(item => log += formatMessage(item) + ' ');
        return log
    };

    const formatMessage = function (message) {
        if (is.string(message)) return message;
        else if (is.array(message) || is.object(message)) return JSON.stringify(message);
        else return message
    };

    const logger = createLogger({
        format: combine(
            timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
            splat(), // 把额外参数用 meta 数组保存起来
            printf(printfFn)
        ),
        transports: [
            transport,
            new transports.Console()
        ]
    });
    this.logger = logger;
};

Logger.prototype.log = function (...message) {
    let callsite = callsites();
    let fileInfo = {};
    callsite = callsite[1];
    if (callsite) {
        fileInfo = {
            fileName: path.basename(callsite.getFileName()),
            lineNumber: callsite.getLineNumber(),
            columnNumber: callsite.getColumnNumber(),
            functionName: callsite.getFunctionName(),
        }
    }
    this.logger.info(...message, fileInfo)
};

module.exports = Logger;
