function printCharacters(start, end) {
    let table = document.getElementById("characters");

    for (let i = start; i <= end; i++) {
        let domRow = table.insertRow();

        let codePointCell = domRow.insertCell();
        codePointCell.textContent = i;

        let valueCell = domRow.insertCell();
        valueCell.textContent = String.fromCodePoint(i);
    }
}


let startInput      = document.getElementById('start');
let endInput        = document.getElementById('end');
let generateButton  = document.getElementById('generate');

let didClickGenerate = () => {
    let start = parseInt(startInput.value, 10);
    let end = parseInt(endInput.value, 10);
    console.log('generate clicked! %s, %s, %s, %s', start, end, typeof start, typeof end);
    printCharacters(start, end);
};
generateButton.addEventListener('click', didClickGenerate);

