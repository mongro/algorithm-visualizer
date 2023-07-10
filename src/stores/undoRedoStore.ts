/* import { writable, type Writable, type Unsubscriber } from 'svelte/store';
import UnRedo, { type Command } from './Undo';

export type UndoRedoStore<T> = Writable<T> & {
	redo: () => void;
	undo: () => void;
	undoAll: () => () => void;
	execute: (command: Command<T>) => () => void;
	setRedoStack: (commands: Command<T>[]) => void;
	getRedoStackLength: () => number;
};

export default function createUndoRedoStore<T>(store: T): UndoRedoStore<T> {
	const { subscribe, set, update } = writable<T>(store);
	const commandManager = new UnRedo<T>();

	return {
		subscribe,
		set,
		update,
		redo: () => {
			const newStore = commandManager.redo();
			if (newStore) set(newStore);
		},
		undo: () => {
			const newStore = commandManager.undo();
			if (newStore) set(newStore);
		},
		undoAll: () => () => {
			const newStore = commandManager.undoAll();
			if (newStore) set(newStore);
		},
		execute: (command: Command<T>) => () => {
			const newStore = commandManager.executeCommand(command);
			if (newStore) set(newStore);
		},
		setRedoStack: (commands: Command<T>[]) => commandManager.setRedoStack(commands),
		getRedoStackLength: () => commandManager.getRedoStackLength()
	};
}
 */
