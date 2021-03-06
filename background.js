// Taken from:
// http://adamfeuer.com/notes/2013/01/26/chrome-extension-making-browser-action-icon-open-options-page/

function openOrFocusOptionsPage() {
	var optionsUrl = chrome.extension.getURL('options.html'); 
	chrome.tabs.query({}, function(extensionTabs) {
		var found = false;
		for (var i=0; i < extensionTabs.length; i++) {
			if (optionsUrl == extensionTabs[i].url) {
				found = true;
				chrome.tabs.update(extensionTabs[i].id, {"selected": true});
			}
		}
		if (found == false) {
			chrome.tabs.create({url: "chrome-get-urls-from-tabs-in-windows.html"});
		}
	});
}

chrome.extension.onConnect.addListener(function(port) {
	var tab = port.sender.tab;
	// This will get called by the content script we execute in
	// the tab as a result of the user pressing the browser action.
	port.onMessage.addListener(function(info) {
		var max_length = 1024;
		if (info.selection.length > max_length)
		info.selection = info.selection.substring(0, max_length);
		openOrFocusOptionsPage();
	});
});


function download_backup_file () {
	generate_backup_text(function(backup_text) {
		create_download_link(backup_text, function(download_link) {
			download_link.click()
		});
	});
}


// Called when the user clicks on the browser action icon.
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.storage.sync.get(function(items) {
		var behaviour = items.button_click_behaviour;
		
		if (behaviour === 'download') {
			download_backup_file();
		}
		else { // behaviour === 'window'
			openOrFocusOptionsPage();
		}
	});
});


// Handle keyboard shortcut
chrome.commands.onCommand.addListener(function(command) {
	if (command === 'download') {
		download_backup_file();
	}
});