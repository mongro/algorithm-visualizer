import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';

interface ModalComponent {
	component: typeof SvelteComponent;
	props: {};
}

type Modal = ModalComponent | null;

function createModalStore(initial: Modal) {
	const modal = writable<Modal>(initial);
	const { set, subscribe } = modal;

	return {
		subscribe,
		open: (component: typeof SvelteComponent, props: {}) => {
			set({ component, props });
		},
		close: () => {
			set(null);
		}
	};
}

export const modalStore = createModalStore(null);
