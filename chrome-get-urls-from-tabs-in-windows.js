import { backup } from '/backup.js';

var textarea = document.getElementById('copy-area');


backup.generate_backup_text(function(backup_text) {
	if (textarea) {
		textarea.value = backup_text;
		
		create_download_link(textarea.value, function(download_link) {
			document.getElementById('download-link').appendChild(download_link);
		});
	}
});


// Adapted from:
// http://stackoverflow.com/a/18197511
function create_download_link (text, callback) {
	backup.generate_filename(function(filename) {
		var download_link = document.createElement('a');
		var blob = new Blob([text], { type: 'text/plain' });
		download_link.setAttribute('href', window.URL.createObjectURL(blob));
		download_link.setAttribute('download', filename);
		download_link.innerHTML = 'Download file';
		
		callback(download_link);
	});
};
