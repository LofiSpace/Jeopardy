console.log("js running");
const startButton = document.getElementById("start-button");
const gameCells = document.getElementsByClassName("gameCell");
const table = document.getElementById("jeopardy");

let categoryIds = [];
let gameDataList = [];

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
    for (const cell of gameCells) {
        cell.innerHTML = "?";
        cell.className = "gameCell"; 
      }

    jeopardy.style.display ="none";

    const data = await fetchCategories();
    
    categoryIds = [...data];

const rawData = await fetchQuestionsAnswers(categoryIds[0]);

for (let i = 0; i < 5; i++ ){
    const rawData = await fetchQuestionsAnswers(categoryIds[i]);
    const gameData = {
        title: rawData.title,
        data: rawData.clues.map((clue) =>({ question: clue.question, answer: clue.answer }))
    };
    gameDataList.push(gameData);

}
jeopardy.style.display ="table";

console.log(gameDataList);
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



