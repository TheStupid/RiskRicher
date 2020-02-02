import Scene from "./Scene";
import LayerManager from "../layer/LayerManager";
import LayerNames from "../layer/LayerNames";
import SceneConfig from "./SceneConfig";

export default class SceneManager {
    public static _instance: SceneManager = null;
    public static get instance(): SceneManager {
        if (this._instance == null) {
            this._instance = new SceneManager();
        }
        return this._instance;
    }

    //有两种，一种是楼层场景，一种是特殊场景(副本)
    private _scene: Scene = null;

    constructor() {
        this.init();
    }

    init(): void {
    }

    loadScene(key: string): void {
        if (this._scene == null) {
            this._scene = new Scene();
            LayerManager.instance.getLayer(LayerNames.MID_LAYER).addChild(this._scene);
        }

        this._scene.reset(key, SceneConfig.getSceneName(key));
    }
}