let canvas,graphic,CWidth,CHeight,bgm;
let enemies = [];
let enemies_resize = [];
let turrets = [];
let bullets = [];
let game_mode = 'in_title';
let title_mode = 'main';
let map,player;
let pointer = {
    "x":0,
    "y":0
}
let gamespeed = 1;
let timer = 0;
let game_timer = 0;
let damage_cal = 0;
let num_enemy_dead = 0;
let animation_time = 0;
let current_spawn = 0;
let change_gamespeed_flag = 0;
let change_gamespeed_time = 0;
let turret_cost = [
    1,2,3
];
let wave_count = 0;
let wave_mode = 'calm';
let wave_contents = [
    { type: 'green', move_interval: 60, spawnSec: 1  ,HP: 50},
    { type: 'green', move_interval: 60, spawnSec: 4  ,HP: 60},
    { type: 'green', move_interval: 45, spawnSec: 7 ,HP: 20},
    { type: 'green', move_interval: 60, spawnSec: 10 ,HP: 80},
    { type: 'boss', move_interval: 120, spawnSec: 15, HP:200},
    { type: 'green', move_interval: 60, spawnSec: 20 , HP: 80},
    { type: 'pink', move_interval: 60, spawnSec: 23 , HP: 90},
    { type: 'green', move_interval: 50, spawnSec: 26 , HP: 40},
    { type: 'green', move_interval: 60, spawnSec: 30 , HP: 100},
    { type: 'boss', move_interval: 150, spawnSec: 34 ,HP:450},
    { type: 'orange', move_interval: 55, spawnSec: 41 , HP: 120},
    { type: 'green', move_interval: 60, spawnSec: 43 , HP: 90},
    { type: 'blue', move_interval: 30, spawnSec: 46 , HP: 30},
    { type: 'green', move_interval: 60, spawnSec: 50 ,HP: 110},
    { type: 'boss', move_interval: 90, spawnSec: 54 ,HP: 250},
    { type: 'green', move_interval: 80, spawnSec: 55 ,HP: 100},
    { type: 'green', move_interval: 40, spawnSec: 59 ,HP: 70},
    { type: 'orange', move_interval: 60, spawnSec: 60 ,HP: 130},
    { type: 'green', move_interval: 62, spawnSec: 63 ,HP: 150},
    { type: 'boss', move_interval: 200, spawnSec: 65 ,HP: 700},
    { type: 'green', move_interval: 20, spawnSec: 68 ,HP: 10},
    { type: 'blue', move_interval: 63, spawnSec: 70 ,HP: 180},
    { type: 'gold', move_interval: 60, spawnSec: 72 ,HP: 200},
    { type: 'green', move_interval: 40, spawnSec: 74 ,HP: 150},
    { type: 'boss', move_interval: 130, spawnSec: 76 ,HP: 1000},
];
let random_speed = 0;
let random_contents = 5;
let spawn_speed_level = 0;
let enemy_level = 1.0;

// 「img/chara1_animation/1,2,3,... .PNG」という要素を16個もつ配列を生成
const chara_animation_imgs = [
    Array.from({ length: 16 }, (_, i) => `img/chara1_animation/${i + 1}.PNG`),
    Array.from({ length: 16 }, (_, i) => `img/chara2_animation/${i + 1}.PNG`),
    Array.from({ length: 16 }, (_, i) => `img/chara3_animation/${i + 1}.PNG`)
];
const HTML_WIDTH = 640;
const HTML_HEIGHT = 500;
const enemy_move_imgs = {
    green: Array.from({ length: 14 }, (_, i) => `img/enemy/enemy_green_move/${i + 1}.PNG`),
    blue: Array.from({ length: 14 }, (_, i) => `img/enemy/enemy_blue_move/${i + 1}.PNG`),
    orange: Array.from({ length: 14 }, (_, i) => `img/enemy/enemy_orange_move/${i + 1}.PNG`),
    pink: Array.from({ length: 14 }, (_, i) => `img/enemy/enemy_pink_move/${i + 1}.PNG`),
    gold: Array.from({ length: 14 }, (_, i) => `img/enemy/enemy_gold_move/${i + 1}.PNG`),
    boss: Array.from({ length: 14 }, (_, i) => `img/enemy/enemy_boss_move/${i + 1}.PNG`)
};

let map_data = [
    [0,1,0,0,0,1,0,0,0,1],
    [0,1,0,1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0,1,0,1],
    [0,0,0,1,0,0,0,1,0,1],
];


class Player{
    constructor(turretchip){
        this.x = pointer.x;
        this.y = pointer.y;
        this.hold = false;
        this.holdID = 0;
        // this.picts = turretchip;
        // this.pict = new Image();
        // this.pict.src = turretchip[this.holdID];
        this.resource = 4; //タレット1台1~3のコストを想定して初期値5

        //↓新たに追加しました byまさ
        this.resized_picts = resizeImages(turretchip, map.TILE_SIZE) //画像拡縮の処理
        this.picts = this.resized_picts; //リサイズ画像の配列
        this.pict = this.resized_picts[this.holdID];  //リサイズ画像の１つ１つ。 
    }

