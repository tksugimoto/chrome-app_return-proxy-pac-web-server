chrome.runtime.onStartup.addListener(lunch);
lunch();

function lunch(){
	chrome.app.window.create("index.html", {
		id: "-",
		"bounds": {
			"width":  400,
			"height": 300,
			"top":  0,
			"left": 0
		}
	});
}