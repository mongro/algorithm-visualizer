export type BinElement = {
	size: number;
	quantity: number;
};

export type Bin = {
	fillRate: number;
	elements: {
		size: number;
		index: number;
	}[];
};
