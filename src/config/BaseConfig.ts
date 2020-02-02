import CommonRes from "./CommonRes";

export default class BaseConfig {
    private static readonly GAME_CH_NAME:string = "魔物讨伐者";
    public static readonly MIN_LEVEL:number = 1;
    public static readonly MAX_LEVEL:number = 999;
    public static readonly MIN_DAMAGE:number = 0;

    private static readonly NECESSARY_FILES:Array<string> = [
        CommonRes.URL_COMMON,
        CommonRes.URL_IMG_BLACK
    ];
    public static getNecessaryFiles():Array<string>{
        return BaseConfig.NECESSARY_FILES;
    }

    public static readonly DEFAULT_FONT:string = "SimSun";
}