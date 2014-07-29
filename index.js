"use strict";

var util = require('util');
var serialport = require("serialport");
var Iconv = require('iconv').Iconv;
var SerialPort = serialport.SerialPort;
var Buffer = require('buffer').Buffer;

function Thermal(path, options) {
  serialport.SerialPort.call(this, path, options);
  
  var _this = this;
  this.byteTime = parseFloat(11/this.options.baudrate);
  this.timeout = 0;
  
  this.UPC_A = 0; //digits only. length: 11-12 
  this.UPC_E = 1; //digits only. length: 11-12. don`t work
  this.EAN13 = 2; //digits only. length: 12-13
  this.EAN8 = 3; //digits only. length: 7-8
  this.CODE39 = 4; //[0-9 A-Z $ % + - . /]. length: 1-12
  this.I25 = 5; //digits only. length: 1-25
  this.CODEBAR = 6; //[0-9 A-D $]. length: 1-15
  this.CODE93 = 7; //all ascii table (0-127). length: 1-19
  this.CODE128 = 8; //all ascii table (0-127). length: 2-18
  this.CODE11 = 9; //digits and dash (-). length: 21
  this.MSI = 10; //digits only. length: 16
	
  this.on("open", function() {
    _this.init();
    _this.emit('ready');
  });
}
util.inherits(Thermal, serialport.SerialPort);

Thermal.prototype.init = function () {
  this.command(new Buffer([27, 64]));
  this.setControlParams(20,60,250);
};

Thermal.prototype.text = function(txt) {
  var _this = this;
  var iconv = new Iconv('UTF-8', 'CP866//TRANSLIT//IGNORE');
  var buffer = iconv.convert(txt);

  setTimeout(function () {
    _this.write(buffer);
    _this.write("\n");
    _this.timeout = buffer.length * _this.timeout;
  },buffer.length * _this.timeout);
};

Thermal.prototype.command = function (data) {
  var _this = this;
  
  setTimeout(function () {
    _this.write(data);
    _this.timeout = data.length * _this.timeout;
  },data.length * _this.timeout);
};

Thermal.prototype.print = function(txt) {
  this.text(txt);
  return this;
};

Thermal.prototype.feed = function (n) {
  for(var i=0; i<n; i++)
    this.command("\n");
  return this;  
};

Thermal.prototype.inverseOn = function () {
  this.command(new Buffer([29,66,1]));
//this.command(new Buffer('1D4201','hex'));
  return this;
};

Thermal.prototype.inverseOff = function () {
  this.command(new Buffer([29,66,0]));
  return this;
};

Thermal.prototype.justify = function (n) {
  var c = '';
  
  if(n) 
    c = n.toUpperCase();
  
  switch(c){
    case 'C': 
      var pos = 1;
      break;
    case 'R':  
  		var pos = 2;
  		break;	
  	default:
  	  var pos = 0;
  	  break;	
  }

  this.command(new Buffer([27,97,pos]));
  return this;
};

Thermal.prototype.boldOn = function () {
  this.command(new Buffer([27,69,1]));
  return this;
};

Thermal.prototype.boldOff = function () {
  this.command(new Buffer([27,69,0]));
  return this;
};

Thermal.prototype.underlineOn = function (n) {
  n = parseInt(n) || 1;

  this.command(new Buffer([27,45,n]));
  return this;
};

Thermal.prototype.underlineOff = function () {
  this.command(new Buffer([27,45,0]));
  return this;
};

Thermal.prototype.setSize = function (n) {
  var c = '';
  
  if(n) 
    c = n.toUpperCase();
  
  switch(c){
		case 'L':
			var size = 17;
			break;	
    case 'M':
			var size = 1;
			break;
		default:      
      var size = 0;
      break;
  }
  this.command(new Buffer([29,33,size]));
  return this;
};

Thermal.prototype.setLineHeight = function (n) {
  if(typeof(n)==='undefined' || n===0 ) var n = 32;
  if(n < 24) n = 24;
  if(n > 255) n = 255;

  this.command(new Buffer([27,51,n]));
  return this;
};

Thermal.prototype.doubleHeightOn = function () {
  this.command(new Buffer([27,33,16]));
  return this;
};

Thermal.prototype.doubleHeightOff = function () {
  this.command(new Buffer([27,33,0]));
  return this;
};

Thermal.prototype.doubleWidthOn = function () {
  this.command(new Buffer([27,14]));
  return this;
};

