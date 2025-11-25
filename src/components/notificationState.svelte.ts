export function createNotification() {
	let show = $state(false);
	let timeoutId: ReturnType<typeof setTimeout>;

	function triggerShow() {
		show = true;
		console.log('trigger', show);
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			show = false;
		}, 2000);
	}

	return {
		get show() {
			return show;
		},
		triggerShow
	};
}
