import BaseConfig from "./config/BaseConfig";
import LayerManager from "./layer/LayerManager";

export default class GameStarter {
    constructor() {
    }

    start():void{
        this.initLayerManager();
        this.loadNecessaryFiles();
    }

    private initLayerManager():void{
        LayerManager.instance.init();
    }

    private loadNecessaryFiles(): void {
        // Laya.loader.load(BaseConfig.getNecessaryFiles(), Laya.Handler.create(this, () => {
        // }), Laya.Handler.create(this, (progress: number) => {
        // }));
    }
}