import {FIRST_STEP_ANIMATION_TIME, POINT_RADIUS, resetMap} from "./index.js";

function createCanvases(data, width, height){
    return data.map((item) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#FF0000";
        item.points.forEach((point) => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, POINT_RADIUS, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        })
        return canvas;
    })
}

export class Points {
    animationTime = FIRST_STEP_ANIMATION_TIME;

    constructor(ctx, canvas, hiddenLine, visibleLine) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.hiddenLine = createCanvases(hiddenLine, canvas.width, canvas.height);
        this.visibleLine = createCanvases(visibleLine, canvas.width, canvas.height);
    }

    drawPoints(lasItemIndex, animateFromBegin = false) {
        const points = this.hiddenLine.slice(0);
        for (let i = 0; i <= lasItemIndex; i++) {
            points.push(this.visibleLine[i]);
        }
        let index = 0;
        resetMap();

        if (animateFromBegin) {
            const stamp = new Date().getTime();
            this.anime = () => {
                const now = new Date().getTime();
                const timeOffset = now - stamp;
                if (this.animationTime - timeOffset > 0) {
                    const max = Math.round(Math.min(timeOffset / this.animationTime, 1) * points.length);
                    for(let i = index; i< max; i++) {
                        this.drawPoint(points[i]);
                    }
                    window.requestAnimationFrame(this.anime);
                }
            }
            this.anime();
        } else {
            for (const item of points) {
               this.drawPoint(item);
            }
        }
    }


    drawPoint(canvas) {
        this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.canvas.width, this.canvas.height)
    }
}
