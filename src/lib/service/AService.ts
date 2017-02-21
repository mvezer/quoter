import { IService } from "./IService";

export abstract class AService implements IService {
    abstract isConnected(): boolean;
}