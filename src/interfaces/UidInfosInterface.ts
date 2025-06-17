// src/interfaces/UidInfosInterface.ts

/**
 * UidInfosInterface interface
 * @interfacedesc This interface represents a UidInfos interface.
 * @author matheo-1712
 */

export interface UidInfosInterface {
    id?: number,
    uid: string,
    nickname: string,
    level: number,
    worldLevel: number,
    signature: string,
    finishAchievementNum: number,
    towerFloor: string,
    affinityCount: number,
    theaterAct: number,
    theaterMode: string,
    playerIcon: string,
}