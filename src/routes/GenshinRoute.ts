// src/routes/GenshinRoute.ts

/**
 * GenshinRoute class
 * @classdesc This class represents a Genshin route.
 **/

import { Router } from "express";
import { GenshinCharacterController } from "../controllers/GenshinCharacterController";

export class GenshinRoute {
    public readonly router = Router();
    private readonly controller = new GenshinCharacterController();

    constructor() {
        this.router.get("/characters", this.controller.getAll.bind(this.controller));
    }
}
