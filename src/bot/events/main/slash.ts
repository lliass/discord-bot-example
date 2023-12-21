import { CommandInteractionOptionResolver, Interaction } from 'discord.js';
import { extendedClient } from '../../../bot.index';
import { Event } from '../../structures/event.structure';

export default new Event({
  name: 'interactionCreate',
  run(interaction: Interaction) {
    const interactionIsNotACommand = !interaction.isCommand();

    if (interactionIsNotACommand) return;

    const command = extendedClient.commands.get(interaction.commandName);

    const commandDoesNotExist = !command;

    if (commandDoesNotExist) return;

    const options = interaction.options as CommandInteractionOptionResolver;

    command.run({ client: extendedClient, interaction, options });
  },
});
