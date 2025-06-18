// src/routes/GenshinRoute.ts

import { Router } from "express";
import { GenshinCharacterController } from "../controllers/GenshinCharacterController";
import { MiddlewareAuth } from "../middlewares/AuthMiddleware";
import { Routes } from "./Route";

/**
 * GenshinRoute class
 * @classdesc This class represents a Genshin route.
 **/
export class GenshinRoute extends Routes {
    public readonly router = Router();
    private readonly controller = new GenshinCharacterController();
    private readonly middlewareAuth = new MiddlewareAuth();

    private readonly genshinRoutesList: Routes[] = [
        {
            id: 1,
            alias: "characters-getAll",
            route: "/characters",
            method: "GET",
            parameters: "",
            comment: "Obtenir tous les personnages",
            description: "Obtenir tous les personnages"
        },
        {
            id: 2,
            alias: "characters-getById",
            route: "/characters",
            method: "GET",
            parameters: ":id",
            comment: "Obtenir un personnage par son ID",
            description: "Obtenir un personnage par son ID"
        },
        {
            id: 3,
            alias: "characters-getByValue",
            route: "/characters/value",
            method: "GET",
            parameters: ":value",
            comment: "Obtenir un personnage par son formatedValue",
            description: "Obtenir un personnage par son formatedValue"
        },
        {
            id: 4,
            alias: "characters-create",
            route: "/characters",
            method: "POST",
            parameters:
                "    id: number;\n" +
                "    name: string;\n" +
                "    element: string;\n" +
                "    weapon: string;\n" +
                "    region: string;\n" +
                "    rarity: number;\n" +
                "    icon: string;\n" +
                "    ascensionStat?: string;\n" +
                "    formatedValue: string;",
            comment: "Créer un personnage",
            description: "Créer un personnage"
        },
        {
            id: 5,
            alias: "characters-update",
            route: "/characters",
            method: "PUT",
            parameters: "",
            comment: "Modifier un personnage",
            description: "Modifier un personnage"
        },
        {
            id: 6,
            alias: "characters-delete",
            route: "/characters",
            method: "DELETE",
            parameters: ":id",
            comment: "Supprimer un personnage",
            description: "Supprimer un personnage"
        }
    ];

    constructor() {
        super("/genshin", "GET", "GenshinRoute", "");
        // 🔹 Enregistrer les routes (héritage)
        Routes.registerRoutes(this.genshinRoutesList, "genshin");
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // TODO : REFAIRE LES COMMENTAIRES
        // 🔹 Routes publiques
        this.router.get("/characters", this.controller.getAll.bind(this.controller));
        this.router.get("/characters/:id", this.controller.getById.bind(this.controller));
        this.router.get("/characters/value/:value", this.controller.getByFormatedValue.bind(this.controller));

        // 🔹 Routes protégées
        this.router.post("/characters", this.middlewareAuth.handle.bind(this.middlewareAuth), async (req, res) => {
            try {
                await this.controller.create(req, res);
            } catch (err) {
                console.error("Erreur lors de la création :", err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });

        this.router.put("/characters", this.middlewareAuth.handle.bind(this.middlewareAuth), async (req, res) => {
            try {
                await this.controller.update(req, res);
            } catch (err) {
                console.error("Erreur lors de la modification :", err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });

        this.router.delete("/characters/:id", this.middlewareAuth.handle.bind(this.middlewareAuth), async (req, res) => {
            try {
                await this.controller.delete(req, res);
            } catch (err) {
                console.error("Erreur lors de la suppression :", err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
