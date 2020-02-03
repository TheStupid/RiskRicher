import Drama from "./Drama";

export default class DramaManager {
    public static _instance:DramaManager = null;
    public static get instance():DramaManager{
        if(this._instance == null){
            this._instance = new DramaManager();
        }
        return this._instance;
    }

    private _mainDrama:Drama = null;
    private _curDrama:Drama = null;

    changeDrama(newDrama:Drama):void{
        
    }

    quitDrama():void{

    }
}