import Square from "./Square";
import SceneConfig from "./SceneConfig";
import Sprite = Laya.Sprite;
import DisplayUtil from "../common/DisplayUtil";

export default class Board extends Sprite {
    public static toPixelX(boardX: number): number {
        return boardX * SceneConfig.SQUARE_WIDTH + SceneConfig.BOARD_START_POSITION.x;
    }

    public static toPixelY(boardY: number): number {
        return boardY * SceneConfig.SQUARE_WIDTH + SceneConfig.BOARD_START_POSITION.y;
    }

    public static toBoardX(pixelX: number): number {
        return Math.floor((pixelX - SceneConfig.BOARD_START_POSITION.x) / SceneConfig.SQUARE_WIDTH);
    }

    public static toBoardY(pixelY: number): number {
        return Math.floor((pixelY - SceneConfig.BOARD_START_POSITION.y) / SceneConfig.SQUARE_WIDTH);
    }

    private _id: number = -1;

    constructor() {
        super();
    }

    get id(): number {
        return this._id;
    }

    getSquare(boardX: number, boardY: number): Square {
        return this.getChildByName(boardX + "_" + boardY) as Square;
    }

    addSquare(square: Square): void {
        this.addChild(square);
    }

    public reset(id: number): void {
        this._id = id;
        let boardLayer: Array<number> = SceneConfig.getBoardLayer(id);
        let column: number = SceneConfig.COLUMN_NUM;
        let row: number = SceneConfig.ROW_NUM;
        let layerIndex: number;
        for (let i: number = 0; i < row; i++) {
            for (let k: number = 0; k < column; k++) {
                layerIndex = i * column + k;
                let haveSquare: boolean = boardLayer[layerIndex] > 0;
                let square: Square = this.getSquare(k, i);
                if (square) {
                    square.clear();
                    if (!haveSquare) {
                        DisplayUtil.stopAndRemove(square);
                    }
                } else if (haveSquare) {
                    square = new Square();
                    square.x = Board.toPixelX(k);
                    square.y = Board.toPixelY(i);
                    this.addChild(square);
                }
            }
        }
    }
}