'use strict';


let setBaseSelect = document.getElementById('config-set-base');
let addRowButton = document.getElementById('config-add-row');
let rowsToAddSelect = document.getElementById('rows-to-add');
let trianglePre = document.getElementById('triangle');

let ACharCode = 'A'.charCodeAt(); // 65


function setShow(element, shouldShow) {
    element.style.display = shouldShow ? '' : 'none';
}


function safeGet(array, index) {
    return (index < array.length && index >= 0) ? array[index] : 0;
}

function formatNumber(n) {
    if (n === 0) {
        return ' ';
    } else if (n < 10) {
        return n;
    } else {
        // 10 => 'A'
        // 11 => 'B'
        // ...
        // 35 => 'Z'
        return String.fromCharCode(n - 10 + ACharCode);
    }
}

class Pascal {
    constructor() {
        this.rows = [[1]];
    }

    setBase(base) {
        if (this.base) {
            throw new Error(`cannot set base, already set to ${this.base}`);
        }
        if (base < 2 || base > 36) {
            throw new Error(`base out of range, must be: 1 < base < 37`);
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
        return this.rows[index].map(formatNumber).join(' ');
    }

    formatLastRow() {
        return this.formatRow(this.rows.length - 1);
    }
}


let p = new Pascal();
trianglePre.appendChild(document.createTextNode(p.formatLastRow() + "\n"));
for (let i = 2; i <= 36; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.text = i;
    setBaseSelect.appendChild(option);
}

let didClickAddRow = () => {
    console.log('add row clicked! %s', setBaseSelect.value);
    if (!p.base) {
        p.setBase(parseInt(setBaseSelect.value, 10));
        setBaseSelect.disabled = true;
    }

    let rowsToAdd = rowsToAddSelect.value;
    for (let i = 0; i < rowsToAdd; i++) {
        let newRow = p.addRow();
        console.log(`row: ${newRow}`);
        trianglePre.appendChild(document.createTextNode(p.formatLastRow() + "\n"));
    }
};
addRowButton.addEventListener('click', didClickAddRow);
