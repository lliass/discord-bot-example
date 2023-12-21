import { Interaction } from 'discord.js';
import { extendedClient } from '../../../bot.index';
import { Event } from '../../structures/event.structure';

export default new Event({
  name: 'interactionCreate',
  run(interaction: Interaction) {
    if (interaction.isModalSubmit())
      extendedClient.modals.get(interaction.customId)?.(interaction);
    if (interaction.isButton())
      extendedClient.buttons.get(interaction.customId)?.(interaction);
    if (interaction.isStringSelectMenu())
      extendedClient.selects.get(interaction.customId)?.(interaction);
  },
});
