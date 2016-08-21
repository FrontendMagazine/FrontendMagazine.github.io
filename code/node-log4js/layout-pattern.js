// file: layout-pattern.js
var log4js = require('log4js');
log4js.configure({
  appenders: [{
    type: 'console',
    layout: {
      type: 'pattern',
      pattern: '[%r] [%[%5.5p%]] - %m%n'
    }
  }]
})
var logger = log4js.getLogger('layout-pattern');
logger.debug("Time:", new Date());
