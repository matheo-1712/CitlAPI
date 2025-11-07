// src/interfaces/InfographicInterface.ts

/**
 * GenshinCharacterInterface interface
 * @interfacedesc This interface represents a Infographic interface.
 * @author matheo-1712
 **/


export interface InfographicInterface {
    id?: number;
    id_genshin_character?: number;
    id_hsr_character?: number;
    url: string;
    build: string;
    source: string;
    jeu: string;
    formatedValue?: string;
}