import { ICreateUrlConfig } from "./IUtil"

export function getEnvFormattedName(varName: string): string {
    return varName.split('').map((c: string, i: number, arr: string[]) => {
        if (i > 0) {
            const prevUpper: boolean = arr[i - 1].toUpperCase() == arr[i - 1];
            const currentUpper: boolean = arr[i].toUpperCase() == arr[i];
            if (!prevUpper && currentUpper) {
                return "_" + c.toUpperCase();
            }
            else {
                return c.toUpperCase();
            }
        } else {
            return c.toUpperCase();
        }
    }).join('');
}

export function createUrl(config: ICreateUrlConfig): string {

    let url = config.host;

    if (config.port) {
        url = url + ":" + config.port;
    }

    if (config.username) {
        if (config.password) {
            url = config.username + ":" + config.password + "@" + url;
        } else {
            url = config.username + "@" + url;
        }
    }

    if (config.protocol) {
        url = config.protocol + "://" + url;
    }

    return url;
}