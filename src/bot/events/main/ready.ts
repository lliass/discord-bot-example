import { extendedClient } from '../../../bot.index';
import { Event } from '../../structures/event.structure';
import { logTool } from '../../../shared/tools/index';

export default new Event({
  name: 'ready',
  once: true,
  run() {
    const { commands, buttons, selects, modals } = extendedClient;

    logTool.dynamicMessage({ message: 'Bot is Online' });

    const botInformationPayload = {
      'Commands-loaded': commands.size,
      'Buttons-loaded': buttons.size,
      'Selects-Menus-loaded': selects.size,
      'Modals-loaded': modals.size,
    };

    logTool.dynamicMessage({
      message: `${JSON.stringify(botInformationPayload)}`,
    });
  },
});
