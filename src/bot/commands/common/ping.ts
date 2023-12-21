import { ApplicationCommandType } from 'discord.js';
import { Command } from '../../structures/command.structure';

export default new Command({
  name: 'ping',
  description: 'Moni-Thor deve retornar "pong"',
  type: ApplicationCommandType.ChatInput,
  run({ interaction }) {
    interaction.reply({ ephemeral: true, content: 'pong' });
  },
});
