// src/controllers/InfographicController.ts

import { InfographicModel } from "../models/InfographicModel";
import { Controller } from "./Controller";
import { Request, Response } from "express";

/**
 * InfographicController class
 * @classdesc This class represents an infographic controller.
 * @extends Controller
 * @implements {InfographicInterface}
 * @classdesc This class represents a Infographic controller.
 */

export class InfographicController extends Controller {
    constructor(
        private readonly model: InfographicModel = new InfographicModel({})
    ) {
        super();
    }
    handleRequest(req: Request, res: Response): void {
        const { method, url } = req;
        console.log(`Handling request: ${method} ${url}`);
        res.status(200).send("Request handled successfully.");
    }

    // GET /infographics : Obtenir toutes les infographies
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const infographics = await this.model.getAll();
            console.log(infographics);
            super.sendSuccess(res, infographics.map(i => i.toJSON()));
        } catch (error) {
            super.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }

    // GET /infographics/:id : Obtenir une infographie par son ID
    async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const infographic = await this.model.getById(Number(id));
            if (infographic) {
                super.sendSuccess(res, infographic);
            } else {
                super.sendNotFound(res, `Infographie avec l'ID ${id} introuvable.`);
            }
        } catch (error) {
            super.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }

    // GET /infographics/genshin/:id : Obtenir une infographie par son ID de personnage
    async getByIdGenshinCharacter(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const infographic = await this.model.getByIdGenshinCharacter(Number(id));
            if (infographic) {
                super.sendSuccess(res, infographic);
            } else {
                super.sendNotFound(res, `Infographie avec l'ID de personnage ${id} introuvable.`);
            }
        } catch (error) {
            super.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }

    // GET /infographics/jeu/:jeu : Obtenir les infographies par le jeu
    async getByJeu(req: Request, res: Response): Promise<void> {
        const { jeu } = req.params;
        try {
            const infographics = await this.model.getByJeu(jeu);
            if (infographics) {
                super.sendSuccess(res, infographics);
            } else {
                super.sendNotFound(res, `Infographie avec le jeu ${jeu} introuvable.`);
            }
        } catch (error) {
            super.sendError(res, error instanceof Error ? error.message : String(error));
        }
    }
}
