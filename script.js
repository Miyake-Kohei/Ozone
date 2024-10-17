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
        this.enemy_base = [0,0];
        this.player_base = [2,4];
        console.log(this.enemy_base)

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
    constructor(id,x,y,enemychip){
        //敵を滑らかに動くようにする
        //canvasにおける座標とgridにおける座標の両方を記述する
        this.id = id;
        this.x_grid = x; 
        this.y_grid = y;
        this.x_canvas = x_grid*map.vrble_width;
        this.y_canvas = y_grid*map.vrble_height;
        this.pict = new Image();
        this.pict.src = enemychip[this.id];
        //console.log(this.x);
        //console.log(this.y);
    }

    draw(){
        graphic.drawImage(this.pict, this.x_canvas, this.y_canvas, this.vrble_width, this.vrble_height);
    }

    move(event){
        let x_candidate = this.x_grid;
        let y_candidate = this.y_grid;
        

        switch(event.key){
            case 'ArrowRight':x_candidate++;//右移動
                    break;
            case 'ArrowLeft' :x_candidate--;//左移動
                    break;
            case 'ArrowUp'   :y_candidate--;//上移動
                    break;
            case 'ArrowDown' :y_candidate++;//下移動
                    break;
        }

        if(map.map_data[y_candidate][x_candidate] === 0){
            this.x_grid = x_candidate;
            this.y_grid = y_candidate;
            this.x_canvas = x_grid*map.vrble_width;
            this.y_canvas = y_grid*map.vrble_height;
            console.log(this.x_canvas);
            console.log(this.y_canvas);
        }
    }
    attack(){
        turre
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

    const img_enemychip = [
        'img/enemy_temp.png'
    ];
    
    map = new Map(map_data, img_mapchip);
    enemy = new Enemy(0, map.enemy_base[1], map.enemy_base[0],img_enemychip);
    window.addEventListener('keydown', event => {
        enemy.move(event)
    });
}

function update(){
    
}

function draw(){
    map.draw();
    enemy.draw();    
}

function gameloop(){
    update();
    draw();
}
