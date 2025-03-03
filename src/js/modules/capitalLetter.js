function capitalLetter() { 
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
}

export default capitalLetter;