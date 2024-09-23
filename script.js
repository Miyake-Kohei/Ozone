let canvas,graphic,CWidth,CHeight;

class Turret{
    constructor(id,x,y){
        this.id = id;
        this.x = x;
        this.y = y;
    }

    draw(){

    }

    shoot(){

    }
}

class Enemy{
    constructor(id,x,y){
        this.id = id;
        this.x = x;
        this.y = y;
    }

    draw(){

    }

    move(){
        
    }
}

onload = function(){
    canvas = document.getElementById("game");
    graphic = canvas.getContext("2d");
    //初期化
    init()
    //入力処理
    setInterval("gameloop()",16)
}

function init(){
    CWidth = canvas.width;
    CHeight = canvas.height;
}

function update(){

}

function draw(){

}

function gameloop(){
    update();
}