import React, { useEffect, useRef } from 'react'
import { Box, makeStyles, Button } from '@material-ui/core';

import { createGraph } from '../utils/graph';

const useStyles = makeStyles({
    map: {
        width: 500,
        height: 300,
        backgroundImage: 'url(./map.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top left',
    }
})

const Map: React.FC = () => {
    let ctx: CanvasRenderingContext2D | null;
    const classes = useStyles();

    const graph = createGraph();

    const canvasRef = useRef(null)

    const onMapClick = ({ clientX: x, clientY: y }: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        graph.addCheckpoint({
            x,
            y
        }, ctx!);

        ctx!.fillStyle = '#B22222'
        ctx!.beginPath()
        ctx!.arc(x, y, 8, 0, 2 * Math.PI)
        ctx!.fill()
    }

    useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        ctx = canvas!.getContext('2d')!;
    }, [])

    return (
        <>
            <Box className={classes.map} mb={3}>
                <canvas ref={canvasRef} width="500px" height="300px" onClick={onMapClick} />
            </Box>
            <Box textAlign="center">
                <Button variant="contained" color="primary" onClick={() => graph.findOptimalRoad(ctx!)}>Best Road</Button>
            </Box>
        </>
    );
}

export default Map;