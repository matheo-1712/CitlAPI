// src/repositories/InfographicRepository.ts

import { InfographicInterface } from "../interfaces/InfographicInterface";
import { Repository } from "./Repository";

/**
 * InfographicRepository class
 * @classdesc This class represents an infographic repository is used to manage the infographic data.
 * @extends Repository<InfographicInterface>
 */


export class InfographicRepository extends Repository<InfographicInterface> {
    constructor() {
        super("infographics");
    }

    // Méthode pour vérifier si une infographie existe déjà dans la base de données
    async exists(infographic: InfographicInterface): Promise<InfographicInterface | null> {
        const results = await super.query(`SELECT * FROM infographics WHERE id_genshin_character = ? AND jeu = ? AND build = ?`, [infographic.id_genshin_character, infographic.jeu, infographic.build]);
        return results.length > 0 ? results[0] : null;
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
        const results = await super.query(`SELECT * FROM infographics WHERE id_genshin_character = ? AND jeu = "GI`, [id]);
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


    // Méthode pour obtenir l'infographie par son ID de personnage (Honkai Star Rail)
    async getByIdHSR(id: number): Promise<InfographicInterface[] | null> {
        const results = await super.query(`SELECT * FROM infographics WHERE id_genshin_character = ? AND jeu = "HSR`, [id]);
        return results.length > 0 ? results : null;
    }
    // Méthode pour enregistrer une infographie (Honkai Star Rail)
    async saveHSR(data: InfographicInterface): Promise<void> {
        // Préparation de l'objet pour la base de données
        const infographicData = {
            id_hsr_character: data.id_hsr_character,
            jeu: "HSR",
            url: data.url,
            build: data.build,
            source: data.source,
        };
        await super.save(infographicData);
    }
}
