import UIComponent = Laya.UIComponent;
import Image = Laya.Image;
import Sprite = Laya.Sprite;

/**
 * 自定义进度条
 * ligenhao
 */
export default class CustomProgressBar extends UIComponent {

    private static readonly BAR_TYPES: number = 4;
    private _bar: Image = null;
    private _type: number = 0;
    private _value: number = 0;
    private _originalX: number;
    private _originalY: number;
    private _isHorizontal:boolean;

    constructor() {
        super();
        this.once(Laya.Event.ADDED, this, () => {
            this.initComponents();
            if (this._type == ProgressBarType.PUSH_BY_SELF
                || this._type == ProgressBarType.PUSH_BY_RECT) {
                this._originalX = this._bar.x - this._bar.width;
                this._originalY = this._bar.y + this._bar.height;
            }
            this.changeValue();
        });
    }

    protected initComponents(): void {
        for (let i = 0; i < CustomProgressBar.BAR_TYPES; i++) {
            this._bar = this.getChildByName("bar_" + i) as Image;
            if (this._bar) {
                this._type = i;
                break;
            }
        }
        this._isHorizontal = this._bar.width > this._bar.height;
        let mask = new Sprite();
        if (this._type == ProgressBarType.PUSH_BY_SELF
            || this._type == ProgressBarType.CUT_BY_SELF) {
            mask.graphics = this._bar.graphics;
        } else {
            mask.graphics.drawRect(0, 0, this._bar.width, this._bar.height, "#000000");
        }
        this._bar.mask = mask;
    }

    /**
     *当前的进度量。
     *<p><b>取值：</b>介于0和1之间。</p>
     */
    public get value(): number {
        return this._value;
    }

    public set value(num: number) {
        if (this._value != num) {
            num = num > 1 ? 1 : num < 0 ? 0 : num;
            this._value = num;
            this.changeValue();
        }
    }

    private changeValue(): void {
        if (this._type == ProgressBarType.PUSH_BY_SELF
            || this._type == ProgressBarType.PUSH_BY_RECT) {
            if(this._isHorizontal){
                this._bar.x = this._originalX + this._bar.width * this._value;
                this._bar.mask.x = this._bar.width * (1 - this._value);
            }else{
                this._bar.y = this._originalY - this._bar.height * this._value;
                this._bar.mask.y = this._bar.height * (this._value - 1);
            }
        } else {
            if(this._isHorizontal){
                this._bar.mask.x = this._bar.width * (this._value - 1);
            }else{
                this._bar.mask.y = this._bar.height * (1 - this._value);
            }
        }
    }
}

const enum ProgressBarType {
    PUSH_BY_SELF,
    PUSH_BY_RECT,
    CUT_BY_SELF,
    CUT_BY_RECT
}