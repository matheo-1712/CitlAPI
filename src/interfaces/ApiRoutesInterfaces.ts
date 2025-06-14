// src/interfaces/ApiRoutesInterfaces.ts

/**
 * ApiRoutesInterface interface
 * @interfacedesc This interface represents an API route interface.
 * @author matheo-1712
 */

export interface ApiRoutesInterface {
    id?: number;
    alias: string;
    route: string;
    method: string;
    parameters: string;
    description?: string;
    comment?: string;
}