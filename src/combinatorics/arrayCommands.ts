import type { CellData, KnapSackData } from '../routes/knapsack/ArrayData';
import type { Command } from '../stores/Undo';

export class changeEntry2D implements Command<KnapSackData> {
	i: number;
	j: number;
	value: Partial<CellData>;
	previousValue: CellData | undefined;

	constructor(i: number, j: number, value: Partial<CellData>) {
		this.i = i;
		this.j = j;
		this.value = value;
	}
	execute(data: KnapSackData) {
		this.previousValue = { ...data.array[this.i][this.j] };
		data.array[this.i][this.j] = { ...this.previousValue, ...this.value };

		return data;
	}

	undo(data: KnapSackData) {
		if (this.previousValue) data.array[this.i][this.j] = this.previousValue;
		return data;
	}
}

export class changeCurrentItem implements Command<KnapSackData> {
	i: number;
	previous: number | undefined;

	constructor(i: number) {
		this.i = i;
	}
	execute(data: KnapSackData) {
		this.previous = data.currentItem;
		data.currentItem = this.i;
		return data;
	}

	undo(data: KnapSackData) {
		if (this.previous) data.currentItem = this.previous;
		return data;
	}
}

export class changeCurrentWeight implements Command<KnapSackData> {
	j: number;
	previous: number | undefined;
	constructor(j: number) {
		this.j = j;
	}

	execute(data: KnapSackData) {
		this.previous = data.currentWeight;
		data.currentWeight = this.j;
		return data;
	}

	undo(data: KnapSackData) {
		if (this.previous) data.currentWeight = this.previous;
		return data;
	}
}