    grab(){

        const displayX = 60;
        const displayY = 420;

        if(this.y>displayY&&this.y<displayY+this.pict.height){
            let gridX = Math.floor(this.x/this.pict.width);
            if(gridX%2!=0&&Math.floor(gridX/2)<this.picts.length){
                this.hold = true;
                this.holdID = Math.floor(gridX/2);
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
            // this.pict.src = this.picts[this.holdID]　//左を↓に置き換えました byまさ
            this.pict = this.resized_picts[this.holdID];  //リサイズ画像を代入。
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
            // let portrait = new Image(); //画像拡縮処理するようにしたのでコメントアウトしました byまさ
            // portrait.src = pict;
            let portrait = pict
        
            graphic.drawImage(portrait, portrait.width*(2*i+1), displayY); 
            i++;
        }
    }

    // Mapクラス内を大幅に変えたので、map.tile0 → map.tiles[0]にしました。byまさ
    deploy(map){
        if(this.x>0&&this.x<canvas.width&&this.y>0&&this.y<64*6){
            let gridc = {
                "x": Math.floor(this.x/map.tiles[0].width),
                "y": Math.floor(this.y/map.tiles[0].height)
            }

            const COST = turret_cost[this.holdID];
            if(map.map_data[gridc.y][gridc.x]==1 && this.resource >= COST){
                map.map_data[gridc.y][gridc.x]=2;
                addTurret(this.holdID,gridc.x,gridc.y,6);
                this.resource -= COST;
                //console.log(this.resource, 'resource left')
            }
        }
    }
}

class Map{
    constructor(map_data, mapchip){
        this.TILE_SIZE = 64;
        this.resized_picts = resizeImages(mapchip, this.TILE_SIZE) //画像拡縮の処理
        this.tiles = [this.resized_picts[0], this.resized_picts[1]]; //リサイズ画像を代入。ここだけpictsではなくtilesという名前になっている

        for (let i=0; i<mapchip.lengh; i++) {
            this.tiles[i] = this.resized_img(mapchip[i], 64)
        }

        this.resized_base_good = resizeImages(['img/good.PNG'], 64)
        this.resized_base_bad = resizeImages(['img/bad.PNG'], 64)

        this.map_data = map_data;
        this.enemy_base = [0,0];
        this.player_base = [8,5];
        this.vrble_width = graphic.canvas.width / Object.keys(this.map_data[0]).length;
        this.vrble_height = this.vrble_width
        // this.vrble_height = graphic.canvas.height / Object.keys(this.map_data).length;
    }

    draw(){
        for (let y = 0; y < this.map_data.length; y++) {
            for (let x = 0; x < this.map_data[y].length; x++) {
                if (this.map_data[y][x] === 0) {
                    graphic.drawImage(this.tiles[0], this.TILE_SIZE*x, this.TILE_SIZE*y);
                }else{
                    graphic.drawImage(this.tiles[1], this.TILE_SIZE*x, this.TILE_SIZE*y);
                }
                // ↓ をここと置き換えるとバグの温床になりそうなので、考え中（タレットの床番号が2であるため）
                // let tileIndex = this.map_data[y][x]
                // graphic.drawImage(this.tiles[tileIndex], this.TILE_SIZE*x, this.TILE_SIZE*y);
        if (game_mode === 'in_game') {
            graphic.drawImage(
                this.resized_base_good[0],
                this.TILE_SIZE*this.player_base[0],
                this.TILE_SIZE*this.player_base[1]-8);   
        }
        if (game_mode === 'in_gameover') {
            graphic.drawImage(
                this.resized_base_bad[0],
                this.TILE_SIZE*this.player_base[0],
                this.TILE_SIZE*this.player_base[1]-8);
        }
            }
        }
    }

    judge_GAMEOVER(){
        for(let i = 0; i < enemies.length; i++) {
            let emy = enemies[i];
            this.dx_judge = Math.abs(emy.x_grid - this.player_base[0]) < 1;
            this.dy_judge = Math.abs(emy.y_grid - this.player_base[1]) < 1;

            if (this.dx_judge && this.dy_judge) {
                emy.isDead = true;
                removeEnemy();
                
                if (game_mode === 'in_game') {
                    timer = 0;
                    game_mode = 'in_gameover';
                }
                
                // 拠点にライフを設ける場合の処理
                // emy.isDead = true;
                // removeEnemy();
                // this.player_base_life -= 1
                // if (this.player_base_life <= 0) {
                    
                // }
            }
        }

    }

}

class Bullet{
    constructor(x,y,vx,vy,bulletchip,id,bulletSpeed,target,damage){
        this.x = x;
        this.y = y;
        // this.pict = new Image();
        // this.pict.src = pict;
        this.vx = vx;
        this.vy = vy;
        this.damage = damage;
        this.away = false;
        this.id = id;

        this.resized_picts = resizeImages(bulletchip, map.TILE_SIZE*0.3) //pictはstrなので、配列に直して与えました byまさ
        this.pict = this.resized_picts[this.id];
        this.bulletSpeed = bulletSpeed;
        this.target = target;
    }

