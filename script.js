let canvas,graphic,CWidth,CHeight;
let enemies = [];
let turrets = [];

const map_data = [
    [0,1,0,0,0,0,0],
    [0,1,0,1,1,1,0],
    [0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0],
    [0,0,0,1,0,0,0]
];

// map_data配列における場所
const enemy_base = (0,0);
const player_base = (2,4);

// 通路0の画像パス
// 壁1の画像パス
const img_mapchip = [
    'img/mapchip0.png',
    'img/mapchip1.png'
]

class Turret{
    constructor(id,x,y){
        this.id = id;
        this.x = x;
        this.y = y;
    }

    draw(){

    }

    aim(){

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
    tile = new Image();
}

function update(){
    console.log('testtest')
}

function draw(){
    drawMap();    
}


function drawMap() {
    for (let y = 0; y < map_data.length; y++) {
        for (let x = 0; x < map_data[y].length; x++) {
            
            if(map_data[y][x]===0){
                tile.src = img_mapchip[0];
            }else{
                tile.src = img_mapchip[1];
            }
                graphic.drawImage(tile, tile.width*x, tile.height*y);
        }

    }
}

function gameloop(){
    update();
    draw();
}