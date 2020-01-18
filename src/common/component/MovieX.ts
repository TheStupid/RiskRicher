import Sprite = Laya.Sprite;
import Event = laya.events.Event;

// WARNING: DO NOT USE
export default class MovieX extends Sprite {

    private _frameMap: object = {};
    private _frameMapReal: object = {};
    private _frameInfos: object = {};

    private _frameNow: number = 0;
    private _frameMax: number = 0;

    private _looping:boolean = true;

    private _noMin:number = 999999;
    private _noMax:number = 0;

    public constructor() {
        super();
        this.once(Laya.Event.ADDED, this, () => {
            this.fill();
            this.setFrame(1);
            this.on(Event.REMOVED, this, this.onRemoved);
            Laya.timer.loop(1, this, this.loop);
        });
    }

    public get currentFrame(): number {
        return this._frameNow;
    }

    public get totalFrame(): number {
        return this._frameMax;
    }

    public get isPlaying(): boolean {
        return this._looping;
    }

    // public get currentFrameLabel(): string {
    //     let label:string = null;
    //     let frame:Sprite = this._frameMap["f" + this._frameNow];
    //     for (let i:number = 0; i < frame.numChildren; i++) {
    //         let child: Sprite = <Sprite>frame.getChildAt(i);
    //         if (child.name.indexOf("__LABEL__") == 0) {
    //             label = child.name.substring("__LABEL__".length);
    //             break;
    //         }
    //     }
    //     return label;
    // }

    public stop():void {
        this._looping = false;
    }

    public play():void {
        this._looping = true;
    }

    private fill(): void {
        for (let i: number = 0; i < this.numChildren; i++) {
            let child: Sprite = <Sprite>this.getChildAt(i);
            let matcher:RegExpMatchArray = child.name.match(/frame([0-9]+)_([0-9]+)/);
            if (matcher == null) {
                continue;
            }
            let frame: number = parseInt(matcher[1]);
            let no: number = parseInt(matcher[2]);
            if (frame > this._frameMax) {
                this._frameMax = frame;
            }
            if (no > this._noMax) {
                this._noMax = no;
            }
            if (no < this._noMin) {
                this._noMin = no;
            }
            if (this._frameMap["f" + frame] == null) {
                this._frameMap["f" + frame] = {};
                this._frameMapReal["f" + frame] = {};
                this._frameInfos["f" + frame] = {};
            }
            this._frameMap["f" + frame]["n" + no] = child;
            this._frameMapReal["f" + frame]["n" + no] = child;
            this._frameInfos["f" + frame]["n" + no] = new Info(child, true);
        }
        if (this._frameMap["f1"] == null) {
            let child: Sprite = new Sprite();
            child.name = "frame1_0";
            this.addChild(child);
            this._frameMap["f1"] = { "n0":child };
            this._frameMapReal["f1"] = { "n0":child };
            this._frameInfos["f1"] = { "n0":new Info(child, true) };
            if (0 < this._noMin) {
                this._noMin = 0;
            }
        }

        //  ==================================================

        for (let i: number = 2; i <= this._frameMax; i++) {
            if (this._frameMap["f" + i] == null) {
                this._frameMap["f" + i] = this._frameMap["f" + (i - 1)];
                this._frameInfos["f" + i] = {};
            } else {
                for (const prop in this._frameMap["f" + (i - 1)]) {
                    if (this._frameMap["f" + i][prop] == null) {
                        this._frameMap["f" + i][prop] = this._frameMap["f" + (i - 1)][prop];
                    }
                }
            }
            for (const prop in this._frameInfos["f" + (i - 1)]) {
                if (this._frameInfos["f" + i][prop] == null) {
                    this._frameInfos["f" + i][prop] = (<Info>this._frameInfos["f" + (i - 1)][prop]).clone();
                }
            }
        }

        //  ==================================================

        for (let i: number = this._noMin; i <= this._noMax; i++) {
            let frameIds: number[] = [];
            let fixTween = () => {
                let keyFrameBegin: number = frameIds[0] - 1;
                let keyFrameEnd: number = frameIds[frameIds.length - 1] + 1;
                let divParts: number = frameIds.length + 1;
                let agvInfo: Info = new Info(this._frameMapReal["f" + keyFrameEnd]["n" + i])
                    .reduce(this._frameMapReal["f" + keyFrameBegin]["n" + i])
                    .divide(divParts);
                for (let k: number = 0; k < frameIds.length; k++) {
                    this._frameInfos["f" + frameIds[k]]["n" + i] = new Info(this._frameMapReal["f" + keyFrameBegin]["n" + i]).add(agvInfo.clone().multi(k));
                }
            };
            for (let j: number = 1; j <= this._frameMax; j++) {
                let info: Info = this._frameInfos["f" + j]["n" + i];
                if (info == null) {
                    continue;
                }
                if (!info.key) {
                    frameIds.push(j);
                } else if (frameIds.length > 0) {
                    fixTween();
                    frameIds = [];
                }
            }
        }
    }

    private setFrame(frame:number):void {
        this._frameNow = frame;
        for (const prop in this._frameMapReal) {
            for (const prop1 in this._frameMapReal[prop]) {
                (<Sprite>this._frameMapReal[prop][prop1]).visible = false;
            }
        }
        for (const prop1 in this._frameMap["f" + frame]) {
            (<Sprite>this._frameMap["f" + frame][prop1]).visible = true;
            (<Info>this._frameInfos["f" + frame][prop1]).fix(<Sprite>this._frameMap["f" + frame][prop1]);
            if ((<Sprite>this._frameMap["f" + frame][prop1]).getChildByName("__STOP__") != null) {
                this._looping = false;
            }
        }
    }

    private loop(): void {
        if (!this._looping) {
            return;
        }
        if ((++ this._frameNow) > this._frameMax) {
            this._frameNow = 1;
        }
        this.setFrame(this._frameNow);
    }

    private onRemoved(evt: Event): void {
        this.off(Event.REMOVED, this, this.onRemoved);
        Laya.timer.clear(this, this.loop);
    }

}

type InfoDef = { x: number, y: number, scaleX: number, scaleY: number, alpha: number };

class Info {

    public x: number;
    public y: number;
    public scaleX: number;
    public scaleY: number;
    public alpha: number;
    public readonly key: boolean;

    public constructor(def: InfoDef, key: boolean = false) {
        this.x = def.x;
        this.y = def.y;
        this.scaleX = def.scaleX;
        this.scaleY = def.scaleY;
        this.alpha = def.alpha;
        this.key = key;
    }

    public add(def: InfoDef): Info {
        this.x += def.x;
        this.y += def.y;
        this.scaleX += def.scaleX;
        this.scaleY += def.scaleY;
        this.alpha += def.alpha;
        return this;
    }

    public reduce(def: InfoDef): Info {
        this.x -= def.x;
        this.y -= def.y;
        this.scaleX -= def.scaleX;
        this.scaleY -= def.scaleY;
        this.alpha -= def.alpha;
        return this;
    }

    public multi(factor: number): Info {
        this.x *= factor;
        this.y *= factor;
        this.scaleX *= factor;
        this.scaleY *= factor;
        this.alpha *= factor;
        return this;
    }

    public divide(factor: number): Info {
        this.x /= factor;
        this.y /= factor;
        this.scaleX /= factor;
        this.scaleY /= factor;
        this.alpha /= factor;
        return this;
    }

    public clone(): Info {
        return new Info(this);
    }

    public fix(target:Sprite): void {
        target.x = this.x;
        target.y = this.y;
        target.scaleX = this.scaleX;
        target.scaleY = this.scaleY;
        target.alpha = this.alpha;
    }


}