    draw(){
        graphic.drawImage(this.pict,this.x-this.pict.width/2,this.y-this.pict.height/2);    
    }

    fly(){
        this.x += this.vx;
        this.y += this.vy;
        if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height){
            this.away = true;
        }
    }

    homing(){
        try{
            if(this.target.isDead === false){
                const dx = this.target.x_canvas - this.x;
                const dy = this.target.y_canvas - this.y;
                const dis = Math.sqrt(dx*dx+dy*dy);
                this.vx = (dx/dis)*this.bulletSpeed;
                this.vy = (dy/dis)*this.bulletSpeed;
            }
        }
        catch(e){
        }
        this.x += this.vx;
        this.y += this.vy;
        if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height){
            this.away = true;
        }
    }

    hit(enemies){
        for(let enemy of enemies){
            const dx = (enemy.x_canvas + enemy.pict.width/2) - (this.x + this.pict.width/2);
            const dy = (enemy.y_canvas + enemy.pict.height/2) - (this.y + this.pict.height/2);
            //console.log(enemy.pict.width)
            const dis = Math.sqrt(dx*dx+dy*dy);
            if(dis<enemy.pict.width/2){
                enemy.damaged(this.id,this.damage);
                this.away = true;
                //console.log("hit");
            }
        }
    }
}

class Turret{
    constructor(id,x,y,bulletSpeed,turretchip,range){
        this.id = id;
        this.x = x;
        this.y = y;
        this.bulletSpeed = bulletSpeed;
        this.range = range[this.id];
        // this.pict = new Image();
        // this.pict.src = turretchip[this.id];
        
        // 静止画用
        // this.resized_picts = resizeImages(turretchip, map.TILE_SIZE) // 画像拡縮の処理
        // this.pict = this.resized_picts[this.id] //this.idでどのタレットの画像を引くか決める

        // アニメーション用
        this.resized_animations = resizeImages(chara_animation_imgs[this.id], map.TILE_SIZE);
        this.animas = this.resized_animations;
        this.animas_idx = 1;
        // 過去書いた処理を使うための代入。
        // this.animas内の要素はどれも大きさ同じなので[0]を使用。
        // console.log('sadfsaf', this.animas[0])
        this.pict = this.animas[0];
        let damagechip =[
            20,15,60
        ];
        this.damage = damagechip[this.id];
    }

    // 静止画用
    // draw(){
    //     graphic.drawImage(this.pict, this.pict.width*this.x, this.pict.height*this.y);
    // }

    // アニメーションの番号送りのみを行う（init()内のsetIntervalで使用）
    proceed_animation(){
        this.animas_idx = (this.animas_idx+1) % this.animas.length;
        if(this.animas_idx === 13){
            this.aim();
        }
    }
    // 画像の表示のみ行う。（グローバルのdraw()内で使用）
    draw_animation(){
        graphic.drawImage(
            this.animas[this.animas_idx], 
            this.animas[this.animas_idx].width*this.x, 
            this.animas[this.animas_idx].height*this.y-25);
    }

    aim(){
        let min = this.range;
        let target = null;
        for(let enemy = 0; enemy < enemies.length; enemy++){
            let distance = Math.abs(this.x - enemies[enemy].x_grid) + Math.abs(this.y - enemies[enemy].y_grid);
            if(distance <= min){
                min = distance;
                target = enemy;
            }
        }
        //console.log(min);
        //console.log(target);
        try{
            this.shoot(enemies[target]);
        }
        catch(e){

        }
    }

    shoot(target){
        const dx = target.x_canvas - (this.x+1/2)*this.pict.width;
        const dy = target.y_canvas - (this.y+1/3)*this.pict.height;
        const dis = Math.sqrt(dx*dx+dy*dy);
        const vx = (dx/dis)*this.bulletSpeed;
        const vy = (dy/dis)*this.bulletSpeed;
        const img_bulletchip = [
            'img/bullet_pink.png',
            'img/bullet_blue.png',
            'img/bullet_yellow.png'
        ];
        let bullet = new Bullet((this.x+1/2)*this.pict.width,(this.y+1/2)*this.pict.height,vx,vy,img_bulletchip,this.id,this.bulletSpeed,target,this.damage);
        bullets.push(bullet);
    }
}

class Enemy{
    // constructor(id,x,y,enemychip,speed,HP){
    constructor(id,x,y,enemychip,speed,HP,type){
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
        this.flag_move = 0
        // this.pict = new Image();
        // this.pict.src = enemychip[this.id];
        this.x_grid_before = null;
        this.y_grid_before = null;
        this.hp = HP;
        this.x_candidate = 0;
        this.y_candidate = 0;
        this.move_count=0;
        this.x_move = 0;
        this.y_move = 0;
        this.type = type;

        this.resized_picts = resizeImages(enemychip, map.TILE_SIZE) //画像拡縮の処理
        this.pict = this.resized_picts[0] //リサイズ画像を代入

        // アニメーション用
        this.resized_animations = resizeImages(enemy_move_imgs[this.type], map.TILE_SIZE, 'h', -5,0);
        this.animas = this.resized_animations;
        this.animas_idx = 1;
        console.log(this.animas[0])
        // this.pict = this.animas[0][0];
    }

