import { RowDataPacket } from "mysql2";
import db from "../db";
import { GenshinCharacterModel } from "../models/GenshinCharacterModel";
import { it } from "node:test";

/**
 * Repository class
 * @classdesc This class represents a repository with all the logic for the database.
 * @template T - The type of the model.
 */

export abstract class Repository<T extends { id?: number }> {

    protected store = new Map<string, T>();
    protected tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    // Logique SQL centralisée
    protected async fetchNextId(): Promise<number> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(
                `SELECT MAX(id) AS id FROM ${this.tableName}`
            );
            const maxId = (rows[0]?.id as number | null) ?? 0;
            return maxId + 1;
        } catch (error) {
            console.error(error);
            return 0;
        }
    }

    public async getNextId(): Promise<number> {
        return this.fetchNextId();
    }

    // Logique de sauvegarde
    public async save(item: T): Promise<void> {
        // Logique de vérification de l'existence de l'ID
        item.id ??= await this.getNextId();
        // Logique de vérification de la disponibilité de l'ID
        if (await this.findById(item.id)) {
            item.id = await this.getNextId();
        }
        this.store.set(item.id.toString(), item);
        // Logique de sauvegarde dans la base de données
        try {
            await db.query(`INSERT INTO ${this.tableName} SET ?`, item);
        }
        catch (error) {
            console.error("Erreur lors de la sauvegarde dans la base de données :", error);
        }
    }

    // Logique de recherche
    public async findById(id: number): Promise<T | null> {
        try {
            // Effectuer la requête avec un typage spécifique pour MySQL
            const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);

            // Vérifie si des lignes ont été trouvées et retourne la première ligne, sinon null
            return rows.length > 0 ? rows[0] as T : null;

        } catch (error) {
            console.error("Erreur lors de la recherche dans la base de données :", error);
            return null;
        }
    }

    // Logique de recherche de tous les éléments
    async findAll(): Promise<T[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM ${this.tableName}`);
            return rows as T[];
        } catch (error) {
            console.error("Erreur lors de la recherche de tous les éléments :", error);
            return [];
        }
    }

    // Logique de suppression
    async delete(id: number): Promise<boolean> {
        try {
            const [result]: any = await db.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            return false;
        }
    }

    // Logique de mise à jour
    async update(id: number, item: Partial<T>): Promise<T | null> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`UPDATE ${this.tableName} SET ? WHERE id = ?`, [item, id]);
            return rows.length > 0 ? rows[0] as T : null;
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            return null;
        }
    }

    // Logique de query
    async query(query: string, params: any[] = []): Promise<T[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(query, params);
            return rows as T[];
        } catch (error) {
            console.error("Erreur lors de la requête :", error);
            return [];
        }
    }

    // Logique de récupération de la première ligne
    async findFirst(): Promise<T | null> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM ${this.tableName} LIMIT 1`);
            return rows.length > 0 ? rows[0] as T : null;
        } catch (error) {
            console.error("Erreur lors de la récupération de la première ligne :", error);
            return null;
        }
    }

    // Logique de remplissage de la table
    async fillTable(): Promise<void> {
        try {
            const data = require("../../data/genshin_characters.json");
            for (const character of data) {
                // Vérifie si un personnage avec le même nom existe déjà
                const existingCharacter = await GenshinCharacterModel.getByCharacterName(character.name);
                if (!existingCharacter) {
                    // Enregistrer l'objet
                    await this.save(character as T);
                }
            }
        } catch (error) {
            console.error("Erreur lors du remplissage de la table :", error);
        }
    }

}
