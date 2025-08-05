// Получение данных из HTML
const urlDB = `http://localhost:3000/request`;
const input = document.querySelector(`#word-input`);
const form = document.querySelector(`.form`); 
const resultsWords = document.querySelector(`.results-word`)
const modal = document.querySelector(`.modal`);
const formSave = document.querySelector(`.formSave`);
const dictionaryBtnEng = document.querySelector(`.dictionaryBtnEng`);
const dictionaryBtnRus = document.querySelector(`.dictionaryBtnRus`);
const dictionaryEng = document.querySelector(`.dictionaryEng`);
const dictionaryRus = document.querySelector(`.dictionaryRus`);
const dictionary = document.querySelector(`.dictionary`);
const numberOfWords = document.querySelector('.numberOfWords');


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

    // Формирование англо-русского словаря
    renderEng() {  
        const elementEng = document.createElement(`div`);
        elementEng.classList.add(`dictionary__blockOfWord`);
        elementEng.innerHTML = `<p style = "margin: 0; font-size: 24px"; >${this.Word} - ${this.Definition}</p>`;

        elementEng.append(this.button);
        this.parent.append(elementEng);

        this.deleteBtn();
    } 

    // Формирование русско-англо словаря
    renderRus() {    
        const elementRus = document.createElement(`div`);
        elementRus.classList.add(`dictionary__blockOfWord`);
        elementRus.innerHTML = `<p style = "margin: 0; font-size: 24px"; >${this.Definition} - ${this.Word}</p>`;

        elementRus.append(this.button);
        this.parent.append(elementRus);

        this.deleteBtn();
    }




    // Кнопка удаления
    deleteBtn() { 
        this.button.classList.add(`dictionary__deleteBtn`);
        this.button.id = this.id;
        this.button.innerText = `Delete`;
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
// при нажатии на крестик (Eng)
const closeDictionaryacrossEng = (event) => {
    if (event.target === dictionaryEng || event.target.getAttribute(`data-close`) === ``) {
        closeDictionary(dictionaryEng);
        location.reload();
    }
}

// Закрытие словаря
// при нажатии на крестик (Rus)
const closeDictionaryacrossRus = (event) => { 
    if (event.target === dictionaryRus || event.target.getAttribute(`data-close`) === ``) {
        closeDictionary(dictionaryRus);
        location.reload();
    } 
}

// Закрытие словаря при нажатии на клавишу ESC
const keydownCloseDictionary = (event) => { 
    if (event.code === `Escape` && dictionaryEng.classList.contains(`showDictionary`)) {
        location.reload();
        closeDictionary(dictionaryEng);
    }
    else if (event.code === `Escape` && dictionaryRus.classList.contains(`showDictionary`)) {
        location.reload();
        closeDictionary(dictionaryRus); 
    }
}

//Открытие словаря
const showDictionary = (event) => { 
    if (event.target === dictionaryBtnEng) {
        dictionaryEng.classList.toggle(`showDictionary`);
        document.body.style.overflow = `hidden`;
        // dictionaryEng.classList.add('showDictionary');
        // dictionaryEng.classList.remove(`closeDictionary`);
    } else if (event.target === dictionaryBtnRus) {
        dictionaryRus.classList.toggle(`showDictionary`);
        document.body.style.overflow = `hidden`;
        // dictionaryRus.classList.add('showDictionary');
        // dictionaryRus.classList.remove(`closeDictionary`);
    } 
}

//Закрытие словаря
const closeDictionary = (event) => { 
    if (event === dictionaryEng) {
        dictionaryEng.classList.toggle(`showDictionary`);
        document.body.style.overflow = ``;
        // dictionaryEng.classList.add('closeDictionary');
        // dictionaryEng.classList.remove('showDictionary');
    } else if (event === dictionaryRus) { 
        dictionaryRus.classList.toggle(`showDictionary`);
        document.body.style.overflow = ``; 
        // dictionaryRus.classList.add('closeDictionary');
        // dictionaryRus.classList.remove('showDictionary');
    }
}

// Отправка данных в базу данных из формы
const handleSubmit = (event) => { 
    event.preventDefault();

    if (!state.Word.trim()) return;

    getResources(urlDB)
            .then((data) => { 
                data.some((item, index) => { 
                if ((item.Word === state.Word).toLowerCase()) {
                        const element = document.createElement(`div`);
                        element.innerHTML = `
                        <div class="results-info">
                            ${item.Word} - ${item.Definition}
                        </div>
                        `;
                        return element;
                }else if ((index === Object.keys(data).length - 1)) { 
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

        postData(`http://localhost:3000/request`, json)
            .then(() => {
                location.reload();
            })
            .catch(() => {
                    const statusMessage = document.createElement(`p`);
                    statusMessage.classList.add(`error`)
                    statusMessage.innerText = `Sorry pal, we couldn't record this word...Something goes wrong with server API`
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

//Ввод слов в поисковике
input.oninput = function () {
    resultsWords.innerHTML = ``;
    let val = this.value.trim().toLowerCase();
    if (val === '') return; // Выходим если строка пустая
    
    getResources(urlDB).then((data) => {
        let hasMatches = false; // Флаг для отслеживания совпадений
        
        data.forEach(({ Word, Definition, id }) => {
            const wordOriginal = Word.toLowerCase();
            const definitionOriginal = Definition.toLowerCase();
            
            if (wordOriginal.includes(val) || definitionOriginal.includes(val)) {
                hasMatches = true; // Нашли хотя бы одно совпадение
                const element = createElement(id);
                const resOfWord = capitalLetterOfWord(Word, Definition);
                
                if (wordOriginal.includes(val)) {
                    element.innerHTML =
                        insertMark(resOfWord[0], val) + ' - ' + insertMark(resOfWord[1], val);
                } else {
                    element.innerHTML =
                        insertMark(resOfWord[1], val) + ' - ' + insertMark(resOfWord[0], val);
                }
                
                resultsWords.append(element);
            }
        });
        
        // Если не найдено ни одного совпадения
        if (!hasMatches) {
            resultsWords.innerHTML = 'Sorry, no matches found';
        }
    });
};

//Подсветка совпадений
const insertMark = (str, val) => {
    const regex = new RegExp(val, 'gi');
    return str.replace(regex, (item) => `<mark>${item}</mark>` );
};

//Создание элемента
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

const numberOfWordsValue = (url) => { 
    let res = document.createElement('p');
    // res.tabIndex = 0;
    res.style.cssText = `
    margin: 0;
    font-size: 22px;
    `;
//     Обработчик фокуса
//     res.addEventListener('focus', () => {
//     res.style.outline = '2px solid #2196F3';
// });

    // Обработчик потери фокуса
    // res.addEventListener('blur', () => {
    // res.style.outline = '';
    // });

    getResources(url)
        .then((data) => { 
            data.forEach((item, index) => { 
                res.innerHTML = `Number of Words:  ${index + 1}`;
            })
        })
    numberOfWords.append(res);
}

numberOfWordsValue(urlDB);

// Сортировка слов по алфавиту
const sortWordsEng = (url) => { 
    getResources(url)
        .then((data) => {
            data.sort(function (a, b){ 
                if (a.Word < b.Word) return -1;
            })
            data.forEach(({ id, Word, Definition }) => {
                switch (Word[0].toUpperCase()) {
                    case `A`:
                        new Words(id, Word, Definition, `.dictionary__word_A`).renderEng();
                        break;
                
                    case `B`:
                        new Words(id, Word, Definition, `.dictionary__word_B`).renderEng();
                        break;
                
                    case `C`:
                        new Words(id, Word, Definition, `.dictionary__word_C`).renderEng();
                        break;
                
                    case `D`:
                        new Words(id, Word, Definition, `.dictionary__word_D`).renderEng();
                        break;
                
                    case `E`:
                        new Words(id, Word, Definition, `.dictionary__word_E`).renderEng();
                        break;
                    
                    case `F`:
                        new Words(id, Word, Definition, `.dictionary__word_F`).renderEng();
                        break;

                    case `G`:
                        new Words(id, Word, Definition, `.dictionary__word_G`).renderEng();
                        break;

                    case `H`:
                        new Words(id, Word, Definition, `.dictionary__word_H`).renderEng();
                        break;

                    case `I`:
                        new Words(id, Word, Definition, `.dictionary__word_I`).renderEng();
                        break;

                    case `J`:
                        new Words(id, Word, Definition, `.dictionary__word_J`).renderEng();
                        break;

                    case `K`:
                        new Words(id, Word, Definition, `.dictionary__word_K`).renderEng();
                        break;

                    case `L`:
                        new Words(id, Word, Definition, `.dictionary__word_L`).renderEng();
                        break;

                    case `M`:
                        new Words(id, Word, Definition, `.dictionary__word_M`).renderEng();
                        break;

                    case `N`:
                        new Words(id, Word, Definition, `.dictionary__word_N`).renderEng();
                        break;

                    case `O`:
                        new Words(id, Word, Definition, `.dictionary__word_O`).renderEng();
                        break;

                    case `P`:
                        new Words(id, Word, Definition, `.dictionary__word_P`).renderEng();
                        break;

                    case `Q`:
                        new Words(id, Word, Definition, `.dictionary__word_Q`).renderEng();
                        break;

                    case `R`:
                        new Words(id, Word, Definition, `.dictionary__word_R`).renderEng();
                        break;

                    case `S`:
                        new Words(id, Word, Definition, `.dictionary__word_S`).renderEng();
                        break;

                    case `T`:
                        new Words(id, Word, Definition, `.dictionary__word_T`).renderEng();
                        break;

                    case `U`:
                        new Words(id, Word, Definition, `.dictionary__word_U`).renderEng();
                        break;

                    case `V`:
                        new Words(id, Word, Definition, `.dictionary__word_V`).renderEng();
                        break;
                    
                    case `W`:
                        new Words(id, Word, Definition, `.dictionary__word_W`).renderEng();
                        break;

                    case `X`:
                        new Words(id, Word, Definition, `.dictionary__word_X`).renderEng();
                        break;

                    case `Y`:
                        new Words(id, Word, Definition, `.dictionary__word_Y`).renderEng();
                        break;

                    case `Z`:
                        new Words(id, Word, Definition, `.dictionary__word_Z`).renderEng();
                        break;
                }

                switch (Definition[0].toUpperCase()) {
                    case `А`:
                        new Words(id, Word, Definition, `.dictionary__word_a`).renderRus();
                        break;
                
                    case `Б`:
                        new Words(id, Word, Definition, `.dictionary__word_b`).renderRus();
                        break;
                
                    case `В`:
                        new Words(id, Word, Definition, `.dictionary__word_v`).renderRus();
                        break;
                
                    case `Г`:
                        new Words(id, Word, Definition, `.dictionary__word_g`).renderRus();
                        break;
                
                    case `Д`:
                        new Words(id, Word, Definition, `.dictionary__word_d`).renderRus();
                        break;
                    
                    case `Е`:
                        new Words(id, Word, Definition, '.dictionary__word_e').renderRus();
                        break;

                    case `Ё`:
                        new Words(id, Word, Definition, '.dictionary__word_e`').renderRus();
                        break;

                    case `Ж`:
                        new Words(id, Word, Definition, `.dictionary__word_zh`).renderRus();
                        break;

                    case `З`:
                        new Words(id, Word, Definition, `.dictionary__word_z`).renderRus();
                        break;

                    case `И`:
                        new Words(id, Word, Definition, `.dictionary__word_i`).renderRus();
                        break;

                    case `Й`:
                        new Words(id, Word, Definition, '.dictionary__word_y`').renderRus();
                        break;

                    case `К`:
                        new Words(id, Word, Definition, `.dictionary__word_k`).renderRus();
                        break;

                    case `Л`:
                        new Words(id, Word, Definition, `.dictionary__word_l`).renderRus();
                        break;

                    case `М`:
                        new Words(id, Word, Definition, `.dictionary__word_m`).renderRus();
                        break;

                    case `Н`:
                        new Words(id, Word, Definition, `.dictionary__word_n`).renderRus();
                        break;

                    case `О`:
                        new Words(id, Word, Definition, `.dictionary__word_o`).renderRus();
                        break;

                    case `П`:
                        new Words(id, Word, Definition, `.dictionary__word_p`).renderRus();
                        break;

                    case `Р`:
                        new Words(id, Word, Definition, `.dictionary__word_r`).renderRus();
                        break;

                    case `С`:
                        new Words(id, Word, Definition, `.dictionary__word_s`).renderRus();
                        break;

                    case `Т`:
                        new Words(id, Word, Definition, `.dictionary__word_t`).renderRus();
                        break;

                    case `У`:
                        new Words(id, Word, Definition, `.dictionary__word_u`).renderRus();
                        break;

                    case `Ф`:
                        new Words(id, Word, Definition, `.dictionary__word_f`).renderRus();
                        break;

                    case `Х`:
                        new Words(id, Word, Definition, `.dictionary__word_h`).renderRus();
                        break;

                    case `Ц`:
                        new Words(id, Word, Definition, `.dictionary__word_c`).renderRus();
                        break;

                    case `Ч`:
                        new Words(id, Word, Definition, `.dictionary__word_ch`).renderRus();
                        break;
                    
                    case `Ш`:
                        new Words(id, Word, Definition, `.dictionary__word_sh`).renderRus();
                    break;
                
                    case `Щ`:
                        new Words(id, Word, Definition, `.dictionary__word_sch`).renderRus();
                    break;
                
                    case `Э`:
                        new Words(id, Word, Definition, `.dictionary__word_e`).renderRus();
                        break;
                    
                    case `Ю`:
                        new Words(id, Word, Definition, `.dictionary__word_yu`).renderRus();
                    break;
                
                    case `Я`:
                        new Words(id, Word, Definition, `.dictionary__word_ya`).renderRus();
                        break;
                }
            });
        }) 
}
sortWordsEng(urlDB);

//EVENTS
form.addEventListener(`submit`, handleSubmit,);
dictionaryBtnEng.addEventListener(`click`, showDictionary);
dictionaryBtnRus.addEventListener(`click`, showDictionary);
dictionaryEng.addEventListener(`click`,closeDictionaryacrossEng);
dictionaryRus.addEventListener(`click`,closeDictionaryacrossRus);
window.addEventListener(`keydown`, keydownCloseDictionary);