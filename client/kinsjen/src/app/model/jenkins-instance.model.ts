import { Credential as Credential } from "./credential.model";
import { AutomationServerType } from "./automation-server-type.model";

export class JenkinsInstance {
    id: number = 0;
    name: string = '';
    url: string = '';
    type: string = 'Jenkins';
}
