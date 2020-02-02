import Image = Laya.Image;
import Sprite = Laya.Sprite;
import Board from "./Board";
import SceneConfig from "./SceneConfig";

export default class Scene extends Sprite {
    private _name: string;
    private _key: string;
    private _imgBG: Image = null;
    private _board: Board = null;
    private _container: Sprite = null;

    constructor() {
        super();
        this._imgBG = new Image();
        this._board = new Board();
        this._container = new Sprite();

        this.addChild(this._imgBG);
        this.addChild(this._board);
        this.addChild(this._container);
    }

    reset(key: string, name: string): void {
        this._key = key;
        this._name = name;
        this._board.reset(SceneConfig.getBoardId(this._key));
    }
}