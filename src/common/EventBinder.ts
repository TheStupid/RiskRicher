/**
 * 事件绑定器（适合自动或手动一次性解绑监听函数）
 *
 * @author chenminwei
 */
import EventDispatcher = Laya.EventDispatcher;


export default class EventBinder {
    private _items: BinderItem[];
    private _attachingThis: any;

    /**
     * @param attachingObject 关联显示对象，当显示对象从舞台移除时解绑所有监听函数，<br>
     *
     * <font color="#FF0000"><b>NOTE</b></font>:any 当 attachingObject 不为 null 时，不能通过本类往 attachingObject 绑定 Event.REMOVED_FROM_STAGE 事件
     */
    public constructor(attachingObject: EventDispatcher = null, attachingThis: any = null) {
        this._items = [];
        this._attachingThis = attachingThis;
        if (attachingObject != null) {
            this.attachDisplayObject(attachingObject);
        }
    }

    /**
     * 绑定监听函数
     */
    public bind(target: EventDispatcher,
                type: string,
                listener: Function,
                caller: any = null,
                layaArgs:Array<any> = null): EventBinder {
        this._items.push(new BinderItem(target, type, listener, caller != null ? caller : this._attachingThis, layaArgs));
        return this;
    }

    /**
     * 解绑监听函数
     */
    public unBind(target: EventDispatcher ,
                  type: string,
                  listener: Function,
                  caller: any = null): EventBinder {
        for (var i: number = 0; i < this._items.length; i++) {
            if (this._items[i].unBindIfMatch(target, type, listener, caller != null ? caller : this._attachingThis)) {
                this._items.splice(i, 1);
                break;
            }
        }
        return this;
    }

    /**
     * 解绑所有监听函数
     */
    public unBindAll(): void {
        for (var item of this._items) {
            item.unBind();
        }
    }

    /**
     * 关联显示对象，当显示对象从舞台移除时解绑所有监听函数
     */
    public attachDisplayObject(object: EventDispatcher): void {
        this.bind(object, Laya.Event.REMOVED, this.onRemovedFromStage, this, null);
    }

    private onRemovedFromStage(): void {
        this.unBindAll();
    }

}

class BinderItem {
    private _target:EventDispatcher;
    private _type: string;
    private _listener: Function;
    private _caller: any;

    public constructor(target:EventDispatcher,
                       type: string,
                       listener: Function,
                       caller: any,
                       layaArgs: Array<any>) {
        this._target = target;
        this._type = type;
        this._listener = listener;
        this._caller = caller;
        target.on(type, caller, listener, layaArgs);
    }

    public unBind(): void {
        this._target.off(this._type, this._caller, this._listener);
    }

    public unBindIfMatch(target: EventDispatcher,
                         type: string,
                         listener: Function,
                         caller: any): boolean {
        if (this._target == target && this._type == type && this._listener == listener && this._caller == caller) {
            this.unBind();
            return true;
        }
        return false;
    }
}