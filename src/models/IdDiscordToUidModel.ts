// src/models/IdDiscordToUidModel.ts

import {Model} from "./Model";
import {IdDiscordToUidInterface} from "../interfaces/IdDiscordToUidInterface";
import {IdDiscordToUidRepository} from "../repositories/IdDiscordToUidRepository";

export class IdDiscordToUidModel extends Model implements IdDiscordToUidInterface {
    constructor(
        data: Partial<IdDiscordToUidInterface>,
        private readonly repository = new IdDiscordToUidRepository()
    ) {
        super(data);
        this.id = data.id ?? 0;
        this.id_discord = data.id_discord ?? "";
        this.uid_genshin = data.uid_genshin ?? null;
    }

    id?: number;
    id_discord: string;
    uid_genshin: string | null;

    // Method to convert the model to a JSON object
    toJSON(): Record<string, any> {
        return {
            id: this.id,
            id_discord: this.id_discord,
            uid_genshin: this.uid_genshin,
        };
    }

    // Method to register UID and ID Discord after that fetching Uid Infos from Genshin API
    async create(IdDiscordToUid : IdDiscordToUidInterface): Promise<IdDiscordToUidInterface> {
        const data = await this.repository.save(IdDiscordToUid);
        return IdDiscordToUid;
    }

    // Method to get all UID by ID Discord from the database
    async getAll(): Promise<IdDiscordToUidInterface[]> {
        const data = await this.repository.findAll();
        return data.map((item) => new IdDiscordToUidModel(item));
    }

    // Method to get the UID by ID Discord from the database
    async getUidByIdDiscord(id_discord: string): Promise<IdDiscordToUidInterface | null> {
        const data = await this.repository.getUidByIdDiscord(id_discord);
        return data ? new IdDiscordToUidModel(data) : null;
    }




}