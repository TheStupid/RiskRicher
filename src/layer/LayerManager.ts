import Sprite = Laya.Sprite;
import LayerNames from "./LayerNames";
import Box = Laya.Box;
import GameConfig from "../GameConfig";

export default class LayerManager {
    private static _instance:LayerManager = null;
    public static get instance():LayerManager{
        if(this._instance == null){
            this._instance = new LayerManager();
        }
        return this._instance;
    }

    init():void{
        let layers:Array<string> = [LayerNames.BOTTON_LAYER,LayerNames.MID_LAYER,LayerNames.TOP_LAYER];
        for(let layerName of layers){
            this.addLayer(layerName,Laya.stage);
        }
    }

    private addLayer(layerName:string,container:Sprite):void{
        let bLayer:Box = new Box();
        bLayer.size(GameConfig.width,GameConfig.height);
        bLayer.name = layerName;
        container.addChild(bLayer);
    }

    getLayer(layerName:string):Box{
        return Laya.stage.getChildByName(layerName) as Box;
    }
}