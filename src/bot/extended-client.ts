import {
  Client,
  Partials,
  IntentsBitField,
  BitFieldResolvable,
  GatewayIntentsString,
  Collection,
  ApplicationCommandDataResolvable,
  ClientEvents,
} from 'discord.js';
import { discordVariables } from '../config/variables.config';
import {
  CommandType,
  ComponentsButton,
  ComponentsModal,
  ComponentsSelect,
} from './structures/command.structure';
import fs from 'fs';
import path from 'path';
import { EventType } from './structures/event.structure';
import { logTool } from '../shared/tools/index';

export class ExtendedClient extends Client {
  public commands: Collection<string, CommandType> = new Collection();
  public buttons: ComponentsButton = new Collection();
  public modals: ComponentsModal = new Collection();
  public selects: ComponentsSelect = new Collection();

  constructor() {
    super({
      intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<
        GatewayIntentsString,
        number
      >,
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
      ],
    });
  }

  public start() {
    const { botToken } = discordVariables;
    this.registerModules();
    this.registerEvents();
    this.login(botToken);
  }

  private registerCommands(commands: Array<ApplicationCommandDataResolvable>) {
    this.application?.commands
      .set(commands)
      .then(() => {
        logTool.dynamicMessage({
          message: 'Slash Commands (/) defined',
        });
      })
      .catch((error) => {
        logTool.error({
          errorMessage: `An error ocurred while trying to set the Slash Commands (/)`,
          errorStack: error,
        });
      });
  }

  private async registerModules() {
    const slashCommands: Array<ApplicationCommandDataResolvable> = [];

    const commandsPath = path.join(__dirname, '.', 'commands');

    fs.readdirSync(commandsPath).forEach((subFolderName) => {
      const commandFilesFiltered = fs
        .readdirSync(commandsPath + `/${subFolderName}/`)
        .filter((fileName) => this.checkIfIsDesiredExtensions(fileName));

      commandFilesFiltered.forEach(async (fileName) => {
        const command: CommandType = (
          await import(`./commands/${subFolderName}/${fileName}`)
        )?.default;

        const { name, buttons, selects, modals } = command;

        if (name) {
          this.commands.set(name, command);
          slashCommands.push(command);

          if (buttons)
            buttons.forEach((run, key) => this.buttons.set(key, run));
          if (modals) modals.forEach((run, key) => this.modals.set(key, run));
          if (selects)
            selects.forEach((run, key) => this.selects.set(key, run));
        }
      });
    });

    this.on('ready', () => this.registerCommands(slashCommands));
  }

  private checkIfIsDesiredExtensions(filename: string): boolean {
    return filename.endsWith('.ts') || filename.endsWith('.js');
  }

  private async registerEvents() {
    const eventsPath = path.join(__dirname, '.', 'events');

    const eventsSubFoldersName = fs.readdirSync(eventsPath);

    eventsSubFoldersName.forEach((subFolderName) => {
      const eventsFilesFiltered = fs
        .readdirSync(`${eventsPath}/${subFolderName}`)
        .filter((eventFileName) =>
          this.checkIfIsDesiredExtensions(eventFileName),
        );

      eventsFilesFiltered.forEach(async (eventFileName) => {
        const { name, once, run }: EventType<keyof ClientEvents> = (
          await import(`./events/${subFolderName}/${eventFileName}`)
        )?.default;

        try {
          if (name) once ? this.once(name, run) : this.on(name, run);
        } catch (error) {
          logTool.error({
            errorMessage: `An error ocurred on event (${name})`,
            errorStack: error,
          });
        }
      });
    });
  }
}
