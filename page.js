(function() {
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
	
	var header_text = 'chrome-tabs-' + date_string;
	document.getElementById('header').innerHTML = header_text;
})();