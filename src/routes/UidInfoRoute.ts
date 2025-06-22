// src/route/UidInfoRoute.ts

import {Routes} from "./Route";
import {UidInfoController} from "../controllers/UidInfoController";
import {Router} from "express";

export class UidInfoRoute extends Routes{
    public readonly router = Router();
    private readonly controller = new UidInfoController();
    private readonly uidInfoRoutesList: Routes[] = [
        {
            id: 200,
            alias: "uid-infos-getAll",
            route: "/uid-infos",
            method: "GET",
            parameters: "",
            comment: "Obtenir toutes les infos UID",
        },
        {
            id: 201,
            alias: "uid-infos-getByUid",
            route: "/uid-infos",
            method: "GET",
            parameters: ":uid",
            comment: "Obtenir une info UID par son uid",
        },
        {
            id: 202,
            alias: "uid-infos-refresh",
            route: "/uid-infos/refresh",
            method: "POST",
            parameters: "uid_genshin",
            comment: "Rafraîchir les infos UID",
        },
    ]

    constructor() {
        super("/uid-infos", "GET", "UidInfoRoute", "");
        this.router = Router();
        this.initializeRoutes();
    }

    // Initialiser les routes
    private initializeRoutes() {
        // Enregistrer les routes
        Routes.registerRoutes(this.uidInfoRoutesList);

        // Déclarer les routes
        this.router.get("/", this.controller.getAll.bind(this.controller));
        this.router.get("/:uid", this.controller.getByUid.bind(this.controller));
        this.router.post("/refresh", this.controller.refresh.bind(this.controller));
    }
}