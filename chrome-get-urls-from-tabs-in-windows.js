var textarea = document.getElementById('copy-area');

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
});