// Поиск и вывод нужных слов из базы данных
input.oninput = function () {
    resultsWords.innerHTML = ``;
    let val = this.value.trim().toLowerCase();
    getResources(urlDB).then((data) => {
        if (val !== '') {
            data.forEach(({ Word, Definition, id }) => {
                const wordLower = Word.toLowerCase();
                const definitionLower = Definition.toLowerCase();

                if (wordLower.includes(val)) {
                    const element = createElement(id);
                    const resOfWord = capitalLetterOfWord(Word, Definition);
                    const matchIndex = wordLower.indexOf(val);
                    element.innerHTML = insertMark(resOfWord[0], matchIndex, val.length);
                    resultsWords.append(element);
                } else if (definitionLower.includes(val)) {  //== 1
                    const element = createElement(id);
                    const resOfWord = capitalLetterOfWord(Word, Definition);
                    const matchIndex = wordLower.indexOf(val);
                    element.innerHTML = insertMark(resOfWord[1], matchIndex, val.length);
                    resultsWords.append(element);
                }
             })
        }
    })
}

function createElement(id) {
    const element = document.createElement('p');
    element.classList.add('results-word', 'element');
    element.id = id;
    return element;
}

// Приведение первой буквы в верхний регистр
    const capitalLetterOfWord = (Word, Definition) => { 
        const upperFirstWord = Word[0].toUpperCase();
        const upperFirstDefinition = Definition[0].toUpperCase();
        const resOfWord = Word.slice(1);
        const resOfDefinition = Definition.slice(1);
        const resultOfWord = upperFirstWord + resOfWord;
        const resultOfDefinition = upperFirstDefinition + resOfDefinition;
        return [resultOfWord,resultOfDefinition];
    }

   const insertMark = (string, pos, len) => {
return string.slice(0, pos) + '<mark>' + string.slice(pos, pos + len) + '</mark>' + string.slice(pos + len);
};




// Неправильный вариант
// // Поиск и вывод нужных слов из базы данных
// input.oninput = function () {
//     resultsWords.innerHTML = ``;
//     let val = this.value.trim().toLowerCase();
//     getResources(urlDB).then((data) => {
//         if (val !== '') {
//             data.forEach(({ Word, Definition, id }) => {
//                 if (Word.toLowerCase().includes(val) == 1) {
//                     const element = document.createElement(`p`);
//                     element.classList.add(`results-word`);
//                     element.classList.add(`element`);
//                     element.id = id;
//                     const resOfWord = capitalLetterOfWord(Word, Definition);
//                     // element.innerHTML = `
//                     // ${resOfWord[0]} - ${resOfWord[1]}
//                     // `;
//                     let str = resOfWord[0];
//                     // element.innerText = resOfWord;
//                     element.innerHTML = insertMark(str, Word.toLowerCase().includes(val), val.length);
//                     resultsWords.append(element);
//                 } else if (Definition.toLowerCase().includes(val) == 1) {  //== 1
//                     const element = document.createElement(`p`);
//                     element.classList.add(`results-word`);
//                     element.classList.add(`element`);
//                     element.id = id;
//                     const resOfWord = capitalLetterOfWord(Word, Definition);
//                     element.innerHTML = `
//                     ${resOfWord[1]} - ${resOfWord[0]}
//                     `;
//                     resultsWords.append(element);
//                 }
//              })
//         }
//     })
// }

// // Приведение первой буквы в верхний регистр
//     const capitalLetterOfWord = (Word, Definition) => { 
//         const upperFirstWord = Word[0].toUpperCase();
//         const upperFirstDefinition = Definition[0].toUpperCase();
//         const resOfWord = Word.slice(1);
//         const resOfDefinition = Definition.slice(1);
//         const resultOfWord = upperFirstWord + resOfWord;
//         const resultOfDefinition = upperFirstDefinition + resOfDefinition;
//         return [resultOfWord,resultOfDefinition];
//     }

//    const insertMark = (string, pos, len) => {
//   return string.slice(0, pos) +'<mark>' + string.slice(pos, pos + len) + '</mark>' + string.slice(pos + len);
// };