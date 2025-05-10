import { Router } from "express";
import { InfographicController } from "../controllers/InfographicController";

/**
 * InfographicRoute class
 * @classdesc This class represents an infographic route.
**/

export class InfographicRoute {
    public readonly router = Router();
    private readonly controller = new InfographicController();

    constructor() {
        // GET /api/infographics : Obtenir toutes les infographies
        this.router.get("/", this.controller.getAll.bind(this.controller));

        // GET /api/infographics/:id : Obtenir une infographie par son ID
        this.router.get("/:id", this.controller.getById.bind(this.controller));

        // GET /api/infographics/genshin/:id : Obtenir une infographie par son ID de personnage
        this.router.get("/genshin/:id", this.controller.getByIdGenshinCharacter.bind(this.controller));

        // GET /api/infographics/jeu/:jeu : Obtenir les infographies par le jeu
        this.router.get("/jeu/:jeu", this.controller.getByJeu.bind(this.controller));
    }
}