// src/services/UidInfosService.ts

import {Service} from "./Service";
import { EnkaClient } from "enka-network-api"
import {UidInfosInterface} from "../interfaces/UidInfosInterface";
import {UidInfoModel} from "../models/UidInfoModel";

/**
 * UidInfosService is a service class that extends the base Service class.
 * It is used to handle operations related to UID information.
 */

export  class UidInfosService extends Service {
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
            const enka = new EnkaClient()

            // Vérifier si l'UID est null
            if (uid === null) {
                return null;
            }

            return await enka.fetchUser(uid);

        } catch (error) {
            this.logError('Error getting Enka data:', String(error));
            return null;
        }
    }

// Méthode pour enregistrer les infos UID à partir d'un objet DetailedGenshinUser
    async registerUidInfosEnka(detailedUser: any): Promise<boolean> {
        try {
            if (!detailedUser || !detailedUser._data) {
                this.logError("Aucune donnée Enka valide reçue.");
                return false;
            }

            const data = detailedUser._data;
            const info = data.playerInfo;

            if (!info) {
                this.logError("Les informations du joueur sont manquantes.");
                return false;
            }

            // TODO : Refaire une gestion de profil d'utilisateur

            // Construction du champ towerFloor (ex: "12-3-9⭐")
            const towerFloor = `${info.towerFloorIndex ?? 0}-${info.towerLevelIndex ?? 0}-${info.towerStarIndex ?? 0}⭐`;

            // Construction de l’objet final
            const uid_infos: UidInfosInterface = {
                uid: data.uid,
                nickname: info.nickname ?? "Inconnu",
                level: info.level ?? 0,
                signature: info.signature ?? "",
                finishAchievementNum: info.finishAchievementNum ?? 0,
                towerFloor,
                affinityCount: info.fetterCount ?? 0,
                theaterAct: info.theaterActIndex ?? 0,
                theaterMode: String(info.theaterModeIndex ?? ""),
                worldLevel: info.worldLevel ?? 0,
                stygianIndex: info.stygianIndex ?? 0,
                stygianSeconds: info.stygianSeconds ?? 0,
            };

            // Enregistrement / mise à jour dans la base de données
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

