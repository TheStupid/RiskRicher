import Sprite = Laya.Sprite;
import SquareEffect from "./squareeffect/SquareEffect";

export default class Square extends Sprite {
    private _effect: SquareEffect = null;

    constructor() {
        super();
    }

    setEffect(newEffect: SquareEffect): void {
        if (this._effect && this._effect.type == newEffect.type) {
            this._effect = newEffect;
        } else {
            if (this._effect) {
                this._effect.dispose();
            }
            this.addChild(newEffect.view);
            this._effect = newEffect;
        }
    }

    clear():void{
        if(this._effect){
            this._effect.dispose();
        }
    }
}