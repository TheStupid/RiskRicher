import MapData from "../../common/MapData";
import Sprite = Laya.Sprite;
import {SquareEffectAttributeId} from "./SquareEffectAttributeId";
import DisplayUtil from "../../common/DisplayUtil";

export default class SquareEffect {
    private _attributes: MapData = null;
    private _view:Sprite = null;

    public onPlayerStand(): void {

    }

    public onTouched(): void {

    }

    public update(attribute: MapData) {
        this._attributes = attribute;
        this._view = new Sprite();
    }

    public get view(): Sprite {
        return this._view;
    }

    public dispose(): void {
        DisplayUtil.stopAndRemove(this._view);
    }

    get attributes(): MapData {
        return this._attributes;
    }

    get type():number{
        return this._attributes.getNumber(SquareEffectAttributeId.type);
    }
}