function bindPostData(formSave){
    // Отправление данных пользователя в базу данных
    const bindPostData = () => {
        const formSave = document.querySelector(`.formSave`);    
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
        });
        bindPostData(formSave);
    };
}

export default bindPostData;