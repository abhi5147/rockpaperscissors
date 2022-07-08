const socket = io();

// DOM Elements
const createRoomBox = document.getElementById("create-room-box");
const roomIdInput = document.getElementById("room-id");
const createRoomBtn = document.getElementById("create-room-btn");
const gameplayScreen = document.querySelector(".gameplay-screen");
const startScreen = document.querySelector(".start-screen");
const joinBoxRoom = document.getElementById("join-room-box");
const joinRoomBtn = document.getElementById("join-room-btn");
const joinRoomInput = document.getElementById("join-room-input");
const joinRandomBtn = document.getElementById("join-random");
const errorMessage = document.getElementById("error-message");
const playerOne = document.getElementById("player-1");
const playerTwo = document.getElementById("player-2");
const waitMessage = document.getElementById("wait-message");
const rock = document.getElementById("rock");
const paper = document.getElementById("paper");
const scissor = document.getElementById("scissor");
const myScore = document.getElementById('my-score');
const enemyScore = document.getElementById('enemy-score');
const playerOneTag = document.getElementById("player-1-tag");
const playerTwoTag = document.getElementById("player-2-tag");
const winMessage = document.getElementById("win-message");

//  Game variables
let canChoose = false;
let playerOneConnected = false;
let playerTwoIsConnected = false;
let playerId = 0;
let myChoice = "";
let enemyChoice = "";
let roomId = "";
let myScorePoints = 0;
let enemyScorePoints = 0;

//evenListner

createRoomBtn.addEventListener("click", function(){
    let id = roomIdInput.value;

    if(id!="")
    {
        errorMessage.innerHTML = "";
        errorMessage.style.display = "none";

        socket.emit("create-room", id);
    }
})

joinRoomBtn.addEventListener("click", function(){
    let id = joinRoomInput.value;

    errorMessage.innerHTML = "";
    errorMessage.style.display = "none";

    socket.emit("join-room", id);
})

joinRandomBtn.addEventListener("click", function(){
    errorMessage.innerHTML = "";
    errorMessage.style.display = "none";
    socket.emit("join-random");
})

rock.addEventListener("click", function(){
    if(canChoose && myChoice === "" && playerOneConnected && playerTwoIsConnected){
        myChoice = "rock";
        choose(myChoice);
        socket.emit("make-move", {playerId, myChoice, roomId});
    }
})

paper.addEventListener("click", function(){
    if(canChoose && myChoice === "" && playerOneConnected && playerTwoIsConnected){
        myChoice = "paper";
        choose(myChoice);
        socket.emit("make-move", {playerId, myChoice, roomId});
    }
})

scissor.addEventListener("click", function(){
    if(canChoose && myChoice === "" && playerOneConnected && playerTwoIsConnected){
        myChoice = "scissor";
        choose(myChoice);
        socket.emit("make-move", {playerId, myChoice, roomId});
    }
})

// Socket
socket.on("display-error", error => {
    errorMessage.style.display = "block";
    let p = document.createElement("p");
    p.innerHTML = error;
    errorMessage.appendChild(p);
})

socket.on("room-created", id => {
    playerId = 1;
    roomId = id;

    startScreen.style.display = "none";
    gameplayScreen.style.display = "block";
})

socket.on("room-joined", id => {
    playerId = 2;
    roomId = id;

    playerOneConnected = true;
    playerJoinTheGame(1);
    setWaitMessage(false);

    startScreen.style.display = "none";
    gameplayScreen.style.display = "block";
})

socket.on("player-1-connected", () => {
    playerJoinTheGame(1);
    playerOneConnected = true;
})

socket.on("player-2-connected", () => {
    playerJoinTheGame(2)
    playerTwoIsConnected = true
    canChoose = true;
    setWaitMessage(false);
});

socket.on("player-1-disconnected", () => {
    reset();
})

socket.on("player-2-disconnected", () => {
    canChoose = false;
    playerTwoLeftTheGame()
    setWaitMessage(true);
    enemyScorePoints = 0
    myScorePoints = 0
    displayScore()
})

socket.on("draw", (myChoice) => {
    let message = "Draw!";
    setWinningMessage(message);
})

