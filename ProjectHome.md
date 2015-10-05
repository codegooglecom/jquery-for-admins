## How to easily include script: ##
jq4a is compatible with...
  * Windows Scripting Host/JScript
  * Mozilla Rhino

### Via AJAX: ###
In WSH/JScript :
```
var a=new ActiveXObject("Msxml2.XMLHTTP");a.Open("GET","http://jquery-for-admins.googlecode.com/svn/trunk/jq4a.js",false);
a.Send();eval(a.responseText);
```
In Mozilla/Rhino :
```
var a=readUrl("http://jquery-for-admins.googlecode.com/svn/trunk/jq4a.js");eval(a);
```
### From a File: ###
In WSH/JScript :
Assuming jq4a.js exists in the same folder, simply call:
```
eval(new ActiveXObject("Scripting.FileSystemObject").OpenTextFile("jq4a.js",1).ReadAll());
```
In Mozilla/Rhino :
```
load("jq4a.js");
```
## Current functions include: ##

```
$.echo(txt);
```
Print 'txt' to the console. Under WSH/JScript this is 'WScript.Echo()', under Rhino this is 'print()'.

```
$.tee(cmdStr, itFunc, echoIt);
```
Similar to UNIX "tee" command.
_cmdStr_ is the command to run (ie: "DIR /s", "TYPE file.txt", "PROGRAM.EXE")
_itFunc_ is a function that will be called for every line of output resulting from _cmdStr_
_echoIt_ bool. If true, output will also be passed to $.echo()

```
$.each(axObj, itFunc);
```
Similar to jQuery.each(). Works with...
  * Arrays
  * ActiveX Objects that use Enumerator()
  * JScript Objects for(var x in obj) {}
_axObj_ is the object to iterate through.
_itFunc_ will be passed each iteration.

```
$.shell.execute(cmdStr);
```
Will execute command-line commands or executable files (checks if 'cmdStr' exists).
Returns a cmdObj with these properties:
.destroy() = Clean up references and dispose of the object.
.readLine() = Read a line from 'StdOut' of the process.

```
$.file.exists(path);
```
Returns true if the file at 'path' exists, false if it does not.

```
$.echoCmd(cmdStr);
```
Calls $.shell.execute(cmdStr) and displays the output using $.echo();

```
$.ajax(aOpts);
```
Similar to jQuery.ajax(). Pass a JSON object with these properties:
  * .type _(optional)_ defaults to 'GET'.
  * .username _(optional)_ if specified, will be passed to .Open() for Authenticate header.
  * .password _(optional)_ ignored if .username is not specified.
  * .url the URL of the request to send, ie: "http://www.google.com"
  * .success _(optional)_ called if request is successful (no exception thrown), passed the responseText string.
  * .error _(optional)_ called if the request has an error, passed the exception object.

```
$.reboot()
```
Windows/WSH: Uses WMI to reboot the system.
Windows/Java: Uses shutdown.exe with arguments to reboot the system.
Unix/Java: Uses 'reboot' to reboot the system.
```
$.shutdown()
```
Windows: Uses WMI to shutdown the system.
Windows/Java: Uses shutdown.exe with arguments to shutdown the system.
Unix/Java: Uses 'poweroff' to shutdown the system.
```
$.base64Encode(input)
```
Returns the supplied string encoded to base64.

```
$.trim(str);
```
Trims a string both left and right.

```
$.contains(str, obj);
```
Check if 'obj' (an array or string) contains 'str'.

## A StringWriter/StringBuilder prototype helper is also included ##
Under WSH a .NET StringWriter will be created using COM.
Under Mozilla/Rhino a StringBuilder class will be created.
Failing these two, a JavaScript string will be used.

To declare a StringWriter object:
```
var x = new $.stringWriter();
```
To write text to the StringWriter:
```
x.Write(wobj);
```
To write text with a newline:
```
x.WriteLine(wobj)
```
To get the contents of the StringWriter:
```
x.ToString(wargs)
```
To check if the StringWriter is using native support (.NET StringWriter/Java StringBuilder):
```
x.isNative
```

## Environment Checks ##
```
$.environment.windows;
$.environment.mac;
$.environment.unix;
$.environment.java;
$.environment.activeX;
```

See my blog post at:
http://mikesharp.wordpress.com/2011/04/03/jquery-for-administrators/