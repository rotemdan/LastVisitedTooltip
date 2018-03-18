async function onMessage(request, sender, sendResponse) {
	switch (request.operation) {
		case "getVisits":
			return await browser.history.getVisits({url: request.url});
			break;
	}
}

browser.runtime.onMessage.addListener(onMessage);
