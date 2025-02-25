function input() { 
    // Поиск и вывод нужных слов из базы данных
input.oninput = function () {
    resultsWords.innerHTML = ``;
    let val = this.value.trim().toLowerCase();
    getResources(urlDB).then((data) => {
        if (val !== '') {
            data.forEach(({ Word, Definition, id }) => {
                if (Word.toLowerCase().includes(val) == 1) {
                    const element = document.createElement(`p`);
                    element.classList.add(`results-word`);
                    element.classList.add(`element`);
                    element.id = id;     
                    const resOfWord = capitalLetterOfWord(Word, Definition);
                    element.innerHTML = `
                    ${resOfWord[0]} - ${resOfWord[1]}
                    `;
                    resultsWords.append(element);
                } 
                if (Definition.toLowerCase().includes(val) == 1) { 
                    const element = document.createElement(`p`);
                    element.classList.add(`results-word`);
                    element.classList.add(`element`);
                    element.id = id;
                    const resOfWord = capitalLetterOfWord(Word, Definition);
                    element.innerHTML = `
                    ${resOfWord[1]} - ${resOfWord[0]}
                    `;

                    resultsWords.append(element);
                    }
            })
        }
    })
}
}

module.exports = input;