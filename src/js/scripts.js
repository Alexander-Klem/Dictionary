// Получение данных из HTML
const urlDB = `http://localhost:3000/request`;
const input = document.querySelector(`#word-input`);
const form = document.querySelector(`.form`); 
const resultsWords = document.querySelector(`.results-word`)
const modal = document.querySelector(`.modal`);
const formSave = document.querySelector(`.formSave`);
const dictionaryBtn = document.querySelector(`.dictionaryBtn`);
const dictionary = document.querySelector(`.dictionary`);
const dictionaryContent = document.querySelector(`.dictionary__content`);


// Формирование слов в словаре
class Words { 
    constructor(id, Word, Definition, parentSelector) { 
        this.Word = Word;
        this.Definition = Definition;
        this.resOfWord = capitalLetterOfWord(this.Word, this.Definition);
        this.id = id;
        this.parent = document.querySelector(parentSelector);
        this.button = document.createElement(`button`);
    }

    render() { 
        this.button.classList.add(`dictionary__deleteBtn`);
        this.button.id = this.id;
        this.button.innerText = `Delete`;
       
        const element = document.createElement(`div`);
        element.classList.add(`dictionary__blockOfWord`);
        element.innerHTML = `
        <p style = "margin: 0; font-size: 24px"; >${this.resOfWord[0]} - ${this.resOfWord[1]}</p>
        `
        element.append(this.button);
        this.parent.append(element);

        this.button.addEventListener(`click`, (event) => {
            getResources(`http://localhost:3000/request`)
                .then((data) => {
                    data.forEach((item) => {
                        if (event.target.id === item.id) {
                            const btn = event.target;
                            const parent = btn.parentNode;
                            parent.remove();

                            deleteResources(`http://localhost:3000/request/${item.id}`)
                                .then(getResources(`http://localhost:3000/request`))
                        }
                 });
            });
        });
    } 
}


// Постинг данных в базу данных
const postData = async(url, data) => { 
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: data
    });

    return await res.json();
}


// Получение данных из базы данных
const getResources = async(url) => { 
    const res = await fetch(url); 

    if (!res.ok) { 
        throw new Error(`Coudn't fetch ${url}, status ${res.status}`);
    }

    return await res.json();
}


// Удаление данных из базы данных
const deleteResources = async (url) => { 
    const res = await fetch(url, { method: `DELETE` });
 
    if (!res.ok) { 
        throw new Error(`Coudn't fetch ${url}, status ${res.status}`);
    }

    return await res.json();
}

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

// Отправка данных в базу данных из формы
const handleSubmit = (event) => { 
    event.preventDefault();

    if (!state.Word.trim()) return;

    getResources(urlDB)
            .then((data) => { 
                data.some((item, index) => { 
                if ((item.Word === state.Word).toLowerCase() || (item.Definition === state.Word).toLowerCase()) {
                        const element = document.createElement(`div`);
                        element.innerHTML = `
                        <div class="results-info">
                            ${item.Word} - ${item.Definition}
                        </div>
                        `;
                        return element;
                    } else if ((index === Object.keys(data).length-1)) { 
                        const statusMessage = document.createElement(`p`);
                        statusMessage.classList.add(`error`)
                        statusMessage.innerText = `Sorry pal, we couldn't recodr this word...Something goes wrong with server API`
                        form.append(statusMessage);
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                    }
            })
            }).catch((error) => { 
                console.log(error)
            }).finally(() => {form.reset();})
}


// Отправление данных пользователя в базу данных
const bindPostData = (form) => {
    form.addEventListener(`submit`, (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        
        const json = JSON.stringify(Object.fromEntries(formData.entries()));

        postData(`http://localhost:3000/request1`, json)
            .then(() => { 
                location.reload();
            })
            .catch(() => {
                    const statusMessage = document.createElement(`p`);
                    statusMessage.classList.add(`error`)
                    statusMessage.innerText = `Sorry pal, we couldn't recodr this word...Something goes wrong with server API`
                    form.append(statusMessage);
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }).finally(() => {
                form.reset();
            });
    });
}
bindPostData(formSave);


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


// Сортировка слов по алфавиту
const sortWords = (url) => { 
    getResources(url)
        .then((data) => {
            data.sort(function (a, b){ 
                if (a.Word < b.Word) return -1;
            })
            data.forEach(({ id, Word, Definition }) => {
                switch (Word[0].toUpperCase()) {
                    case `A`:
                        new Words(id, Word, Definition, `.dictionary__wordA`).render();
                        break;
                
                    case `B`:
                        new Words(id, Word, Definition, `.dictionary__wordB`).render();
                        break;
                
                    case `C`:
                        new Words(id, Word, Definition, `.dictionary__wordC`).render();
                        break;
                
                    case `D`:
                        new Words(id, Word, Definition, `.dictionary__wordD`).render();
                        break;
                
                    case `E`:
                        new Words(id, Word, Definition, `.dictionary__wordE`).render();
                        break;
                    
                    case `F`:
                        new Words(id, Word, Definition, `.dictionary__wordF`).render();
                        break;

                    case `G`:
                        new Words(id, Word, Definition, `.dictionary__wordG`).render();
                        break;

                    case `H`:
                        new Words(id, Word, Definition, `.dictionary__wordH`).render();
                        break;

                    case `I`:
                        new Words(id, Word, Definition, `.dictionary__wordI`).render();
                        break;

                    case `J`:
                        new Words(id, Word, Definition, `.dictionary__wordJ`).render();
                        break;

                    case `K`:
                        new Words(id, Word, Definition, `.dictionary__wordK`).render();
                        break;

                    case `L`:
                        new Words(id, Word, Definition, `.dictionary__wordL`).render();
                        break;

                    case `M`:
                        new Words(id, Word, Definition, `.dictionary__wordM`).render();
                        break;

                    case `N`:
                        new Words(id, Word, Definition, `.dictionary__wordN`).render();
                        break;

                    case `O`:
                        new Words(id, Word, Definition, `.dictionary__wordO`).render();
                        break;

                    case `P`:
                        new Words(id, Word, Definition, `.dictionary__wordP`).render();
                        break;

                    case `Q`:
                        new Words(id, Word, Definition, `.dictionary__wordQ`).render();
                        break;

                    case `R`:
                        new Words(id, Word, Definition, `.dictionary__wordR`).render();
                        break;

                    case `S`:
                        new Words(id, Word, Definition, `.dictionary__wordS`).render();
                        break;

                    case `T`:
                        new Words(id, Word, Definition, `.dictionary__wordT`).render();
                        break;

                    case `U`:
                        new Words(id, Word, Definition, `.dictionary__wordU`).render();
                        break;

                    case `V`:
                        new Words(id, Word, Definition, `.dictionary__wordV`).render();
                        break;

                    case `X`:
                        new Words(id, Word, Definition, `.dictionary__wordX`).render();
                        break;

                    case `Y`:
                        new Words(id, Word, Definition, `.dictionary__wordY`).render();
                        break;

                    case `Z`:
                        new Words(id, Word, Definition, `.dictionary__wordZ`).render();
                        break;

                }
            });
        }) 
}
sortWords(urlDB);


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


//EVENTS
form.addEventListener(`submit`, handleSubmit);
dictionaryBtn.addEventListener(`click`, showDictionary);
document.addEventListener(`keydown`, keydownCloseDictionary);
dictionary.addEventListener(`click`, closeDictionaryacross);    