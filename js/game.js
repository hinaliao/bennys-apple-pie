window.onload = () => {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    let id = null;
    let start = false;
    // document.body.insertBefore(this.canvas, document.body.childNodes[0]);    
    // this.interval = setInterval(update, 20);
  
    //Sounds
    let music = new Audio();
    music.src = "/audio/A Daily Cup of Tea.mp3";
    music.volume = 0.3;
    let winner = new Audio();
    winner.src = "";
    let ops = new Audio();
    ops.src = "";
    let gameOver = new Audio();
    gameOver.src = "/audio/Rainmaker.mp3";
    gameOver.volume = 0.3;


    // //Images
    // let party = new Image();
    // party.src = ""; //dancing
    // let dead = new Image();
    // dead.src = ""; //dead bunny


    //Player
    class Player {
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;  
            this.width = width;
            this.height = height;
            this.speedX = 0;        
            this.bsktImg = new Image();
            this.bsktImg.src = "../images/basket.png";
            // this.bennyWin = new Image();
            // this.bennyWin.src = "";
            // this.bennyDead = new Image();
            // this.bennyDead.src = "";
        }
        
        createBasket(){
            context.drawImage(
                this.bsktImg,
                this.x,
                this.y,
                this.width + 30,
                this.height + 10
            );
        }

        //Position
        position() {
            if (this.x >= 0 && this.x <= canvas.width - this.width) {
              this.x += this.speedX;
            } else if (this.x < 0) {
              this.x = 1;
            } else if (this.x >= canvas.width - this.width) {
              this.x = canvas.width - 50;
            }
        }

        left() {
            return this.x;
        }
        right() {
            return this.x + this.width;
        }
        top() {
            return this.y + 10;
        }

        //Colect
        collect(fruit) {
            return (
                this.top() === fruit.bottom()
            );
        }
    }

    class Fruit{
        constructor(x){
            this.x = x;
            this.y = 0;
            this.width = 35;
            this.height = 35;
        }
        
        // Apples
        createFruit(){
            this.fruitImg = new Image();
            this.fruitImg.src = "/images/apple.png";
            context.drawImage(
                this.fruitImg,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }

        //Poisoned Apples
        createPoisoned(){
            this.poisonedImg = new Image();
            this.poisonedImg.src = "/images/poisoned-apple.png";
            console.log(this.poisonedImg);
            context.drawImage(
                this.poisonedImg,
                this.x,
                this.y,
                this.width + 8,
                this.height + 8
            );
        }

        moveFruit(){
            this.y += 6;
        }

        left() {
            return this.x;
        }

        right() { 
            return this.x + this.width;
        }

        top() {
            return this.y;
        }

        bottom() {
            return this.y + this.height;
        }
    }

    document.addEventListener('keydown', (e) => {
        switch (e.keyCode) {
            case 37: // left arrow
                benny.speedX -= 4;
                break;
            case 39: // right arrow
                benny.speedX += 4;
                break;
            case 32: // spacebar
                if (!start) {
                    update();
                    music.play();
                    start = true;
                } else {
                    window.location.reload();
                }
        }
    });
    
    document.addEventListener('keyup', (e) => {   
        benny.speedX = 0;  
    });

    let benny = new Player(canvas.width/2.5, canvas.height - 48, 50, 50);
    let count = 0;
    let frames = 0;
    let fruits = [];
    let poison = [];

    // Creating normal apples + poisoned apples.
    function createFruit(){
        frames += 1;
        if (count < 15){
          if (frames % 120 === 0) {
            poison.push(
                new Fruit(
                    Math.floor(Math.random() * (canvas.width - 20))
                )
            ); console.log(fruits);
          }
        } else if (count >= 15){
          if (frames % 60 === 0) {
            poison.push(
                new Fruit(
                    Math.floor(Math.random() * (canvas.width - 20))
                )
            );
          }
        }
        if (frames % 40 === 0) {
          setTimeout(function() {
            fruits.push(
                new Fruit(
                    Math.floor(Math.random()* (canvas.width - 25))
                )
            )
          }, 2000)
        }
    }
    
    function moving(){
        poison.forEach((elem, index) => {
            elem.createPoisoned();
            elem.moveFruit();
            if (elem.y >= canvas.height){
                poison.splice(index, 1);
            }
        })
        fruits.forEach((elem, index) => {
            elem.createFruit();
            elem.moveFruit();
            if (elem.y >= canvas.height){
                fruits.splice(index, 1);
            }
        })
    }
    
    //Collected apples
    function nomNomNom() {
        let tabeta = fruits.some(function(apple){
            return benny.collect(apple);
        })
        if (tabeta){
            if (count > 0){
                apple.forEach((elem, index) => {
                    apple.splice(index, 1);
                    count += 1;
                })
            } if (count >= 15) {
                music.pause();
                winner.play();
                count = 15;
                cancelAnimationFrame(id);
                context.font = '20px Oxygen';
                context.fillStyle = 'black';
                context.fillText("Yay, Benny'll bake a delicious Apple Pie!", canvas.width/3, canvas.height/2);
            }
        }
    }

    //Collected poisoned apple
    function hangry(){ //and dead heuehu
        let wrong = poison.some(function (poisonedApple){
            return benny.collect(poisonedApple);
        });

        if (wrong) {
            ops.play();
            music.pause();
            gameOver.play();
            cancelAnimationFrame(id);
            context.font = '30px Oxygen';
            context.fillStyle = 'black';
            context.fillText("You ate the poisoned apple! Benny has died x_x", canvas.width/3, canvas.height/2);
        }
    }

    function score (points){
        context.beginPath();
        // context.fillStyle = 'rgb(118,171,67)';
        // context.rect(250, 0, 90, 30);
        // context.fill();
        context.font = "19px Oxygen";
        context.fillStyle = "black";
        context.fillText("Score: " + points, 240, 20);
    }

    function update(){
        context.clearRect(0, 0, 600, 700); //clear
        benny.createBasket(); //create player
        benny.position(); 
        createFruit(); //print apple and poisoned apple
        moving(); //move them
        
        id = requestAnimationFrame(update); //start the animation
        
        nomNomNom(); //win
        hangry(); //lose
        score(count);  //score
    }
}