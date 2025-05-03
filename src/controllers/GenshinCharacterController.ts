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

    constructor(
        private readonly model: GenshinCharacterModel = new GenshinCharacterModel({})
    ) {
        super();
    }

    handleRequest(req: Request, res: Response): void {
        const { method, url } = req;
        console.log(`Handling request: ${method} ${url}`);
        res.status(200).send("Request handled successfully.");
    }

    // GET /characters : Obtenir tous les personnages
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const characters = await this.model.getAll();
            super.sendSuccess(res, characters);
        } catch (error) {
            super.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }

    // GET /characters/:id : Obtenir un personnage par son ID
    async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const character = await this.model.getById(Number(id));
            if (character) {
                super.sendSuccess(res, character);
            } else {
                super.sendNotFound(res, `Personnage avec l'ID ${id} introuvable.`);
            }
        } catch (error) {
            super.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }

    // GET /characters/value/:value : Obtenir un personnage par sa formatedValue
    async getByFormatedValue(req: Request, res: Response): Promise<void> {
        const { value } = req.params;
        try {
            const character = await this.model.getByFormatedValue(value);
            if (character) {
                super.sendSuccess(res, character);
            } else {
                super.sendNotFound(res, `Personnage avec la formatedValue ${value} introuvable.`);
            }
        } catch (error) {
            super.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }

    // POST /characters : Créer un personnage
    async create(req: Request, res: Response): Promise<void> {
        try {
            const character = await this.model.create(req.body);
            super.sendSuccess(res, character);
        } catch (error) {
            super.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }

    // PUT /characters/:id : Mettre à jour un personnage
    async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const character = await this.model.update(Number(id), req.body);
            if (character) {
                super.sendSuccess(res, character);
            } else {
                super.sendNotFound(res, `Personnage avec l'ID ${id} introuvable.`);
            }
        } catch (error) {
            super.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }

    // DELETE /characters/:id : Supprimer un personnage
    async delete(req: Request, res: Response): Promise<boolean> {
        const { id } = req.params;
        try {
            const success = await this.model.delete(Number(id));
            if (success) {
                super.sendSuccess(res, `Personnage avec l'ID ${id} supprimé.`);
                return true;
            } else {
                super.sendNotFound(res, `Personnage avec l'ID ${id} introuvable.`);
                return false;
            }
        } catch (error) {
            super.sendError(res, error instanceof Error ? error.message : String(error));
            return false;
        }
        
    }
}
    