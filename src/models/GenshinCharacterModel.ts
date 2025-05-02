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
    private static readonly S_repository = new GenshinCharacterRepository();
    private readonly repository = new GenshinCharacterRepository();
    name: string;
    element: string;
    weapon: string;
    region: string;
    rarity: number;
    icon: string;
    ascensionStat?: string;
    formatedValue: string;

    constructor(data: Partial<GenshinCharacterModel>) {
        super(data);
        this.name = data.name ?? "";
        this.element = data.element ?? "";
        this.weapon = data.weapon ?? "";
        this.region = data.region ?? "";
        this.rarity = data.rarity ?? 0;
        this.icon = data.icon ?? "";
        this.ascensionStat = data.ascensionStat ?? undefined;
        this.formatedValue = data.formatedValue ?? "";
    }
    async getAll(): Promise<GenshinCharacterModel[]> {
        return await this.repository.findAll();
    }
    getById(id: number): Promise<GenshinCharacterModel | null> {
        throw new Error("Method not implemented.");
    }
    create(data: Partial<GenshinCharacterModel>): Promise<GenshinCharacterModel> {
        throw new Error("Method not implemented.");
    }
    update(id: number, data: Partial<GenshinCharacterModel>): Promise<GenshinCharacterModel | null> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    // Méthode pour récupérer tous les personnages
    static async getAll(): Promise<GenshinCharacterModel[]> {
        const characters = await this.S_repository.findAll();
        return characters;
    }

    // Méthode pour récupérer un personnage par son nom
    static async getByCharacterName(name: string): Promise<GenshinCharacterModel | null> {
        const character = await this.S_repository.getByCharacterName(name);
        return character;
    }

    // Méthode pour remplir la table avec des données JSON
    async fillTable(): Promise<void> { 
        await this.repository.fillTable();
    }
}