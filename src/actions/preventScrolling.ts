export default function preventScrolling(node: HTMLElement) {
	if (document.body.style.overflow !== 'hidden') {
		const documentWidth = document.documentElement.clientWidth;
		const windowWidth = window.innerWidth;
		const scrollBarWidth = windowWidth - documentWidth;
		document.body.style.paddingRight = scrollBarWidth + 'px';
		document.body.style.overflow = 'hidden';
	}

	return {
		destroy: () => {
			document.body.style.removeProperty('overflow');
			document.body.style.removeProperty('padding-right');
		}
	};
}
