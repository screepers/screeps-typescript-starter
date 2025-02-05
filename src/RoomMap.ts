import { RoomRoutine } from "./RoomProgram";
import { forEach } from "lodash";

// RoomMap now extends RoomRoutine and correctly implements all necessary parts
const GRID_SIZE = 50;

export class RoomMap extends RoomRoutine {
    name = 'RoomMap';
    private room: Room;
    private distanceMatrix: CostMatrix | null = null;
    private skeleton: Skeleton | null = null;

    constructor(room: Room) {
        super(new RoomPosition(25, 25, room.name), {}); // Empty creepIds as placeholder
        this.room = room;
    }

    // Implementation of the abstract routine method
    routine(room: Room): void {
        this.ensureDistanceTransform();  // Ensure distance transform is up-to-date
        this.ensurePeaks();              // Ensure peaks are identified
        this.ensureEdges();              // Ensure edges between peaks are computed
        this.visualize();                // Visualize the result (matrix, peaks)
    }

    // Implementation of the abstract calcSpawnQueue method (empty for RoomMap)
    calcSpawnQueue(room: Room): void {
        // Placeholder, you can leave it empty if spawning isn't needed in this class
    }

    // Private method to ensure the distance transform is calculated and stored
    private ensureDistanceTransform(): void {
        if (this.distanceMatrix !== null) return;

        if (this.room.memory.distanceMatrix) {
            this.distanceMatrix = this.deserializeCostMatrix(this.room.memory.distanceMatrix);
        } else {
            this.distanceMatrix = this.createDistanceTransform();
            this.room.memory.distanceMatrix = this.serializeCostMatrix(this.distanceMatrix);
        }
    }

    private ensurePeaks(): void {
        if (this.skeleton !== null && this.skeleton.peaks.length > 0) return;

        if (this.room.memory.skeleton?.peaks) {
            this.skeleton = this.room.memory.skeleton;
        } else {
            if (!this.distanceMatrix) throw new Error("Distance matrix not calculated");
            const peaks = this.findPeaks(this.distanceMatrix);

            if (!this.skeleton) this.skeleton = { peaks: [], edges: [] };
            this.skeleton.peaks = peaks;

            if (!this.room.memory.skeleton) this.room.memory.skeleton = { peaks: [], edges: [] };
            this.room.memory.skeleton.peaks = peaks;
        }
    }

    private ensureEdges(): void {
        if (this.skeleton !== null && this.skeleton.edges.length > 0) return; // Already calculated

        if (this.room.memory.skeleton?.edges) {
            this.skeleton = this.room.memory.skeleton;
        } else {
            if (!this.skeleton || !this.distanceMatrix) throw new Error("Peaks or distance matrix not calculated");

            const edges = this.createEdges(this.skeleton.peaks, this.distanceMatrix);
            this.skeleton.edges = edges;

            if (!this.room.memory.skeleton) this.room.memory.skeleton = { peaks: [], edges: [] };
            this.room.memory.skeleton.edges = edges;
        }
    }

    private visualize(): void {
        console.log(JSON.stringify(this.distanceMatrix));
        console.log(JSON.stringify(this.skeleton));
        if (!this.distanceMatrix || !this.skeleton) return;

        const vis = this.room.visual;

        // Draw Distance Matrix
        for (let x = 0; x < 50; x++) {
            for (let y = 0; y < 50; y++) {
                const distance = this.distanceMatrix.get(x, y);
                if (distance > 0) {
                    // Normalize the distance for coloring (0 = lowest, 1 = highest)
                    const normalized = distance / (this.room.memory.highestDistance || 1);

                    // Interpolate color from blue → green → red
                    const color = this.interpolateColor(normalized);
                    vis.rect(x, y, 1, 1, { fill: color, opacity: 0.1 });
                }
            }
        }

        // Draw Peaks
        this.skeleton.peaks.forEach(peak => {
            const { x, y } = peak.center;
            const size =  peak.height; // Scale square size by height

            // Draw peak center as a yellow circle
            vis.circle(x, y, { fill: 'yellow', radius: 0.3 });

            // Draw a red square around the peak to represent its height
            vis.rect(x - size / 2, y - size / 2, size, size, { fill: 'red', opacity: 0.1 });
        });
    }

    private interpolateColor(value: number): string {
        const r = Math.floor(255 * value); // More red at high values
        const g = Math.floor(255 * (1 - Math.abs(value - 0.5) * 2)); // Green in the middle
        const b = Math.floor(255 * (1 - value)); // More blue at low values
        return `rgb(${r},${g},${b})`;
    }

    private createDistanceTransform(): CostMatrix {
        const distanceMatrix = new PathFinder.CostMatrix();
        const queue: { x: number; y: number; distance: number }[] = [];
        const terrain = Game.map.getRoomTerrain(this.room.name);
        let highestDistance = 0;

        // Initialize the queue with walls and set their distance to 0
        for (let x = 0; x < 50; x++) {
            for (let y = 0; y < 50; y++) {
                if (terrain.get(x, y) === TERRAIN_MASK_WALL) {
                    distanceMatrix.set(x, y, 0);
                    queue.push({ x, y, distance: 0 });
                } else {
                    distanceMatrix.set(x, y, Infinity);
                }
            }
        }

        // BFS to propagate distances
        while (queue.length > 0) {
            const { x, y, distance } = queue.shift()!; // Get the next tile

            // Check neighbors (up, down, left, right)
            const neighbors = [
                { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
                { dx: 0, dy: -1 }, { dx: 0, dy: 1 }
            ];

            for (const { dx, dy } of neighbors) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < 50 && ny >= 0 && ny < 50) {
                    const currentDistance = distanceMatrix.get(nx, ny);
                    const newDistance = distance + 1;

                    if (terrain.get(nx, ny) !== TERRAIN_MASK_WALL && newDistance < currentDistance) {
                        distanceMatrix.set(nx, ny, newDistance);
                        queue.push({ x: nx, y: ny, distance: newDistance });

                        if (newDistance > highestDistance) {
                            highestDistance = newDistance;
                        }
                    }
                }
            }
        }

