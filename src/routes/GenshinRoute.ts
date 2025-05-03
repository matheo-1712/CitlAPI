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
        // GET /api/characters : Obtenir tous les serveurs
        this.router.get("/characters", this.controller.getAll.bind(this.controller));

        // GET /api/characters/:id : Obtenir un serveur par son ID
        this.router.get("/characters/:id", this.controller.getById.bind(this.controller));

        // GET /api/characters/value/:value : Obtenir un serveur par sa formatedValue
        this.router.get("/characters/value/:value", this.controller.getByFormatedValue.bind(this.controller));

        // Route avec Middleware d'authentification

        // POST /api/serveurs (création d'un serveur) (token d'authentification requis)
        this.router.post("/", this.middlewareAuth.handle.bind(this.middlewareAuth), async (req, res) => {
            try {
                const serveur = await this.controller.create(req, res);
                res.status(201).json({
                    success: true,
                    data: serveur,
                });
            } catch (err) {
                console.error("Erreur lors de la création :", err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
        // PUT /api/serveurs/:id (modification d'un serveur) (token d'authentification requis)
        this.router.put("/:id", this.middlewareAuth.handle.bind(this.middlewareAuth), async (req, res) => {
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
        // DELETE /api/serveurs/:id (suppression d'un serveur) (token d'authentification requis)
        this.router.delete("/:id", this.middlewareAuth.handle.bind(this.middlewareAuth), async (req, res) => {
            try {
                const success = await this.controller.delete(req, res);
                if (success) {
                    res.status(200).json({ success: true, message: "Serveur supprimé avec succès." });
                } else {
                    res.status(404).json({ success: false, message: "Serveur introuvable." });
                }
            } catch (err) {
                console.error("Erreur lors de la suppression :", err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
