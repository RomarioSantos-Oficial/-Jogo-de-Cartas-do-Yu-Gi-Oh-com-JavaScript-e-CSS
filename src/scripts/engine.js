const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },

    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },

    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },

    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },

    actions: {
        button: document.getElementById("next-duel"),
    },
};

const pathImages = "./src/assets/icons";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}/dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}/magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}/exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(cardId, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", cardId);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(cardId);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();
    await hiddenCardDetails();
    await ShowhiddenCardFielDSImages(true);
    await drawCardsInfield(cardId, computerCardId);
    let duelResults = await checkDuelResults(cardId, computerCardId); // Agora esperando a resolução da promessa
    updateScore();
    drawButton(duelResults);
}


async function drawCardsInfield(cardId, computerCardId) {
    const playerCard = cardData[cardId];
    const computerCard = cardData[computerCardId];

    if (playerCard && playerCard.img) {
        state.fieldCards.player.src = playerCard.img;
    }

    if (computerCard && computerCard.img) {
        state.fieldCards.computer.src = computerCard.img;
    }
}


async function ShowhiddenCardFielDSImages(value){
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    } 

    if (value === false){
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.type.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function updateScore() {
    if (state.score.scoreBox) {
        state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
    }
}

async function drawButton(text) {
    if (typeof text === 'string') {
        state.actions.button.innerText = text.toUpperCase();
        state.actions.button.style.display = "block";
    } else {
        console.error("O texto fornecido não é uma string:", text);
    }
}


async function removeAllCardsImages() {
    const { computerBOX, player1BOX } = state.playerSides;
    [computerBOX, player1BOX].forEach((box) => {
        let imgElements = box.querySelectorAll("img");
        imgElements.forEach((img) => img.remove());
    });
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Draw";
    const playerCard = cardData[playerCardId];

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "WIN";
        state.score.playerScore++;
    };

    if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "Lose";
        state.score.computerScore++;
    };

    playerAudio("duelResults");

    return duelResults;
}

async function drawSelectCard(index) {
    const card = cardData[index];
    state.cardSprites.avatar.src = card.img;
    state.cardSprites.name.innerText = card.name;
    state.cardSprites.type.innerText = "Attribute: " + card.type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    init();
}

function playerAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {

    ShowhiddenCardFielDSImages(false);

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
    const bgm =document.getElementById("bgm");
    bgm.play();
}

init();