        // Store the highest distance in room memory
        this.room.memory.highestDistance = highestDistance;

        // Second pass: Invert the distances
        for (let x = 0; x < 50; x++) {
            for (let y = 0; y < 50; y++) {
                const originalDistance = distanceMatrix.get(x, y);
                if (originalDistance !== Infinity) {
                    const invertedDistance = 1 + highestDistance - originalDistance;
                    distanceMatrix.set(x, y, invertedDistance);
                }
            }
        }

        return distanceMatrix;
    }

    private findPeaks(distanceMatrix: CostMatrix): Peak[] {
        const terrain = Game.map.getRoomTerrain(this.room.name);
        const searchCollection: { x: number; y: number; height: number }[] = [];
        const visited = new Set<string>();
        const peaks: Peak[] = [];
        const highestDistance = this.room.memory.highestDistance || 0;

        // Step 1: Collect all tiles into a search collection
        for (let x = 0; x < 50; x++) {
            for (let y = 0; y < 50; y++) {
                if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
                    const height = distanceMatrix.get(x, y);
                    if (highestDistance - height > 4) {
                        searchCollection.push({ x, y, height });}
                }
            }
        }

        // Sort search collection by height (descending)
        searchCollection.sort((a, b) => b.height - a.height);

        // Step 2: Identify peaks
        while (searchCollection.length > 0) {
            const tile = searchCollection.shift()!; // Get the highest tile remaining

            if (visited.has(`${tile.x},${tile.y}`)) {
                continue; // Skip if already part of another peak
            }

            // BFS/Flood-fill to find adjacent tiles of the same height
            const cluster: { x: number; y: number }[] = [];
            const queue = [{ x: tile.x, y: tile.y }];

            while (queue.length > 0) {
                const { x, y } = queue.pop()!;
                const key = `${x},${y}`;

                if (visited.has(key) || distanceMatrix.get(x, y) !== tile.height) {
                    continue;
                }

                visited.add(key);
                cluster.push({ x, y });

                // Check adjacent tiles
                const neighbors = [
                    { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
                    { dx: 0, dy: -1 }, { dx: 0, dy: 1 }
                ];

                for (const { dx, dy } of neighbors) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx >= 0 && nx < 50 && ny >= 0 && ny < 50 && !visited.has(`${nx},${ny}`)) {
                        queue.push({ x: nx, y: ny });
                    }
                }
            }

            // Compute centroid of the cluster
            const centerX = Math.round(cluster.reduce((sum, t) => sum + t.x, 0) / cluster.length);
            const centerY = Math.round(cluster.reduce((sum, t) => sum + t.y, 0) / cluster.length);

            // Store peak information
            const peak: Peak = {
                tiles: cluster.map(t => new RoomPosition(t.x, t.y, this.room.name)),
                center: new RoomPosition(centerX, centerY, this.room.name),
                height: 1 + highestDistance - tile.height
            };

            peaks.push(peak);
        }

        // Step 3: Filter out peaks that are too close to larger ones
        peaks.sort((a, b) => b.tiles.length - a.tiles.length); // Sort by size (largest first)
        const finalPeaks: Peak[] = [];
        const excludedPositions = new Set<string>();

        for (const peak of peaks) {
            if (excludedPositions.has(`${peak.center.x},${peak.center.y}`)) {
                continue;
            }

            finalPeaks.push(peak);

            // Mark surrounding positions for exclusion
            const exclusionRadius = peak.height;
            for (let dx = -exclusionRadius; dx <= exclusionRadius; dx++) {
                for (let dy = -exclusionRadius; dy <= exclusionRadius; dy++) {
                    const ex = peak.center.x + dx;
                    const ey = peak.center.y + dy;
                    if (ex >= 0 && ex < 50 && ey >= 0 && ey < 50) {
                        excludedPositions.add(`${ex},${ey}`);
                    }
                }
            }
        }

        return finalPeaks;
    }


    // Helper function to create edges
    private createEdges(peaks: Peak[], distanceMatrix: CostMatrix): Edge[] {
        const edges: Edge[] = [];
        // Implement logic to create edges
        return edges;
    }

    // Helper function to serialize CostMatrix for memory
    private serializeCostMatrix(matrix: CostMatrix): number[] {
        const serialized: number[] = [];
        for (let x = 0; x < 50; x++) {
            for (let y = 0; y < 50; y++) {
                serialized.push(matrix.get(x, y));
            }
        }
        return serialized;
    }

    // Helper function to deserialize CostMatrix from memory
    private deserializeCostMatrix(serialized: number[]): CostMatrix {
        const matrix = new PathFinder.CostMatrix();
        for (let x = 0; x < 50; x++) {
            for (let y = 0; y < 50; y++) {
                matrix.set(x, y, serialized[x * 50 + y]);
            }
        }
        return matrix;
    }
}

// Data structures
type Peak = {
    tiles: RoomPosition[]; // Tiles that make up the peak
    center: RoomPosition;  // Average x, y of the tiles
    height: number;        // Distance score of the peak
};

type Edge = {
    from: Peak;            // Starting peak
    to: Peak;              // Ending peak
    path: RoomPosition[];  // Path between peaks (ridge line)
    cost: number;          // Cost of the path
};

type Skeleton = {
    peaks: Peak[];         // All peaks in the room
    edges: Edge[];         // All edges between peaks
};
