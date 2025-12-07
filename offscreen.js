chrome.runtime.onMessage.addListener(on_message);

function on_message(message, _sender, send_response) {
	if (message.handler === 'url_for_blob') {
		url_for_blob(message.data, send_response);
	}
}

function url_for_blob(text, callback) {
	var blob = new Blob([text], { type: 'text/plain' });
	var object_url = URL.createObjectURL(blob);

	callback(object_url);
}

// navigator.serviceWorker.addEventListener(
// 	'message',
// 	function(e) {
// 		e.ports[0].postMessage(URL.createObjectURL(e.data));
// 	}
// );
