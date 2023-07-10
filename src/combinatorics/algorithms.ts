import type { Bin, BinElement } from '../routes/binpack/types';
import type Graph from './graph';
import type Node from './node';
import type { weightedEdge } from './node';
import type { Command } from '../stores/Undo';
import type { KnapSackData } from '../routes/knapsack/ArrayData';
import { batchCommand } from './graphCommands';
import { changeCurrentItem, changeCurrentWeight, changeEntry2D } from './arrayCommands';

export function nextFit(elementsUnflattend: BinElement[]) {
	const elements = elementsUnflattend.reduce<number[]>(
		(acc, current) => [...acc, ...Array(current.quantity).fill(current.size)],
		[]
	);

	let bins: Bin[] = [{ fillRate: 0, elements: [] }];

	for (let i = 0, n = elements.length; i < n; i++) {
		const size = elements[i];
		const currentBin = bins[bins.length - 1];
		const fillRate = size + currentBin.fillRate;
		if (fillRate <= 1) {
			currentBin.elements.push({ size, index: i });
			currentBin.fillRate = fillRate;
		} else {
			bins.push({ fillRate: size, elements: [{ size, index: i }] });
		}
	}
	return bins;
}

export function firstFit(elementsUnflattend: BinElement[]) {
	const elements = elementsUnflattend.reduce<number[]>(
		(acc, current) => [...acc, ...Array(current.quantity).fill(current.size)],
		[]
	);

	let bins = <Bin[]>[];
	for (let i = 0, n = elements.length; i < n; i++) {
		const size = elements[i];
		const binsLength = bins.length;
		let elementSorted = false;

		for (let k = 0; k < binsLength; k++) {
			const fillRate = size + bins[k].fillRate;
			if (fillRate <= 1) {
				bins[k].fillRate = fillRate;
				bins[k].elements.push({ size, index: i });
				elementSorted = true;
				break;
			}
		}
		if (!elementSorted) {
			bins.push({ fillRate: size, elements: [{ size, index: i }] });
		}
	}
	return bins;
}

export function firstFitDecrease(elements: BinElement[]) {
	let sortedElements = [...elements].sort((a, b) => b.size - a.size);
	return firstFit(sortedElements);
}

export function nextFitDecrease(elements: BinElement[]) {
	let sortedElements = [...elements].sort((a, b) => b.size - a.size);
	return nextFit(sortedElements);
}

export type DijkstraStep = {
	action:
		| 'initializing'
		| 'consider_node'
		| 'consider_edge'
		| 'update_distance'
		| 'distance_unchanged'
		| 'shortest_distance_calculated'
		| 'no_more_reachable';
	data: any;
};
// Dijkstra's algorithm
export function dijkstra(graph: Graph<{}, weightedEdge>, startNode: string) {
	const distances = new Map<string, number>(); // Stores shortest distances from startNode to all other nodes
	const previous = new Map<string, string | null>(); // Stores the previous node in the shortest path
	const queue = []; // Priority queue of nodes to visit
	const steps = <DijkstraStep[]>[];

	// Initialize distances and queue
	for (const node of graph.getAllNodes()) {
		distances.set(node.id, Infinity);
		previous.set(node.id, null);
		queue.push(node);
	}
	distances.set(startNode, 0);
	steps.push({
		action: 'initializing',
		data: { start: startNode }
	});

	// Helper function to compare distances between nodes
	const compareDistances = (a: Node, b: Node) =>
		(distances.get(a.id) as number) - (distances.get(b.id) as number);

	while (queue.length > 0) {
		// Sort the queue based on the distances
		queue.sort(compareDistances);

		// Get the node with the smallest distance (at the front of the queue)
		const smallestNode = queue.shift() as Node<{}, weightedEdge>;

		steps.push({
			action: 'consider_node',
			data: { node: smallestNode.id }
		});

		// Stop if the smallest distance is Infinity (no more reachable nodes)
		if (distances.get(smallestNode.id) === Infinity) {
			steps.push({
				action: 'no_more_reachable',
				data: { node: smallestNode.id }
			});
			break;
		}

		// Iterate through the adjacent nodes of the smallest node
		for (const [adjacentNode, data] of smallestNode.getSuccessors()) {
			const distance = (distances.get(smallestNode.id) as number) + data.weight;
			steps.push({
				action: 'consider_edge',
				data: { from: smallestNode.id, to: adjacentNode }
			});
			if (distance < (distances.get(adjacentNode) as number)) {
				// Update the distance and previous node
				distances.set(adjacentNode, distance);
				steps.push({
					action: 'update_distance',
					data: {
						from: smallestNode.id,
						to: adjacentNode,
						dist: distance
					}
				});
				previous.set(adjacentNode, smallestNode.id);
			} else {
				steps.push({
					action: 'distance_unchanged',
					data: {
						from: smallestNode.id,
						to: adjacentNode,
						dist: distance
					}
				});
			}
		}
		steps.push({
			action: 'shortest_distance_calculated',
			data: { node: smallestNode.id }
		});
	}

	return { distances, steps };
}

