import { IController, IControllerConfig } from "./IController";

export abstract class AController implements IController {
    protected _isInitialized = false;
   
    isInitialized(): boolean {
        return this._isInitialized;;
    }
}