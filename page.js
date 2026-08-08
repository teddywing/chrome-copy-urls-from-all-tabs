import { backup } from '/backup.js';

(function() {
	document.getElementById('header').innerHTML = backup.generate_file_string();
})();