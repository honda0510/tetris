//様々なテトリミノのパターン
var MINOS = [
    [
        [1, 1, 1, 1],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 1, 1],
        [0, 1, 1, 0]
    ],
    [
        [0, 1, 1, 0],
        [0, 1, 1, 0]
    ],
    [
        [1, 1, 0, 0],
        [0, 1, 1, 0]
    ],
    [
        [0, 1, 0, 0],
        [1, 1, 1, 0]
    ],
    [
        [0, 0, 0, 1],
        [0, 1, 1, 1]
    ],
    [
        [1, 0, 0, 0],
        [1, 1, 1, 0]
    ]
];

function getMino() {
    //MINOS からランダムで id を取得する
    var id = Math.floor(Math.random() * MINOS.length);
    var mino = [];
    for (var y = 0; y < 2; y++) {
        mino[y] = [];
        for (var x = 0; x < 4; x++) {
            mino[y][x] = 0;
            if (MINOS[id][y]) {
                if (MINOS[id][y][x]) {
                    mino[y][x] = 1;
                }
            }
        }
    }
    return mino;
}

function rotate(mino) {
    var rotated = [];
    for (var y = 0; y < 4; y++) {
        rotated[y] = [];
        for (var x = 0; x < 4; x++) {
            rotated[y][x] = mino[x][-y + 3];
        }
    }
    return rotated;
}
