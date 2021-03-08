import { Message } from "discord.js";

declare module "discord.js" {
    export interface Client {
        commands: Collection<unknown, Command>
    }

    export interface Command {
        name: string,
        description: string,
        args: boolean,
        usage: string,
        guildOnly: boolean,
        execute: (message: Message, args: string[]) => Promise<any> // Can be `Promise<SomeType>` if using async
    }
}