// src/routes/GenshinRoute.ts

import { Router } from "express";
import { GenshinCharacterController } from "../controllers/GenshinCharacterController";

/**
 * GenshinRoute class
 * @classdesc This class represents a Genshin route.
 **/

export class GenshinRoute {
    public readonly router = Router();
    private readonly controller = new GenshinCharacterController();

    constructor() {
        this.router.get("/characters", this.controller.getAll.bind(this.controller));
        this.router.get("/characters/:id", this.controller.getById.bind(this.controller));
        this.router.get("/characters/value/:value", this.controller.getByFormatedValue.bind(this.controller));
        this.router.post("/characters", this.controller.create.bind(this.controller));
        this.router.put("/characters/:id", this.controller.update.bind(this.controller));
        this.router.delete("/characters/:id", this.controller.delete.bind(this.controller));
    }
}
