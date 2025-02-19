const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const urlDB = `http://localhost:3000/request`;


const input = document.querySelector(`#word-input`);
const form = document.querySelector(`.form`); 
// const resultContainer = document.querySelector(`.results`);
const resultsWords = document.querySelector(`.results-word`)
const containerWord = document.querySelector(`.results-info`);
const errorContainer = document.querySelector(`.error`);
const modal = document.querySelector(`.modal`);
const modalShowBtn = document.querySelector(`.save`);
const formSave = document.querySelector(`.formSave`);
const dictionaryBtn = document.querySelector(`.dictionaryBtn`);
const dictionary = document.querySelector(`.dictionary`);


const message = {
    loading: `/src/images/spinner.svg`,
    success: `Word has been saved`,
    failure: `Something goes wrong...`
}

const state = {
    Word: "",
}


//class
class Words { 
    constructor(id,Word,Definition,parentSelector) { 
        this.Word = Word;
        this.Definition = Definition;
        this.id = id;
        this.parent = document.querySelector(parentSelector);
        this.button = document.createElement(`button`);
    }

    render() { 
        this.button.classList.add(`dictionary__deleteBtn`);
        this.button.id = this.id;
        this.button.innerText = `Delete`;
        const element = document.createElement(`div`);
        element.classList.add(`dictionary__word`);
        element.innerHTML = `
            <p style = "margin: 0">${this.Word} - ${this.Definition}</p>
        `;
        element.append(this.button);
        this.parent.append(element);


        this.button.addEventListener(`click`, (event) => { 
            getResources(`http://localhost:3000/request`)
                .then((data) => { 
                    data.forEach((item, index) => { 
                        if (event.target.id === item.id) {               
                            const btn = event.target;
                            const parent = btn.parentNode;
                            parent.remove();

                            // axios.delete(`http://localhost:3000/request/${item.id}`)
                            //     .then((data) => { 
                            //         console.log(data);
                            //     })

                            deleteResources(`http://localhost:3000/request/${item.id}`)
                            .then(getResources(`http://localhost:3000/request`))
                          
                        }
                    })
                    
            })
        })
    }  
}

const getResources = async(url) => { 
    const res = await fetch(url); 

    if (!res.ok) { 
        throw new Error(`Coudn't fetch ${url}, status ${res.status}`);
    }

    return await res.json();
}

const deleteResources = async (url) => { 
    const res = await fetch(url, { method: `DELETE` })
 
    if (!res.ok) { 
        throw new Error(`Coudn't fetch ${url}, status ${res.status}`);
    }

    return await res.json();
}




//class
getResources(`http://localhost:3000/request`)
.then((data) => { 
            data.forEach(({ id, Word, Definition }) => { 
                new Words(id, Word, Definition, `.dictionary__words`).render();
            })
        }); 
        

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
            location.reload();
        }, 1000);
    }
}

bindPostData(formSave);


const closeModalacross = (event) => { 
    if (event.target === modal || event.target.getAttribute(`data-close`) ===  ``) {closeModal();}
}

const keydownCloseModal = (event) => { 
    if (event.code === `Escape` && modal.classList.contains(`show`)) {closeModal()} 
}

const closeDictionaryacross = (event) => { 
    if (event.target === dictionary || event.target.getAttribute(`data-close`) === ``) {
        closeDictionary();
    }
}

const keydownCloseDictionary = (event) => { 
    if (event.code === `Escape` && dictionary.classList.contains(`showDictionary`)) {closeDictionary()} 
}

const showModal = () => { 
    modal.classList.add(`show`, `fade`);
    modal.classList.remove(`hide`);
    document.body.style.overflow = `hidden`;
    // modal.classList.toggle(`show`)
}

const closeModal = () => { 
    modal.classList.add('hide', `fade`);
    modal.classList.remove('show');
    document.body.style.overflow = ``;
    // modal.classList.toggle(`show`)
}

const showDictionary = () => { 
    dictionary.classList.add(`showDictionary`, `fade`);
    dictionary.classList.remove(`closeDictionary`);
    document.body.style.overflow = `hidden`;
    // modal.classList.toggle(`show`)
}

const closeDictionary = () => { 
    dictionary.classList.add('closeDictionary', `fade`);
    dictionary.classList.remove('showDictionary');
    document.body.style.overflow = ``;
    // modal.classList.toggle(`show`)
}

