function sort() { 
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
}

module.exports = sort;