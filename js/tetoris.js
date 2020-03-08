//canvas で使用する変数
var canvas;
var ctx;
//一つのブロックの大きさ
var SQUARE = 30;
//列
var COLS = 10;
//行
var ROWS = 20;
//エリアの大きさ
var WIDTH = COLS * SQUARE;
var HEIGHT = ROWS * SQUARE;

//ブロックを描く位置
var current_x = 0;
var current_y = 0;

//テトリミノ用の変数
var current_mino;

//ブロックの配置状況の保持
var fields = [];

window.onload = function () {
    //グリットを配列としてもつ
    for (var gy = 0; gy < ROWS; gy++) {
        //行ごとに配列を作る
        fields[gy] = [];
        for (var gx = 0; gx < COLS; gx++) {
            //列ごとに配列を作る 0 は該当するグリットに何もないことを意味する
            fields[gy][gx] = 0;
        }
    }
    //エリアの設定
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    //テトリミノをランダムで取得
    current_mino = getMino();
    //描写処理
    render();
    setInterval(changePosition, 1000);

    document.addEventListener("keydown", function (event) {
        //キーに関する処理を追加 キーを押してないとき
        if (event.keyCode == undefined || event.keyCode == null) {
            //何もしない
        }
        //左のカーソルを押したとき
        if (event.keyCode == 37 && allowMotion(-1, 0)) {
            current_x--;
        }
        //上のカーソルを押したとき
        if (event.keyCode == 38) {
            rotated = rotate(current_mino);
            if (allowMotion(0, 0, rotated)) {
                current_mino = rotated;
            }
        }
        //右のカーソルを押したとき
        if (event.keyCode == 39 && allowMotion(1, 0)) {
            current_x++;
        }
        //上のカーソルを押したとき
        if (event.keyCode == 40 && allowMotion(0, 1)) {
            current_y++;
        }
        //キーを押したらすぐに反映してほしいので、ここでも rendor を呼び出す
        render();
    });
};

//画像処理に関する関数
function render() {
    //全ての描写を削除する
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    //fix したところを都度描写する
    for (var y = 0; y < ROWS; y++) {
        for (var x = 0; x < COLS; x++) {
            drawBlock(x, y, fields[y][x]);
        }
    }
    //テトリミノの描写
    for (var my = 0; my < 4; my++) {
        for (var mx = 0; mx < 4; mx++) {
            drawBlock(current_x + my, current_y + my, current_mino[my][mx]);
        }
    }
}

//時間に応じたブロックの位置情報
function changePosition() {
    if (allowMotion(0, 1)) {
        current_y++;
    } else {
        fix();
        //fix する度にどこかの行がブロックで満たされているかを確認する
        clearFillInRows();
        //fix と列の削除が終わったら、新しいテトリミノを取得
        current_mino = getMino();
        //テトリミノの出現箇所の調整
        current_x = 3;
        current_y = 0;
    }
    render();
}

//ブロックを描写する関数
function drawBlock(x, y, doDrawing) {
    if (doDrawing) {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.fillRect(x * SQUARE, y * SQUARE, SQUARE, SQUARE);
        ctx.stroke();
    }
}

function allowMotion(move_x, move_y, rotate_mino) {
    //next_x には-1 から COLS(10)までの数字が入る
    var next_x = current_x + move_x;
    var next_y = current_y + move_y;
    //rotate_mino が最初にあるか調べて、あれば回転したテトリミノ、なければ現在のテトリミノを入れる
    var next_mino = rotate_mino || current_mino;
    //テトリミノのブロックのどれか一つでも条件を満たさなかった場合は false
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 4; x++) {
            if (next_mino[y][x]) {
                //ブロックの位置分を考慮して、各値に y か x の値を足しておく
                //左端は x が 0
                if (next_x + x < 0) {
                    return false;
                    //右端は x が COLS
                } else if (next_x + x >= COLS) {
                    return false;
                    //next_y が 20 より大きい場合は false
                } else if (next_y + y >= ROWS) {
                    return false;
                    //左側、もしくは右側に fix したブロックがあった場合も false
                } else if (fields[next_y + y][next_x + x]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function fix() {
    //fix するテトリミノの各ブロックの構成を調べて、全てのブロックを fix する
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 4; x++) {
            if (current_mino[y][x]) {
                fields[current_y + y][current_x + x] = 1;
            }
        }
    }
}

//一列揃ったかを調べて、揃っていたら列を削除する
function clearFillInRows() {
    //下の行から調べる。数字は大きい順
    for (y = ROWS - 1; y >= 0; y--) {
        //調べたい行がブロックで満たされているかのフラグ
        var fill = true;
        //列は小さい順(左から)調べる
        for (x = 0; x < COLS; x++) {
            //1 グリットでもブロックがない箇所があったら調べるのを止める
            if (fields[y][x] == 0) {
                fill = false;
                break;
            }
        }
        //満たしていた場合は行のブロックを消して、一段下げる
        if (fill) {
            clearRow(y);
            //行の削除が終わったら、調べる行を一段下げて、再度調べる
            y++;
        }
    }
}

function clearRow(y) {
    for (var v = y - 1; v >= 0; v--) {
        for (var x = 0; x < COLS; x++) {
            // 行を一つ下にずらす。対象より下の段は強制的に上書き v+1 で一列下を見る
            fields[v + 1][x] = fields[v][x];
        }
    }
}
