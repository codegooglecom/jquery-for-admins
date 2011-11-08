/*!
 * jQuery for Administrators Core
 * http://code.google.com/p/jquery-for-admins/
 *
 * Copyright 2011, Michael Snead
 * Dual licensed under the MIT or GPL Version 2 licenses (just like jQuery).
 *
 * 11/3/2011
 *
 * This code is pre-alpha.
 */

 
 //Msxml2.XMLHTTP
 //http://msdn.microsoft.com/en-us/library/ms535874(v=vs.85).aspx
 
 (function(context) {
	var $ = function(selector, context) {
	};
	var trimLeft = /^\s+/;
	var trimRight = /\s+$/;
	
	$.tee = function(cmdStr, itFunc, echoIt) {
		var shell = new ActiveXObject("WScript.Shell");
		var exec = shell.Exec(cmdStr);
		var stdout = exec.StdOut;
		while(!stdout.AtEndOfStream) {
			if(echoIt === undefined || echoIt === true) { 
				var buff = stdout.ReadLine();
				WScript.Echo(buff);
				if(itFunc) { itFunc(buff); }
			} else {
				var buff = stdout.ReadLine();
				if(itFunc) { itFunc(buff); }
			}
		}
	}
		
	$.each = function(axObj, itFunc) {
		var itemCount = 0;
		if(Object.prototype.toString.call(axObj)==='[object Array]'){
			for(var i=0;i<axObj.length;i++){ //It's an array, loop through it
				itFunc(axObj[i],i);
			}
		} else {
			if(!(axObj instanceof Object)) { //It's not a JS object, probably ActiveX
				var e = new Enumerator(axObj);
				e.moveFirst();
				while(e.atEnd() == false) {
					itFunc(e.item(),itemCount);
					e.moveNext();
					itemCount++;
				}
			} else {
				for(var x in axObj) {
					itFunc(x,itemCount);
					itemCount++;
				}
			}
		}
	};
	
	$.getCmdObject = function(cmdStr) {
		var cmdObj = {};
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var patt = /[A-Z0-9a-z]*/g;
		var cmds = cmdStr.match(patt)[0];
		var isFile = false;
		try{
			if(fso.FileExists(cmds)) {
				cmdObj.shell = new ActiveXObject("WScript.Shell");
				cmdObj.exec = cmdObj.shell.Exec(cmdStr);
				cmdObj.stdout = cmdObj.exec.StdOut;
				isFile = true;
			}
		}catch(e){}
		if(!isFile) {
		//Maybe it's a command
			cmdObj.shell = new ActiveXObject("WScript.Shell");
			cmdObj.exec = cmdObj.shell.Exec('%comspec% /c ' + cmdStr);
			cmdObj.stdout = cmdObj.exec.StdOut;
		}
		return cmdObj;
	}
	
	$.echoCmd = function(cmdStr) {
		var cmdObj = $.getCmdObject(cmdStr);
		while(!cmdObj.stdout.AtEndOfStream) {
			WScript.Echo(cmdObj.stdout.ReadLine());
		}
	};
	
	$.reflectObject = function(obj) {
		var retStr = "";
		retStr += "prototype: " + Object.prototype.toString.call(obj) + "\r\n";
		for(var x in obj) {
			retStr += x + ": " + obj[x] + "\r\n";
		}
		return retStr;
	}
	
	$.ajax = function(aOpts) {
		try {
		var aXML = new ActiveXObject("Msxml2.XMLHTTP");
		var aType = aOpts.type ? aOpts.type : "GET";
		if(aOpts.username) {
			aXML.Open(aType, aOpts.url, aOpts.async === true, aOpts.username + '', aOpts.password + '');
		} else {
			aXML.Open(aType, aOpts.url, aOpts.async === true);
		}
		aXML.Send();
		if(aOpts.success) { aOpts.success(aXML.responseText); }
		else { return aXML.responseText; }
		} catch(e) {
			WScript.Echo($.reflectObject(e));
			if(aOpts.error) { aOpts.error(e); }
		}
	}

	$.reboot = function() {
		var opsys = GetObject("winmgmts:{(Shutdown)}//./root/cimv2").ExecQuery("select * from Win32_OperatingSystem where Primary=true");
		for(var enumItems = new Enumerator(opsys); !enumItems.atEnd(); enumItems.moveNext())
		{
			enumItems.item().Reboot();
		}
	}
	$.shutdown = function() {
		var opsys = GetObject("winmgmts:{(Shutdown)}//./root/cimv2").ExecQuery("select * from Win32_OperatingSystem where Primary=true");
		for(var enumItems = new Enumerator(opsys); !enumItems.atEnd(); enumItems.moveNext())
		{
			enumItems.item().Shutdown();
		}
	}
	$.base64Encode = function(input) {
		var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		while(i < input.length) {
		  chr1 = input.charCodeAt(i++);
		  chr2 = input.charCodeAt(i++);
		  chr3 = input.charCodeAt(i++);
		  enc1 = chr1 >> 2;
		  enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		  enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		  enc4 = chr3 & 63;
		  if(isNaN(chr2)) {
			 enc3 = enc4 = 64;
		  } else if(isNaN(chr3)) {
			 enc4 = 64;
		  }
		  output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	};

	$.trim = String.prototype.trim ?
		function(text) {
			return text == null ?
				"" :
				text.trim();
		} :
		function(text) {
			return text == null ?
				"" :
				text.toString().replace(trimLeft,"").replace(trimRight,"");
		};
	
	context.$ = $;
 })(this);
 function StringWriter(){};
StringWriter.prototype.Write = function(wobj) {
	this.axObject = this.axObject || new ActiveXObject("System.IO.StringWriter");
	this.axObject.Write_13(wobj);
}
StringWriter.prototype.WriteLine = function(wobj) {
	this.axObject = this.axObject || new ActiveXObject("System.IO.StringWriter");
	this.axObject.WriteLine_13(wobj);
}
StringWriter.prototype.ToString = function(wargs) {
	this.axObject = this.axObject || new ActiveXObject("System.IO.StringWriter");
	return wargs ? this.axObject.ToString(wargs) : this.axObject.ToString();
}
//System.Collections.ArrayList <-- use $.each to enumerate
// Add,Sort,Reverse,Remove

Array.prototype.contains = Array.prototype.contains || function(it) {
	for(var i = 0; i < this.length; i++) {
		if($.contains(this[i],it) === true) {
			return true;
		}
	}
	return false;
}

$.contains = function(x, it) {
	if(Object.prototype.toString.call(it)==='[object Array]'){
		for(var i=0;i<it.length;i++){ //It's an array, loop through it
				if(x.indexOf(it[i]) != -1) 
				{ return true; }
		}
	} else {
		return x.indexOf(it) !== -1;
	}	
	return false;
}

String.prototype.contains = String.prototype.contains || function(it) {
	return $.contains(this, it);
};