function openAndCloseDic() { 
    // Закрытие словаря
// при нажатии на крестик
const closeDictionaryacross = (event) => { 
    if (event.target === dictionary || event.target.getAttribute(`data-close`) === ``) {
        closeDictionary();
    }
}

// при нажатии на клавишу ESC
const keydownCloseDictionary = (event) => { 
    if (event.code === `Escape` && dictionary.classList.contains(`showDictionary`)) {closeDictionary()} 
}

//Открытие словаря
const showDictionary = () => { 
    dictionary.classList.add(`showDictionary`);
    dictionary.classList.remove(`closeDictionary`);
    document.body.style.overflow = `hidden`;
    // dictionary.classList.toggle(`showDictionary`)
}

// Закрытие словаря
const closeDictionary = () => { 
    dictionary.classList.add('closeDictionary');
    dictionary.classList.remove('showDictionary');
    document.body.style.overflow = ``;
    // dictionary.classList.toggle(`showDictionary`)
}
}

export default openAndCloseDic;