socket.on("player-1-wins", ({myChoice, enemyChoice}) => {
    if(playerId === 1){
        let message = "You Win!";
        setWinningMessage(message);
        myScorePoints++;
    }else{
        let message = "You Lose!";
        setWinningMessage(message);
        enemyScorePoints++;
    }

    displayScore()
})

socket.on("player-2-wins", ({myChoice, enemyChoice}) => {
    if(playerId === 2){
        let message = "You Win!";
        setWinningMessage(message);
        myScorePoints++;
    }else{
        let message = "You Lose!";
        setWinningMessage(message);
        enemyScorePoints++;
    }

    displayScore()
});

socket.on("remove-moving",()=>{
    document.getElementById("image1").classList.remove("moving");
    document.getElementById("image2").classList.remove("moving");
    addImage(myChoice,enemyChoice);
});

socket.on("add-moving",()=>{
    document.getElementById("image1").classList.add("moving");
    document.getElementById("image2").classList.add("moving");
});

socket.on("add-image",(playerOneChoice,playerTwoChoice,playerNo)=>{
    if(playerNo==playerId){
        addImage(playerOneChoice,playerTwoChoice);
    }
    else{
        addImage(playerTwoChoice,playerOneChoice);
    }
});



// Functions

function addImage(myChoice,enemyChoice){
    document.getElementById("image1").classList.remove("rockImage");
    document.getElementById("image1").classList.remove("paperImage");
    document.getElementById("image1").classList.remove("scissorImage");
    document.getElementById("image2").classList.remove("rockImage");
    document.getElementById("image2").classList.remove("paperImage");
    document.getElementById("image2").classList.remove("scissorImage");
    if(myChoice==="rock")
    {
        document.getElementById("image1").classList.add("rockImage");
    }
    else if(myChoice==="paper"){
        document.getElementById("image1").classList.add("paperImage");
    }
    else{
        document.getElementById("image1").classList.add("scissorImage");
    }
    if(enemyChoice==="rock")
    {
        document.getElementById("image2").classList.add("rockImage");
    }
    else if(enemyChoice==="paper"){
        document.getElementById("image2").classList.add("paperImage");
    }
    else{
        document.getElementById("image2").classList.add("scissorImage");
    }
}

function playerJoinTheGame(playerId){
    if(playerId === 1){
        playerOne.classList.add("connected");
    }else{
        playerTwo.classList.add("connected");
    }
}

function setWaitMessage(display){
    if(display){
        let p = document.createElement("p");
        p.innerText = "Waiting for another player to join...";
        waitMessage.appendChild(p)
    }else{
        waitMessage.innerHTML = "";
    }
}

function reset(){
    canChoose = false;
    playerOneConnected = false;
    playerTwoIsConnected = false;
    startScreen.style.display = "block";
    gameplayChoices.style.display = "block";
    gameplayScreen.style.display = "none";
    joinBoxRoom.style.display = "none";
    createRoomBox.style.display = "none";
    playerTwo.classList.remove("connected");
    playerOne.classList.remove("connected");
    myScorePoints = 0
    enemyScorePoints = 0
    displayScore()
    setWaitMessage(true);
}

function playerTwoLeftTheGame(){
    playerTwoIsConnected = false;
    playerTwo.classList.remove("connected");
}

function displayScore(){
    myScore.innerText = myScorePoints;
    enemyScore.innerText = enemyScorePoints;
}

function choose(choice){
    if(choice === "rock"){
        rock.classList.add("my-choice");
    }else if(choice === "paper"){
        paper.classList.add("my-choice");
    }else{
        scissor.classList.add("my-choice");
    }

    canChoose = false;
}

function removeChoice(choice){
    if(choice === "rock"){
        rock.classList.remove("my-choice");
    }else if(choice === "paper"){
        paper.classList.remove("my-choice");
    }else{
        scissor.classList.remove("my-choice");
    }

    canChoose = true;
    myChoice = "";
}

function setWinningMessage(message){
    let p  = document.createElement("p");
    p.innerText = message;

    winMessage.appendChild(p);

    setTimeout(() => {
        removeChoice(myChoice)
        winMessage.innerHTML = "";
    }, 2000)
}

