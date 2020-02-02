import ConfuseInteger from "../common/ConfuseInteger";

export default class DataCenter {
    private static _instance:DataCenter = null;

    public static get instance():DataCenter{
        if(this._instance == null){
            this._instance = new DataCenter();
        }
        return this._instance;
    }

    private _floor:ConfuseInteger = new ConfuseInteger(1);

    constructor() {
    }

    public get floor():number{
        return this._floor.getValue();
    }
}