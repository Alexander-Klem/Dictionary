function getOfRes() { 
    // Получение данных из базы данных
const getResources = async(url) => { 
    const res = await fetch(url); 

    if (!res.ok) { 
        throw new Error(`Coudn't fetch ${url}, status ${res.status}`);
    }

    return await res.json();
}
}

module.exports = getOfRes;