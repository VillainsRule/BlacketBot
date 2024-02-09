import * as discord from 'discord.js';
import emojis from '../data/emojis.js';

export default {
    deploy: new discord.SlashCommandBuilder()
        .setName(`booster`)
        .setDescription(`Get information on the current chance boost.`),

    async run(interaction, client, blacket) {
        let booster = await blacket.booster();
        if (!booster.active) return interaction.editReply({
            embeds: [
                new discord.EmbedBuilder()
                    .setDescription(`${emojis.Error} **There is no active booster.**`)
                    .setColor('#ff0000')
            ]
        });

        let boostingUser = await blacket.user(booster.user);
        await interaction.editReply({
            embeds: [
                new discord.EmbedBuilder()
                    .setDescription(`${booster.multiplier >= 2 ? emojis['3 Hour Booster'] : emojis['1 Hour Booster']} **${boostingUser.user.username}** is boosting chances by **${booster.multiplier}x**. This will end <t:${Math.round(booster.time)}:R>.`)
            ]
        });
    }
}