    // draw(){
    //     graphic.drawImage(this.pict, this.x_canvas, this.y_canvas, map.vrble_width, map.vrble_height);
    // }

    // アニメーションの番号送りのみを行う（init()内のsetIntervalで使用）
    proceed_animation(){
        this.animas_idx = (this.animas_idx+1) % this.animas.length;
    }
    // 画像の表示のみ行う。（グローバルのdraw()内で使用）
    draw_animation(){
        graphic.drawImage(
            this.animas[this.animas_idx], 
            this.x_canvas, 
            this.y_canvas); //this.x,yは存在しないので、this.x,y_canvasで代用
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
            //console.log(e.massage);
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
            //console.log(e.massage);
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
            //console.log(e.massage);
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
            //console.log(e.massage);
        }
    }

    animation_move(){
        this.flag_move = 1;
        this.x_canvas = this.x_canvas + this.x_move * this.frame;
        this.y_canvas = this.y_canvas + this.y_move * this.frame;
        this.move_count++;
        if(this.move_count > this.speed/2){
            this.x_grid = this.x_candidate;
            this.y_grid = this.y_candidate;
        }
        if(this.move_count === this.speed){
            this.flag_move = 0;
        }
    }

    move(){
        if(this.flag_move === 1){
            this.animation_move(this.x_candidate-this.x_grid,this.y_candidate-this.y_grid);
            return 0;
        }

        this.x_candidate = this.x_grid;
        this.y_candidate = this.y_grid;
        let command;
        command = this.search_move();

        switch(command){
            case 'R' :this.x_candidate++;//右移動
                    break;
            case 'L' :this.x_candidate--;//左移動
                    break;
            case 'U' :this.y_candidate--;//上移動
                    break;
            case 'D' :this.y_candidate++;//下移動
                    break;
        }

        if(map.map_data[this.y_candidate][this.x_candidate] === 0){
            this.move_count=0;
            this.x_move = this.x_candidate-this.x_grid;
            this.y_move = this.y_candidate-this.y_grid;
            this.x_grid_before = this.x_grid;
            this.y_grid_before = this.y_grid;
            this.animation_move();
            
            //this.x_grid = x_candidate;
            //this.y_grid = y_candidate;
            //console.log(this.x_grid_before);
            //console.log(this.y_grid_before);
        }
    }

    attack(){
    }

    damaged(id,damage){
        let type_to_id_idx ={
            pink: 0,
            blue :  1,
            orange: 2,
            gold:   3,
            green:  3,
            boss:   3
        };
        let enemy_id = type_to_id_idx[this.type];

        if(enemy_id === 3){
            this.hp -= damage;
            damage_cal += damage;
        }

        // 特定タレットのみ攻撃を通す処理
        else{
            if(enemy_id === id){
                this.hp -= damage * 5;
                console.log("critical!");
                damage_cal += damage * 5;
            }
            else{
                this.hp -= Math.floor( damage / 5);
                console.log("sorry")
                damage_cal += Math.floor( damage / 5);
            }
        }
    }
    dead(){
        if(this.hp <= 0){
            this.isDead = true;
            num_enemy_dead += 1;
            if(this.type === 'gold'){
                player.resource++;
            }

            if(this.type === 'boss'){
                let boss_random = Math.floor(Math.random() * 4);
                if(boss_random === 0){
                    player.resource++;
                }
            }
        }
    }
}

class ResizeStaticImg{
    constructor(_img_source, _x, _y, _w, _h){
        this.originalImg;
        this.resizeCanvas;
        this.x = _x;
        this.y = _y;
        this.width = _w;
        this.height = _h;
        
        this.originalImg = new Image();
        this.originalImg.src = _img_source; // 画像のソースを設定
        // 拡縮された画像を保持するためのキャンバス
        this.resizeCanvas = document.createElement('canvas');
        this.resizeCanvas_ctx = this.resizeCanvas.getContext('2d');

        // キャンバスに描画
        this.originalImg.onload = () => {
            this.resizeCanvas.width = 1920;
            this.resizeCanvas.height = 1080;
            this.resizeCanvas_ctx.drawImage(
                this.originalImg,   // 描画obj
                0,0,                // 切り取り開始座標
                this.originalImg.width, this.originalImg.height, // 切り取り幅
                0,0,                // キャンバス上の描画開始座標
                this.resizeCanvas.width,this.resizeCanvas.height);
                // 300, 150); //描画サイズ（not枠）。ここを切れるぎりぎりに調節する。
        }
    }
    draw(){
        graphic.drawImage(
            this.resizeCanvas,
            this.x,this.y,
            this.width,this.height); // 表示全体を、絵・枠両方拡大
            // this.originalImgs[0].width,this.originalImgs[0].height);
    }
    draw2(x0,y0,w0,h0){
        graphic.drawImage(
            this.resizeCanvas,
            x0,y0,
            w0,h0); // 表示全体を、絵・枠両方拡大
            // this.originalImgs[0].width,this.originalImgs[0].height);
    }
}

