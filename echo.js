"use strict"

const colorEcho = (function(){
    const colorSequence = [];
    let sequenceIndex = 0;
    const gameStateMessage = document.getElementsByClassName("game-state-message")[0];

    function disableBtns(disabled){ 
        const gameContainer = document.getElementsByClassName("game-btn-container")[0];
        if (disabled){gameContainer.classList.add("disabled");}

        else if (!disabled){gameContainer.classList.remove("disabled");}
    } 
    
    function getNextColor(){
        const buttonList = ["red", "green", "blue", "yellow"];
        return buttonList[Math.floor(Math.random() * buttonList.length)];
    }
    
    function glow(buttonColor){
        const activeBtn = document.getElementById(buttonColor);
        activeBtn.classList.toggle(`${buttonColor}-btn-glow`);
        setTimeout(() => {
            activeBtn.classList.toggle(`${buttonColor}-btn-glow`);
        }, 1000);
    }
        
    function playRound(){
        gameStateMessage.textContent="WATCH";
        colorSequence.push(getNextColor());
        runSequence(colorSequence);   
    }
    
    function setCurrentScore(reset=false){
        const score = document.getElementById("current-score");
        score.textContent = (reset === true) ? 0: Number(score.textContent) + 1
    }
    
    function setHighScore(){
        const highScore = document.getElementById("high-score");
        const currentScore = document.getElementById("current-score").textContent;
        if (currentScore > highScore.textContent){
            localStorage.highScore = currentScore;
            highScore.textContent = currentScore;
        }
    }

    function loadHighScore(){
        const highScore = document.getElementById("high-score");
        if (localStorage.getItem("highScore") === null){
            localStorage.highScore = "0";
            highScore.textContent = "0";
            return;
        }
        highScore.textContent = localStorage.highScore;     
    }
    
    function runSequence(seq){
        let index = 0;
        function nextBtn(){
            glow(seq[index]);
            ++index;
        }

        nextBtn();
        let presser = window.setInterval(() => {
            if (index >= seq.length){
                clearTimeout(presser);
                gameStateMessage.textContent="GO"; 
                disableBtns(false);
                return;
            }
            nextBtn();
        }, 2000);
    
    }
    
    function cleanUp(){
        const startBtn = document.getElementById("start-btn");
        disableBtns(true);
        setHighScore();
        setCurrentScore(true);
        alert("You Lose");
        gameStateMessage.textContent=""; 
        startBtn.classList.toggle("hidden");
        sequenceIndex = 0;
        colorSequence.length = 0;
    }
    
    function initialize(){
        loadHighScore();

        const startBtn = document.getElementById("start-btn");
        startBtn.addEventListener("click",e => {
            startBtn.classList.toggle("hidden");
            playRound();
        });

        const gameBtns = document.querySelectorAll(".game-btn");
        gameBtns.forEach(btn =>{
            btn.addEventListener("click", e => { 
                glow(e.target.id);
            })
        });
        
        gameBtns.forEach(btn =>{
            btn.addEventListener("click", e => {    
                if (e.target.id == colorSequence[sequenceIndex]){
                    ++sequenceIndex;
                    if (sequenceIndex == colorSequence.length){
                        disableBtns(true);
                        sequenceIndex = 0;
                        setCurrentScore();
                        setHighScore();
                        setTimeout(() => {
                            playRound();
                        },2100);                
                    }
                }
                else{
                    cleanUp(); 
                }
            });
        });
        

    }
    const game = {};
    game["initialize"] = initialize;
    return game
})();

window.addEventListener("DOMContentLoaded", colorEcho.initialize, false);
