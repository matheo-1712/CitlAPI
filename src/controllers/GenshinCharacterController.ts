// src/controllers/GenshinCharacterController.ts

import { Request, Response } from "express";
import { GenshinCharacterModel } from "../models/GenshinCharacterModel";
import { Controller } from "./Controller";

/**
 * GenshinCharacterController class
 * @classdesc This class represents a Genshin character controller.
 * @extends Controller
 * @implements {GenshinCharacterInterface}
 **/

export class GenshinCharacterController extends Controller {
    handleRequest(req: Request, res: Response): void {
        const { method, url } = req;
        console.log(`Handling request: ${method} ${url}`);
        res.status(200).send("Request handled successfully.");
    }

    // GET /characters : Obtenir tous les personnages
    async getAll(res: Response): Promise<void> {
        try {
            const characters = await GenshinCharacterModel.getAll();
            super.sendSuccess(res, characters);
        } catch (error) {
            super.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }
}
    