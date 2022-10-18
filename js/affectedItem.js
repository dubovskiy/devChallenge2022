import {STEP_ANIMATION_TIME} from "./index.js";

export class Affected {
    node = null;
    value = 0;
    valueNode = null;
    animationTime = STEP_ANIMATION_TIME;

    createNode(title, value = 0) {
        this.node = document.createElement('div');
        this.node.innerHTML = `<div class='affectValue'>${this.value}</div><div class='affectTitle'>${title}</div>`;
        this.valueNode = this.node.querySelector('.affectValue');
        this.setValue(0);
        this.update(value);
    }

    animate(newValue) {
        const oldValue = this.value;
        const delta = newValue - oldValue;
        let stamp = new Date().getTime();

        this.anime = () => {
            const now = new Date().getTime();
            const timeOffset = now - stamp;
            if (this.animationTime - timeOffset > 0) {
                this.setValue(oldValue + Math.round(timeOffset / this.animationTime * delta))
                window.requestAnimationFrame(this.anime);
            } else {
                this.setValue(newValue);
            }
        }
        this.anime();
    }

    setValue(value) {
        this.value = value;
        this.valueNode.innerHTML = value;
    }

    update(value, animationTime) {
        this.animationTime = animationTime;
        this.animate(value);
    };

    constructor(title, value) {
        this.createNode(title, value);
    }
}
