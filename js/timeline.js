import {PAUSE, PLAY, STEP_ANIMATION_TIME} from "./index.js";


const MAX_COLUMN_HEIGHT = 60;
const MIN_COLUMN_HEIGHT = 5;
const TIME_SHOW_HIDDEN = 3000;

function getMaxHeight (dataByColumn) {
    // I set approx 30% of data like max value;
    return dataByColumn.map(item => item.dayAffected).sort()[Math.floor(dataByColumn.length * 0.9)]
}

function converValueToColumnHeight(item, index, columnMax) {
    let value = item.dayAffected;
    if (value > columnMax) {
        item.columnAffected = MAX_COLUMN_HEIGHT;
    } else if(value > 0) {
        item.columnAffected = Math.max(Math.round(value / columnMax * MAX_COLUMN_HEIGHT), MIN_COLUMN_HEIGHT);
    } else {
        item.columnAffected = 0;
    }
}

function updateDataByColumns(data) {
    const columnMax = getMaxHeight(data);
    data.forEach((item, index) => converValueToColumnHeight(item, index, columnMax))
    return data;
}

export class Columns {
    columnsList = [];
    constructor(data, wrapper, timeline, playBtn, callback) {
        this.callback = callback;

        const dataByColumn = updateDataByColumns(data);
        this.columnsList = dataByColumn.map((item, index) => this.createColumns(item, index));
        this.timeline = timeline;
        timeline.min = 0;
        timeline.value = 0;
        timeline.max = data.length - 1;
        timeline.addEventListener('input', (e) => {
            this.button.setStatus(false);
            this.update(e.target.value)
        });
        wrapper.append(...this.columnsList);
        this.update(0, true);
        this.button = new Button(playBtn, () => {
            if (timeline.value !== timeline.max) {
                this.update(+timeline.value + 1);
                return true;
            }
            return false;
        });
    }

    createColumns({columnAffected}, index) {
        const item = document.createElement('div');
        item.classList.add('column');
        item.dataset.index = index;
        item.insertAdjacentHTML('afterbegin', `<div style="height: ${columnAffected}px" class="columnFilled"></div>`)
        item.addEventListener('click', () => {
            this.button.setStatus(false);
            this.update(index, true);
        })
        return item;
    }

    update(value, isColumnClicked) {
        this.callback(value, isColumnClicked);
        this.timeline.value = value;
        this.columnsList.forEach((item) => {
            const method = +item.dataset.index > value ? 'remove' : 'add';
            item.classList[method]('active');
        })
    }
}

class Button {
    isPlaying = false;
    constructor(btn, callback) {
        this.btn = btn;
        this.setStatus(false);
        this.btn.addEventListener('click', () => {
            this.setStatus(!this.isPlaying);
            if (this.isPlaying) {
                const interval = setInterval(() => {
                    if (!this.isPlaying || !callback()) {
                        clearInterval(interval)
                        this.setStatus(false);
                    }
                }, STEP_ANIMATION_TIME);
            }
        })
    }
    setStatus(isPlay) {
        this.isPlaying = isPlay;
        this.btn.innerHTML = isPlay ? PAUSE : PLAY;
    }
}
