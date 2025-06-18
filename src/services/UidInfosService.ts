// src/services/UidInfosService.ts

import {Service} from "./Service";
import {Wrapper} from 'enkanetwork.js';
import {UidInfosInterface} from "../interfaces/UidInfosInterface";

/**
 * UidInfosService is a service class that extends the base Service class.
 * It is used to handle operations related to UID information.
 */

export  class UidInfosService extends Service{
    constructor() {
        super('Uid - Infos - Service');
    }

    async fetchUidInfos(uid_genshin: string | null): Promise<void> {
        // Fetch UID infos from Genshin API
        try {

        } catch (error) {

        }

    }

    // Method to get Enka data
    async getEnkaData(uid: string): Promise<any> {
        try {
            // Récupérer les informations du joueur pour Genshin 
            const { genshin } = new Wrapper();

            return await genshin.getPlayer(uid);

        } catch (error) {
            this.logError('Error getting Enka data:', String(error));
            return null;
        }
    }

    // Method to register UID infos
    async registerUidInfosEnka(data: any): Promise<boolean> {
        try {
            const towerFloor = data.player.abyss.floor + "-" + data.player.abyss.chamber + "-" + data.player.abyss.stars + '⭐';

            // Ajouter les informations de l'utilisateur
            const uid_infos: UidInfosInterface = {
                uid: data.uid,
                nickname: data.player.username,
                level: Number(data.player.levels.rank),
                signature: data.player.signature,
                finishAchievementNum: data.player.achievements,
                towerFloor: towerFloor,
                affinityCount: data.player.maxFriendshipCount,
                theaterAct: Number(data.player.theaterAct),
                theaterMode: data.player.theaterMode,
                worldLevel: Number(data.player.levels.world),
                playerIcon: data.player.profilePicture.assets.icon
            }

            if (await UidInfos.exists(uid_infos.uid)) {
                try {
                    await UidInfos.update(uid_infos);
                    return true;
                } catch (error) {
                    this.logError("Erreur lors de la mise à jour des informations de l'UID:", String(error));
                    return false;
                }

            } else {
                // Ajouter les informations de l'utilisateur
                try {
                    await UidInfos.add(uid_infos);
                    return true;
                } catch (error) {
                    this.logError("Erreur lors de l'ajout des informations de l'UID:", String(error));
                    return false;
                }
            }

        } catch (error) {
            this.logError("Erreur lors de la mise à jour des informations pour l'utilisateur:", String(error));
            return false;
        }
    }

    // Method to register characters
    async registerCharactersEnka(data: any): Promise<boolean> {
        try {
            for (const characterData of data.player.showcase) {
                const character: PlayerCharacter = {
                    uid_genshin: data.uid,
                    character_id: Number(characterData.characterId),
                    name: characterData.name,
                    element: characterData.element,
                    level: Number(characterData.level),
                    constellations: characterData.constellations,
                    icon: characterData.assets.icon,
                }

                const characterExists = await PlayerCharacter.exists(character.uid_genshin, character.character_id);
                if (characterExists) {
                    try {
                        await PlayerCharacter.update(character);
                    } catch (error) {
                        this.logError("Erreur lors de la mise à jour du personnage:", String(error));
                    }
                } else {
                    try {
                        await PlayerCharacter.add(character);
                    } catch (error) {
                        this.logError("Erreur lors de l'ajout du personnage:", String(error));
                    }
                }
            }
            return true;

        } catch (error) {
            this.logError("Erreur lors de la mise à jour des informations pour l'utilisateur:", String(error));
            return false;
        }
    }
}
