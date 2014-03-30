var textarea = document.getElementById('copy-area');
var create_download_link;
var generate_filename;


chrome.windows.getAll({populate:true}, function(windows){
	var w_index = 0;
	
	chrome.storage.sync.get(function(items) {
		var format = items.file_format;
		
		if (format === 'yaml') {
			var chrome_tabs = [];
			
			windows.forEach(function(window){
				textarea.value += "- Window " + w_index + ":\n";
				
				window.tabs.forEach(function(tab){
					textarea.value += "  - page_title: '" + tab.title.replace('\'', '\'\'') + "'\n";
					textarea.value += "    url: '" + tab.url + "'\n";
				});
						
				textarea.value += "\n";
				
				w_index++;
			});
		}
		else if (format === 'html') {
			textarea.value += '<!doctype html>\n\
<html lang="en">\n\
<head>\n\
	<meta charset="utf-8">\n';

			textarea.value += '	<title>Chrome Copy URLs From All Tabs</title>\n';

			textarea.value += '</head>\n\
<body>\n\
	<div role="main">\n';
			
			windows.forEach(function(window){
				textarea.value += "		<h1>Window " + w_index + ":</h1>\n\n";
				textarea.value += "		<ul>\n";
				
				window.tabs.forEach(function(tab){
					textarea.value += "			<li>\n"
					textarea.value += "				<a href=\"" + tab.url + "\">" + tab.title + "</a>\n";
					textarea.value += "			</li>\n"
				});
		
				textarea.value += "		</ul>\n";
		
				w_index++;
			});
			
			textarea.value += '	</div>\n\
</body>\n\
</html>';
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
	generate_filename(function(filename) {
		var download_link = document.createElement('a');
		download_link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		download_link.setAttribute('download', filename);
		download_link.innerHTML = 'Download file';
		
		document.querySelector('body').appendChild(download_link);
	});
};


generate_filename = function(callback) {
	chrome.storage.sync.get(function(items) {
		var format = items.file_format;
		
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
		
		callback('chrome-tabs-' + date_string + '.' + file_extension);
	});
};