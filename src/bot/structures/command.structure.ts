import {
  ApplicationCommandData,
  ButtonInteraction,
  Collection,
  CommandInteraction,
  CommandInteractionOptionResolver,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from 'discord.js';
import { ExtendedClient } from '../extended-client';

interface CommandProps {
  client: ExtendedClient;
  interaction: CommandInteraction;
  options: CommandInteractionOptionResolver;
}

export type ComponentsSelect = Collection<
  string,
  (interaction: StringSelectMenuInteraction) => any
>;
export type ComponentsModal = Collection<
  string,
  (interaction: ModalSubmitInteraction) => any
>;
export type ComponentsButton = Collection<
  string,
  (interaction: ButtonInteraction) => any
>;

interface CommandComponents {
  selects?: ComponentsSelect;
  buttons?: ComponentsButton;
  modals?: ComponentsModal;
}

interface ExecutableCommands {
  run(props: CommandProps): any;
}

export type CommandType = ApplicationCommandData &
  CommandComponents &
  ExecutableCommands;

export class Command {
  constructor(options: CommandType) {
    options.dmPermission = false;
    Object.assign(this, options);
  }
}
