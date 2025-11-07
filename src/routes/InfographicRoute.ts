import { Router } from "express";
import { InfographicController } from "../controllers/InfographicController";
import {Routes} from "./Route";
import {MiddlewareAuth} from "../middlewares/AuthMiddleware";

/**
 * InfographicRoute class
 * @classdesc This class represents an infographic route.
 * @extends Routes
 * @author matheo-1712
**/

export class InfographicRoute extends Routes {
    public readonly router = Router();
    private readonly controller = new InfographicController();
    private readonly middlewareAuth = new MiddlewareAuth();

    private readonly genshinRoutesList: Routes[] = [
        {
            id: 100,
            alias: "infographics-getAll",
            route: "/infographics",
            method: "GET",
            parameters: "",
            comment: "Obtenir toutes les infographies",
        },
        {
            id: 101,
            alias: "infographics-getById",
            route: "/infographics/:id",
            method: "GET",
            parameters: ":id",
            comment: "Obtenir une infographie par son ID",
        },
        {
            id: 102,
            alias: "infographics-getByIdGenshinCharacter",
            route: "/infographics/genshin/:id",
            method: "GET",
            parameters: ":id",
            comment: "Obtenir une infographie par son ID de personnage",
        },
        {
            id: 103,
            alias: "infographics-getByJeu",
            route: "/infographics/jeu/:jeu",
            method: "GET",
            parameters: ":jeu",
            comment: "Obtenir les infographies par le jeu",
        },
        {
            id: 104,
            alias: "infographics-saveGiByPlayerValue",
            route: "/infographics/genshin/new",
            method: "POST",
            parameters: "id_genshin_character, url, build, source, jeu",
            comment: "Enregistrer une nouvelle infographie",
        },

    ]

    constructor() {
        super("/genshin", "GET", "GenshinRoute", "");
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {

        // 🔹 Enregistrer les routes (héritage)
        Routes.registerRoutes(this.genshinRoutesList);
        // GET /api/infographics : Obtenir toutes les infographies
        this.router.get("/", this.controller.getAll.bind(this.controller));

        // GET /api/infographics/:id : Obtenir une infographie par son ID
        this.router.get("/:id", this.controller.getById.bind(this.controller));

        // GET /api/infographics/genshin/:id : Obtenir une infographie par son ID de personnage
        this.router.get("/genshin/:id", this.controller.getByIdGenshinCharacter.bind(this.controller));

        // GET /api/infographics/jeu/:jeu : Obtenir les infographies par le jeu
        this.router.get("/jeu/:jeu", this.controller.getByJeu.bind(this.controller));

        // POST /api/infographics/genshin/new/ : Enregistrer une nouvelle infographie
        this.router.post("/genshin/new",this.middlewareAuth.handle.bind(this.middlewareAuth) , this.controller.saveGiByPlayerValue.bind(this.controller));
    }
}