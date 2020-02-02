import Point = Laya.Point;

export default class SceneConfig {
    public static readonly SQUARE_WIDTH: number = 60;
    public static readonly BOARD_START_POSITION: Point = new Point(0, 0);

    public static readonly COLUMN_NUM: number = 7;
    public static readonly ROW_NUM: number = 8;
    private static readonly BOARD_0: Array<number> = [
        1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1
    ];

    public static getBoardLayer(id: number): Array<number> {
        return SceneConfig.BOARD_0;
    }

    public static getBoardId(sceneKey: string): number {
        return 0;
    }

    public static getSceneKey(floor: number): string {
        return "grassland";
    }

    public static getSceneName(key: string): string {
        return "草原";
    }
}