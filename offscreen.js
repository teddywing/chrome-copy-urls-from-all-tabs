chrome.runtime.onMessage.addListener(on_message);

function on_message(message, _sender, send_response) {
	if (message.handler === 'url_for_blob') {
		url_for_blob(message.data, send_response);
	}
}

function url_for_blob(text, callback) {
	mime_type(function(mime_type) {
		var blob = new Blob([text], { type: mime_type });
		var object_url = URL.createObjectURL(blob);

		callback(object_url);
	});
}

function mime_type(callback) {
	chrome.storage.sync.get(function(items) {
		var format = items.file_format;

		if (format === 'yaml') {
			callback('text/yaml');
		}
		else if (format === 'html') {
			callback('text/html');
		}
		else {
			callback('text/plain');
		}
	});
};

// navigator.serviceWorker.addEventListener(
// 	'message',
// 	function(e) {
// 		e.ports[0].postMessage(URL.createObjectURL(e.data));
// 	}
// );
