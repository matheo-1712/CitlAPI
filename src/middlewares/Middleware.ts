// src/middlewares/Middleware.ts

import { Request, Response, NextFunction } from "express";

/**
 * Middleware class
 * @classdesc This class represents a model of middleware.
 **/

export abstract class Middleware {
    abstract handle(req: Request, res: Response, next: NextFunction): void;
}
