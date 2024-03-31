import {useCallback, useEffect, useRef} from "react";
import {Image} from 'react-konva';

function useImage(src, onLoad) {
    const image = useRef(new window.Image());
    useEffect(() => {
        image.current.addEventListener('load', onLoad);
        return () => image.current.removeEventListener('load', onLoad);
    }, [onLoad]);
    useEffect(() => {
        image.current.src = src;
    }, [src, onLoad]);
    return image.current;
}

function KonvaImage({x, y, w, h, src}) {
    const imageNode = useRef(null);
    const redraw = useCallback(() => imageNode.current && imageNode.current.getLayer().batchDraw(), []);
    const image = useImage(src, redraw);

    return <Image x={x} y={y}
                  width={w} height={h}
                  image={image}
                  ref={node => imageNode.current = node}/>
}

export default KonvaImage;
