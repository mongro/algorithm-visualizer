export default function focusTrap(node: HTMLElement) {
	const focusableElements =
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Tab') {
			// trap focus
			const nodes = node.querySelectorAll<HTMLElement>(focusableElements);
			const tabbable = Array.from(nodes).sort((a, b) => a.tabIndex - b.tabIndex);
			let index = document.activeElement
				? tabbable.indexOf(document.activeElement as HTMLElement)
				: -1;
			if (index === -1 && event.shiftKey) index = 0;
			index += tabbable.length + (event.shiftKey ? -1 : 1);
			index %= tabbable.length;
			tabbable[index].focus();
			event.preventDefault();
		}
	};

	document.addEventListener('keydown', handleKeydown);
	return {
		destroy: () => document.removeEventListener('keydown', handleKeydown)
	};
}
