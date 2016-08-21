var log4js = require('log4js');
var express = require('express');

log4js.configure({
 appenders: [{
   type: 'DateFile',
   filename: 'access.log',
   pattern: '-yyyy-MM-dd.log',
   alwaysIncludePattern: true,
   category: 'access'
 }]
});

var app = express();
app.use(log4js.connectLogger(log4js.getLogger('access'), { level: log4js.levels.INFO }));
app.get('/', function(req,res) {
  res.send('前端外刊评论');
});
app.listen(5000);
