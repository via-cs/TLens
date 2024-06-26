import usePointLassoSelection from "./usePointLassoSelection.js";
import useLasso from "./useLasso.js";
import {Fragment, useCallback, useRef} from "react";
import ConvexHull, {LassoGroup} from "./ConvexHull.jsx";
import {inject, observer} from "mobx-react";
import useContextMenu from "../../../utils/useContextMenu.jsx";
import {selectionColor} from "../../../utils/theme.js";
import useKeyPressed from "../../../utils/useKeyPressed.js";
import WorkerTagsMenu from "./WorkerTagsMenu.jsx";
import {probOpacity} from "../../../utils/encoding.js";
import Point from "./Point.jsx";
import useProjLayout from "./useProjLayout.js";
import {alpha} from "@mui/material";

const W = 1000, H = 1000, rScale = 25;

/**
 *
 * @param {import('src/model/Strategy.js').Prediction[]} allPredictors
 * @param {number[][]} predictorGroups
 * @param {number[]} selectedPredictors
 * @param {number[]} comparedPredictors
 * @param {number[]} viewedPredictors
 * @param {(predIds: number[], whichGroup: 0 | 1) => void} onSelectGroup
 * @param {(predId: number[]) => void} onViewPredictors
 * @constructor
 */
function PredictorsProjection({
                                  allPredictors,
                                  predictorGroups,
                                  selectedPredictors,
                                  comparedPredictors,
                                  viewedPredictors,
                                  onSelectGroup,
                                  onViewPredictors,
                                  store,
                              }) {
    /**
     * Instructions on force-directed graph:
     * 1. Variable "predProj" here recorded the projection location of each point,
     *    in the format of Array<[number, number]>, each number is in [0, 1]
     * 2. Use a hook to re-layout the points with force-directed graph.
     * */
    const predProj = store.predictionProjection;
    const {points, onInit} = useProjLayout(predProj, predictorGroups, rScale);
    const {lasso, isDrawing, handleMouseDown, handleMouseUp, handleMouseMove} = useLasso();
    const shift = useKeyPressed('Shift');
    const preSelectedPointsIdx = usePointLassoSelection(points, lasso);
    const handleClear = useCallback(e => {
        e.preventDefault();
        e.stopPropagation();
        onSelectGroup([], 0);
        onSelectGroup([], 1);
    }, []);

    const tagSelection = useRef([]);
    const {menuFactory, onContextMenu} = useContextMenu();
    const handleContextMenu = pId => e => {
        e.stopPropagation();
        e.preventDefault();
        onContextMenu(e);
        tagSelection.current = pId;
    }
    const handleSelectPoint = pId => e => e.button === 0 && onSelectGroup([pId], Number(e.shiftKey));

    return <Fragment>
        <svg viewBox={`0 0 ${W} ${H}`} width={'100%'} height={'100%'}
             onContextMenu={handleClear}
             onDoubleClick={onInit}
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={e => {
                 if (isDrawing) onSelectGroup(preSelectedPointsIdx, shift ? 1 : 0);
                 handleMouseUp(e);
             }}>
            <g>
                {predictorGroups.map((g, gId) => (
                    <ConvexHull key={gId}
                                predictorGroup={g}
                                points={points}
                                tags={store.clusterTags(g)}
                                selected={selectedPredictors}
                                onViewGroup={onViewPredictors}
                                onSelectGroup={onSelectGroup}
                                onContextMenu={handleContextMenu(g)}/>
                ))}
            </g>
            <g>
                {points.map((point, pId) => {
                    const opacity = probOpacity(allPredictors[pId].probability);
                    return <Point key={pId} pId={pId}
                                  x={point[0] * W} y={point[1] * H}
                                  traj={allPredictors[pId].trajectory}
                                  r={point[2] * W / rScale}
                                  tags={store.workerTags[pId]}
                                  opacity={opacity}
                                  selected={selectedPredictors.includes(pId)}
                                  preSelected={preSelectedPointsIdx.includes(pId)}
                                  preSelectColor={selectionColor[Number(shift)]}
                                  compared={comparedPredictors.includes(pId)}
                                  viewed={viewedPredictors.includes(pId)}
                                  isLassoing={isDrawing}
                                  onContextMenu={handleContextMenu([pId])}
                                  onClick={handleSelectPoint(pId)}
                                  onMouseEnter={() => onViewPredictors([pId])}
                                  onMouseLeave={() => onViewPredictors([])}/>
                })}
            </g>
            {isDrawing && <LassoGroup d={'M' + lasso.map(p => `${p[0] * W} ${p[1] * H}`).join('L')}
                                      color={alpha(selectionColor[Number(shift)], 0.2)}
                                      width={W / 200}/>}
        </svg>
        {menuFactory(<WorkerTagsMenu tagSelection={tagSelection.current}/>)}
    </Fragment>
}

export default inject('store')(observer(PredictorsProjection));