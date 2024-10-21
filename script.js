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
        this.player_base = [4,2];
        console.log(this.enemy_base)
        this.vrble_width = graphic.canvas.width / Object.keys(this.map_data[0]).length;
        this.vrble_height = this.vrble_width
        // this.vrble_height = graphic.canvas.height / Object.keys(this.map_data).length;

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
                console.log('enter')
                enemies.splice(i, 1)
                // ←emyオブジェクトを消すプログラムの予定
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
    constructor(id,x,y,enemychip,speed){
        //敵を滑らかに動くようにする
        //canvasにおける座標とgridにおける座標の両方を記述する
        this.id = id;
        this.isDead = false;
        this.speed = speed;
        this.x_grid = x; 
        this.y_grid = y;
        this.x_canvas = this.x_grid*map.vrble_width;
        this.y_canvas = this.y_grid*map.vrble_height;
        this.frame = map.vrble_width/this.speed;
        console.log(map.vrble_width)
        console.log(this.frame)
        this.flag_move = 0
        this.pict = new Image();
        this.pict.src = enemychip[this.id];
        this.x_grid_before = null;
        this.y_grid_before = null;
    }

    draw(){
        graphic.drawImage(this.pict, this.x_canvas, this.y_canvas, map.vrble_width, map.vrble_height);
    }

    search_move(){
        //右移動
        try{
            if(map.map_data[this.y_grid][this.x_grid+1] === 0){
                if(this.y_grid != this.y_grid_before || this.x_grid+1 != this.x_grid_before){
                    return 'R'
                }
            }
        }
        catch(e){
            console.log(e.massage);
        }

        //左移動
        try{
            if(map.map_data[this.y_grid][this.x_grid-1] === 0){
                if(this.y_grid != this.y_grid_before || this.x_grid-1 != this.x_grid_before){
                    return 'L'
                }
            }
        }
        catch(e){
            console.log(e.massage);
        }

        //上移動
        try{
            if(map.map_data[this.y_grid-1][this.x_grid] === 0){
                if(this.y_grid-1 != this.y_grid_before || this.x_grid != this.x_grid_before){
                    return 'U'
                }
            }
        }
        catch(e){
            console.log(e.massage);
        }

        //下移動
        try{
            if(map.map_data[this.y_grid+1][this.x_grid] === 0){
                if(this.y_grid+1 != this.y_grid_before || this.x_grid != this.x_grid_before){
                    return 'D'
                }
            }
        }
        catch(e){
            console.log(e.massage);
        }
    }

    animation_move(x_move,y_move){
        let i=0;
        this.flag_move = 1;
        let interval = setInterval(() => {
            this.x_canvas = this.x_canvas + x_move * this.frame;
            this.y_canvas = this.y_canvas + y_move * this.frame;
            i++;
            if(i === this.speed){
                this.flag_move = 0;
                clearInterval(interval);
            }
        }, 16);
    }

    move(){
        if(this.flag_move === 1){
            console.log("break");
            return 0;
        }
        let x_candidate = this.x_grid;
        let y_candidate = this.y_grid;
        let command;
        command = this.search_move();

        switch(command){
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
            this.x_grid_before = this.x_grid;
            this.y_grid_before = this.y_grid;
            this.x_grid = x_candidate;
            this.y_grid = y_candidate;
            console.log(this.x_grid_before);
            console.log(this.y_grid_before);
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
        [0,0,0,1,0,0,0,1,0,1]
    ];

    const img_mapchip = [
        'img/mapchip0.png',
        'img/mapchip1.png'
    ];

    const img_enemychip = [
        'img/enemy_temp.png'
    ];
    
    map = new Map(map_data, img_mapchip);
    let enemy = new Enemy(0, map.enemy_base[1], map.enemy_base[0],img_enemychip,40); //最後の引数はスピードで，小さいほど速くなる（0以下だとエラーが起こる．）
    enemies.push(enemy);
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
    map.draw();
    for(let enemy of enemies){
        enemy.draw();
    }
}

function gameloop(){
    update();
    draw();
}
