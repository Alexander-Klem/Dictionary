function handeSubmit() { 
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
}

module.exports = handeSubmit;