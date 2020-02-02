import StringUtil from '../common/StringUtil';
import BaseConfig from "../config/BaseConfig";
import GameConfig from "../GameConfig";
import Sprite = Laya.Sprite;
import Text = Laya.Text;

export default class LoadingSprite extends Sprite {
    protected _txtLoading: Text;

    protected _progress: number = -1;
    protected _loadingText: string;

    constructor() {
        super();
        this.mouseEnabled = true;
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

    protected initLoadingText(): void {
        this._txtLoading = new Text();
        this._txtLoading.font = BaseConfig.DEFAULT_FONT;
        this._txtLoading.align = "center";
        this._txtLoading.valign = "middle";
        this._txtLoading.fontSize = 20;
        this.x = GameConfig.width / 2;
        this.y = GameConfig.height / 2;
        this.addChild(this._txtLoading);
    }

    protected disposeProgressComponent(): void {
    }

    protected disposeLoadingText(): void {
        this._txtLoading = null;
    }

    protected onStageResize(): void {
    }
}