// src/models/UidInfoModel.ts

import {Model} from "./Model";
import {UidInfosInterface} from "../interfaces/UidInfosInterface";
import {UidInfoRepository} from "../repositories/UidInfoRepository";

/**
 * Represents the user information model for a unique identifier (UID).
 * This model extends the base `Model` class and implements the `UidInfosInterface`.
 * It contains properties related to user profile details, game progress, and achievements.
 *
 * Responsibilities:
 * - Hold data about a user's information, such as UID, nickname, level, and other specific attributes.
 * - Provide a constructor to initialize the class with optional data fields.
 *
 * Properties:
 * - `id` (optional): The unique identifier for the model entity.
 * - `uid`: The user's unique identifier string.
 * - `nickname`: The nickname of the user.
 * - `level`: The level of the user.
 * - `worldLevel`: The world level corresponding to the user.
 * - `signature`: The user's signature or description.
 * - `finishAchievementNum`: The total number of achievements completed by the user.
 * - `towerFloor`: The floor the user has reached in the game's tower or domain.
 * - `affinityCount`: The count of affinity items or interactions the user has achieved.
 * - `theaterAct`: The current act or stage in a specific game mode or event.
 * - `theaterMode`: The mode or type of the theater-related gameplay.
 * - `playerIcon`: The identifier or URL for the user's profile icon.
 *
 * Constructor:
 * The constructor accepts an optional `data` object (partial `UidInfoModel` type) to initialize properties of the class.
 * Default values are set for properties if not provided in the input data.
 */

export class UidInfoModel extends Model implements UidInfosInterface {
    id?: number;
    uid: string;
    nickname: string;
    level: number;
    worldLevel: number;
    signature: string;
    finishAchievementNum: number;
    towerFloor: string;
    affinityCount: number;
    theaterAct: number;
    theaterMode: string;
    playerIcon: string;

    private readonly repository = new UidInfoRepository();

    constructor(
        data: Partial<UidInfoModel>
    ) {
        super(data);
        this.id = data.id ?? 0;
        this.uid = data.uid ?? "";
        this.nickname = data.nickname ?? "";
        this.level = data.level ?? 0;
        this.worldLevel = data.worldLevel ?? 0;
        this.signature = data.signature ?? "";
        this.finishAchievementNum = data.finishAchievementNum ?? 0;
        this.towerFloor = data.towerFloor ?? "";
        this.affinityCount = data.affinityCount ?? 0;
        this.theaterAct = data.theaterAct ?? 0;
        this.theaterMode = data.theaterMode ?? "";
        this.playerIcon = data.playerIcon ?? "";
    }

    // Method to convert the model to a JSON object
    toJSON(): Record<string, any> {
        return {
            id: this.id,
            uid: this.uid,
            nickname: this.nickname,
            level: this.level,
            worldLevel: this.worldLevel,
            signature: this.signature,
        }
    }

    // Method to get all UidInfoModel instances from the database
    async getAll(): Promise<UidInfosInterface[]> {
        return await this.repository.findAll();
    }

    // Method to get a UidInfoModel instance by UID from the database
    async getByUid(uid: string): Promise<UidInfosInterface | null> {
        return await this.repository.getByUid(uid);
    }

    // Method to get a Id by UID from the database
    async getIdByUid(uid: string): Promise<number | undefined | null> {
        const data = await this.repository.getIdByUid(uid);
        return data ? data.id : null;
    }

    // Method to check if a UidInfoModel instance exists in the database by UID
    async exists(uid: string): Promise<boolean> {
        return (await this.repository.getByUid(uid)) !== null;
    }

    // Method to save a UidInfoModel instance to the database
    async create(uidInfo: UidInfosInterface): Promise<void> {
        await this.repository.save(uidInfo);
    }

    // Method to update a UidInfoModel instance in the database
    async update(id: number, uidInfo: UidInfosInterface): Promise<void> {
        await this.repository.update(id, uidInfo);
    }
}
