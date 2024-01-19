import {inject, observer} from "mobx-react";
import {Slider, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {viewSize} from "../../../utils/layout.js";
import RangeSlider from 'react-range-slider-input';
import "react-range-slider-input/dist/style.css";
import {t} from "i18next";

/**
 * @param {import('src/store/store.js').Store} store
 * @constructor
 */
function Timeline({
                      store,
                  }) {
    return <Root>
        <Row>
            <Time>{formatTime(store.curTime)}</Time>
            <Slider min={1}
                    max={store.numFrames}
                    value={store.frame + 1}
                    onChange={e => store.setFrame(e.target.value - 1)}
                    valueLabelDisplay={'auto'}
                    valueLabelFormat={v => formatTime(store.frameTime(v))}/>
        </Row>
        <Row>
            <Time>
                {(store.trajTimeWindow[0] / 30).toFixed(1)} s
            </Time>
            <WindowSlider min={-450}
                          max={150}
                          step={1}
                          disabled={!store.gameData}
                          value={store.trajTimeWindow}
                          onInput={store.setTrajTimeWindow}/>
            <Time>
                {(store.trajTimeWindow[1] / 30).toFixed(1)} s
            </Time>
        </Row>
    </Root>
}

export default inject('store')(observer(Timeline))

const Root = styled('div')(({theme}) => ({
    height: viewSize.timelineHeight,
    padding: theme.spacing(1),
}))

const Time = styled(Typography)({
    width: 70,
    textAlign: 'center',
    flex: '0 0 auto',
})

const Row = styled('div')({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    '&:hover .range-slider__range': {
        height: 6,
    }
})

const WindowSlider = styled(RangeSlider)(({theme}) => ({
    "&.range-slider": {
        height: 2,
    },
    "&.range-slider .range-slider__range": {
        background: theme.palette.primary.main,
        transition: 'height 0.3s',
        borderRadius: 0,
    },
    "&.range-slider .range-slider__thumb": {
        background: theme.palette.primary.dark,
        width: 12,
        height: 12,
        transition: 'transform 0.3s',
    },
    "&.range-slider .range-slider__range[data-active]": {
        height: 8,
    },
    "&.range-slider .range-slider__thumb[data-active]": {
        transform: 'translate(-50%, -50%) scale(1.25)',
    },
    "&.range-slider .range-slider__thumb[data-lower]": {
        transform: 'translate(-50%, -50%)',
    },
    "&.range-slider .range-slider__thumb[data-upper]": {
        transform: 'translate(-50%, -50%)',
    },
    "&::before": {
        content: '""',
        position: 'absolute',
        left: '75%',
        height: '10px',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1,
        backgroundColor: theme.palette.primary.main,
    },
    "&::after": {
        content: `"${t("System.MapView.CurrentTime")}"`,
        position: 'absolute',
        left: '75%',
        height: '10px',
        top: '50%',
        transform: 'translate(-50%, 10px)',
        width: 200,
        textAlign: 'center',
    }
}))

function formatTime(t) {
    const sign = t < 0 ? '-' : '';
    t = Math.abs(t);
    const h = Math.floor(t / 3600)
    t -= h * 3600;
    const m = Math.floor(t / 60)
    t -= m * 60;
    const s = Math.floor(t);

    const str = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    if (h === 0) return `${sign}${str}`;
    else return `${sign}${h}:${str}`;
}
