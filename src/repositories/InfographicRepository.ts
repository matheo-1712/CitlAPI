// src/repositories/InfographicRepository.ts

import { InfographicInterface } from "../interfaces/InfographicInterface";
import { Repository } from "./Repository";
import {GenshinCharacterRepository} from "./GenshinCharacterRepository";

/**
 * InfographicRepository class
 * @classdesc This class represents an infographic repository is used to manage the infographic data.
 * @extends Repository<InfographicInterface>
 */


export class InfographicRepository extends Repository<InfographicInterface> {
    constructor() {
        super("infographics");
    }

    // Méthode pour obtenir toutes les infographies
    async getAll(): Promise<InfographicInterface[] | null> {
        const results = await super.findAll();
        return results.length > 0 ? results : null;
    }

    // Méthode pour vérifier si une infographie existe déjà dans la base de données
    async exists(infographic: InfographicInterface): Promise<InfographicInterface | null> {
        const results = await super.query(`SELECT * FROM infographics WHERE id_genshin_character = ? AND jeu = ? AND build = ?`, [infographic.id_genshin_character, infographic.jeu, infographic.build]);
        return results.length > 0 ? results[0] : null;
    }

    // Méthode pour obtenir l'infographie d'un Jeu spécifique
    async getByJeu(jeu: string): Promise<InfographicInterface[] | null> {
        const results = await super.query(`SELECT * FROM infographics WHERE jeu = ?`, [jeu]);
        return results.length > 0 ? results : null;
    }

    // Méthode pour mettre à jour une infographie
    async updateInfographic(infographic: InfographicInterface): Promise<boolean> {
        try {
            if (infographic.id !== undefined) {
                await super.update(infographic.id, infographic);
            } else {
                throw new Error("Infographic ID is undefined.");
            }
            return true
        } catch (error) {
            console.error("Error updating infographic:", error);
            throw error;
        }
    }

    // Méthode pour obtenir l'infographie par son ID de personnage (Genshin Impact)
    async getByIdGI(id: number): Promise<InfographicInterface[] | null> {
        const results = await super.query(`SELECT * FROM infographics WHERE id_genshin_character = ? AND jeu = "GI"`, [id]);
        return results.length > 0 ? results : null;
    }

    // Méthode pour enregistrer une infographie (Genshin Impact)
    async saveGI(data: InfographicInterface): Promise<void> {
        // Préparation de l'objet pour la base de données
        const infographicData = {
            id_genshin_character: data.id_genshin_character,
            jeu: "GI",
            url: data.url,
            build: data.build,
            source: data.source,
        };
        await super.save(infographicData);
    }

    // Méthode pour enregistrer une infographie (Genshin Impact)
    async saveGiByPlayerValue(data: InfographicInterface): Promise<void> {
        const repositoryGiCharacter = new GenshinCharacterRepository();
        const repositoryInfographic = new InfographicRepository();

        const character = await repositoryGiCharacter.getByFormatedValue(data.formatedValue);
        if (!character) {
            console.warn(`⚠️ Aucun personnage trouvé pour ${data.formatedValue}`);
            return;
        }

        const infographicData = {
            id_genshin_character: character.id,
            jeu: "GI",
            url: data.url,
            build: data.build,
            source: data.source,
        };

        // ✅ Recherche de l'infographie existante
        const existing = await repositoryInfographic.findOne({
            where: {
                id_genshin_character: character.id,
                build: data.build,
            },
        });

        if (existing && existing.id !== undefined) {
            // Mise à jour
            await repositoryInfographic.update(existing.id, infographicData);
            console.log(`🔁 Infographie mise à jour pour ${character.name} (${data.build})`);
        } else {
            // Création
            await repositoryInfographic.save(infographicData);
            console.log(`🆕 Nouvelle infographie enregistrée pour ${character.name} (${data.build})`);
        }
    }

    private async findOne(param: { where: { id_genshin_character: number; build: string } }) {
        const { id_genshin_character, build } = param.where;

        // Exemple avec un query builder ou pool MySQL
        const result = await super.query(
            `SELECT * FROM infographics WHERE id_genshin_character = ? AND build = ? LIMIT 1`,
            [id_genshin_character, build]
        );

        if (result.length > 0) {
            return result[0]; // retourne l'objet existant
        }

        return null; // rien trouvé
    }

}
