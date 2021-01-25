export interface Coordinate {
    x: number,
    y: number
}

export interface Checkpoint {
    coordinate: Coordinate,
    id: string,
    isStart: boolean,
    isVisited: boolean,
    neighbors: Neighbor[],
    addNeighbor: (neighborCheckpoint: Checkpoint, pathLength: number) => void
}

export interface Neighbor {
    info: Checkpoint,
    pathLength: number
}
