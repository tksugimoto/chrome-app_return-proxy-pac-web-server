
var socketId;
var host = "127.0.0.1";
var port = 1024;

chrome.sockets.tcpServer.create(function(createInfo) {
	console.debug("chrome.sockets.tcpServer.create", createInfo);
	socketId = createInfo.socketId;

	chrome.sockets.tcpServer.listen(socketId, host, port, function(result) {
		console.debug("chrome.sockets.tcpServer.listen", result);
	});
});

chrome.sockets.tcpServer.onAccept.addListener(function(info) {
	//console.debug("chrome.sockets.tcpServer.onAccept.addListener", info);
	if (info.socketId === socketId) {
		var paused = false;
		chrome.sockets.tcp.setPaused(info.clientSocketId, paused);
	}
});

chrome.sockets.tcp.onReceive.addListener(function(info) {
	var clientSocketId = info.socketId;
	var requestText = arrayBuffer2string(info.data);
	
	var path = null;
	if (requestText.match(/^GET ([^ ]+) HTTP/)) {
		path = RegExp.$1;
		path = path.replace(/[?].*/, "");
	}
	console.debug("chrome.sockets.tcp.onReceive", path, requestText.split("\n")[0], info, requestText);
	
	if (path === "/proxy.pac") {
		var filePath = "file/proxy.js";
		var xhr = new XMLHttpRequest();
		xhr.open("GET", filePath);
		xhr.onload = function() {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var body = xhr.responseText;
					var header = [
						"HTTP/1.1 200 OK",
						"Content-Type: text/plain; charset=UTF-8"
					].join("\n");
					var responseText = header + "\n\n" + body;
					var arrayBuffer = string2arrayBuffer(responseText);
					chrome.sockets.tcp.send(clientSocketId, arrayBuffer, function(info) {
						chrome.sockets.tcp.disconnect(clientSocketId);
						chrome.sockets.tcp.close(clientSocketId);
					});
				} else {
					notFound(clientSocketId);
				}
			}
		};
		xhr.send(null);
	} else {
		notFound(clientSocketId);
	}
});

function notFound(clientSocketId){
	var message = '<title>404 page not found</title><link rel="icon" href="/favicon.ico" type="image/png" />ページが見つかりません';
	var header = [
		"HTTP/1.1 200 OK",
		"Content-Type: text/html; charset=utf-8",
//		"Content-Length: " + message.length//この指定をすると日本語が含まれている場合に途中で切れる
	].join("\n");
	var responseText = header + "\n\n" + message;
	var arrayBuffer = string2arrayBuffer(responseText);
	chrome.sockets.tcp.send(clientSocketId, arrayBuffer, function(info) {
		chrome.sockets.tcp.disconnect(clientSocketId);
		chrome.sockets.tcp.close(clientSocketId);
	});
}

function string2arrayBuffer(string, notUTF8) {
	if (notUTF8) {
		var uint8Array = new Uint8Array(string.length);
		for (var i = 0, len = uint8Array.length; i < len; i++) {
			uint8Array[i] = string.charCodeAt(i);
		}
		return uint8Array.buffer;
	} else {
		// UTF-8
		return new TextEncoder("utf-8").encode(string).buffer;
	}
}

function arrayBuffer2string(arrayBuffer, encoding) {
	if (!encoding) encoding = "utf-8";
	var uint8Array = new Uint8Array(arrayBuffer);
	return new TextDecoder(encoding).decode(uint8Array);
	
	// UTF-8 未対応
	var uint8Array = new Uint8Array(arrayBuffer);
	var string = "";
	for (var i = 0, len = uint8Array.length; i < len; i++) {
		string += String.fromCharCode(uint8Array[i]);
	}
	return string;
}