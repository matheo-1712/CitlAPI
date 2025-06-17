// src/models/InfographicModel.ts

import { InfographicInterface } from "../interfaces/InfographicInterface";
import { ModelInterface } from "../interfaces/ModelInterface";
import { InfographicRepository } from "../repositories/InfographicRepository";
import { Model } from "./Model";

/**
 * InfographicModel class
 * @extends Model
 * @implements ModelInterface<InfographicModel>, InfographicInterface
 * @classdesc This class represents an Infographic model.
 * @sql_table_name infographics
 * @sql_table_fields id, id_genshin_character, jeu, url, build, source
 * @sql_table_primary_key id
 * @sql_table_foreign_keys id_genshin_character
 */

export class InfographicModel extends Model implements InfographicInterface, ModelInterface<InfographicModel> {
    id: number;
    id_genshin_character: number;
    id_hsr_character: number;
    jeu: string;
    url: string;
    build: string;
    source: string;

    constructor(
        data: Partial<InfographicModel>,
        private readonly repository = new InfographicRepository()
    ) {
        super(data);
        this.id = data.id ?? 0;
        this.id_genshin_character = data.id_genshin_character ?? 0;
        this.id_hsr_character = data.id_hsr_character ?? 0;
        this.jeu = data.jeu ?? "";
        this.url = data.url ?? "";
        this.build = data.build ?? "";
        this.source = data.source ?? "";
    }

    // Méthode pour passer les données en JSON
    toJSON() {
        return {
            id: this.id,
            id_genshin_character: this.id_genshin_character,
            id_hsr_character: this.id_hsr_character,
            jeu: this.jeu,
            url: this.url,
            build: this.build,
            source: this.source
        };
    }

    // Méthode pour obtenir l' ensemble des infographies
    async getAll(): Promise<InfographicModel[]> {
        const results = await this.repository.getAll();
        return results ? results.map(data => new InfographicModel(data)) : [];
    }

    // Méthode pour obtenir l'infographie par son ID
    async getById(id: number): Promise<InfographicModel | null> {
        const result = await this.repository.findById(id);
        return result ? new InfographicModel(result) : null;
    }

    // Méthode pour obtenir l'infographie par son ID de personnage
    async getByIdGenshinCharacter(id: number): Promise<InfographicModel[] | null> {
        const results = await this.repository.getByIdGI(id);
        return results ? results.map(data => new InfographicModel(data)) : [];
        
    }

    // Méthode pour obtenir les infographies par le jeu
    async getByJeu(jeu: string): Promise<InfographicModel[] | null> {
        const results = await this.repository.getByJeu(jeu);
        return results ? results.map(data => new InfographicModel(data)) : [];
    }

    // Méthode créer une infographie
    async create(data: Partial<InfographicModel>): Promise<InfographicModel> {
        const infographic = new InfographicModel(data);
        // Nettoyage des données avant de les enregistrer
        const cleanedData: Partial<InfographicModel> = {
            id: infographic.id,
            id_genshin_character: infographic.id_genshin_character,
            jeu: infographic.jeu,
            url: infographic.url,
            build: infographic.build,
            source: infographic.source,
        };
        await this.repository.save(cleanedData as InfographicModel);
        return infographic;
    }

    // Méthode pour mettre à jour une infographie
    async update(id: number, data: Partial<InfographicModel>): Promise<InfographicModel | null> {
        const infographic = new InfographicModel(data);
        // Nettoyage des données avant de les enregistrer
        const cleanedData: Partial<InfographicModel> = {
            id: infographic.id,
            id_genshin_character: infographic.id_genshin_character,
            jeu: infographic.jeu,
            url: infographic.url,
            build: infographic.build,
            source: infographic.source,
        };
        const isUpdated = await this.repository.update(id, cleanedData);
        return isUpdated ? await this.getById(id) : null;
    }

    // Méthode pour supprimer une infographie
    async delete(id: number): Promise<boolean> {
        return await this.repository.delete(id);
    }
}