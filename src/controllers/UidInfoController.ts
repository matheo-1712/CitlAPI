// src/controllers/UidInfoController.ts

import {Controller} from "./Controller";
import {UidInfoModel} from "../models/UidInfoModel";
import {Request, Response} from "express";
import {UidInfosService} from "../services/UidInfosService";

/**
 * The UidInfoController class is responsible for managing UID information related API requests.
 * It extends the base Controller class and interacts with the underlying UidInfoModel.
 */

export class UidInfoController extends Controller {
    constructor(
        private readonly model: UidInfoModel = new UidInfoModel({}),
        private readonly service: UidInfosService = new UidInfosService()
    ) {
        super();
    }
    handleRequest(req: Request, res: Response): void {
        const { method, url } = req;
        console.log(`Handling request: ${method} ${url}`);
        res.status(200).send("Request handled successfully.");
    }

    // GET /uid-infos : Obtenir toutes les infos UID
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const uidInfos = await this.model.getAll();
            this.sendSuccess(res, uidInfos);
        } catch (error) {
            this.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }

    // GET /uid-infos/:uid : Obtenir une info UID par son uid
    async getByUid(req: Request, res: Response): Promise<void> {
        const { uid } = req.params;
        try {
            const uidInfo = await this.model.getByUid(uid);
            this.sendSuccess(res, uidInfo);
        } catch (error) {
            this.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }

    // POST /uid-infos/refresh: Rafraîchir les infos UID
    async refresh(req: Request, res: Response): Promise<void> {
        try {
            const uid : string = req.body.uid_genshin;
            const uidInfos = await this.service.fetchUidInfos(uid)
            this.sendSuccess(res, uidInfos);
        } catch (error) {
            this.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }
}