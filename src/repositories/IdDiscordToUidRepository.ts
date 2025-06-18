// src/repositories/IdDiscordToUidRepository.ts

import {Repository} from "./Repository";
import {IdDiscordToUidInterface} from "../interfaces/IdDiscordToUidInterface";

/**
 * IdDiscordToUidRepository is a repository class responsible for managing the mappings
 * between Discord IDs and internal user IDs within the application. It extends the
 * generic Repository class to leverage common data access and management functionality.
 *
 * This class operates over a pre-defined collection or table called "id_discord_to_uid"
 * to store and retrieve mappings, ensuring efficient query execution and reliable data
 * management.
 *
 * Methods inherited from Repository allow for the creation, retrieval, updating, and
 * deletion of the records related to Discord ID to user ID mappings.
 *
 * Extends:
 * - `Repository<IdDiscordToUidInterface>`
 */

export class IdDiscordToUidRepository extends Repository<IdDiscordToUidInterface> {
    constructor() {
        super("id_discord_to_uid");
    }

    // Method to get a UidInfoModel instance by UID from the database
    public async getUidByIdDiscord(id_discord: string): Promise<IdDiscordToUidInterface | null> {
        const results = await super.query(`SELECT * FROM ${this.tableName} WHERE id_discord = ?`, [id_discord]);
        return results.length > 0 ? results[0] : null;
    }
}