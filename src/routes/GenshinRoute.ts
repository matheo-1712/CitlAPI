// src/routes/GenshinRoute.ts

import { Router } from "express";
import { GenshinCharacterController } from "../controllers/GenshinCharacterController";
import { MiddlewareAuth } from "../middlewares/AuthMiddleware";

/**
 * GenshinRoute class
 * @classdesc This class represents a Genshin route.
 **/

export class GenshinRoute {
    public readonly router = Router();
    private readonly controller = new GenshinCharacterController();
    private readonly middlewareAuth = new MiddlewareAuth();

    constructor() {
        // GET /api/genshin/characters : Obtenir tous les serveurs
        this.router.get("/characters", this.controller.getAll.bind(this.controller));

        // GET /api/genshin/characters/:id : Obtenir un serveur par son id
        this.router.get("/characters/:id", this.controller.getById.bind(this.controller));

        // GET /api/genshin/characters/value/:value : Obtenir un serveur par son formatedValue
        this.router.get("/characters/value/:value", this.controller.getByFormatedValue.bind(this.controller));

        // Route avec Middleware d'authentification

        // POST /api/genshin/characters (création d'un personnage) (token d'authentification requis)
        this.router.post("/characters", this.middlewareAuth.handle.bind(this.middlewareAuth), async (req, res) => {
            try {
                const genshinCharacter = await this.controller.create(req, res);
                res.status(201).json({
                    success: true,
                    data: genshinCharacter,
                });
            } catch (err) {
                console.error("Erreur lors de la création :", err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });

        // PUT /api/genshin/characters/ (modification d'un personnage) (token d'authentification requis)
        this.router.put("/characters", this.middlewareAuth.handle.bind(this.middlewareAuth), async (req, res) => {
            try {
                const serveur = await this.controller.update(req, res);
                res.status(200).json({
                    success: true,
                    data: serveur,
                });
            } catch (err) {
                console.error("Erreur lors de la modification :", err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
        
        // DELETE /api/genshin/characters/:id (suppression d'un personnage) (token d'authentification requis)
        this.router.delete("/characters", this.middlewareAuth.handle.bind(this.middlewareAuth), async (req, res) => {
            try {
                const success = await this.controller.delete(req, res);
                if (success) {
                    res.status(200).json({ success: true, message: "Personnage supprimé." });
                } else {
                    res.status(404).json({ success: false, message: "Personnage non trouvé." });
                }
            } catch (err) {
                console.error("Erreur lors de la suppression :", err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
