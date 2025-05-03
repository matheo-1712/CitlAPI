// GenshinCharacterInterface.ts

/**
 * GenshinCharacterInterface interface
 * @interfacedesc This interface represents a Genshin character interface.
**/

export interface GenshinCharacterInterface {
    id?: number;
    name: string;
    element: string;
    weapon: string;
    region: string;
    rarity: number;
    icon: string;
    ascensionStat?: string;
    formatedValue: string;
}