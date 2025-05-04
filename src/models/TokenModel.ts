// src/models/TokenModel.ts

import { TokenInterface } from "../interfaces/TokenInterface";
import { TokenRepository } from "../repositories/TokenRepository";
import { ServiceToken } from "../services/TokenService";
import { Model } from "./Model";

/**
 * TokenModel class
 * @classdesc This class represents a token model.
 * @extends Model
 * @implements TokenInterface
 **/

export class TokenModel extends Model implements TokenInterface{
    private readonly repository = new TokenRepository();
    private readonly service = new ServiceToken();

    id: number;
    utilisateur: string;
    role?: string;
    createdAt: string;
    token?: string;

    constructor(data: Partial<TokenModel>) {
        super(data);
        this.id = data.id ?? 0;
        this.utilisateur = data.utilisateur ?? "";
        this.role = data.role ?? "";
        this.createdAt = data.createdAt ?? "";
        this.token = data.token ?? "";
    }

   // Méthode pour générer les tokens par défaut
    async generateInitialTokens(): Promise<void> {
        await this.service.generateInitialTokens();
    }
}