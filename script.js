window.addEventListener("load", start);

function start() {
    console.log("DOM fully loaded and parsed");
    fetchData();
    registerInput();
}

const values = [1,2,3,5,7,8,9,11,12,14,15];
let globalArrayOfWords = [];
let searchWord;

async function fetchData() {
    try {
    const response = await fetch("/data/ddo_fullforms_2023-10-11.csv");
    const rawData = await response.text();
    const rows = rawData.split("\n");

    rows.forEach(row => {
        const splitRow = row.split("\t");
        let word = {
            variant: splitRow[0],
            primWord: splitRow[1],
            homograf: splitRow[2],
            wordClass: splitRow[3],
            id: splitRow[4],
        };
        globalArrayOfWords.push(word);
    });

    globalArrayOfWords.sort((a, b) => a.variant.localeCompare(b.variant));
    searchWord = globalArrayOfWords.findIndex(word => word.variant === "kyst");

    }
    catch (error) {
        console.log("An error occurred: " + error);
    }
};


function registerInput() {
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");
    const resultDiv = document.getElementById("result");
    
    searchButton.addEventListener("click", function() {
        const searchWord = searchInput.value;
        const matches = binarySearch(searchWord, globalArrayOfWords, objectCheck);
        
        resultDiv.innerHTML = '';

        if (matches !== -1) {
            let matchingItems = [globalArrayOfWords[matches]];
            let i = matches;

            while (i < globalArrayOfWords.length && globalArrayOfWords[i].variant === searchWord) {
                matchingItems.push(globalArrayOfWords[i]);
                i++;
            }
            matchingItems.forEach(word => {
                resultDiv.innerHTML += `Variant: ${word.variant}, Primary Word: ${word.primWord}, Homograf: ${word.homograf}, Word Class: ${word.wordClass}, Word ID: ${word.id}<br>`;
            });
        } else {
            resultDiv.innerHTML = "Word not found";
        }
    });
}




function objectCheck(searchWord, word){
    return searchWord.localeCompare(word.variant)
  };

function binarySearch(word, globalArrayOfWords, objectCheck){
    let start = 0;
    let end = globalArrayOfWords.length - 1;

    while (start <= end) {
        let middle = Math.floor((start + end) / 2);
        let result = objectCheck(word, globalArrayOfWords[middle]);

        if (result === 0) {
            return middle;
        } else if (result < 0) {
            end = middle - 1;
        } else {
            start = middle + 1;
        }
    }

    return -1;
}
