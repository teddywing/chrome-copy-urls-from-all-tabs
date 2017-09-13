var textarea = document.getElementById('copy-area');
var generate_backup_text;
var create_download_link;
var generate_file_string;
var generate_filename;


generate_backup_text = function(callback) {
	var backup_text = '';
	
	browser.windows.getAll({populate:true}, function(windows){
		var w_index = 0;
		
		browser.storage.sync.get(function(items) {
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


generate_backup_text(function(backup_text) {
	if (textarea) {
		textarea.value = backup_text;
		
		create_download_link(textarea.value, function(download_link) {
			document.getElementById('download-link').appendChild(download_link);
		});
	}
});


// Adapted from:
// http://stackoverflow.com/a/18197511
create_download_link = function(text, callback) {
	generate_filename(function(filename) {
		var download_link = document.createElement('a');
		var blob = new Blob([text], { type: 'text/plain' });
		download_link.setAttribute('href', window.URL.createObjectURL(blob));
		download_link.setAttribute('download', filename);
		download_link.innerHTML = 'Download file';
		
		callback(download_link);
	});
};


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
	browser.storage.sync.get(function(items) {
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