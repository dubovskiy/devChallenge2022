import events from '../data/events.json' assert {type: 'json'};

import {Columns} from "./timeline.js";
import getData from "./getNormalizedData.js";
import {LeftPane} from "./leftPanel.js";
import {Points} from "./points.js";
export const TOTAL_COLUMNS = 100;
export const STEP_ANIMATION_TIME = 500;
export const FIRST_STEP_ANIMATION_TIME = 3000;
export const PLAY = '&#9658;';
export const PAUSE = '&#x275A;&#x275A;';
const MAP_URL = "./assets/ukraine.svg";
export const POINT_RADIUS = 5;

export const UKRAINE_RECT = {
    top: 52.379251,
    right: 40.220469,
    bottom: 44.386416,
    left: 22.137157,
}
UKRAINE_RECT.width = UKRAINE_RECT.right - UKRAINE_RECT.left;
UKRAINE_RECT.height = UKRAINE_RECT.top - UKRAINE_RECT.bottom;



function updateMapMaxheight() {
    const maxHeight = window.innerHeight - header.clientHeight - footer.clientHeight;
    const maxWidth = maxHeight * canvas.width / canvas.height;
    canvas.style.maxHeight = `${maxHeight}px`;
    canvas.style.maxWidth = `${maxWidth}px`;
}

const columnsWrapper = document.querySelector('.columns');
const timeline = document.querySelector('.timeline');
const eventDate = document.querySelector('.eventDate');
const leftPaneWrapper = document.querySelector('.countPane');
const header = document.querySelector('.header');
const footer = document.querySelector('.footer');
const canvas = document.querySelector('canvas');
const playBtn = document.querySelector('.btnPlace > button');
window.addEventListener('resize', updateMapMaxheight);

const ctx = canvas.getContext('2d');
const country = new Image();
country.src = MAP_URL;

country.onload = function () {
    canvas.width = this.width * 2;
    canvas.height = this.height * 2;
    resetMap();

    const {hiddenLine, visibleLine} = getData(events, canvas);

    const leftPane = new LeftPane(leftPaneWrapper, visibleLine[0].affected);
    const dots = new Points(ctx, canvas, hiddenLine, visibleLine);

    const onChangeDate = function (index, isColumnClicked) {
        const {date, affected} = visibleLine[index];
        eventDate.innerHTML = date;
        isColumnClicked ? leftPane.setValuesFromStart(affected) : leftPane.setValues(affected);
        dots.drawPoints(index, isColumnClicked);
    }

    const columns = new Columns(visibleLine, columnsWrapper, timeline, playBtn, onChangeDate);
    updateMapMaxheight();
};

export function resetMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(country, 0, 0, canvas.width, canvas.height);
}

