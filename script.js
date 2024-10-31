let canvas,graphic,CWidth,CHeight;
let enemies = [];
let enemies_resize = [];
let turrets = [];
let bullets = [];
let game_mode = 'in_title';
let map,player;
let pointer = {
    "x":0,
    "y":0
}
let timer = 0;
let current_spawn = 0
let turret_cost = [
    1,2,3
];
let wave_count = 0;
let wave_mode = 'calm';
let wave_contents = [
    { type: 'enemyType1', move_interval: 60, spawnSec: 1  ,HP: 20},
    { type: 'enemyType1', move_interval: 60, spawnSec: 4  ,HP: 30},
    { type: 'enemyType1', move_interval: 45, spawnSec: 7 ,HP: 10},
    { type: 'enemyType1', move_interval: 60, spawnSec: 10 ,HP: 40},
    { type: 'enemyType1', move_interval: 120, spawnSec: 15, HP:100},
    { type: 'enemyType1', move_interval: 60, spawnSec: 20 , HP: 40},
    { type: 'enemyType1', move_interval: 60, spawnSec: 23 , HP: 50},
    { type: 'enemyType1', move_interval: 50, spawnSec: 26 , HP: 30},
    { type: 'enemyType1', move_interval: 60, spawnSec: 30 , HP: 50},
    { type: 'enemyType1', move_interval: 240, spawnSec: 34 ,HP:450},
    { type: 'enemyType1', move_interval: 55, spawnSec: 41 , HP: 60},
    { type: 'enemyType1', move_interval: 60, spawnSec: 43 , HP: 90},
    { type: 'enemyType1', move_interval: 30, spawnSec: 46 , HP: 50},
    { type: 'enemyType1', move_interval: 60, spawnSec: 50 ,HP: 50},
    { type: 'enemyType1', move_interval: 90, spawnSec: 54 ,HP: 400},
    { type: 'enemyType1', move_interval: 80, spawnSec: 55 ,HP: 50},
    { type: 'enemyType1', move_interval: 40, spawnSec: 59 ,HP: 80},
    { type: 'enemyType1', move_interval: 60, spawnSec: 60 ,HP: 90},
    { type: 'enemyType1', move_interval: 62, spawnSec: 63 ,HP: 100},
    { type: 'enemyType1', move_interval: 65, spawnSec: 65 ,HP: 400},
    { type: 'enemyType1', move_interval: 20, spawnSec: 68 ,HP: 10},
    { type: 'enemyType1', move_interval: 63, spawnSec: 70 ,HP: 110},
    { type: 'enemyType1', move_interval: 60, spawnSec: 72 ,HP: 120},
    { type: 'enemyType1', move_interval: 40, spawnSec: 23 ,HP: 70},
    { type: 'enemyType1', move_interval: 100, spawnSec: 23 ,HP: 1000},
];
let random_speed = 0;
let random_contents = 3;
let spawn_speed_level = 0;
let enemy_level = 1.0;

