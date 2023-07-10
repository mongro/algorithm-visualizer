import { writable, type Writable } from 'svelte/store';

export interface Command<T> {
	execute: (state: T) => T;
	undo: (state: T) => T;
}

export default class UndoRedoStore<T> implements Writable<UndoRedoStore<T>> {
	state: T;
	history: Command<T>[];
	redoStack: Command<T>[];
	subscribe;
	set;
	update;
	constructor(initialState: T, history?: Command<T>[], redoStack?: Command<T>[]) {
		this.state = initialState;
		this.history = history || [];
		this.redoStack = redoStack || [];
		const { subscribe, set, update } = writable<UndoRedoStore<T>>(this);
		this.subscribe = subscribe;
		this.set = set;
		this.update = update;
	}

	//changes in state excluded from undo/redo history
	updateState(update: (oldState: T) => T) {
		this.state = update(this.state);
		this.update((store) => this);
	}

	execute(command: Command<T>) {
		this.state = command.execute(this.state) || this.state;
		this.history.push(command);
		this.redoStack = [];
		this.set(this);
	}

	undo() {
		const command = this.history.pop();

		if (!command) {
			return;
		}
		this.state = command.undo(this.state) || this.state;
		this.redoStack.push(command);
		this.set(this);
	}

	redo() {
		const command = this.redoStack.pop();
		if (!command) {
			return;
		}
		this.state = command.execute(this.state) || this.state;
		this.history.push(command);
		this.set(this);
	}

	undoAll() {
		while (this.getHistoryLength() > 0) {
			this.undo();
		}
	}

	redoAll() {
		while (this.getRedoStackLength() > 0) {
			this.redo();
		}
	}

	getRedoStackLength() {
		return this.redoStack.length;
	}

	getHistoryLength() {
		return this.history.length;
	}

	getTotalCommands() {
		return this.history.length + this.redoStack.length;
	}

	setHistory(history: Command<T>[]) {
		this.history = history;
	}
	setRedoStack(redoStack: Command<T>[]) {
		this.redoStack = redoStack;
	}
}