const showError = (error) => { 
    errorContainer.style.display = `block`;
    resultsWrapper.style.display = `none`;

    errorContainer.innerText = error.message;
}


const fail = (form) => {
    errorContainer.style.display = `block`;
    resultContainer.style.display = `none`;
    errorContainer.innerText = `Такого слова в базе нет`
    form.reset();
    setTimeout(() => {
        errorContainer.style.display = `none`;
        resultContainer.style.display = `block`;
    },3000)
}

// const renderDefinition = (Word, Definition) => { 
//     const element = document.createElement(`div`);
//     element.innerHTML = `
//     <div class="results-info">
//         ${Word} - ${Definition}
//     </div>
//     `;
//     resultContainer.append(element);
//     return element;
// }

const handleSubmit = async(event) => { 
    event.preventDefault();
    resultContainer.innerHTML = ``;

    if (!state.Word.trim()) return;

    getResources(urlDB)
            .then((data) => { 
            resultContainer.innerHTML = ``;
                data.some((item, index) => { 
                if (item.Word.toLowerCase() === state.Word.toLowerCase() || item.Definition.toLowerCase() === state.Word.toLowerCase()) {
                        const element = document.createElement(`div`);
                        element.innerHTML = `
                        <div class="results-info">
                            ${item.Word} - ${item.Definition}
                        </div>
                        `;
                        resultContainer.append(element);
                        return element;
                    } else if ((index === Object.keys(data).length-1)) { 
                        fail(form);
                    }
            })
            }).catch((error) => { 
                console.log(error)
            }).finally(() => {form.reset();})
    
}


const handleKeyUp = (event) => { 
    const value = event.target.value;
    state.Word = value;
}



//EVENTS
// 1-ый вариант поиска
input.oninput = function () {
    resultsWords.innerHTML = ``;
    // resultContainer.innerHTML = ``;
    let val = this.value.trim().toLowerCase();
    getResources(urlDB).then((data) => {
        if (val !== '') {
            data.forEach(({ Word, Definition, id }) => {
                if (Word.toLowerCase().includes(val) == 1) {
                    const element = document.createElement(`p`);
                    element.classList.add(`results-word`);
                    element.id = id;
        //             element.innerHTML = `
        // ${insertMark(Word, Word.toLowerCase().includes(val), val.length)} - ${Definition}
                    //             `;
                    element.innerHTML = `
                    ${Word} - ${Definition}
                    `;
                    
                    resultsWords.append(element);
                } 
                if (Definition.toLowerCase().includes(val) == 1) { 
                    const element = document.createElement(`p`);
                    element.classList.add(`results-word`);
                    element.id = id;
        //             element.innerHTML = `
        // ${insertMark(Definition, Definition.toLowerCase().includes(val), val.length)} - ${Word}
        //             `;
                    
                    element.innerHTML = `
                    ${Definition} - ${Word}
                    `;
                    resultsWords.append(element);
                    }
            })
        }
    })
}

// const insertMark = (str, pos, len) => { 
// return str.slice (0, pos) + `<mark>` + str.slice (pos, pos + len - 1) + `</mark>` + str.slice (pos + len - 1);
// }

// 2-ой вариант поиска
// const showList = () => {
//     resultsWords.innerHTML = ``;
//     getResources(urlDB).then((data) => {
//         data.filter((item) => {
//             return (
//                 item.Word.toLowerCase().includes(search_term) || item.Definition.toLowerCase().includes(search_term)
//             );
//         }).forEach((e) => {
//             const li = document.createElement(`li`);
//             li.innerHTML = `${e.Word} - ${e.Definition}`;
//             resultsWords.append(li);
//         })
//     })
// }

// 2-ой вариант поиска
// showList();

// 2-ой вариант поиска
// let search_term = ``;

// 2-ой вариант поиска
// input.addEventListener(`input`, (event) => {
//     search_term = event.target.value.toLowerCase();
//     showList();
// })
input.addEventListener(`keyup`, handleKeyUp);
form.addEventListener(`submit`, handleSubmit);
modalShowBtn.addEventListener(`click`, showModal);
document.addEventListener(`keydown`, keydownCloseModal);
modal.addEventListener(`click`, closeModalacross);
dictionaryBtn.addEventListener(`click`, showDictionary);
document.addEventListener(`keydown`, keydownCloseDictionary);
dictionary.addEventListener(`click`, closeDictionaryacross);