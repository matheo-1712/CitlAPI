// src/models/GenshinCharacterModel.ts

import { GenshinCharacterInterface } from "../interfaces/GenshinCharacterInterface";
import { ModelInterface } from "../interfaces/ModelInterface";
import { GenshinCharacterRepository } from "../repositories/GenshinCharacterRepository";
import { Model } from "./Model";

/**
 * GenshinCharacterModel class
 * @extends Model
 * @implements ModelInterface<GenshinCharacterModel>, GenshinCharacterInterface
 * @classdesc This class represents a Genshin character model.
 * @sql_table_name genshin_characters
 */

export class GenshinCharacterModel extends Model implements GenshinCharacterInterface, ModelInterface<GenshinCharacterModel> {
    id: number;
    name: string;
    element: string;
    weapon: string;
    region: string;
    rarity: number;
    icon: string;
    ascensionStat?: string;
    formatedValue: string;

    constructor(
        data: Partial<GenshinCharacterModel>,
        private readonly repository = new GenshinCharacterRepository()
    ) {
        super(data);
        this.id = data.id ?? 0;
        this.name = data.name ?? "";
        this.element = data.element ?? "";
        this.weapon = data.weapon ?? "";
        this.region = data.region ?? "";
        this.rarity = data.rarity ?? 0;
        this.icon = data.icon ?? "";
        this.ascensionStat = data.ascensionStat ?? undefined;
        this.formatedValue = data.formatedValue ?? "";
    }

    // Méthode pour obtenir l' ensemble des personnages
    async getAll(): Promise<GenshinCharacterModel[]> {
        return await this.repository.findAll();
    }

    // Méthode pour obtenir le personnage par son ID
    async getById(id: number): Promise<GenshinCharacterModel | null> {
        return await this.repository.findById(id);
    }

    // Méthode pour obtenir le personnage par sa formatedValue
    async getByFormatedValue(formatedValue: string): Promise<GenshinCharacterModel | null> {
        return await this.repository.getByFormatedValue(formatedValue);
    }


    // Méthode créer un personnage
    async create(data: Partial<GenshinCharacterModel>): Promise<GenshinCharacterModel> {
        const character = new GenshinCharacterModel(data);
        // Nettoyage des données avant de les enregistrer
        const cleanedData : Partial<GenshinCharacterModel> = {
            id: character.id,
            name: character.name,
            element: character.element,
            weapon: character.weapon,
            region: character.region,
            rarity: character.rarity,
            icon: character.icon,
            ascensionStat: character?.ascensionStat,
            formatedValue: character.formatedValue,
        };
        await this.repository.save(cleanedData as GenshinCharacterModel);
        return character;
    }

    // Méthode pour mettre à jour un personnage
    async update(id: number, data: Partial<GenshinCharacterModel>): Promise<GenshinCharacterModel | null> {
        const character = new GenshinCharacterModel(data);
        // Nettoyage des données avant de les enregistrer
        const cleanedData: Partial<GenshinCharacterModel> = {
            name: character.name.trim(),
            element: character.element.trim(),
            weapon: character.weapon.trim(),
            region: character.region.trim(),
            rarity: character.rarity,
            icon: character.icon.trim(),
            ascensionStat: character.ascensionStat?.trim(),
            formatedValue: character.formatedValue.trim(),
        };
        const isUpdated = await this.repository.update(id, cleanedData);
        return isUpdated ? await this.getById(id) : null;
    }

    // Méthode pour supprimer un personnage
    async delete(id: number): Promise<boolean> {
        return await this.repository.delete(id);
    }

    // Méthode pour remplir la table avec des données JSON
    async fillTable(): Promise<void> {
        await this.repository.fillTable();
    }
}