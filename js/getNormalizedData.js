import {TOTAL_COLUMNS, UKRAINE_RECT} from "./index.js";

function getNewDay() {
    return {
        points: [],
        affected: {
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
        },
    }
}

function getPosX(lon) {
    return (lon - UKRAINE_RECT.left) / UKRAINE_RECT.width;
}

function getPosY(lat) {
    return (UKRAINE_RECT.top - lat) / UKRAINE_RECT.height;
}


function getNormalizeByDate (events) {
    return events.reduce((acc, item) => {
        const accItem = acc[item.from] || getNewDay();
        const {lat, lon, affected_number, affected_type} = item;
        if (lat > UKRAINE_RECT.top || lat < UKRAINE_RECT.bottom || lon > UKRAINE_RECT.right || lon < UKRAINE_RECT.left) {
            return acc;
        }

        if (lat && lon) {
            accItem.points.push({x: getPosX(lon), y: getPosY(lat)});
        }


        if (affected_type) {
            accItem.affected[affected_type] += +affected_number;
        }
        accItem.date = item.from;
        acc[item.from] = accItem;
        return acc;
    }, {})
}

function getWithAffectedFromBegin (totalData) {
    const sortedData = Object.values(totalData).sort((a, b) => {
        if (a.date > b.date) return 1;
        if (a.date < b.date) return -1;
        return 0;
    });

    return sortedData.reduce((acc, item, index) => {
        const prev = index ? acc[index - 1] : getNewDay();
        const sumAffected = {...prev.affected};
        item.dayAffected = Object.values(item.affected).reduce((acc, value) => acc + value, 0);
        for (const affectedItemType in item.affected) {
            sumAffected[affectedItemType] += item.affected[affectedItemType];
        }
        item.affected = sumAffected;
        acc.push(item);
        return acc;
    }, [])
}


function removeDuplicatePoints(data, {height, width}) {
    const mentions = [];
    for (const item of data) {
        item.points = item.points.reduce((acc, point) => {
            const x = Math.round(point.x * width);
            const y = Math.round(point.y * height);

            const str = `${x}${y}`;
            if (!mentions.includes(str)) {
                acc.push({x, y});
                mentions.push(str);
            }
            return acc;
        }, []);
    }
}

export default function getData(events, {height, width}) {
    const byDate = getNormalizeByDate(events);
    const normalizedData = getWithAffectedFromBegin(byDate);
    removeDuplicatePoints(normalizedData, {height, width});
    const hiddenLine = normalizedData.slice(0, normalizedData.length - TOTAL_COLUMNS);
    const visibleLine = normalizedData.slice(normalizedData.length - TOTAL_COLUMNS);
    return {hiddenLine, visibleLine};
}