export function knapsack(values: number[], weights: number[], maxWeight: number) {
	const N = values.length;
	const DP: number[][] = new Array(N + 1);
	const steps: batchCommand<KnapSackData>[] = [];

	for (let i = 0; i < N + 1; i++) {
		DP[i] = new Array(maxWeight + 1);
		for (let j = 0; j < maxWeight + 1; j++) {
			DP[i][j] = 0;
		}
	}

	for (let i = 0; i <= N; i++) {
		if (i > 1) steps.push(new batchCommand<KnapSackData>([new changeCurrentItem(i - 1)]));
		for (let j = 0; j <= maxWeight; j++) {
			if (j > 0) {
				if (steps.length > 0) steps[steps.length - 1].add(new changeCurrentWeight(j));
				else {
					steps.push(new batchCommand<KnapSackData>([new changeCurrentWeight(j)]));
				}
			}

			if (i === 0 || j === 0) {
				/*
      If we have no items or maximum weight we can take in collection is 0
      then the total weight in our collection is 0
      */
				DP[i][0] = 0;
			} else if (weights[i - 1] <= j) {
				const A = values[i - 1] + DP[i - 1][j - weights[i - 1]];
				const B = DP[i - 1][j];
				const batchCmd = new batchCommand<KnapSackData>();

				batchCmd.add(
					new changeEntry2D(i - 1, j - weights[i - 1], {
						status: 'A'
					})
				);
				batchCmd.add(
					new changeEntry2D(i - 1, j, {
						status: 'B'
					})
				);

				steps.push(batchCmd);
				/*
      find the maximum of these two values
      and take which gives us a greater weight
       */
				if (A > B) {
					DP[i][j] = A;
					steps.push(
						new batchCommand<KnapSackData>([
							new changeEntry2D(i, j, {
								status: 'A',
								value: A
							})
						])
					);
				} else {
					DP[i][j] = B;
					steps.push(
						new batchCommand<KnapSackData>([
							new changeEntry2D(i, j, {
								status: 'B',
								value: B
							})
						])
					);
				}

				const deleteCmd = new batchCommand<KnapSackData>();

				deleteCmd.add(
					new changeEntry2D(i - 1, j, {
						status: 'default'
					})
				);

				deleteCmd.add(
					new changeEntry2D(i - 1, j - weights[i - 1], {
						status: 'default'
					})
				);
				deleteCmd.add(
					new changeEntry2D(i, j, {
						status: 'default'
					})
				);

				steps.push(deleteCmd);

				// }
			} else {
				// leave the current item from our collection
				DP[i][j] = DP[i - 1][j];
				steps.push(
					new batchCommand<KnapSackData>([
						new changeEntry2D(i - 1, j, {
							status: 'B'
						})
					])
				);
				steps.push(
					new batchCommand<KnapSackData>([
						new changeEntry2D(i, j, {
							status: 'B',
							value: DP[i - 1][j]
						})
					])
				);

				const deleteCmd = new batchCommand<KnapSackData>();

				deleteCmd.add(
					new changeEntry2D(i, j, {
						status: 'default'
					})
				);

				deleteCmd.add(
					new changeEntry2D(i - 1, j, {
						status: 'default'
					})
				);
				steps.push(deleteCmd);
			}
		}
	}
	function createKnapSackItems(i: number, j: number): number[] {
		if (i === 0) return [];
		const lastCmd = steps[steps.length - 1];
		lastCmd.add(
			new changeEntry2D(i - 1, j, {
				status: 'A'
			})
		);
		lastCmd.add(new changeCurrentItem(i - 1));
		lastCmd.add(new changeCurrentWeight(j));

		const deleteCmd = new batchCommand<KnapSackData>();

		deleteCmd.add(
			new changeEntry2D(i - 1, j, {
				status: 'default'
			})
		);

		steps.push(deleteCmd);
		if (DP[i][j] > DP[i - 1][j]) {
			lastCmd.add(
				new changeEntry2D(i, j, {
					status: 'B'
				})
			);

			return [i, ...createKnapSackItems(i - 1, j - weights[i - 1])];
		} else {
			lastCmd.add(
				new changeEntry2D(i, j, {
					status: 'A'
				})
			);
			deleteCmd.add(
				new changeEntry2D(i, j, {
					status: 'default'
				})
			);
			return createKnapSackItems(i - 1, j);
		}
	}

	steps.push(
		new batchCommand<KnapSackData>([new changeCurrentWeight(-1), new changeCurrentItem(-1)])
	);

	const items = createKnapSackItems(N, maxWeight);
	steps.push(
		new batchCommand<KnapSackData>([new changeCurrentWeight(-1), new changeCurrentItem(-1)])
	);

	return { DP, steps, items };
}
