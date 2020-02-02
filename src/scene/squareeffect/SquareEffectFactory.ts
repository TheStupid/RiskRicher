import SquareEffect from "./SquareEffect";
import MapData from "../../common/MapData";

export default class SquareEffectFactory {
    public static getSquareEffect(type: number, param: MapData): SquareEffect {
        let effect: SquareEffect = null;
        switch (type) {

        }
        effect.update(param);
        return effect;
    }
}