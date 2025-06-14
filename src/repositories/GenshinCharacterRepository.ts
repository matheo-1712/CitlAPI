import { GenshinCharacterInterface } from "../interfaces/GenshiCharacterInterface";
import { GenshinCharacterModel } from "../models/GenshinCharacterModel";
import { Repository } from "./Repository";

/**
 * GenshinCharacterRepository class
 * @extends Repository<GenshinCharacterModel>
 * @classdesc This class represents a Genshin character repository.
 * @sql_table_name genshin_characters
 * @sql_create_columns_dump
 CREATE TABLE IF NOT EXISTS genshin_characters (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    element VARCHAR(50) NOT NULL,
    weapon VARCHAR(50) NOT NULL,
    region VARCHAR(100) NOT NULL,
    rarity INT NOT NULL,
    icon TEXT NOT NULL,
    ascensionStat TEXT, -- Champ optionnel
    formatedValue VARCHAR(100) NOT NULL
);
 **/

export class GenshinCharacterRepository extends Repository<GenshinCharacterModel> {
    constructor() {
        super("genshin_characters");
    }

    // Méthode pour récupérer l'ensemble des personnages
    async findAll(): Promise<GenshinCharacterModel[]> {
        return super.findAll();
    }

    // Méthode pour récupérer un personnage par son nom
    async getByCharacterName(name: string): Promise<GenshinCharacterModel | null> {
        const results = await super.query(`SELECT * FROM genshin_characters WHERE name = ?`, [name]);
        return results && results.length > 0 ? results[0] : null;
    }

    // Méthode pour récupérer un personnage par sa formatedValue
    async getByFormatedValue(formatedValue: string): Promise<GenshinCharacterModel | null> {
        const results = await super.query(`SELECT * FROM genshin_characters WHERE formatedValue = ?`, [formatedValue]);
        return results.length > 0 ? results[0] : null;
    }

    // Méthode pour obtenir un personnage par son ID
    async getById(id: number): Promise<GenshinCharacterModel | null> {
        const result = await super.findById(id);
        return result || null;
    }


    // Méthode pour remplir la table avec des données JSON
    async fillTable(): Promise<void> {
        const data = require("../../data/genshin_characters.json");
        for (const character of data) {
            // Vérifie si le personnage existe déjà dans la base de données
            const existingCharacter = await this.getById(character.id);
            if (existingCharacter) {
                // Si le personnage existe déjà, on met à jour ses données
                const updatedCharacter: GenshinCharacterModel = {
                    ...existingCharacter,
                    ...character,
                };
                if (existingCharacter.id !== undefined) {
                    await this.update(existingCharacter.id, updatedCharacter);
                }
            }
            else {
                // Si le personnage n'existe pas, on le crée
                const characterData: GenshinCharacterInterface = {
                    id: character.id,
                    name: character.name,
                    element: character.element,
                    weapon: character.weapon,
                    region: character.region,
                    rarity: character.rarity,
                    icon: character.icon,
                    ascensionStat: character.ascensionStat ?? '',
                    formatedValue: character.formatedValue,
                };

                // Enregistrer l'objet sans inclure de champ repository
                await this.save(characterData as GenshinCharacterModel);
            }
        }
    }
}
