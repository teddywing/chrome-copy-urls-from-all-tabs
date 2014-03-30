var textarea = document.getElementById('copy-area');
var create_download_link;
var generate_filename;


chrome.windows.getAll({populate:true}, function(windows){
	var w_index = 0;
	
	chrome.storage.sync.get(function(items) {
		var format = items.file_format;
		console.log(format);
		
		if (format === 'yaml') {
			
		}
		else if (format === 'html') {
			
		}
		else { // format === 'text'
			windows.forEach(function(window){
				textarea.value += "Window " + w_index + ":";
				
				window.tabs.forEach(function(tab){
					textarea.value += "\n";
					textarea.value += "\t* " + tab.title + "\n";
					textarea.value += "\t  " + tab.url + "\n";
				});
		
				textarea.value += "\n\n";
		
				w_index++;
			});
		}
		
		
		create_download_link(textarea.value);
	});
});


// Adapted from:
// http://stackoverflow.com/a/18197511
create_download_link = function(text) {
	var download_link = document.createElement('a');
	download_link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	download_link.setAttribute('download', generate_filename());
	download_link.innerHTML = 'Download file';
	
	document.querySelector('body').appendChild(download_link);
};


generate_filename = function() {
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
		+ d.getMinutes();
	
	return 'chrome-tabs-' + date_string + '.txt';
};