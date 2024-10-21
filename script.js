let canvas,graphic,CWidth,CHeight;
let enemies = [];
let turrets = [];
let map,player;
let pointer = {
    "x":0,
    "y":0
}

class Player{
    constructor(turretchip){
        this.x = pointer.x;
        this.y = pointer.y;
        this.hold = false;
        this.holdID = 0;
        this.picts = turretchip;
        this.pict = new Image();
        this.pict.src = turretchip[this.holdID];
    }

    grab(){

        const displayX = 60;
        const displayY = 420;

        if(this.y>displayY&&this.y<displayY+this.pict.height){
            let gridX = Math.floor(this.x/this.pict.width);
            if(gridX%2!=0&&gridX+1>=this.picts.length){
                this.hold = true;
                this.holdID = gridX%2;
            }
            else{
                this.hold = false;
            }
        }
    }

    draw(){
        this.x = pointer.x;
        this.y = pointer.y;
        if(this.hold){
            this.pict.src = this.picts[this.holdID]
            graphic.drawImage(this.pict, this.x-this.pict.width/2, this.y-this.pict.height/2);
        }
    }

    drawUI(){
        const displayX = 60;
        const displayY = 420;

        graphic.fillStyle = "rgb(0,0,0)";
        graphic.fillRect(0,400,canvas.width,100);

        let i=0
        for(let pict of this.picts){
            let portrait = new Image();
            portrait.src = pict;
        
            graphic.drawImage(portrait, portrait.width*(2*i+1), displayY); 
            i++;       
        }
    }

    deploy(){

    }
}

class Map{
    constructor(map_data, mapchip){
        this.map_data = map_data;
        this.tile0 = new Image();
        this.tile1 = new Image();
        this.tile0.src = mapchip[0];
        this.tile1.src = mapchip[1];
        this.enemy_base = [0,0];
        this.player_base = [4,2];
        console.log(this.enemy_base)
    }

    draw(){
        for (let y = 0; y < this.map_data.length; y++) {
            for (let x = 0; x < this.map_data[y].length; x++) {
                if(this.map_data[y][x]===0){
                    graphic.drawImage(this.tile0, this.tile0.width*x, this.tile0.height*y);
                }else{
                    graphic.drawImage(this.tile1, this.tile1.width*x, this.tile1.height*y);
                }

            }
        }
    }

    judge_GAMEOVER(){

        for(let i = enemies.length - 1; i >= 0; i--) {
            let emy = enemies[i];
            this.dx_judge = Math.abs(emy.x - this.player_base[0]) < 1;
            this.dy_judge = Math.abs(emy.y - this.player_base[1]) < 1;

            if (this.dx_judge && this.dy_judge) {
                enemies.splice(i, 1)
                // ←emyオブジェクトを消すプログラムの予定
            }
        }

    }

}

class Turret{
    constructor(id,x,y,turretchip){
        this.id = id;
        this.x = x;
        this.y = y;
        this.pict = new Image();
        this.pict.src = turretchip[this.id];
        this.bullets = [];
    }

    draw(){
        graphic.drawImage(this.pict, this.pict.width*this.x, this.pict.height*this.y);
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
        this.isDead = false;
        this.count_move = 0;
        this.movement = ['D','D','D','D','R','R','U','U','U','U','R','R','R','R','D','D','D','D','L','L','U','U'];
        this.x_grid = x; 
        this.y_grid = y;
        this.x_canvas = this.x_grid*map.vrble_width;
        this.y_canvas = this.y_grid*map.vrble_height;
        this.frame_32 = map.vrble_width/32;
        this.flag_move = 0;
        this.pict = new Image();
        this.pict.src = enemychip[this.id];
    }

    draw(){
        graphic.drawImage(this.pict, this.x_canvas, this.y_canvas, map.vrble_width, map.vrble_height);
    }


    animation_move(x_move,y_move){
        let i=0;
        this.flag_move = 1;
        let interval = setInterval(() => {
            this.x_canvas = this.x_canvas + x_move * this.frame_32;
            this.y_canvas = this.y_canvas + y_move * this.frame_32;
            i++;
            if(i === 32){
                this.flag_move = 0;
                clearInterval(interval);
            }
        }, 16);
    }

    move(){
        if(this.flag_move === 1){
            return 0;
        }
        let x_candidate = this.x_grid;
        let y_candidate = this.y_grid;
        

        switch(this.movement[this.count_move]){
            case 'R' :x_candidate++;//右移動
                    break;
            case 'L' :x_candidate--;//左移動
                    break;
            case 'U' :y_candidate--;//上移動
                    break;
            case 'D' :y_candidate++;//下移動
                    break;
        }

        if(map.map_data[y_candidate][x_candidate] === 0){
            this.animation_move(x_candidate-this.x_grid,y_candidate-this.y_grid);
            this.x_grid = x_candidate;
            this.y_grid = y_candidate;
            this.count_move++;
        }
    }

    attack(){
    }
}

onload = function(){
    canvas = document.getElementById("game");
    graphic = canvas.getContext("2d");

    //初期化
    init()
    //入力処理
    document.onkeydown = keydown;
    document.onmousemove = mousemove;
    document.onmouseover = mouseover;
    document.onmousedown = mousedown;
    document.onmouseup = mouseup;

    setInterval("gameloop()",16)
}

function init(){
    CWidth = canvas.width;
    CHeight = canvas.height;
    const map_data = [
        [0,1,0,0,0,1,0,0,0,1],
        [0,1,0,1,0,1,0,1,0,1],
        [0,1,0,1,0,1,0,1,0,1],
        [0,1,0,1,0,1,0,1,0,1],
        [0,1,0,1,0,1,0,1,0,1],
        [0,0,0,1,0,0,0,1,0,1]
    ];

    const img_mapchip = [
        'img/mapchip0.png',
        'img/mapchip1.png'
    ];

    const img_enemychip = [
        'img/enemy_temp.png'
    ];
    
    const img_turretchip = [
        'img/turret_temp1.png',
        'img/turret_temp2.png'
    ]

    map = new Map(map_data, img_mapchip);
    player = new Player(img_turretchip);
    let enemy = new Enemy(0, map.enemy_base[1], map.enemy_base[0],img_enemychip);
    enemies.push(enemy);
    addTurret(0,1,0);
    window.addEventListener('keydown', event => {
        enemy.move(event)
    });
}

function addTurret(id,x,y){
    const img_turretchip = [
        'img/turret_temp1.png',
        'img/turret_temp2.png'
    ];
    let turret = new Turret(id,x,y,img_turretchip);
    turrets.push(turret);
}

function removeEnemy(){
    enemies = enemies.filter((element) => element.isDead != true);
}

function update(){
    for(let enemy of enemies){
        enemy.move();
    }
    removeEnemy();
    map.judge_GAMEOVER();
}

function draw(){
    graphic.fillStyle = "rgb(255,255,255)";
    graphic.fillRect(0,0,canvas.width,canvas.height);
    map.draw();
    for(let enemy of enemies){
        enemy.draw();
    }
    for(let turret of turrets){
        turret.draw();
    }
    player.drawUI();
    player.draw();
}

function keydown(e){

}

function mousedown(e){
    player.grab();
}

function mouseup(e){
    if(player.hold){
        player.hold = false;
    }
}

function mousemove(e){
    pointer.x = e.offsetX;
    pointer.y = e.offsetY;
}

function mouseover(e){

}

function gameloop(){
    update();
    draw();
}
