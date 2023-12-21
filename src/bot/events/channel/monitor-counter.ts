import { Event } from '../../structures/event.structure';
import { dateHelper } from '../../../shared/helpers/index';
import { extendedClient } from '../../../bot.index';
import { Channel } from 'discord.js';
import { monitorService } from '../../services/monitor/index';
import { logTool } from '../../../shared/tools/index';

export default new Event({
  name: 'voiceStateUpdate',
  async run(oldChannel, newChannel) {
    try {
      const { member } = newChannel;

      const memberRolesBelongToMonitorRoles = member?.roles.cache.some((role) =>
        monitorService.checkIfTheRoleBelongToTheRoleOfMonitor(role.name),
      );

      const currentDate = dateHelper.getFormattedDateFromAmericaSaoPaulo(
        new Date(),
      );

      const monitorCanWorkOnTheCurrentDay =
        monitorService.checkIfTheMonitorCanWorkOnTheCurrentDay(currentDate);

      if (!memberRolesBelongToMonitorRoles || !monitorCanWorkOnTheCurrentDay)
        return;

      const channelCategoryParentId =
        newChannel.channel?.parentId &&
        newChannel.channel?.parentId !== oldChannel.channel?.parentId
          ? newChannel.channel?.parentId
          : oldChannel.channel?.parentId;

      // Just to get the name of the category channel
      const channelCategoryInformations = (await extendedClient.channels.fetch(
        String(channelCategoryParentId),
      )) as Channel & { name: string };

      const currentCategoryChannelIsPartOfMonitoringChannels =
        monitorService.checkIfTheChannelIsPartOfTheMonitoringChannels(
          channelCategoryInformations.name,
        );

      if (!currentCategoryChannelIsPartOfMonitoringChannels) return;

      const monitorIsEnteringOnTheChannel = !oldChannel.channelId;

      const monitorIsComingOutOnTheChannel = !newChannel.channelId;

      const monitoringDocumentDate = monitorService.getMonitoringDocumentDate();

      const formattedMonitoringDocumentDate = new Date(monitoringDocumentDate);

      const isMonitorsEntryWithinMonitoringTime =
        monitorService.checkIfTheMonitorsEntryIsWithinMonitoringTime(
          currentDate,
        );

      const isMonitorsExitWithinMonitoringTime =
        monitorService.checkIfTheMonitorsExitIsWithinMonitoringTime(
          currentDate,
        );

      if (monitorIsEnteringOnTheChannel && isMonitorsExitWithinMonitoringTime) {
        monitorService.monitorActionsOnMonitoringChannels({
          action: 'entered',
          monitorName: member?.user.username as string,
        });

        const monitoringDayExist =
          await monitorService.verifyIfTheMonitoringDayExist(
            formattedMonitoringDocumentDate,
          );

        if (monitoringDayExist) {
          await monitorService.insertMonitorInMonitoringTrackingIfTheyDoNotExist(
            {
              creationDocumentDate: formattedMonitoringDocumentDate,
              monitorUserName: member?.user.username as string,
              accessOutOfTime: isMonitorsEntryWithinMonitoringTime,
            },
          );
        } else {
          await monitorService.createMonitoringTrackingAndTheFirstMonitor({
            creationDocumentDate: formattedMonitoringDocumentDate,
            monitorUserName: member?.user.username as string,
            accessOutOfTime: isMonitorsEntryWithinMonitoringTime,
          });
        }
      } else if (
        monitorIsComingOutOnTheChannel &&
        isMonitorsEntryWithinMonitoringTime
      ) {
        monitorService.monitorActionsOnMonitoringChannels({
          action: 'left',
          monitorName: member?.user.username as string,
        });
        await monitorService.updateMonitorsLastExitInMonitoringTracking({
          creationDocumentDate: formattedMonitoringDocumentDate,
          monitorUserName: member?.user.username as string,
          accessOutOfTime: isMonitorsExitWithinMonitoringTime,
        });
      } else {
        // TODO: Improve this logic to analyze the last monitoring channel that the monitor entry
      }
    } catch (error) {
      logTool.error({
        errorMessage: 'An error on Monitor Counter event',
        errorStack: error,
      });
    }
  },
});
