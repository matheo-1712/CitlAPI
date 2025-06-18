// src/services/UidInfosService.ts

import {Service} from "./Service";
import {Wrapper} from 'enkanetwork.js';
import {UidInfosInterface} from "../interfaces/UidInfosInterface";
import {UidInfoModel} from "../models/UidInfoModel";

/**
 * UidInfosService is a service class that extends the base Service class.
 * It is used to handle operations related to UID information.
 */

export  class UidInfosService extends Service{
    constructor(
        private readonly model: UidInfoModel = new UidInfoModel({}),
    ) {
        super('Uid - Infos - Service');
    }

    async fetchUidInfos(uid_genshin: string | null): Promise<void> {
        // Fetch UID infos from Genshin API
        try {
            // Récupérer les informations du joueur pour Genshin
            this.getEnkaData(uid_genshin).then((data) => {
                this.registerUidInfosEnka(data);
            });

        } catch (error) {

        }
    }

    // Method to get Enka data
    async getEnkaData(uid: string | null): Promise<any> {
        try {
            // Récupérer les informations du joueur pour Genshin 
            const { genshin } = new Wrapper();

            // Vérifier si l'UID est null
            if (uid === null) {
                return null;
            }

            return await genshin.getPlayer(uid);

        } catch (error) {
            this.logError('Error getting Enka data:', String(error));
            return null;
        }
    }

    // Method to register UID infos
    async registerUidInfosEnka(data: any): Promise<boolean> {
        try {
            // Verify data existence
            if (!data || !data.player) {
                return false;
            }

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

            try {
                if (await this.model.exists(uid_infos.uid)) {
                    const id = await this.model.getIdByUid(uid_infos.uid);
                    if (id) {
                        await this.model.update(id, uid_infos);
                        return true;
                    }
                    return false;
                } else {
                    await this.model.create(uid_infos);
                    return true;
                }
            } catch (error) {
                this.logError("Erreur lors de la gestion des informations de l'UID:", String(error));
                return false;
            }
        } catch (error) {
            this.logError("Erreur lors de la mise à jour des informations pour l'utilisateur:", String(error));
            return false;
        }
    }
}
