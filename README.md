# thermal
=======

Node.js thermal printer library for Raspberry Pi

## Quick Examples

```javascript
var Termal = require('thermal');
var printer = new Termal('/dev/ttyAMA0', {
    baudrate: 19200
});

printer.on("ready",function(){
  printer.print("Hello World").feed(1)
});
```

## API
### feed(n)
Feeds by the specified number of lines

---------------------------------------

### inverseOn
Turn white/black reverse printing mode on

---------------------------------------

### inverseOff
Turn white/black reverse printing mode off

---------------------------------------

### justify(n)
Select align mode: L - left, C - center, R - right

---------------------------------------

### boldOn
Set bold font

---------------------------------------

### boldOff
Cancel bold font

---------------------------------------


### underlineOn(n)
Set underline mode: 0 - no underline, 1 - normal underline, 2 - thick underline

---------------------------------------

### underlineOff
Cancel underline mode

---------------------------------------

### setSize(n)
Set font size: L - Large: double width and height, M - Medium: double height, S - Small: standard width and height

---------------------------------------

### setLineHeight(n)
Set line spacing: integer value in range (24,255)

---------------------------------------

### doubleHeightOn
Set font double height mode

---------------------------------------

### doubleHeightOff
Cancel font double height mode

---------------------------------------

### doubleWidthOn
Set font double width mode

---------------------------------------

### doubleWidthOff
Cancel font double width mode

---------------------------------------

### upsideDownOn
Set character updown mode

---------------------------------------

### upsideDownOff
Cancel character updown mode

---------------------------------------

### online
Take the printer online

---------------------------------------

### offline
Take the printer offline

---------------------------------------

### printBarcode(text, type)
Print barcode with selected text and type. Availiable types:
```js
  UPC_A - digits only. length: 11-12 
	UPC_E - digits only. length: 11-12
	EAN13 - digits only. length: 12-13
	EAN8 - digits only. length: 7-8
	CODE39 - [0-9 A-Z $ % + - . /]. length: 1-12
	I25 - digits only. length: 1-25
	CODEBAR - [0-9 A-D $]. length: 1-15
	CODE93 - all ascii table (0-127). length: 1-19
	CODE128 - all ascii table (0-127). length: 2-18
	CODE11 - digits and dash (-). length: 21
	MSI - digits only. length: 16
```

---------------------------------------

### setControlParams(dots, time, interval)
Set “max heating dots”,”heating time”, “heating interval”

n1 = 0-255 Max printing dots,Unit(8dots),Default:7(64 dots)

n2 = 3-255 Heating time,Unit(10us),Default:80(800us)

n3 = 0-255 Heating interval,Unit(10us),Default:2(20us)

The more max heting dots, the more peak current will cost
whenprinting, the faster printing speed. The max heating dots is
8*(n1+1)

The more heating time, the more density , but the slower printing speed. If heating time is too short, blank page may occur.

The more heating interval, the more clear, but the slower printingspeed.

---------------------------------------

### setCodeTable(n)
Select character code table

n: 0-47

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

---------------------------------------

### flush
Prints all buffered data to the print region collectively, then recovers to the standard mode.

-All buffer data is deleted after printing.

-The print area set by ESC W (Set print region in page mode) is reset to the default setting. ï No paper cut is executed.

-Sets the print position to the beginning of the next line after execution.

-This command is enabled only in page mode.

---------------------------------------