var textarea = document.getElementById('copy-area');
var create_download_link;
var generate_filename;

chrome.windows.getAll({populate:true},function(windows){
	var w_index = 0;
	
	windows.forEach(function(window){
		textarea.value += "Window " + w_index + ":";
		
		window.tabs.forEach(function(tab){
			//collect all of the urls here, I will just log them instead
			//console.log(tab.url);
			textarea.value += "\n\t";
			textarea.value += '* ' + tab.url + "\n";
			textarea.value += "\t\t" + '<a href="' + tab.url + '">' + tab.title + '</a>';
		});
		
		textarea.value += "\n\n";
		
		w_index++;
	});
	
	create_download_link(textarea.value);
});


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