const debugModeEnabled = false;
const extensionManifest = browser.runtime.getManifest();

function log(...args) {
	if (debugModeEnabled) {
		console.log(`[${extensionManifest.name}]`, ...args);
	}
}
