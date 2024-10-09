let canvas,graphic,CWidth,CHeight;
let enemies = [];
let turrets = [];
let map;

class Map{
    constructor(map_data, mapchip){
        this.map_data = map_data;
        this.tile0 = new Image();
        this.tile1 = new Image();
        this.tile0.src = mapchip[0];
        this.tile1.src = mapchip[1];
        this.enemy_base = (0,0);
        this.player_base = (2,4);

        this.vrble_width = graphic.canvas.width / Object.keys(this.map_data[0]).length;
        this.vrble_height = this.vrble_width
        // this.vrble_height = graphic.canvas.height / Object.keys(this.map_data).length;

    }

    draw(){
        for (let y = 0; y < this.map_data.length; y++) {
            for (let x = 0; x < this.map_data[y].length; x++) {
                if(this.map_data[y][x]===0){
                    graphic.drawImage(this.tile0, this.vrble_width*x, this.vrble_height*y, this.vrble_width, this.vrble_height);
                }else{
                    graphic.drawImage(this.tile1, this.vrble_width*x, this.vrble_height*y, this.vrble_width, this.vrble_height);
                }

            }
        }
    }
}

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
    const map_data = [
        [0,1,0,0,0,0,0],
        [0,1,0,1,1,1,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        [0,0,0,1,0,0,0]
    ];
    
    const img_mapchip = [
        'img/mapchip0.png',
        'img/mapchip1.png'
    ];
    map = new Map(map_data, img_mapchip);



}

function update(){
    
}

function draw(){
    map.draw();    
}

function gameloop(){
    update();
    draw();
}

