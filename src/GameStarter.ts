import BaseConfig from "./config/BaseConfig";
import LayerManager from "./layer/LayerManager";
import CustomLoader from "./loader/CustomLoader";
import CustomLoaderEvent from "./loader/CustomLoaderEvent";
import SceneManager from "./scene/SceneManager";
import SceneConfig from "./scene/SceneConfig";
import DataCenter from "./data/DataCenter";

export default class GameStarter {
    constructor() {
    }

    start(): void {
        this.initLayerManager();
        this.loadNecessaryFiles();
    }

    private initLayerManager(): void {
        LayerManager.instance.init();
    }

    private loadNecessaryFiles(): void {
        CustomLoader.instance.on(CustomLoaderEvent.onLoadCompleted, this, this.onLoaded);
        CustomLoader.instance.load(BaseConfig.getNecessaryFiles());
    }

    private onLoaded() {
        let curFloor: number = DataCenter.instance.floor;
        SceneManager.instance.loadScene(SceneConfig.getSceneKey(curFloor));
    }
}