// 要グローバル変数：game_mode
class ClickableButton {
    constructor(_img_path, _allow_mode, _callback) {
        // システム側：クリック範囲を指定する
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.allow_mode = _allow_mode;
        this.callback; 
        // クリック時に実行される処理（関数）
        document.addEventListener("mousedown", this.handleMouseDown.bind(this));

        // 描画側：リサイズして描画
        this.originalImg = new Image();
        this.originalImg.src = _img_path;
        this.resizeCanvas = document.createElement('canvas');
        this.resizeCanvas_ctx = this.resizeCanvas.getContext('2d');
        
        this.originalImg.onload = () => {
            this.resizeCanvas.width = 1920;
            this.resizeCanvas.height = 1080;
            this.resizeCanvas_ctx.drawImage(
                this.originalImg,   // 描画obj
                0,0,                // 切り取り開始座標
                this.originalImg.width, this.originalImg.height, // 切り取り幅
                0,0,                // キャンバス上の描画開始座標
                this.resizeCanvas.width,this.resizeCanvas.height);
                // 300, 150); //描画サイズ（not枠）。ここを切れるぎりぎりに調節する。
        }
    }
    
    draw_and_define(x0,y0,w0,h0,callback0){
        // この関数が呼び出されて初めてボタン位置・大きさがちゃんと決まる
        this.x = x0;
        this.y = y0;
        this.w = w0;
        this.h = h0;
        this.callback = callback0;
        graphic.drawImage(
            this.resizeCanvas,
            x0,y0,
            w0,h0); // 表示全体を、絵・枠両方拡大

        // デバッグ用：クリック判定範囲を赤い枠線で表示
        if (false){
            graphic.beginPath();
            graphic.strokeStyle = 'red'; // 枠線の色
            graphic.lineWidth = 3; // 枠線の太さ
            graphic.strokeRect(x0, y0, w0, h0);
            // console.log(this.x,this.y,this.w,this.h);
        }
        
    }

    // 範囲内のクリックか判定するメソッド
    isWithinBounds(clickX, clickY) {
        return (
            clickX >= this.x &&
            clickX <= this.x + this.w &&
            clickY >= this.y &&
            clickY <= this.y + this.h
        );
    }
    // マウスダウン時の処理
    handleMouseDown(event) {
        const clickX = event.offsetX; //offsetX...canvas自体の左上を基準とした座標
        const clickY = event.offsetY;
        // クリック位置が範囲内ならコールバックを実行
        // game_mo...の条件がないと意図しないgame_mode上で処理が働いてしまう
        if (game_mode === this.allow_mode && this.isWithinBounds(clickX, clickY)) {
        // if (this.isWithinBounds(clickX, clickY)) {
            this.callback();
        }
    }
}

window.addEventListener('load', () => {
});


window.addEventListener('load', () => {
});


onload = function(){
    canvas = document.getElementById("game");
    graphic = canvas.getContext("2d");
    bgm = document.getElementById('bgm');

    //フォント読み込み
    document.fonts.load('10pt"hanazome"');

    //初期化
    init()
    //入力処理
    document.onkeyup = keyup;
    document.onmousemove = mousemove;
    document.onmouseover = mouseover;
    document.onmousedown = mousedown;
    document.onmouseup = mouseup;

    setTimeout("gameloop()",16 / gamespeed)
}

function init(){
    CWidth = canvas.width;
    CHeight = canvas.height;

    const img_mapchip = [
        'img/mapchip0_cookie.png',
        'img/mapchip1_pudding.png'
    ];

    const img_enemychip = [
        'img/enemy_move_inv.png'
    ];
    
    const img_turretchip = [
        'img/dot_chara1.png',
        'img/dot_chara2.png',
        'img/dot_chara3.png' 
    ]
    // const img_turretchip = [
    //     'img/turret_temp1.png',
    //     'img/turret_temp2.png'
    // ];

    map = new Map(map_data, img_mapchip);
    player = new Player(img_turretchip);
}

function addTurret(id,x,y,speed){
    const img_turretchip = [
        'img/dot_chara1.png',
        'img/dot_chara2.png',
        'img/dot_chara3.png'
    ];

    const range_turretchip = [
        8,
        5,
        2
    ];
    // const img_turretchip = [
    //     'img/turret_temp1.png',
    //     'img/turret_temp2.png'
    // ];
    let turret = new Turret(id,x,y,speed,img_turretchip,range_turretchip);
    turrets.push(turret);
}
// function addEnemy(_move_interval,HP){
function addEnemy(_move_interval,HP,_enemy_type){
    const img_enemychip = ['img/enemy_move_inv.png'];
    _enemy_speed = _move_interval-Math.floor( Math.random() * random_speed);
    if(_enemy_speed <= 0){
        _enemy_speed = 1;
    }

    let change_enemy_type = Math.floor( Math.random() * 100);

    if(_enemy_type === 'green'){
        if(wave_count >= 3){
            if(change_enemy_type >= 82 && change_enemy_type <= 86){
                _enemy_type = 'blue';
            }

            if(change_enemy_type >= 87 && change_enemy_type <= 91){
                _enemy_type = 'orange';
            }

            if(change_enemy_type >= 92 && change_enemy_type <= 96){
                _enemy_type = 'pink';
            }
        }
        if(change_enemy_type > 96){
            _enemy_type = 'gold';
        }
    }

    if(_enemy_type != 'boss'){
        if(change_enemy_type > 96){
            _enemy_type = 'gold';
        }
    }

    let enemy = new Enemy(0, map.enemy_base[1], map.enemy_base[0], img_enemychip, _enemy_speed,Math.floor(HP * enemy_level), _enemy_type); //id,x,y,enemychip,speed,HP最後の引数はスピードで，小さいほど速くなる（0以下だとエラーが起こる．）
    console.log(enemy.hp)
    enemies.push(enemy);
}

