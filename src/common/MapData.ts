import ConfuseInteger from "./ConfuseInteger";

export default class MapData {
    private _data: object = {};

    public setNumber(id: number, value: number): void {
        if (this._data[this.getKey(id)] == null) {
            this._data[this.getKey(id)] = new ConfuseInteger(value);
        } else {
            (this._data[this.getKey(id)] as ConfuseInteger).setValue(value);
        }
    }

    public getData(id: number): any {
        return this._data[this.getKey(id)];
    }

    public setData(id: number, value: any): void {
        if (typeof value == "number") {
            this.setNumber(id, value);
        } else {
            this._data[this.getKey(id)] = value;
        }
    }

    public getNumber(id: number): number {
        if (this._data[this.getKey(id)] != null) {
            return (this._data[this.getKey(id)] as ConfuseInteger).getValue();
        } else {
            return 0;
        }
    }

    private getKey(id: number): string {
        return id + "";
    }
}