// 「img/chara1_animation/1,2,3,... .PNG」という要素を16個もつ配列を生成
const chara_animation_imgs = [
    Array.from({ length: 16 }, (_, i) => `img/chara1_animation/${i + 1}.PNG`),
    Array.from({ length: 16 }, (_, i) => `img/chara2_animation/${i + 1}.PNG`),
    Array.from({ length: 16 }, (_, i) => `img/chara3_animation/${i + 1}.PNG`)
];
const enemy_move_imgs = [
    Array.from({ length: 14 }, (_, i) => `img/enemy/enemy_gold_move/${i + 1}.PNG`)
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
        this.resource = 2; //タレット1台1~3のコストを想定して初期値5

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

        this.map_data = map_data;
        this.enemy_base = [0,0];
        this.player_base = [8,4];
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
            }
        }
    }

    judge_GAMEOVER(){
        for(let i = 0; i < enemies.length; i++) {
            let emy = enemies[i];
            this.dx_judge = Math.abs(emy.x_grid - this.player_base[0]) < 1;
            this.dy_judge = Math.abs(emy.y_grid - this.player_base[1]) < 1;

            if (this.dx_judge && this.dy_judge) {
                //_before_enemies = enemies;
                emy.isDead = true;
                removeEnemy();
                //console.log('removeEnemy: ', _before_enemies, '→', enemies);
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
                enemy.hp -= this.damage;
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
        console.log('sadfsaf', this.animas[0])
        this.pict = this.animas[0];
        let damagechip =[
            15,10,50
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
            this.animas[this.animas_idx].height*this.y);
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
    constructor(id,x,y,enemychip,speed,HP){
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

        this.resized_picts = resizeImages(enemychip, map.TILE_SIZE) //画像拡縮の処理
        this.pict = this.resized_picts[0] //リサイズ画像を代入

        // アニメーション用
        this.resized_animations = resizeImages(enemy_move_imgs[0], map.TILE_SIZE, 'h', -5,0);
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

    animation_move(x_move,y_move,x_candidate,y_candidate){
        let i=0;
        this.flag_move = 1;
        let interval = setInterval(() => {
            this.x_canvas = this.x_canvas + x_move * this.frame;
            this.y_canvas = this.y_canvas + y_move * this.frame;
            i++;
            if(i > this.speed/2){
                this.x_grid = x_candidate;
                this.y_grid = y_candidate;
            }
            if(i === this.speed){
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
            this.animation_move(x_candidate-this.x_grid,y_candidate-this.y_grid,x_candidate,y_candidate);
            this.x_grid_before = this.x_grid;
            this.y_grid_before = this.y_grid;
            //this.x_grid = x_candidate;
            //this.y_grid = y_candidate;
            //console.log(this.x_grid_before);
            //console.log(this.y_grid_before);
        }
    }

    attack(){
    }

    dead(){
        if(this.hp <= 0){
            this.isDead = true;
        }
    }
}

onload = function(){
    canvas = document.getElementById("game");
    graphic = canvas.getContext("2d");

    //フォント読み込み
    document.fonts.load('10pt"hanazome"');

    //初期化
    init()
    //入力処理
    document.onkeydown = keydown;
    document.onmousemove = mousemove;
    document.onmouseover = mouseover;
    document.onmousedown = mousedown;
    document.onmouseup = mouseup;

    setInterval("enemy_animation_proceed(game_mode)", 60)
    setInterval("turret_animation_proceed(game_mode)", 70) // アニメーションの番号送り専用
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
        [0,0,0,1,0,0,0,1,0,1],
    ];

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

function addEnemy(_move_interval,HP){
    const img_enemychip = ['img/enemy_move_inv.png'];
    _enemy_speed = _move_interval-Math.floor( Math.random() * random_speed);
    if(_enemy_speed <= 0){
        _enemy_speed = 1;
    }
    let enemy = new Enemy(0, map.enemy_base[1], map.enemy_base[0], img_enemychip, _enemy_speed,Math.floor(HP * enemy_level)); //id,x,y,enemychip,speed,HP最後の引数はスピードで，小さいほど速くなる（0以下だとエラーが起こる．）
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

function keydown(e){

}

function mousedown(e){
    player.grab();
    console.log('x', e.pageX)
    console.log('y', e.pageY)
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



const title_image = new Image();
title_image.src = 'img/enemy_move_inv.png'
function gameloop(){
    timer += 1;
    //console.log(game_mode);

    if( game_mode === 'in_title' ){
        //console.log('game_mode: in_title');
        random_speed = 0;
        random_contents = 3;
        spawn_speed_level = 0;
        enemy_level = 1.0;

        graphic.drawImage(title_image,60,0)
        drawText(graphic, "Sweet Rush Tower", CWidth/2, CHeight*600/720-300, 60, "rgb(50, 50, 50)");
        drawText(graphic, "Press [SPACE] to start", CWidth/2, CHeight*600/720, 50, "rgb(50, 50, 50)");
        
        window.addEventListener('keydown', event => {
            if(event.code === 'Space'){
                graphic.clearRect(0,0, CWidth, CHeight);
                game_mode = 'in_game';
                timer = 0          
            }
        });
    }

    if( game_mode === 'in_game' ){
        update();
        draw();
        //console.log(wave_mode)

        drawText(graphic, `resource: ${player.resource}`, CWidth*3/4, CHeight*5/6+50, 20, "rgb(150, 150, 150)");
        if(wave_mode === 'calm'){
            current_spawn = 0;
            window.addEventListener('keydown', event => {
                if(event.code === 'Space'){
                    wave_mode = 'battle';
                    timer = 0;
                }
            });
            drawText(graphic, "Press [SPACE] to wave", CWidth*3/4, CHeight*5/6+20, 20, "rgb(150, 150, 150)");
        } 


        if(wave_mode === 'battle'){
            spawn_flag = wave_contents[current_spawn % 25];

            //console.log(wave_contents[wave_count].length)
            if( current_spawn === random_contents && enemies.length === 0){
                wave_mode = 'calm';
                wave_count += 1;
                player.resource += 1;
                random_contents += Math.floor( Math.random() * 3);
                spawn_speed_level += Math.floor(Math.floor( Math.random() * 3)/2);
                if(spawn_speed_level >= 59){
                    spawn_speed_level = 59;
                }
                random_speed += Math.floor( Math.random() * 4);
                if(random_speed >= 30){
                    random_speed = 30;
                }
                enemy_level = enemy_level + 0.25 + Math.random() * 0.1;
                timer = 0;
            }

            //console.log('current_spawn', current_spawn)
            if( spawn_flag['spawnSec'] === Math.round(timer/(60 - spawn_speed_level)) && current_spawn < random_contents){
                addEnemy(spawn_flag['move_interval'],spawn_flag['HP']);
                if( current_spawn < random_contents ){
                    current_spawn += 1
                }
            }

            if(current_spawn != 0 && current_spawn % 25 === 0){
                timer = 0;
                enemy_level *= 2;
                spawn_speed_level += 2;
                if(spawn_speed_level >= 59){
                    spawn_speed_level = 59;
                }
            }
        }
    }
}