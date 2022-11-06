'use strict';


let setBaseSelect = document.getElementById('config-set-base');
let addRowButton = document.getElementById('config-add-row');
let rowsToAddSelect = document.getElementById('rows-to-add');
let trianglePre = document.getElementById('triangle');


function setShow(element, shouldShow) {
    element.style.display = shouldShow ? '' : 'none';
}


function safeGet(array, index) {
    return (index < array.length && index >= 0) ? array[index] : 0;
}

class Pascal {
    constructor() {
        this.rows = [[1]];
    }

    setBase(base) {
        if (this.base) {
            throw new Error(`cannot set base, already set to ${this.base}`);
        }
        this.base = base;
    }

    addRow() {
        if (!this.base) {
            throw new Error("base not set");
        }
        let prevRow = this.rows[this.rows.length - 1]
        let newRow = [];
        for (let i = 0; i <= prevRow.length; i++) {
            let val = safeGet(prevRow, i - 1) + safeGet(prevRow, i);
            newRow.push(val % this.base);
        }
        this.rows.push(newRow);
        return newRow;
    }

    formatRow(index) {
        return this.rows[index].map(n => (n > 0) ? n : ' ').join(' ');
    }

    formatLastRow() {
        return this.formatRow(this.rows.length - 1);
    }
}


let p = new Pascal();
trianglePre.appendChild(document.createTextNode(p.formatLastRow() + "\n"));

let didClickAddRow = () => {
    console.log('add row clicked! %s', setBaseSelect.value);
    if (!p.base) {
        p.setBase(parseInt(setBaseSelect.value, 10));
        setShow(setBaseSelect, false);
    }

    let rowsToAdd = rowsToAddSelect.value;
    for (let i = 0; i < rowsToAdd; i++) {
        let newRow = p.addRow();
        console.log(`row: ${newRow}`);
        trianglePre.appendChild(document.createTextNode(p.formatLastRow() + "\n"));
    }
};
addRowButton.addEventListener('click', didClickAddRow);
