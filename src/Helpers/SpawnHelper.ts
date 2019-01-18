/**
 * Functions to help keep Spawn.Api clean go here
 */
export class SpawnHelper {
    public static getBody_Grouped(descriptor: StringMap): BodyPartConstant[] {
        const creepBody: BodyPartConstant[] = [];
        _.forEach(Object.keys(descriptor), (part: BodyPartConstant) => {
            for (let i = 0; i < descriptor[part]; i++) {
                creepBody.push(part);
            }
        });
        return creepBody;
    }
}
