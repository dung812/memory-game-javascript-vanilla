let previousCard;
let count = 0;
let turns = 0;
let firstGuess = "";
let secondGuess = "";
const delay = 1000;

const grid = document.querySelector(".grid");
const resultBox = document.querySelector(".result");
const wrapTurns = document.querySelector(".wrap-turns");

// Sound
let click = new Audio("assets/sound/click.mp3");
let correct = new Audio("assets/sound/correct.mp3");
let result = new Audio("assets/sound/result.mp3");


function generateCard() {
    grid.innerHTML = "";
  
    //* Công thức: sort(() => 0.5 - Math.random()): random array
    const cardArrayMerge = cardsArray.concat(cardsArray).sort(() => 0.5 - Math.random()); // Nhân bản phần tử lên
    cardArrayMerge.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.name = item.name;
        
        const frontCard = document.createElement("div");
        frontCard.classList.add("front");
  
        const backCard = document.createElement("div");
        backCard.classList.add("back");
        backCard.style.backgroundImage = `url(${item.img})`;
  
        card.appendChild(frontCard);
        card.appendChild(backCard);
        grid.appendChild(card);

    });

    const cards = grid.querySelectorAll(".card");
    // set onclick attribute to all available options
    for(i=0; i < cards.length; i++){
        cards[i].setAttribute("onclick", "cardSelected()");
    }
}

generateCard();

grid.addEventListener("click", function(e) {
    const clicked = e.target;
    if (clicked.nodeName === "SECTION" || 
        previousCard === clicked || 
        clicked.parentNode.classList.contains("selected") || 
        clicked.parentNode.classList.contains("matched")) {
      return;
    };

    if (count < 2) {
        count++;
        if (count === 1) {
          firstGuess = clicked.parentNode.dataset.name;
          clicked.parentNode.classList.add("selected");
        }        
        else {
          secondGuess = clicked.parentNode.dataset.name;
          clicked.parentNode.classList.add("selected");
        }
        
        if(firstGuess && secondGuess) {
          if (firstGuess === secondGuess) {
            // Xử lý đúng
            setTimeout(matchingCard,delay);
            setTimeout(resetGuess,delay);
            setTimeout(function(){
                correct.play();
            },delay);
          }
          turns++;
          updateTurns(turns);
          setTimeout(resetGuess,delay);
        }
        previousCard = clicked;
    }
});

function matchingCard() {
  const selects  = document.querySelectorAll(".selected");
  [...selects].forEach((item) => item.classList.add("matched"));
}

function resetGuess() {
  count = 0;
  firstGuess = "";
  secondGuess = "";
  previousCard = null;
  const selects  = document.querySelectorAll(".selected");
  const matchedAll = document.querySelectorAll(".matched");
  const cardLength = document.querySelectorAll(".card").length;
  [...selects].forEach((item) => item.classList.remove("selected"));

  if (matchedAll.length === cardLength) { // Trường hợp đã chơi xong game
    // matchedAll.forEach(item => item.classList.remove("matched"));
    // setTimeout(generateCard,delay);

    setTimeout(function(){
        result.play();
        resultBox.classList.remove("hidden");
        grid.classList.add("hidden");
        wrapTurns.classList.add("hidden");
    
        const resultContent = document.querySelector(".result-content");
        resultContent.innerHTML = `You got ${turns} turns!`
    },delay);

  }
}

const btnNewGame  = document.querySelector("#btn-new");

btnNewGame.addEventListener("click", (e) => {
    resultBox.classList.add("hidden");
    grid.classList.remove("hidden");
    wrapTurns.classList.remove("hidden");

    setTimeout(resetGuess,delay);
    const matchedAll = document.querySelectorAll(".matched");
    matchedAll.forEach(item => item.classList.remove("matched"));
    setTimeout(generateCard,delay);
    turns = 0;
});

function updateTurns(valueTurns) {
    const turns = document.querySelector("#turns");
    turns.innerHTML = `Turns: ${valueTurns}` ;
}



function cardSelected() {
    click.play();
}