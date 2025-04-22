console.log("js running");
const startButton = document.getElementById("start-button");
const gameCells = document.getElementsByClassName("gameCell");
const table = document.getElementById("jeopardy");

let categoryIds = [];
let gameDataList = [];

// const orderedArray = [1,2,3,4,5,6,7,8];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * i);
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}

function setCategoryTitles(categoryData) {
    const headers = document.getElementsByClassName("categoryTitle");
    const titles = categoryData.map((category) => category.title);

    for (let i = 0; i < titles.length; i++) {
        console.log(headers[i].innerHTML = titles[i]);
    }
}

async function fetchQuestionsAnswers(categoryId){
  try{
    const URL = `https://rithm-jeopardy.herokuapp.com/api/category?id=${categoryId}`;
    const response = await axios.get(URL);
    return response.data;
} catch(error){
console.debug(error);
}

}

async function fetchCategories() {
    try {
        const response = await axios.get("https://rithm-jeopardy.herokuapp.com/api/categories?count=100");
        const categoryIDs = response.data.map((category) => {
            return category.id;
        });
        return categoryIDs;
    } catch (error) {
        console.debug(error);
    }
}


startButton.addEventListener("click", async function(e){
    startButton.innerText="Restart?";
    gameDataList = [];

    // for now i want the table to be blank
    // 1. First I want to create the header ///
    // 1a = Go into <thead> element create five <th> elements and insert category names 

    // 2. After also programatically create 5 rows and 5 columns and insert questions marks
    // 2a Also on each loop we need to put in the coordinates 
    // 2b Render everything 


    for (const cell of gameCells) {
        cell.innerHTML = "?";
        cell.className = "gameCell"; 
      }

    jeopardy.style.display ="none";

    const data = await fetchCategories();
    
    categoryIds = [...data];

    // const rawData = await fetchQuestionsAnswers(categoryIds[0]);

    // first I'm going to shuffle the category ids we got
    shuffleArray(categoryIds);
    // then I will pull questions and answers
    for (let i = 0; i < 5; i++ ) {
        const rawData = await fetchQuestionsAnswers(categoryIds[i]);
        const gameData = {
            title: rawData.title,
            data: rawData.clues.map((clue) =>({ question: clue.question, answer: clue.answer }))
        };
        gameDataList.push(gameData);

    }

    setCategoryTitles(gameDataList);

    jeopardy.style.display ="table";

    // console.log(gameDataList);
});

for (const cell of gameCells){
    cell.addEventListener("click", function(e){
        console.log("clicked game cell");
        const coordsString = e.target.dataset["coords"];
        const x = coordsString[0];
        const y = coordsString[2];
        console.log("our x is", x);
        console.log("our y is", y);

        console.log(gameDataList[x].title);
        console.log(gameDataList[x].data[y].question);
        cell.innerHTML = gameDataList[x].data[y].question;
    
    cell.addEventListener("click", function(e){
        cell.innerHTML = gameDataList[x].data[y].answer;
        cell.classList.add("complete");

    });




});

}



