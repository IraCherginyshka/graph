import { Coordinate, Checkpoint, Neighbor } from '../interfaces';

export function createCheckpoint(coordinate: Coordinate): Checkpoint {
    const neighbors: Neighbor[] = [];

    return {
        coordinate,
        id: `${coordinate.x}${coordinate.y}`,
        isStart: false,
        isVisited: false,
        neighbors,
        addNeighbor(neighborCheckpoint, pathLength) {
            neighbors.push({ info: neighborCheckpoint, pathLength });
        }
    };
}

export function createGraph() {
    const checkpoints: Checkpoint[] = [];

    return {
        addCheckpoint(coordinate: Coordinate, ctx: CanvasRenderingContext2D): void {
            const newCheckpoint = createCheckpoint(coordinate);

            if (checkpoints.some((checkpoint) => checkpoint.id === newCheckpoint.id)) return;

            if (checkpoints.length) { // >0
                checkpoints.forEach((checkpoint) => {
                    this.addPath(newCheckpoint, checkpoint, ctx)
                })
            } else {
                newCheckpoint.isStart = true;
                newCheckpoint.isVisited = true;
            }

            checkpoints.push(newCheckpoint);
        },

        addPath(firstCheckpoint: Checkpoint, secondCheckpoint: Checkpoint, ctx: CanvasRenderingContext2D) {

            // edgeLength = d ^ 2 = (х2— х1) ^ 2 + (y2— y1) ^ 2
            const pathLength = Math.sqrt(
                Math.pow(secondCheckpoint.coordinate.x - firstCheckpoint.coordinate.x, 2) +
                Math.pow(secondCheckpoint.coordinate.y - firstCheckpoint.coordinate.y, 2)
            );

            firstCheckpoint.addNeighbor(secondCheckpoint, pathLength);
            secondCheckpoint.addNeighbor(firstCheckpoint, pathLength);

            // draw new paths
            ctx.beginPath();
            ctx.moveTo(firstCheckpoint.coordinate.x, firstCheckpoint.coordinate.y);
            ctx.lineTo(secondCheckpoint.coordinate.x, secondCheckpoint.coordinate.y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'BlueViolet';
            ctx.stroke();
            ctx.font = '18px bold';
            ctx.fillText(`${pathLength.toFixed(2)}`, (firstCheckpoint.coordinate.x + secondCheckpoint.coordinate.x) / 2, (firstCheckpoint.coordinate.y + secondCheckpoint.coordinate.y) / 2);
        },

        findOptimalRoad(ctx: CanvasRenderingContext2D) {
            if (checkpoints.length < 2) return;

            let checkedCheckpoint: Checkpoint = checkpoints.find(({ isStart }) => isStart)!;

            while (checkedCheckpoint.neighbors.some(({info}) => !info.isVisited)) {

                const notVisitedCheckpoints = checkedCheckpoint.neighbors.filter(({info}) => !info.isVisited);
                const nearestNeighbor = notVisitedCheckpoints.reduce((prev, curr) =>(prev.pathLength < curr.pathLength ? prev : curr));
                 nearestNeighbor.info.isVisited = true;

                // draw paths to the nearest checkpoint
                ctx.beginPath();
                ctx.moveTo(checkedCheckpoint.coordinate.x, checkedCheckpoint.coordinate.y);
                ctx.lineTo(nearestNeighbor.info.coordinate.x, nearestNeighbor.info.coordinate.y);
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'green';
                ctx.stroke();
                ctx.font = '18px bold serif';
                ctx.fillText(`${nearestNeighbor.pathLength.toFixed(2)}`, (checkedCheckpoint.coordinate.x + nearestNeighbor.info.coordinate.x) / 2, (checkedCheckpoint.coordinate.y + nearestNeighbor.info.coordinate.y) / 2);

                checkedCheckpoint = nearestNeighbor?.info;
            }
        }
    };
}
