import Handler = Laya.Handler;
import EventDispatcher = Laya.EventDispatcher;
import LoadingSprite from "./LoadingSprite";
import LayerManager from "../layer/LayerManager";
import LayerNames from "../layer/LayerNames";
import DisplayUtil from "../common/DisplayUtil";
import FileLoader from "./FileLoader";
import CustomLoaderEvent from "./CustomLoaderEvent";

export default class CustomLoader extends EventDispatcher {
    private loadList: Object[];

    /** 下载后是否自动关闭 */
    private autoClose: boolean;

    /** 提示框 */
    private _loadingSprite: LoadingSprite;

    /** 下载提示语 */
    private message: string;

    constructor() {
        super();
    }

    public get loadingSprite(): LoadingSprite {
        return this._loadingSprite;
    }

    /**
     * 启动文件下载
     * @param    loadList            要下载的文件列表
     * @param    loadingSpritType    下载提示框类型
     * @param    autoClose            下载完后自动关闭提示窗口，默认为true
     * @param    message                下载提示语
     * @param    name                下载需要获取的类名
     **/
    public load(loadList: Object[], loadingSprite: LoadingSprite, autoClose: boolean = true, message: string = "请稍等……"): void {
        this.loadList = loadList;
        this.message = message;
        this.autoClose = autoClose;
        this._loadingSprite = new LoadingSprite();

        if (this._loadingSprite != null) {
            this._loadingSprite.setLoadingText(message);
            LayerManager.instance.getLayer(LayerNames.TOP_LAYER).addChild(this._loadingSprite);
        }

        if (loadList.length > 0) {
            this.loadFiles();
        } else {
            this.onCompleted();
        }
    }

    public close(): void {
        if (this._loadingSprite != null) {
            this._loadingSprite.dispose();
            DisplayUtil.stopAndRemove(<any>this._loadingSprite);
            this._loadingSprite = null;
        }
    }

    private loadFiles(): void {
        FileLoader.load(this.loadList
            , Handler.create(this, this.onCompleted)
            , Handler.create(this, this.onProgress, null, false));
    }

    private onCompleted(): void {
        if (this.autoClose) {
            this.close();
        }
        this.event(CustomLoaderEvent.onLoadCompleted);
    }

    private onProgress(value: number): void {
        if (this._loadingSprite != null) {
            this._loadingSprite.setProgress(Math.floor(value * 100));
        }
    }
}