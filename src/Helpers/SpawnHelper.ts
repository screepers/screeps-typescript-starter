/**
 * Functions to help keep Spawn.Api clean go here
 */
export class SpawnHelper {
    /**
     * Groups the body parts -- e.g. WORK, WORK, CARRY, CARRY, MOVE, MOVE
     * @param descriptor A StringMap of creepbody limits -- { MOVE: 3, CARRY: 2, ... }
     */
    public static getBody_Grouped(descriptor: StringMap): BodyPartConstant[] {
        const creepBody: BodyPartConstant[] = [];
        _.forEach(Object.keys(descriptor), (part: BodyPartConstant) => {
            for (let i = 0; i < descriptor[part]; i++) {
                creepBody.push(part);
            }
        });
        return creepBody;
    }

    /**
     * Collates the body parts -- e.g. WORK, CARRY, MOVE, WORK, CARRY, ...
     * TODO Test this method -- Hard to test in a code only environment
     * @param descriptor A StringMap of creepbody limits -- { MOVE: 3, CARRY: 2, ... }
     */
    public static getBody_Collated(descriptor: StringMap): BodyPartConstant[] {
        const creepBody: BodyPartConstant[] = [];
        const numParts = _.sum(descriptor);
        const partNames = Object.keys(descriptor);
        const counts: StringMap = {};
        // Initialize Counts
        for(const part in partNames){
            counts[part] = 0;
        }

        while( creepBody.length < numParts ){
            
            for(const part in Object.keys(descriptor)){
                if(counts[part] < descriptor[part]){
                    creepBody.push(<BodyPartConstant>part);
                    counts[part]++;
                }
            }
        }

        return creepBody;
    }
}
