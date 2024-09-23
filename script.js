let canvas,graphic,CWidth,CHeight;

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