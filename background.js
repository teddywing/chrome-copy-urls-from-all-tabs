import { backup } from '/backup.js';


function build_blob_url(text, callback) {
	var offscreen_url = chrome.runtime.getURL('offscreen.html');

	var creating_offscreen_document = false;

	chrome.runtime.getContexts({
		contextTypes: ['OFFSCREEN_DOCUMENT'],
		documentUrls: [offscreen_url]
	})
		.then(function(existing_contexts) {
			var offscreen_document_promise = Promise.resolve();
			if (!creating_offscreen_document && existing_contexts.length === 0) {
				offscreen_document_promise = chrome.offscreen.createDocument({
					url: offscreen_url,
					reasons: ['BLOBS'],
					justification: 'Generate blob URL.'
				});
			}

			offscreen_document_promise
				.then(function() {
					// TODO: chrome.runtime.sendMessage message must be JSON serializable. Worker.Client.postMessage can accept Blob.
					chrome.runtime.sendMessage(
						{
								handler: 'url_for_blob',
								data: text
						},
						function(response) {
							if (chrome.runtime.lastError) {
								console.error('%%%%%%%', chrome.runtime.lastError);
								// #=> { "message": "Could not establish connection. Receiving end does not exist." }
							}

							console.log('!!!!!!!!', response);
							callback(response);
						}
					);
				});
		});

	// self.clients.matchAll()
	// 	.then(function(clients) {
	// 		clients[0].postMessage(blob, );
	// 	});
}


////////////////////////////////////////////////////////////


// Taken from:
// http://adamfeuer.com/notes/2013/01/26/chrome-extension-making-browser-action-icon-open-options-page/

function openOrFocusOptionsPage() {
	var optionsUrl = chrome.runtime.getURL('options.html'); 
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

chrome.runtime.onConnect.addListener(function(port) {
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
	backup.generate_backup_text(function(backup_text) {
		backup.generate_filename(function(filename) {
			build_blob_url(
				backup_text,
				function(blob_url) {
					chrome.downloads.download({
						url: blob_url,
						filename: filename
					});
				}
			);
		});
	});
}


// Called when the user clicks on the browser action icon.
chrome.action.onClicked.addListener(function(tab) {
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
