import CustomProgressBar from "../common/component/CustomProgressBar";
import FileLoader from './FileLoader';
import StringUtil from '../common/StringUtil';
import CommonRes from "../config/CommonRes";
import ProgressBar = Laya.ProgressBar;
import Sprite = Laya.Sprite;
import Text = Laya.Text;
import View = Laya.View;

export default class LoadingSprite extends Sprite {

    protected _res: View;
    protected _progressBar: ProgressBar | CustomProgressBar;
    protected _txtLoading: Text;

    protected _progress: number = -1;
    protected _loadingText: string;

    constructor() {
        super();
        this.mouseEnabled = true;
        this._res = new View();
        this._res.createView(FileLoader.getRes("loader/LoadingSprite.json"));
        this.addChild(this._res);
        this.initProgressComponent();
        this.initLoadingText();
        Laya.stage.on(Laya.Event.RESIZE, this, this.onStageResize);
        this.onStageResize();
    }

    /**
     * 设置进度
     */
    public setProgress(progress: number): void {
        this._progress = progress;
        this.refresh();
    }

    /**
     * 设置加载信息
     */
    public setLoadingText(text: string): void {
        if (this._txtLoading == null) {
            return;
        }
        this._loadingText = text;
        this.refresh();
    }

    private refresh(): void {
        if (this._loadingText) {
            this._txtLoading.text = this.getFormatLoadingText();
        }

        if (this._progressBar != null) {
            if(this._progressBar instanceof  ProgressBar){
                (this._progressBar as ProgressBar).value = this._progress / 100;
            }else{
                (this._progressBar as CustomProgressBar).value = this._progress / 100;
            }
        }
    }

    private getFormatLoadingText(): string {
        if (this._progress >= 0) {
            return this._loadingText + StringUtil.format("%d/100%", this._progress);
        } else {
            return this._loadingText;
        }
    }

    public dispose(): void {
        this.disposeProgressComponent();
        this.disposeLoadingText();
        Laya.stage.off(Laya.Event.RESIZE, this, this.onStageResize);
    }

    protected initProgressComponent(): void {
        this._progressBar = this.getChildByName("progressBar") as ProgressBar | CustomProgressBar;
        this._progress = 0;
        this.refresh();
    }

    protected initLoadingText(): void {
        this._txtLoading = this.getChildByName("txtLoading") as Text;
    }

    protected disposeProgressComponent(): void {
        this._progressBar = null;
    }

    protected disposeLoadingText(): void {
        this._txtLoading = null;
    }

    protected onStageResize(): void {
    }
}