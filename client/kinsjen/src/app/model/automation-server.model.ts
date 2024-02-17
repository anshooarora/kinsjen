import { AuthToken as AuthToken } from "./auth-token.model";
import { AutomationServerType } from "./automation-server-type.model";

export class AutomationServer {
    id: number = 0;
    name: string = '';
    url: string = '';
    type: string = 'Jenkins';
    authTokens: AuthToken[] = []
}
