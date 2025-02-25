function renderWords() { 
    // renderWords
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
}

module.exports = renderWords;