// /src/interfaces/ModelInterface.ts

/**
 * ModelInterface interface
 * @interfacedesc This interface represents a model interface.
 * @template T - The type of the model.
 * @author matheo-1712
**/

export interface ModelInterface<T> {
    getAll(): Promise<T[]>;
    getById(id: number): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: number, data: Partial<T>): Promise<T | null>;
    delete(id: number): Promise<boolean>;
}
