// src/interfaces/TokenInterface.ts

/**
 * TokenInterface interface
 * @interfacedesc This interface represents a token interface.
 * @author matheo-1712
 */

export interface TokenInterface {
    id: number;
    utilisateur: string;
    role?: string;
    createdAt: string;
    token?: string;
}