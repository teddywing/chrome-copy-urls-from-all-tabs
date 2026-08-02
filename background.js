// var textarea = document.getElementById('copy-area');
var generate_backup_text;
var create_download_link;
var generate_file_string;
var generate_filename;


generate_backup_text = function(callback) {
	var backup_text = '';

	chrome.windows.getAll({populate:true}, function(windows){
		var w_index = 0;

		chrome.storage.sync.get(function(items) {
			var format = items.file_format;

			if (format === 'yaml') {
				var chrome_tabs = [];

				windows.forEach(function(window){
					backup_text += "- Window " + w_index + ":\n";

					window.tabs.forEach(function(tab){
						backup_text += "  - page_title: '" + tab.title.replace(/\'/g, '\'\'') + "'\n";
						backup_text += "    url: '" + tab.url + "'\n";
					});

					backup_text += "\n";

					w_index++;
				});
			}
			else if (format === 'html') {
				backup_text += '<!doctype html>\n\
	<html lang="en">\n\
	<head>\n\
		<meta charset="utf-8">\n';

				backup_text += '	<title>Chrome Copy URLs From All Tabs</title>\n';

				backup_text += '</head>\n\
	<body>\n\
		<div role="main">\n';

				windows.forEach(function(window){
					backup_text += "		<h1>Window " + w_index + ":</h1>\n\n";
					backup_text += "		<ul>\n";

					window.tabs.forEach(function(tab){
						backup_text += "			<li>\n"
						backup_text += "				<a href=\"" + tab.url + "\">" + tab.title + "</a>\n";
						backup_text += "			</li>\n"
					});

					backup_text += "		</ul>\n";

					w_index++;
				});

				backup_text += '	</div>\n\
	</body>\n\
	</html>';
			}
			else { // format === 'text'
				windows.forEach(function(window){
					backup_text += "Window " + w_index + ":";

					window.tabs.forEach(function(tab){
						backup_text += "\n";
						backup_text += "\t* " + tab.title + "\n";
						backup_text += "\t  " + tab.url + "\n";
					});

					backup_text += "\n\n";

					w_index++;
				});
			}


			callback(backup_text);
		});
	});
};


// generate_backup_text(function(backup_text) {
// 	if (textarea) {
// 		textarea.value = backup_text;
//
// 		create_download_link(textarea.value, function(download_link) {
// 			document.getElementById('download-link').appendChild(download_link);
// 		});
// 	}
// });


// Adapted from:
// http://stackoverflow.com/a/18197511
create_download_link = function(text, callback) {
	generate_filename(function(filename) {
		// var download_link = document.createElement('a');
		// var blob = new Blob([text], { type: 'text/plain' });
		// download_link.setAttribute('href', window.URL.createObjectURL(blob));
		// download_link.setAttribute('download', filename);
		// download_link.innerHTML = 'Download file';
        //
		// callback(download_link);

		build_blob_url(text);
	});
};


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


generate_file_string = function(filename_prefix) {
	var d = new Date();
	var date_string = 
		d.getFullYear() 
		+ '' 
		+ ('0' + (d.getMonth() + 1)).slice(-2) 
		+ '' 
		+ ('0' + d.getDate()).slice(-2) 
		+ '-' 
		+ ('0' + d.getHours()).slice(-2) 
		+ 'h' 
		+ ('0' + d.getMinutes()).slice(-2);

	return (filename_prefix ? filename_prefix : 'chrome-tabs-') + date_string;
};


generate_filename = function(callback) {
	chrome.storage.sync.get(function(items) {
		var format = items.file_format;

		var file_extension = '';
		if (format === 'yaml') {
			file_extension = 'yml';
		}
		else if (format === 'html') {
			file_extension = 'html';
		}
		else {
			file_extension = 'txt';
		}

		callback(generate_file_string(items.filename_prefix) + '.' + file_extension);
	});
};


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
	generate_backup_text(function(backup_text) {
		generate_filename(function(filename) {
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

		// create_download_link(backup_text, function(download_link) {
		// 	download_link.click()
		// });
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
