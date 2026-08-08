Chrome Copy URLs From All Tabs
==============================

A Google Chrome browser extension that allows you to create a text file backup of URLs in all open tabs in all windows.

Includes a page where you can view the URL output from the extension. Also supports direct file download.

Currently 3 file formats are available: text, YAML, and HTML.

Preferences can be customised via the Options page. The browser action button that appears in the toolbar can be configured to either open a new tab containing the backup text, or download the text as a file.

The downloaded file's prefix can be changed if desired.


## Installing

### Chrome
1. Open the Extensions page in Chrome (`chrome://extensions/`) and ensure
   developer mode is enabled.
2. Click the “Load unpacked” button.
3. In the resulting file browser, select the downloaded extension’s directory.


### Firefox
This extension is unsigned. Refer to “What are my options if I want to install
unsigned extensions in Firefox?” in
https://wiki.mozilla.org/Add-ons/Extension_Signing#FAQ before attempting to
install it.

	$ cd '~/Library/Application Support/Firefox/Profiles/PROFILE_DIRECTORY/extensions'
	$ git clone --single-branch --branch=firefox-webextension \
		https://github.com/teddywing/chrome-copy-urls-from-all-tabs.git \
		'{0a74ac35-82a7-4c0f-9a65-caf55c4b9cb8}'

Relaunch Firefox and open the Add-ons page (`about:addons`). Click the “Enable”
button on the extension’s row.


## License
Licensed under the MIT License. See the included LICENSE file.
