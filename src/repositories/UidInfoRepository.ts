// src/repositories/UidInfoRepository.ts

import {UidInfosInterface} from "../interfaces/UidInfosInterface";
import {Repository} from "./Repository";

/**
 * UidInfoRepository is a class that extends the Repository interface
 * and is responsible for managing data access and storage operations
 * for entities implementing the UidInfosInterface.
 *
 * This repository serves as a data access layer for UID-specific
 * operations, providing a structured way to interact with the underlying
 * persistence mechanism. It inherits all standard repository methods
 * from the parent Repository class to facilitate CRUD operations.
 *
 * Extends:
 * - Repository<UidInfosInterface>
 */

export class UidInfoRepository extends Repository<UidInfosInterface>{

    constructor() {
        super("uid_infos");
    }

    // Méthode pour obtenir toutes les UID infos
    async getAll(): Promise<UidInfosInterface[]> {
        return this.findAll();
    }

    // Méthode pour obtenir une UID info par son UID
    async getByUid(uid: string): Promise<UidInfosInterface | null> {
        const results = await this.query("SELECT * FROM uid_infos WHERE uid = ? LIMIT 1", [uid]);
        return results.length > 0 ? results[0] : null;
    }

    // Méthode pour obtenir un ID par l'uid
    async getIdByUid(uid: string): Promise<UidInfosInterface | null> {
        const results = await this.query("SELECT id FROM uid_infos WHERE uid = ? LIMIT 1", [uid]);
        return results.length > 0 ? results[0] : null;
    }

    // Méthode pour update l'icon de profil par son UUID
    async updatePlayerIcon(uid: string, playerIcon: string): Promise<void> {
        await this.query("UPDATE uid_infos SET playerIcon = ? WHERE uid = ?", [playerIcon, uid]);
    }
}