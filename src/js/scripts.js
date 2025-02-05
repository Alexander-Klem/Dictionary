// TODO: получить данные по API
// TODO: вставить слово в контейнер results-word
// TODO: добавить функционал для воспроизведения звука
// TODO: вставить полученные данные в конейнер с результатами

let state = {
    word: ``,
    meanings: [],
    phonetics: []
}

const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const input = document.getElementById(`word-input`);
const form = document.querySelector(`.form`);
const containerWord = document.querySelector(`.results-word`);
const soundButton = document.querySelector('.results-sound');
const resultsWrapper = document.querySelector(`.results`);
const resultsList = document.querySelector(`.results-list`);
const errorContainer = document.querySelector(`.error`);


const modal = document.querySelector(`.modal`);
const modalShowBtn = document.querySelector(`.save`);
const formSave = document.querySelector(`.formSave`);


class Words { 
    constructor() { 

    }
}

const message = {
    loading: `/images/spinner.svg`,
    success: `Word has been saved`,
    failure: `Something goes wrong...`
}

const getResources = async(url) => { 
    const res = await fetch(url);

    if (!res.ok) { 
        throw new Error(`Coudn't fetch ${url}, status ${res.status}`);
    }

    return await res.json();
}

getResources(`http://localhost:3000/request`)
    .then((data) => createCard(data));

function createCard(data) { 
    data.forEach(({ Word, Definition }) => { 
        const element = document.createElement(`div`);
        element.classList.add(`.modal__title`);
        element.innerHTML = `
        <div>${Word} - ${Definition}</div>
        `;

        document.querySelector(`.main`).append(element);
    })
}

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

const bindPostData = (form) => { 
    form.addEventListener(`submit`, (event) => {
        event.preventDefault();

        const statusMessage = document.createElement(`img`);
        statusMessage.src = message.loading;
        statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
        `;
        form.append(statusMessage);

        const formData = new FormData(form);

        const json = JSON.stringify(Object.fromEntries(formData.entries()));
        
        postData(`http://localhost:3000/request`, json)  
          .then((data) => {
            console.log(data);
            showThanksModal(message.success);
            statusMessage.remove();
        }).catch(() => { 
            showThanksModal(message.failure);
        }).finally(() => { 
            form.reset();
        })
    });

    function showThanksModal(message) { 
        const prevModalDialog = document.querySelector(`.modal__dialog`);

        prevModalDialog.classList.add(`none`);
        showModal();

        const thanksModal = document.createElement(`div`);
        thanksModal.classList.add(`modal__dialog`, `fade`);
        thanksModal.innerHTML = `
        <div class = 'modal__content'>
            <div class = 'modal__close'>&times;</div>
            <div class="modal__title">${message}</div>
        </div>
        `;

        document.querySelector(`.modal`).append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add(`show`);
            prevModalDialog.classList.remove(`none`);
            closeModal();
        }, 3000);
    }
}

bindPostData(formSave);


const closeModalacross = (event) => { 
    if (event.target === modal || event.target.getAttribute(`data-close`) ===  ``) {closeModal();}
}

const keydownCloseModal = (event) => { 
    if (event.code === `Escape` && modal.classList.contains(`show`)) {closeModal()} 
}

const showModal = () => { 
    modal.classList.add(`show`, `fade`);
    // modal.classList.add(`fade`);
    modal.classList.remove(`hide`);
    document.body.style.overflow = `hidden`;
    // modal.classList.toggle(`show`)
}

const closeModal = () => { 
    modal.classList.add('hide', `fade`);
    // modal.classList.remove(`fade`);
    modal.classList.remove('show');
    document.body.style.overflow = ``;
    // modal.classList.toggle(`show`)
}

const showError = (error) => { 
    errorContainer.style.display = `block`;
    resultsWrapper.style.display = `none`;

    errorContainer.innerText = error.message;
}

const renderDefinition = (itemDefinition) => { 
    const example = itemDefinition.example ?
        `<div class="results-item__example">
        <p>Example: <span>${itemDefinition.example}</span></p>
        </div>`
        : ``;

return `<div class="results-item__definition">
        <p>${itemDefinition.definition}</p>
        ${example}
        </div>`
}

const getDefinitions = (definition) => {
    return definition.map(renderDefinition).join('');
}

const renderItem = (item) => { 
    // const itemDefinition = item.definitions[0];
return ` <div class="results-item">
            <div class="results-item__part">${item.partOfSpeech}</div>
            <div class="results-item__definitions">
            ${getDefinitions(item.definitions)}
        </div>
    </div>`
}

const showResults = () => { 
    resultsWrapper.style.display = `block`;
    resultsList.innerHTML = ``;
    
   state.meanings.forEach(item => {
        resultsList.innerHTML += renderItem(item);
    });
}

const insertWord = () => { 
    containerWord.innerText = state.word;
}


const handleSubmit = async (event) => { 
    event.preventDefault();

    // if (!state.word.trim()) return;

    try {
        const response = await fetch(`${url} ${state.word}`);
        const data = await response.json();

        if (response.ok && data.length) {
            errorContainer.style.display = `none`;
            const item = data[0];

            state = {
                ...state,
                meanings: item.meanings,
                phonetics: item.phonetics,
            }

            insertWord();
            showResults();
        } else { 
            showError(data);
        }
    } catch (error) {
        console.log(error);
    }

    
}

const handleKeyUp = (event) => {
    const value = event.target.value;
    state.word = value;
};


const handleSound = () => { 
    if (state.phonetics.length) { 
        const sound = state.phonetics[0];

        if (sound.audio) { 
            new Audio(sound.audio).play();
        }
    }
}

//EVENTS

input.addEventListener(`keyup`, handleKeyUp);
form.addEventListener(`submit`, handleSubmit);
soundButton.addEventListener(`click`, handleSound);
modalShowBtn.addEventListener(`click`, showModal);
document.addEventListener(`keydown`, keydownCloseModal);
modal.addEventListener(`click`, closeModalacross);