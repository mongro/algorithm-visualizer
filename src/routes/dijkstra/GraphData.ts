import Graph from '../../combinatorics/graph';
import UndoRedoStore from '../../stores/Undo';
import LZString from 'lz-string';

function createExampleGraph() {
	const graph = new Graph<NodeData, EdgeData>();

	graph.addNode('A', { point: { x: 100, y: 100 } });
	graph.addNode('B', { point: { x: 200, y: 100 } });
	graph.addNode('C', { point: { x: 300, y: 100 } });
	graph.addNode('D', { point: { x: 300, y: 300 } });
	graph.addNode('E', { point: { x: 400, y: 300 } });
	graph.addNode('F', { point: { x: 600, y: 300 } });

	// Create edges between nodes
	graph.addEdge('A', 'B', { weight: 4 });
	graph.addEdge('A', 'C', { weight: 4 });
	graph.addEdge('C', 'E', { weight: 3 });
	graph.addEdge('E', 'B', { weight: 4 });
	graph.addEdge('E', 'D', { weight: 4 });
	graph.addEdge('F', 'E', { weight: 4 });

	return graph;
}

export let graphStore: UndoRedoStore<Graph<NodeData, EdgeData>> = new UndoRedoStore(
	new Graph<NodeData, EdgeData>()
);

export function initializeGraphStoreFromUrl(str: string) {
	const text = LZString.decompressFromEncodedURIComponent(str);
	const json = JSON.parse(text);
	//missing validation
	const graph = Graph.fromJSON(json) as Graph<NodeData, EdgeData>;
	graphStore = new UndoRedoStore(graph);
}

export function initializeGraphStoreWithExample() {
	graphStore = new UndoRedoStore(createExampleGraph());
}

export type Point = {
	x: number;
	y: number;
};
export interface NodeData {
	text?: string;
	point: Point;
	stroke?: string;
	fill?: string;
}

export interface EdgeData {
	weight: number;
	stroke?: string;
	fill?: string;
}

export const COLOR_BLUE = '#06b6d4';
export const COLOR_ORANGE = '#ea580c';
export const COLOR_GREY = '#9ca3af';
