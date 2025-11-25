export interface WeightedEdge {
	weight: number;
}

export default class Node<NodeData = {}, EdgeData = {}> {
	id: string;
	data: NodeData;
	adjacentNodes: Map<string, EdgeData>;

	constructor(id: string, data: NodeData) {
		this.id = id;
		this.data = data;
		this.adjacentNodes = new Map<string, EdgeData>();
	}

	getSuccessors() {
		return [...this.adjacentNodes.entries()];
	}

	hasSuccessor(id: string) {
		return this.adjacentNodes.get(id);
	}

	addEdge(node: string, data: EdgeData) {
		this.adjacentNodes.set(node, data);
	}

	removeEdge(node: string) {
		const data = this.adjacentNodes.get(node);
		this.adjacentNodes.delete(node);
		return data;
	}

	getEdgeData(node: string) {
		return this.adjacentNodes.get(node);
	}

	changeEdgeData(node: string, data: Partial<EdgeData>) {
		const oldData = this.adjacentNodes.get(node);
		if (oldData) this.adjacentNodes.set(node, { ...oldData, ...data });
	}
	setEdgeData(node: string, data: EdgeData) {
		this.adjacentNodes.set(node, data);
	}

	getData() {
		return this.data;
	}
	changeData(data: Partial<NodeData>) {
		this.data = { ...this.data, ...data };
	}

	setData(data: NodeData) {
		this.data = data;
	}
}
