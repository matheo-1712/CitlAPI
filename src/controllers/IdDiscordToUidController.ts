// src/controllers/IdDiscordToUidController.ts

import {Controller} from "./Controller";
import {Request, Response} from "express";
import {IdDiscordToUidModel} from "../models/IdDiscordToUidModel";
import {UidInfosService} from "../services/UidInfosService";

export class IdDiscordToUidController extends Controller {
    constructor(
        private readonly model : IdDiscordToUidModel = new IdDiscordToUidModel({}),
        private readonly service : UidInfosService = new UidInfosService()
    ) {
        super();
    }
    handleRequest(req: Request, res: Response): void {
        const { method, url } = req;
        console.log(`Handling request: ${method} ${url}`);
        res.status(200).send("Request handled successfully.");
    }

    // GET /id-discord-to-uid : Obtenir toutes les infos UID
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const idDiscordToUid = await this.model.getAll();
            return super.sendSuccess(res, idDiscordToUid);
        } catch (error) {
            return super.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }

    // GET /id-discord-to-uid/:id_discord : Obtenir une info UID par son uid
    async getUidByIdDiscord(req: Request, res: Response): Promise<void> {
        const { id_discord } = req.params;
        try {
            const idDiscordToUid = await this.model.getUidByIdDiscord(id_discord)
            return super.sendSuccess(res, idDiscordToUid);
        } catch (error) {
            return super.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }

    // POST /id-discord-to-uid : Créer un enregistrement ID Discord to UID
    async create(req: Request, res: Response): Promise<void> {
        try {
            const idDiscordToUid = await this.model.create(req.body);
            await this.service.fetchUidInfos(idDiscordToUid.uid_genshin);
            return super.sendSuccess(res, idDiscordToUid);
        } catch (error) {
            return super.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }
}
