// src/routes/IdDiscordToUidRoute.ts

import {Routes} from "./Route";
import {Router} from "express";
import {IdDiscordToUidController} from "../controllers/IdDiscordToUidController";
import {MiddlewareAuth} from "../middlewares/AuthMiddleware";

export class IdDiscordToUidRoute extends Routes {
    public readonly router = Router();
    private readonly controller = new IdDiscordToUidController();
    private readonly middlewareAuth = new MiddlewareAuth();
    private readonly uidInfoRoutesList: Routes[] = [
        {
            id: 300,
            alias: "id-discord-to-uid-getAll",
            route: "/id-discord-to-uid",
            method: "GET",
            parameters: "",
            comment: "Obtenir toutes les infos UID",
        },
        {
            id: 301,
            alias: "id-discord-to-uid-getByUid",
            route: "/id-discord-to-uid/",
            method: "GET",
            parameters: ":uid",
            comment: "Obtenir une info UID par son uid",
        },
        {
            id: 302,
            alias: "id-discord-to-uid-create",
            route: "/id-discord-to-uid",
            method: "POST",
            parameters: "id_discord, uid_genshin",
            comment: "Créer un enregistrement ID Discord to UID",
        },

    ]
    constructor() {
        super("/id-discord-to-uid", "GET", "IdDiscordToUidRoute", "");
        this.router = Router();
        this.initializeRoutes();
    }

    // Initialiser les routes
    private initializeRoutes() {
        // Enregistrer les routes
        Routes.registerRoutes(this.uidInfoRoutesList);
        // Déclarer les routes
        this.router.get("/", this.controller.getAll.bind(this.controller));
        // this.router.get("/:id_discord", this.controller.getByUid().bind(this.controller));
        this.router.post("/",
            this.middlewareAuth.handle.bind(this.middlewareAuth),
            this.controller.create.bind(this.controller)
        );
    }
}
