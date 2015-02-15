// Saves options to chrome.storage
function save_options() {
	var button_click_behaviour = document.getElementById('button-click-behaviour').value;
	var file_format = document.getElementById('file-format').value;
	var filename_prefix = document.getElementById('filename-prefix').value;
	chrome.storage.sync.set({
		button_click_behaviour: button_click_behaviour,
		file_format: file_format,
		filename_prefix: filename_prefix
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 1000);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync.get({
		button_click_behaviour: 'window',
		file_format: 'text',
		filename_prefix: 'chrome-tabs-'
	}, function(items) {
		document.getElementById('button-click-behaviour').value = items.button_click_behaviour;
		document.getElementById('file-format').value = items.file_format;
		document.getElementById('filename-prefix').value = items.filename_prefix;
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
save_options);