function removeEnemy(){
    enemies = enemies.filter((element) => element.isDead != true);
}

function removeBullet(){
    bullets = bullets.filter((element) => element.away != true);
}

function update(){
    for(let enemy of enemies){
        enemy.move();
        enemy.dead();
    }
    removeEnemy();
    for(let bullet of bullets){
        if(bullet.id === 0){
            bullet.fly();
        }
        if(bullet.id === 1 || bullet.id === 2){
            bullet.homing();
        }
        bullet.hit(enemies);
    }
    removeBullet();
    map.judge_GAMEOVER();
}

function draw(){
    graphic.fillStyle = "rgb(255,255,255)";
    graphic.fillRect(0,0,canvas.width,canvas.height);
    map.draw();
    for(let enemy of enemies){
        // enemy.draw();
        enemy.draw_animation();
    }
    for(let turret of turrets){
        // turret.draw();
        turret.draw_animation();
    }
    for(let bullet of bullets){
        bullet.draw();
    }
    player.drawUI();
    player.draw();
}

function keyup(e){

}

function mousedown(e){
    player.grab();
    // console.log('x', e.offsetX)
    // console.log('y', e.offsetY)
}

function mouseup(e){
    if(player.hold){
        player.deploy(map);
        player.hold = false;
    }
}

function mousemove(e){
    pointer.x = e.offsetX;
    pointer.y = e.offsetY;
}

function mouseover(e){

}


function turret_animation_proceed(game_mode){
    if (game_mode === 'in_game') {
        for (let turret of turrets) {
            turret.proceed_animation();
        }
    }
}
function enemy_animation_proceed(game_mode){
    if (game_mode === 'in_game') {
        for (let enemy of enemies) {
            enemy.proceed_animation();
        }
    }
}


// 指定game_modeで、ボタンを表示
// 押すとgame_modeの変更


// actual_drawのブランチで導入
// グローバル関数として画像リサイズ処理を定義
// 返り値は画像objの配列なので、画像obj用の変数(this.pictなど)に代入して使えます。
function resizeImages(CHIP, TILE_SIZE, _inv='', _offsetX=0, _offsetY=0) {
    // リサイズ済み画像を格納する配列
    const resizedImages = [];

    for (let i = 0; i < CHIP.length; i++) {
        const image = new Image();
        image.src = CHIP[i]; // 画像のソースを設定

        // 拡縮された画像を保持するためのキャンバスを作成
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        let ctx = canvas.getContext('2d');

        // 画像読込完了時の処理
        image.onload = () => {    
            ctx.translate(_offsetX, _offsetY); //
            // 反転処理の設定
            if (_inv.includes('h')) { // 水平反転
                ctx.scale(-1, 1);
                ctx.translate(-TILE_SIZE, 0);
            }
            if (_inv.includes('v')) { // 垂直反転
                ctx.scale(1, -1);
                ctx.translate(0, -TILE_SIZE);
            }
            // 元の画像を指定のサイズにリサイズして描画
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, TILE_SIZE, TILE_SIZE);
            // 次回描画時に影響しないように、変換マトリックスをリセット
            // ctx.setTransform(1, 0, 0, 1, 0, 0) 
        };
 
        // リサイズされた画像(canvas)を配列に追加
        resizedImages.push(canvas);
    }

    // リサイズ済み画像の配列を返す
    return resizedImages;
}


function drawText(ctx, text, x, y, size, color) {
    ctx.font = `${size}px hanazome`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}


// 描画用変数（クラスより上側に配置するとreference error）
const BUTTON_W = 150
const BUTTON_H = 300*BUTTON_W/700
console.log({BUTTON_H})
let title_img_obj = new ResizeStaticImg('img/title.png', 0, 0, HTML_WIDTH, HTML_HEIGHT-80); //path,x,y,w,h
let result_img_obj = new ResizeStaticImg('img/result.png', 0, 0, HTML_WIDTH, HTML_HEIGHT); //path,x,y,w,h
let logo_img_obj = new ResizeStaticImg('img/title_logo.png') // 1280*1280

// 「ボタン」オブジェ
let btn_title_exit = new ClickableButton('img/buttons/button_exit.png', 'in_title');
let btn_title_setting = new ClickableButton('img/buttons/button_setting.png', 'in_title');
let btn_title_start = new ClickableButton('img/buttons/button_start.png', 'in_title');

let btn_result_exit = new ClickableButton('img/buttons/button_exit.png', 'in_result');



