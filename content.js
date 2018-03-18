document.addEventListener("DOMContentLoaded", init, false);

function init() {
	const handlerInstalled = new WeakSet();

	addHandlers();
	setInterval(addHandlers, 100);

	function addHandlers() {
		const anchorElements = document.querySelectorAll("a");

		for (let anchorElement of anchorElements) {
			if (handlerInstalled.has(anchorElement)) {
				continue;
			} else {
				handlerInstalled.add(anchorElement);
			}

			anchorElement.addEventListener('mouseenter', async (e) => {
				const targetElement = e.target;
				const url = targetElement.href;

				if (!/^https?:\/\//.test(url)) {
					return;
				}

				const originalTooltip = targetElement.getAttribute('title');
				log(`mouseenter url: ${url}, original tooltip: '${originalTooltip}'`);

				let tooltipModified = false;
				let mouseLeft = false;

				function mouseleaveHandler(e) {
					mouseLeft = true;
					anchorElement.removeEventListener('mouseleave', mouseleaveHandler);

					if (tooltipModified == false) {
						return;
					}

					const targetElement = e.target;
					const url = targetElement.href;

					log(`mouseleave ${url}`);

					if (originalTooltip == null) {
						targetElement.removeAttribute('title');
					} else {
						targetElement.setAttribute('title', originalTooltip);
					}
				}

				anchorElement.addEventListener('mouseleave', mouseleaveHandler, false);

				const visits = await browser.runtime.sendMessage({ operation: "getVisits", url });

				if (visits.length > 0 && mouseLeft === false) {
					// Chrome seems to order in chronological order
					// Firefox seems to order in reverse chronological order
					visits.sort((a, b) => a.visitTime - b.visitTime);

					const lastVisitTimestamp = visits[visits.length - 1].visitTime;
					const lastVisitedText = `[Last visited: ${formatIntervalSinceTimestamp(lastVisitTimestamp)}]`;

					if (originalTooltip && originalTooltip.length > 0) {
						targetElement.setAttribute('title', `${originalTooltip} ${lastVisitedText}`);
					} else {
						targetElement.setAttribute('title', lastVisitedText);
					}

					tooltipModified = true;
				}
			});
		}
	}
}

function formatIntervalSinceTimestamp(originTimestamp) {
	const currentTime = new Date();
	const intervalSeconds = (Date.now() - originTimestamp) / 1000;

	if (intervalSeconds < 60) {
		const seconds = Math.floor(intervalSeconds);
		return seconds === 1 ? `${seconds} second ago` : `${seconds} seconds ago`;
	} else if (intervalSeconds < 60 * 60) {
		const minutes = Math.floor(Math.floor(intervalSeconds / 60));
		return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
	} else if (intervalSeconds < 60 * 60 * 24) {
		const hours = Math.floor(Math.floor(intervalSeconds / 60 / 60));
		return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
	} else {
		const originDate = new Date(originTimestamp);
		return `${originDate.toLocaleDateString()} ${originDate.toLocaleTimeString()}`;
	}
}
