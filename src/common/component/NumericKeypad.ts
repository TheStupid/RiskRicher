import ClickHelper from '../helper/ClickHelper';
import FileLoader from '../../loader/FileLoader';
import Loading from '../Loading';
import DialogManager from '../dialog/DialogManager';
import IDispose from '../../interfaces/IDispose';
import {PanelEffect} from '../dialog/PanelEffect';
import {LayoutType} from '../LayoutType';
import {AlignType} from '../AlignType';
import Handler = Laya.Handler;
import Sprite = Laya.Sprite;
import Point = Laya.Point;
import View = Laya.View;
import Text = Laya.Text;

/**
 * 数字键盘
 * @author ligenhao
 * @export
 * @class NumericKeypad
 * @extends {View}
 * @implements {IDispose}
 */
export default class NumericKeypad extends View implements IDispose {

    private static readonly URL_VIEW: string = "common/component/NumericKeypad.json";
    private static readonly URL_RES: string = "common/component/numerickeypad.atlas";

    private _target: Text;
    private _callback: Function;
    private _maxLength: number;
    private _clickHelper: ClickHelper;
    private _originalStr: string;
    private _layoutType: LayoutType;
    private _xOffset: number;
    private _yOffset: number;
    private _isOk: boolean = false;

    public constructor(target: Text, callback: Function, maxLength: number = 4) {
        super();
        this._target = target;
        this._callback = callback;
        this._maxLength = maxLength;
        this._originalStr = target.text;
    }

    public dispose(): void {
        if (this._clickHelper) {
            this._clickHelper.dispose();
            this._clickHelper = null;
        }
    }

    /**
     * @author ligenhao
     * @param {LayoutType} [layoutType=LayoutType.SOUTH] 相对文本布局方向
     * @param {number} [xOffset=0] x轴偏移坐标
     * @param {number} [yOffset=0] y轴偏移坐标
     * @memberof NumericKeypad
     */
    public show(layoutType: LayoutType = LayoutType.SOUTH, xOffset: number = 0, yOffset: number = 0): void {
        this._layoutType = layoutType;
        this._xOffset = xOffset;
        this._yOffset = yOffset;
        Loading.show();
        FileLoader.load([NumericKeypad.URL_VIEW, NumericKeypad.URL_RES], Handler.create(this, this.initComponents));
    }

    private initComponents(): void {
        Loading.close();
        this.createView(FileLoader.getRes(NumericKeypad.URL_VIEW));
        let point = this.getPoint();
        DialogManager.instance.addDialog(this, AlignType.NONE, PanelEffect.NONE, false,
            point.x + this._xOffset, point.y + this._yOffset, true);
        this._target.text = "";
        this.addListeners();
    }

    private addListeners(): void {
        this._clickHelper = new ClickHelper(this);
        this._clickHelper.regRegexFunc("btn_[0-9]", this.onClickNumber, this);
        this._clickHelper.regClickFunc("btn_back", this.onClickBack, this);
        this._clickHelper.regClickFunc("btn_ok", this.onClickOk, this);
        this.once(Laya.Event.REMOVED, this, () => {
            this._isOk = true;
            var str = this._isOk ? this._target.text : "";
            this._target.text = this._originalStr;
            this._callback(str);
        });
    }

    private onClickNumber(targetName: string): void {
        var num: string = targetName.split("_")[1];
        var length: number = this._target.text.length;
        if (length >= this._maxLength) {
            return;
        }
        this._target.text = this._target.text + num;
    }

    private onClickBack(): void {
        var str: string = this._target.text;
        if (str.length > 0) {
            this._target.text = str.substr(0, str.length - 1);
        }
    }

    private onClickOk(): void {
        this._isOk = true;
        DialogManager.instance.removeDialog(this);
    }

    private getPoint(): Point {
        var point = (this._target.parent as Sprite).localToGlobal(new Point(this._target.x, this._target.y));
        //左边
        if (this._layoutType == LayoutType.WEST || this._layoutType == LayoutType.NORTHWEST || this._layoutType == LayoutType.SOUTHWEST) {
            point.x -= this.width;
        }
        //右边
        if (this._layoutType == LayoutType.EAST || this._layoutType == LayoutType.NORTHEAST || this._layoutType == LayoutType.SOUTHEAST) {
            point.x += this._target.width;
        }
        if (this._layoutType == LayoutType.WEST || this._layoutType == LayoutType.EAST) {//左中或右中
            point.y -= (this.height - this._target.height) / 2;
        }
        //上边
        if (this._layoutType == LayoutType.NORTH || this._layoutType == LayoutType.NORTHWEST || this._layoutType == LayoutType.NORTHEAST) {
            point.y -= this.height;
        }
        //下边
        if (this._layoutType == LayoutType.SOUTH || this._layoutType == LayoutType.SOUTHWEST || this._layoutType == LayoutType.SOUTHEAST) {
            point.y += this._target.height;
        }
        if (this._layoutType == LayoutType.NORTH || this._layoutType == LayoutType.SOUTH) {//上中或下中
            point.x -= (this.width - this._target.width) / 2;
        }
        return point;
    }
}