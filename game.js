buttonColors=['red','blue','green','yellow'];
let gamePattern=[];
let userClickedPattern=[];

let started= false;
let level = 0;
$("body").keypress(function(){
    if(started==false){
        $("#level-title").text("Level " + level);
        nextSequence();
        started=true;
    }
});

$(".btn").on("click",function(){
    let userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length-1);
    
});

function animatePress(currentColor){
    $(`#${currentColor}`).addClass("pressed");
    setTimeout(function(){
    $(`#${currentColor}`).removeClass("pressed");
    },200);
};

function playSound(soundName){
    let audio = new Audio(`sounds/${soundName}.mp3`);
    audio.play();
};  

function checkAnswer(currentLevel){
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length){
          setTimeout(function () {
            nextSequence();
          }, 1000);
        }
      } else {
        playSound("wrong");
        $("body").addClass("game-over");
        $("#level-title").text("Game Over, Press Any Key to Restart");
  
        setTimeout(function () {
          $("body").removeClass("game-over");
        }, 200);
  
        startOver();
      }
};

function nextSequence(){
    userClickedPattern=[];
    let randomNumber=Math.floor(Math.random()*4); 
    let randomChosenColour =buttonColors[randomNumber];
    gamePattern.push(randomChosenColour);   
    $(`#${randomChosenColour}`).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
    level++;
    $("#level-title").text(`Stage ${level}`);
    
};

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
  }



