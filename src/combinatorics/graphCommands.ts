import type { Command } from '../stores/Undo';
import type Graph from './graph';
import type Node from './node';

export class removeAllNodesCommand<N, E> {
	nodes: Map<string, Node<N, E>> | undefined;

	execute(graph: Graph<N, E>) {
		this.nodes = graph.getNodesMap();
		graph.removeAllNodes();
		return graph;
	}

	undo(graph: Graph<N, E>) {
		if (this.nodes) graph.nodes = this.nodes;
		return graph;
	}
}

export class removeNodeCommand<N, E> {
	id: string;
	node: Node<N, E> | undefined;
	edges: { source: string; data: E }[] | undefined;

	constructor(id: string) {
		this.id = id;
	}
	execute(graph: Graph<N, E>) {
		this.node = graph.getNode(this.id);
		this.edges = graph.getAllEdgesTo(this.id);
		graph.removeNode(this.id);
		return graph;
	}

	undo(graph: Graph<N, E>) {
		if (!this.node || !this.edges) return graph;
		graph.addCompleteNode(this.node);
		for (const edge of this.edges) {
			graph.addEdge(edge.source, this.id, edge.data);
		}
		return graph;
	}
}
export class addNodeCommand<N, E> {
	id: string;
	data: N;

	constructor(id: string, data: N) {
		this.data = data;
		this.id = id;
	}

	execute(graph: Graph<N, E>) {
		graph.addNode(this.id, this.data);
		return graph;
	}
	undo(graph: Graph<N, E>) {
		graph.removeNode(this.id);
		return graph;
	}
}

export class addEdgeCommand<N, E> {
	source: string;
	destination: string;
	data: E;

	constructor(source: string, destination: string, data: E) {
		this.data = data;
		this.source = source;
		this.destination = destination;
	}
	execute(graph: Graph<N, E>) {
		graph.addEdge(this.source, this.destination, this.data);
		return graph;
	}
	undo(graph: Graph<N, E>) {
		graph.removeEdge(this.source, this.destination);
		return graph;
	}
}

export class removeEdgeCommand<N, E> {
	data: E | undefined;
	source: string;
	destination: string;

	constructor(source: string, destination: string) {
		this.source = source;
		this.destination = destination;
	}

	execute(graph: Graph<N, E>) {
		this.data = graph.removeEdge(this.source, this.destination);
		return graph;
	}
	undo(graph: Graph<N, E>) {
		if (this.data) graph.addEdge(this.source, this.destination, this.data);
		return graph;
	}
}

export class changeEdgeDataCommand<N, E> {
	previousData: E | undefined;
	destination: string;
	source: string;
	sourceNode: Node<N, E> | undefined;
	data: Partial<E>;

	constructor(source: string, destination: string, data: Partial<E>) {
		this.source = source;
		this.destination = destination;
		this.data = data;
	}

	execute(graph: Graph<N, E>) {
		this.sourceNode = graph.getNode(this.source);
		if (this.sourceNode) {
			this.previousData = this.sourceNode.getEdgeData(this.destination);
			this.sourceNode.changeEdgeData(this.destination, this.data);
		}
		return graph;
	}
	undo(graph: Graph<N, E>) {
		if (this.sourceNode && this.previousData) {
			this.sourceNode.setEdgeData(this.destination, this.previousData);
		}
		return graph;
	}
}

export class changeNodeDataCommand<N, E> {
	id: string;
	node: Node<N, E> | undefined;
	data: Partial<N>;
	previousData: N | undefined;
	constructor(id: string, data: Partial<N>) {
		this.id = id;
		this.data = data;
	}

	execute(graph: Graph<N, E>) {
		this.node = graph.getNode(this.id);
		if (this.node) {
			this.previousData = { ...this.node.getData() };
			this.node.changeData(this.data);
		}
		return graph;
	}
	undo(graph: Graph<N, E>) {
		if (this.node && this.previousData) this.node.setData(this.previousData);
		return graph;
	}
}

export class batchCommand<T> {
	commands: Command<T>[] = [];

	constructor(commands?: Command<T>[]) {
		this.commands = commands || [];
	}
	add(command: Command<T>) {
		this.commands.push(command);
	}

	execute(state: T) {
		let value = state;
		for (const command of this.commands) {
			value = command.execute(value);
		}
		return value;
	}
	undo(state: T) {
		let value = state;
		for (const command of [...this.commands].reverse()) {
			value = command.undo(value);
		}
		return value;
	}
}
