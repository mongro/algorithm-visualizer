import type { Component } from 'svelte';
import { writable } from 'svelte/store';

interface ModalComponent {
	component: Component<any>;
	props: object;
}

type Modal = ModalComponent | null;

function createModalStore(initial: Modal) {
	const modal = writable<Modal>(initial);
	const { set, subscribe } = modal;

	return {
		subscribe,
		open: (component: ModalComponent['component'], propsC: Record<string, any>) => {
			set({ component, props: propsC });
		},
		close: () => {
			set(null);
		}
	};
}

export const modalStore = createModalStore(null);