Thermal.prototype.doubleWidthOff = function () {
  this.command(new Buffer([27,20]));
  return this;
};

Thermal.prototype.upsideDownOn = function () {
  this.command(new Buffer([27,123,1]));
  return this;
};

Thermal.prototype.upsideDownOff = function () {
  this.command(new Buffer([27,123,0]));
  return this;
};

Thermal.prototype.online = function () {
  this.command(new Buffer([27, 61, 1]));
  return this;
};

Thermal.prototype.offline = function () {
  this.command(new Buffer([27, 61, 0]));
  return this;
};

Thermal.prototype.selftest = function () {
  this.command(new Buffer([18,84]));
  return this;
};

Thermal.prototype.printBarcode = function (text, type) {
  this.command(new Buffer([29, 72, 2])); //text pos. 0-3. 0 - don`t display, 1 - on top, 2 - on bottom
  this.command(new Buffer([29, 119, 3])); //barcode width. 2-3. default is 3
  this.command(new Buffer([29, 107, type])); //set barcode type
  this.command(text);
  return this;
};

Thermal.prototype.setBarcodeHeight = function (n) {
  this.command(new Buffer([29, 104, n]));
  return this;
};

Thermal.prototype.setControlParams = function (dots, time, interval) {
/*
Set “max heating dots”,”heating time”, “heating interval”
n1 = 0-255 Max printing dots,Unit(8dots),Default:7(64 dots)
n2 = 3-255 Heating time,Unit(10us),Default:80(800us)
n3 = 0-255 Heating interval,Unit(10us),Default:2(20us)
The more max heting dots, the more peak current will cost
whenprinting, the faster printing speed. The max heating dots is
8*(n1+1)
The more heating time, the more density , but the slower printing speed. If heating time is too short, blank page may occur.
The more heating interval, the more clear, but the slower printingspeed.
*/
  this.command(new Buffer([27, 55, dots, time, interval]));
  return this;
};

Thermal.prototype.setCodeTable = function (n) {
//n: 0-47
/*
0 - CP437 [USA, european standard]
1 - KataKana [Katakana]
2 - CP850 [Multi-lang]
3 - CP860 [Portuguese]
4 - CP863 [Canada - french]
5 - CP865 [Nordic]
6 - WCP1251 [Cyrillic]
7 - CP866 Slavic 2
8 - МИК [Slavic / Bolgarian]
9 - CP755 [Eastern Europe, Latvia 2]
10 - [Iran, Persian]
11 - reserved
12 - reserved
13 - reserved
14 - reserved
15 - CP862 [Hebrew]
16 - WCP1252 [Latin 1]
17 - WCP1253 [Greeсу]
18 - CP852 [Latin 2]
19 - CP858 [1 + european languages, latin symbols]
20 - Иран Ⅱ [Persian]
21 - Latvia
22 - CP864 [Arabic]
23 - ISO-8859- 1 [Western Europe]
24 - CP737 [Greece]
25 - WCP1257 [Baltic]
26 - Thai
27 - CP720 [Arabic]
28 - CP855
29 - CP857 [Turkish]
30 - WCP1250 [Central Europe]
31 - CP775
32 - WCP1254 [Turkish]
33 - WCP1255 [Arabic]
34 - WCP1256 [Arabic]
35 - WCP1258 [Vietnamese]
36 - ISO-8859- 2 [Latin 2]
37 - ISO-8859- 3 [Latin 3]
38 - ISO-8859- 4 [Baltic]
39 - ISO-8859- 5 [Cyrillic]
40 - ISO-8859- 6 [Arabic]
41 - ISO-8859- 7 [Greece]
42 - ISO-8859- 8 [Arabic]
43 - ISO-8859- 9 [Turkish]
44 - ISO-8859- 15 [Latin 9]
45 - [Thai 2]
46 - CP856
47 - CP874
*/
  this.command(new Buffer([27, 116, n]));
  return this;
};

/*
Prints all buffered data to the print region collectively, then recovers to the standard mode.
-All buffer data is deleted after printing.
-The print area set by ESC W (Set print region in page mode) is reset to the default setting. ï No paper cut is executed.
-Sets the print position to the beginning of the next line after execution.
-This command is enabled only in page mode.
*/
Thermal.prototype.flush = function () {
  this.command(new Buffer([12]));
  return this;
};
	
module.exports = Thermal;
