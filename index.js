var TILE_SIZE = 30;
var FPS = 30;
var SLEEP = 1000 / FPS;
var Tile;
(function (Tile) {
    Tile[Tile["AIR"] = 0] = "AIR";
    Tile[Tile["FLUX"] = 1] = "FLUX";
    Tile[Tile["UNBREAKABLE"] = 2] = "UNBREAKABLE";
    Tile[Tile["PLAYER"] = 3] = "PLAYER";
    Tile[Tile["STONE"] = 4] = "STONE";
    Tile[Tile["FALLING_STONE"] = 5] = "FALLING_STONE";
    Tile[Tile["BOX"] = 6] = "BOX";
    Tile[Tile["FALLING_BOX"] = 7] = "FALLING_BOX";
    Tile[Tile["KEY1"] = 8] = "KEY1";
    Tile[Tile["LOCK1"] = 9] = "LOCK1";
    Tile[Tile["KEY2"] = 10] = "KEY2";
    Tile[Tile["LOCK2"] = 11] = "LOCK2";
})(Tile || (Tile = {}));
var Input;
(function (Input) {
    Input[Input["UP"] = 0] = "UP";
    Input[Input["DOWN"] = 1] = "DOWN";
    Input[Input["LEFT"] = 2] = "LEFT";
    Input[Input["RIGHT"] = 3] = "RIGHT";
})(Input || (Input = {}));
var playerx = 1;
var playery = 1;
var map = [
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 3, 0, 1, 1, 2, 0, 2],
    [2, 4, 2, 6, 1, 2, 0, 2],
    [2, 8, 4, 1, 1, 2, 0, 2],
    [2, 4, 1, 1, 1, 9, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
];
var inputs = [];
function remove(tile) {
    for (var y = 0; y < map.length; y++) {
        for (var x = 0; x < map[y].length; x++) {
            if (map[y][x] === tile) {
                map[y][x] = Tile.AIR;
            }
        }
    }
}
function moveToTile(newx, newy) {
    map[playery][playerx] = Tile.AIR;
    map[newy][newx] = Tile.PLAYER;
    playerx = newx;
    playery = newy;
}
function moveHorizontal(dx) {
    if (map[playery][playerx + dx] === Tile.FLUX
        || map[playery][playerx + dx] === Tile.AIR) {
        moveToTile(playerx + dx, playery);
    }
    else if ((map[playery][playerx + dx] === Tile.STONE
        || map[playery][playerx + dx] === Tile.BOX)
        && map[playery][playerx + dx + dx] === Tile.AIR
        && map[playery + 1][playerx + dx] !== Tile.AIR) {
        map[playery][playerx + dx + dx] = map[playery][playerx + dx];
        moveToTile(playerx + dx, playery);
    }
    else if (map[playery][playerx + dx] === Tile.KEY1) {
        remove(Tile.LOCK1);
        moveToTile(playerx + dx, playery);
    }
    else if (map[playery][playerx + dx] === Tile.KEY2) {
        remove(Tile.LOCK2);
        moveToTile(playerx + dx, playery);
    }
}
function moveVertical(dy) {
    if (map[playery + dy][playerx] === Tile.FLUX
        || map[playery + dy][playerx] === Tile.AIR) {
        moveToTile(playerx, playery + dy);
    }
    else if (map[playery + dy][playerx] === Tile.KEY1) {
        remove(Tile.LOCK1);
        moveToTile(playerx, playery + dy);
    }
    else if (map[playery + dy][playerx] === Tile.KEY2) {
        remove(Tile.LOCK2);
        moveToTile(playerx, playery + dy);
    }
}
function update() {
    while (inputs.length > 0) {
        var current = inputs.pop();
        if (current === Input.LEFT)
            moveHorizontal(-1);
        else if (current === Input.RIGHT)
            moveHorizontal(1);
        else if (current === Input.UP)
            moveVertical(-1);
        else if (current === Input.DOWN)
            moveVertical(1);
    }
    for (var y = map.length - 1; y >= 0; y--) {
        for (var x = 0; x < map[y].length; x++) {
            if ((map[y][x] === Tile.STONE || map[y][x] === Tile.FALLING_STONE)
                && map[y + 1][x] === Tile.AIR) {
                map[y + 1][x] = Tile.FALLING_STONE;
                map[y][x] = Tile.AIR;
            }
            else if ((map[y][x] === Tile.BOX || map[y][x] === Tile.FALLING_BOX)
                && map[y + 1][x] === Tile.AIR) {
                map[y + 1][x] = Tile.FALLING_BOX;
                map[y][x] = Tile.AIR;
            }
            else if (map[y][x] === Tile.FALLING_STONE) {
                map[y][x] = Tile.STONE;
            }
            else if (map[y][x] === Tile.FALLING_BOX) {
                map[y][x] = Tile.BOX;
            }
        }
    }
}
function draw() {
    var canvas = document.getElementById("GameCanvas");
    var g = canvas.getContext("2d");
    g.clearRect(0, 0, canvas.width, canvas.height);
    // Draw map
    for (var y = 0; y < map.length; y++) {
        for (var x = 0; x < map[y].length; x++) {
            if (map[y][x] === Tile.FLUX)
                g.fillStyle = "#ccffcc";
            else if (map[y][x] === Tile.UNBREAKABLE)
                g.fillStyle = "#999999";
            else if (map[y][x] === Tile.STONE || map[y][x] === Tile.FALLING_STONE)
                g.fillStyle = "#0000cc";
            else if (map[y][x] === Tile.BOX || map[y][x] === Tile.FALLING_BOX)
                g.fillStyle = "#8b4513";
            else if (map[y][x] === Tile.KEY1 || map[y][x] === Tile.LOCK1)
                g.fillStyle = "#ffcc00";
            else if (map[y][x] === Tile.KEY2 || map[y][x] === Tile.LOCK2)
                g.fillStyle = "#00ccff";
            if (map[y][x] !== Tile.AIR && map[y][x] !== Tile.PLAYER)
                g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
    // Draw player
    g.fillStyle = "#ff0000";
    g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}
function gameLoop() {
    var before = Date.now();
    update();
    draw();
    var after = Date.now();
    var frameTime = after - before;
    var sleep = SLEEP - frameTime;
    setTimeout(function () { return gameLoop(); }, sleep);
}
window.onload = function () {
    gameLoop();
};
var LEFT_KEY = "ArrowLeft";
var UP_KEY = "ArrowUp";
var RIGHT_KEY = "ArrowRight";
var DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", function (e) {
    if (e.key === LEFT_KEY || e.key === "a")
        inputs.push(Input.LEFT);
    else if (e.key === UP_KEY || e.key === "w")
        inputs.push(Input.UP);
    else if (e.key === RIGHT_KEY || e.key === "d")
        inputs.push(Input.RIGHT);
    else if (e.key === DOWN_KEY || e.key === "s")
        inputs.push(Input.DOWN);
});
