export default class LoadTask {
    private readonly _loadText:string;
    private readonly _url:string | string[];

    constructor(url:string |string[],message:string) {
        this._url = url;
        this._loadText = message;
    }

    get url():string | string[]{
        return this._url;
    }

    get loadText(): string {
        return this._loadText;
    }
}