function deleteOfRes() { 
    // Удаление данных из базы данных
const deleteResources = async (url) => { 
    const res = await fetch(url, { method: `DELETE` });
 
    if (!res.ok) { 
        throw new Error(`Coudn't fetch ${url}, status ${res.status}`);
    }

    return await res.json();
}
}

module.exports = deleteOfRes;