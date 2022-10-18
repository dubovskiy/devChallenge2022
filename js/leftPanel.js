import names from '../data/names.json' assert {type: 'json'};
import {Affected} from "./affectedItem.js";
import {FIRST_STEP_ANIMATION_TIME, STEP_ANIMATION_TIME} from "./index.js";

export class LeftPane {
    affecteds = {};

    constructor(wrapper, affected) {
        const lang = navigator.language.replace(/-.*/, '');
        const titles = names[lang]?.affected_type || names.en.affected_type;
        this.affecteds = Object.keys(titles).reduce((acc, affectedType) => {
            const affectedItem = new Affected(titles[affectedType], 0);
            wrapper.append(affectedItem.node);
            acc[affectedType] = affectedItem;
            return acc;
        }, {})
    }

    setValues(data) {
        for (const affectedType in this.affecteds) {
            this.affecteds[affectedType].update(data[affectedType], STEP_ANIMATION_TIME)
        }
    }

    setValuesFromStart(data) {
        for (const affectedType in this.affecteds) {
            this.affecteds[affectedType].setValue(0);
            this.affecteds[affectedType].update(data[affectedType], FIRST_STEP_ANIMATION_TIME)
        }
    }

    clearValues() {
        for (const affectedType in this.affecteds) {
            this.affecteds[affectedType](0)
        }
    }
}