function gameloop(){
    timer += 1;
    animation_time += 1;
    change_gamespeed_time += 1;
    //console.log(game_mode);

    if( game_mode === 'in_title' ){
        //console.log('game_mode: in_title');
        random_speed = 0;
        random_contents = 5;
        spawn_speed_level = 0;
        enemy_level = 1.0;
        animation_time = 0;
        change_gamespeed_time = 0;

        //描画の処理
        //下枠
        graphic.fillStyle = "rgba(" + [50,50,50] + ")";
        graphic.fillRect(0,0,canvas.width,canvas.height);
        // タイトル
        title_img_obj.draw()
        // ロゴ
        logo_x = 17
        logo_y = -10+2*Math.sin(timer/20)
        logo_s = 300
        logo_img_obj.draw2(logo_x,logo_y,logo_s,logo_s);
        
        // drawText(graphic, "Sweet Rush Tower", CWidth/2, CHeight*600/720-300, 60, "rgb(50, 50, 50)");
        // drawText(graphic, "Press [SPACE] to start", CWidth/2, CHeight*600/720, 50, "rgb(50, 50, 50)");
        
        if (title_mode === 'main'){
            // タイトルのボタン群
            { //{}で囲むと、この中で定義された変数は外部からアクセスできない（即時実行関数式）
                const CH = 428
                const CX1 = HTML_WIDTH*1/6-BUTTON_W/2
                const CX2 = HTML_WIDTH*3/6-BUTTON_W/2
                const CX3 = HTML_WIDTH*5/6-BUTTON_W/2
                btn_title_exit.draw_and_define(CX1, CH, BUTTON_W, BUTTON_H, ()=>{
                    console.log('おわる');
                    window.location.reload(); //ブラウザの再読み込み
                });
                btn_title_setting.draw_and_define(CX2, CH, BUTTON_W, BUTTON_H, ()=>{
                    console.log('せってい');
                    title_mode = 'setting';
                });
                btn_title_start.draw_and_define(CX3, CH, BUTTON_W, BUTTON_H, ()=>{
                    console.log('はじめる');
                    bgm.play()
                    graphic.clearRect(0,0, CWidth, CHeight);
                    game_mode = 'in_game';
                    gamespeed = 1;
                    change_gamespeed_flag = 1;
                    timer = 0;
                    player.resource = 4;
                    wave_count = 1;
                    current_spawn = 0;
                    enemies = [];
                    game_timer = 0;
                    damage_cal = 0;
                    num_enemy_dead = 0;
                    turrets = [];
                    map.map_data = [
                        [0,1,0,0,0,1,0,0,0,1],
                        [0,1,0,1,0,1,0,1,0,1],
                        [0,1,0,1,0,1,0,1,0,1],
                        [0,1,0,1,0,1,0,1,0,1],
                        [0,1,0,1,0,1,0,1,0,1],
                        [0,0,0,1,0,0,0,1,0,1],
                    ];
                });
            }
        }

        if (title_mode === 'setting'){
            //半透明(透明度70%)の暗い四角を画面全体に表示
            graphic.beginPath();
            graphic.fillStyle = "rgba(" + [0, 0, 0, 0.7] + ")";
            graphic.fillRect(0, 0, CWidth, CHeight);  
            
            ///ボタン無効化処理
            btn_title_exit.draw_and_define(0,0,0,0, ()=>{});
            btn_title_setting.draw_and_define(0,0,0,0, ()=>{});
            btn_title_start.draw_and_define(0,0,0,0, ()=>{});
            
            { //{}で囲むと、この中で定義された変数は外部からアクセスできない（即時実行関数式）
                const CH = 428
                const CX2 = HTML_WIDTH*3/6-BUTTON_W/2
                btn_title_exit.draw_and_define(CX2, CH, BUTTON_W, BUTTON_H, ()=>{
                    console.log('おわる');
                    title_mode = 'main';
                });
            }

            //説明文デモ
            sentence = [
                "🌟Sweet Rush Towerへようこそ！🌟",
                "ここでは、色とりどりの敵たちが通路を抜けようと攻めてきます。",
                "あなたの使命はキャラクターを巧みに配置して、守ることです。",
                "🛡️ 挑戦が待っているエンドレスモード",
                "徐々に強まる敵の波に対し、あなたの戦略と判断力が試されます。",
                "数多くのタワーをそろえ、敵を撃退し、無限の挑戦に立ち向かえ！"
            ]
            for (let i in sentence){
                drawText(graphic, sentence[i], CWidth/2, 100+50*i, 20, "rgb(250, 250, 250)");
            }
            

        }      
    }

    if( game_mode === 'in_game' ){
        update();
        draw();
        //console.log(wave_mode)

        window.addEventListener('keyup', event => {
            if(event.code === 'Space'){
                if(wave_mode === 'calm'){
                    wave_mode = 'battle';
                    timer = 0;
                }
            }

            if(event.key === '1' && change_gamespeed_flag === 1){
                gamespeed = 1;
                change_gamespeed_flag = 0;
                change_gamespeed_time = 0;

            }

            if(event.key === '2' && change_gamespeed_flag === 1){
                gamespeed = 2;
                change_gamespeed_flag = 0;
                change_gamespeed_time = 0;
            }

            if(event.key === '4' && change_gamespeed_flag === 1){
                gamespeed = 4;
                change_gamespeed_flag = 0;
                change_gamespeed_time = 0;
            }
        });



        drawText(graphic, `x ${gamespeed}`, CWidth*11/12, CHeight*5/6+70, 20, "rgb(150, 150, 150)");
        drawText(graphic, `resource: ${player.resource}`, CWidth*3/4, CHeight*5/6+50, 20, "rgb(150, 150, 150)");
        if(wave_mode === 'calm'){
            current_spawn = 0;
            drawText(graphic, "Press [SPACE] to wave", CWidth*3/4, CHeight*5/6+20, 20, "rgb(150, 150, 150)");
        } 


        if(wave_mode === 'battle'){
            game_timer += 1;
            drawText(graphic, `wave:  ${wave_count}`, CWidth*3/4, CHeight*5/6+20, 20, "rgb(150, 150, 150)");
            spawn_flag = wave_contents[current_spawn % 25];

            //console.log(wave_contents[wave_count].length)
            if( current_spawn === random_contents && enemies.length === 0){
                wave_mode = 'calm';
                wave_count += 1;
                player.resource += 3;
                random_contents += 5;
                spawn_speed_level += 4;
                if(spawn_speed_level >= 59){
                    spawn_speed_level = 59;
                }
                random_speed += 4;
                if(random_speed >= 30){
                    random_speed = 30; // 速くなりすぎないように
                }
                enemy_level = enemy_level + 1; //HP倍率の上昇
                timer = 0;
            }

            //console.log('current_spawn', current_spawn)
            if( spawn_flag['spawnSec'] === Math.round(timer/(60 - spawn_speed_level)) && current_spawn < random_contents){
                // addEnemy(spawn_flag['move_interval'],spawn_flag['HP']);
                addEnemy(spawn_flag['move_interval'],spawn_flag['HP'],spawn_flag['type']);
                if( current_spawn < random_contents ){
                    current_spawn += 1;
                }
            }

            if(current_spawn != 0 && current_spawn % 25 === 0){
                timer = 0;
                enemy_level *= 2.0;
                spawn_speed_level += 5;
                if(spawn_speed_level >= 59){
                    spawn_speed_level = 59;
                }
            }
        }
    }

    if (game_mode === 'in_gameover') {
        update();
        draw();
        gamespeed = 1;
        drawText(graphic, "GAME OVER", CWidth/2+3, CHeight/2-3, 60, "rgb(50, 50, 50)");
        drawText(graphic, "GAME OVER", CWidth/2-3, CHeight/2-3, 60, "rgb(50, 50, 50)");
        drawText(graphic, "GAME OVER", CWidth/2+3, CHeight/2+3, 60, "rgb(50, 50, 50)");
        drawText(graphic, "GAME OVER", CWidth/2-3, CHeight/2+3, 60, "rgb(50, 50, 50)");
        drawText(graphic, "GAME OVER", CWidth/2, CHeight/2, 60, "rgb(250, 200, 200)");
        if (timer > 3*62.5) {
            game_mode = 'in_result'
        }
    }
    if (game_mode === 'in_result') {
        
        wave_mode = 'calm';
        result_img_obj.draw()
        drawText(graphic, "Result", CWidth*3/4, CHeight/8, 60, "rgb(100, 100, 100)");

        drawText(graphic, `到達したwave：${wave_count}`, CWidth*3/4, CHeight/8+75, 20, "rgb(100, 100, 100)");
        drawText(graphic, `倒した敵の数：${num_enemy_dead}`, CWidth*3/4, CHeight/8+125, 20, "rgb(100, 100, 100)");
        drawText(graphic, `与えたダメージ：${damage_cal}`, CWidth*3/4, CHeight/8+175, 20, "rgb(100, 100, 100)");
        drawText(graphic, `経過時間(game内):${Math.round(game_timer/60)}秒`, CWidth*3/4, CHeight/8+225, 20, "rgb(100, 100, 100)");
        // 戻るボタン
        {//即時実行関数
            const CH = 428
            const CX3 = HTML_WIDTH*5/6-BUTTON_W/2
            btn_result_exit.draw_and_define(CX3, CH, BUTTON_W, BUTTON_H, ()=>{
                console.log('おわる');
                game_mode = 'in_title'
                graphic.clearRect(0,0, CWidth, CHeight);
            });
        }
    }


    if(animation_time % 4 === 0){
        enemy_animation_proceed(game_mode); // アニメーションの番号送り専用
    }
    
    if(animation_time % 5 === 0){
        turret_animation_proceed(game_mode); // アニメーションの番号送り専用
    }

    if(animation_time % 20 === 0){
        animation_time = 0;
    }


    if(change_gamespeed_time % 10 === 0){
        change_gamespeed_flag = 1; // アニメーションの番号送り専用
        change_gamespeed_time = 0;
    }

    setTimeout("gameloop()", 16 / gamespeed)

}