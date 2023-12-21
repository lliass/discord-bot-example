import { ApplicationCommandType } from 'discord.js';
import { Command } from '../../structures/command.structure';

export default new Command({
  name: 'listar',
  description: 'Lisa uma fila de monitores',
  type: ApplicationCommandType.ChatInput,
  run({ interaction }) {
    interaction.reply({ ephemeral: true, content: '' });
  },
});
