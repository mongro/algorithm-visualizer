export interface CellData {
	value: number;
	status: 'A' | 'B' | 'added' | 'default';
}

export interface KnapSackData {
	array: CellData[][];
	currentItem: number;
	currentWeight: number;
}
