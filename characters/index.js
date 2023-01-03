function printCharacters() {
    let table = document.getElementById("characters");

    for (const [key, value] of Object.entries(GetCharacters(MixedTheme))) {
        console.log(`${key}: ${value}`);

        let domRow = table.insertRow();

        let valueCell = domRow.insertCell();
        valueCell.textContent = value;

        let nameCell = domRow.insertCell();
        nameCell.textContent = key;
    }
}

printCharacters();
