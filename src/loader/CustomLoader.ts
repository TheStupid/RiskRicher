import Handler = Laya.Handler;
import EventDispatcher = Laya.EventDispatcher;
import LoadingSprite from "./LoadingSprite";
import LayerManager from "../layer/LayerManager";
import LayerNames from "../layer/LayerNames";
import DisplayUtil from "../common/DisplayUtil";
import FileLoader from "./FileLoader";
import CustomLoaderEvent from "./CustomLoaderEvent";
import LoadTask from "./LoadTask";

export default class CustomLoader extends EventDispatcher {
    private static _instance: CustomLoader = null;
    public static get instance(): CustomLoader {
        if (this._instance == null) {
            this._instance = new CustomLoader();
        }
        return this._instance;
    }

    /** 提示框 */
    private _loadingSprite: LoadingSprite;

    private _loadTaskList: Array<LoadTask> = [];

    constructor() {
        super();
    }

    /**
     * 启动文件下载
     * @param    loadList            要下载的文件列表
     * @param    message                下载提示语
     **/
    public load(url: string | string[], message: string = "文件下载中，请稍候……"): void {
        let task: LoadTask = new LoadTask(url, message);

        if (this.isLoading) {
            this._loadTaskList.push(task);
        } else {
            this.startLoadTask(task);
        }
    }

    private onLoadTaskEnd(): void {
        if (this._loadTaskList.length > 0) {
            this.startLoadTask(this._loadTaskList.shift())
        } else {
            this.onCompleted();
        }
    }

    private startLoadTask(task: LoadTask): void {
        if (this._loadingSprite == null) {
            this._loadingSprite = new LoadingSprite();
            this._loadingSprite.setLoadingText(task.loadText);
            LayerManager.instance.getLayer(LayerNames.TOP_LAYER).addChild(this._loadingSprite);
        }

        FileLoader.load(task.url, Handler.create(this, this.onLoadTaskEnd), Handler.create(this, this.onProgress, null, false));
    }

    public close(): void {
        if (this._loadingSprite != null) {
            this._loadingSprite.dispose();
            DisplayUtil.stopAndRemove(<any>this._loadingSprite);
            this._loadingSprite = null;
        }
    }

    private onCompleted(): void {
        this.close();
        this.event(CustomLoaderEvent.onLoadCompleted);
    }

    private onProgress(value: number): void {
        if (this._loadingSprite != null) {
            this._loadingSprite.setProgress(Math.floor(value * 100));
        }
    }

    public get isLoading(): boolean {
        return this._loadingSprite != null;
    }
}