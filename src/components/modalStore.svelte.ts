import type { Component } from 'svelte';

type Options = {
	ariaLabel?: string;
	ariaLabelledBy?: string;
	withClose: boolean;
};

const defaultOptions = {
	withClose: true
};
type ModalProps = Record<string, any>;

type Modal = {
	content: {
		component: Component<any>;
		props?: ModalProps;
	} | null;

	options?: Options;
};

function createModalStore(initial: Modal) {
	const modal = $state<Modal>(initial);

	return {
		modal,
		open: <T extends Record<string, any>>(
			component: Component<T>,
			props?: T,
			options?: Options
		) => {
			const modalOptions = { ...defaultOptions, ...options };
			if (!modalOptions.ariaLabel && !modalOptions.ariaLabelledBy) {
				modalOptions.ariaLabelledBy = 'modalTitle' + crypto.randomUUID();
			}
			modal.content = { component, props };
			console.log('options', modalOptions);
			modal.options = modalOptions;
		},
		close: () => {
			modal.content = null;
		}
	};
}

export const modalStore = createModalStore({ content: null });
