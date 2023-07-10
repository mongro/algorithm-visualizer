import Node from './node';

export default class Graph<NodeData = {}, EdgeData = {}> {
	id: string;
	nodes: Map<string, Node<NodeData, EdgeData>>;

	constructor(id?: string) {
		this.id = id || '1';
		this.nodes = new Map();
	}

	getAllNodes() {
		return [...this.nodes.values()];
	}
	getNodesMap() {
		return this.nodes;
	}

	getAllEdgesTo(id: string) {
		let edges = [];
		for (const node of this.nodes.values()) {
			const successor = node.hasSuccessor(id);
			if (successor !== undefined) {
				edges.push({ source: node.id, data: successor });
			}
		}

		return edges;
	}

	getAllPredecessors(id: string) {
		let predecessors = [];
		for (const node of this.nodes.values()) {
			if (node.hasSuccessor(id)) {
				predecessors.push(node);
			}
		}

		return predecessors;
	}

	getNode(id: string) {
		return this.nodes.get(id);
	}

	hasNode(id: string) {
		return this.nodes.has(id);
	}
	addEdge(source: string, destination: string, data: EdgeData) {
		const sourceNode = this.getNode(source);
		if (sourceNode) sourceNode.addEdge(destination, data);
	}

	removeEdge(source: string, destination: string) {
		const sourceNode = this.getNode(source);
		if (sourceNode) {
			return sourceNode.removeEdge(destination);
		}
		return undefined;
	}

	addCompleteNode(node: Node<NodeData, EdgeData>) {
		const existingNode = this.getNode(node.id);
		if (existingNode) {
			return existingNode;
		}
		this.nodes.set(node.id, node);
		return node;
	}

	addNode(id: string, data: NodeData) {
		const node = this.getNode(id);
		if (node) {
			return node;
		}

		const newNode = new Node<NodeData, EdgeData>(id, data);
		this.nodes.set(id, newNode);
		return newNode;
	}

	removeNode(id: string) {
		if (this.hasNode(id)) {
			for (const node of this.nodes.values()) {
				node.removeEdge(id);
			}
		}
		return this.nodes.delete(id);
	}

	removeAllNodes() {
		this.nodes = new Map();
	}

	cloneGraph() {
		const clonedGraph = new Graph<NodeData, EdgeData>('1');

		const dfs = (node: Node<NodeData, EdgeData>) => {
			if (!node) return;
			if (clonedGraph.hasNode(node.id)) return clonedGraph.getNode(node.id);

			const clonedNode = clonedGraph.addNode(node.id, { ...node.data });

			node.getSuccessors().forEach((n) => {
				const successor = this.getNode(n[0]) as Node<NodeData, EdgeData>;
				const clone = dfs(successor);
				if (clone) clonedNode.addEdge(clone.id, { ...n[1] });
			});

			return clonedNode;
		};

		for (const node of this.getAllNodes()) {
			if (!clonedGraph.hasNode(node.id)) dfs(node);
		}

		// Return new copied graph
		return clonedGraph;
	}
}
