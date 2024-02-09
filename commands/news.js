import * as discord from 'discord.js';
import emojis from '../data/emojis.js';

export default {
    deploy: new discord.SlashCommandBuilder()
        .setName(`news`)
        .setDescription(`Get any Blacket News article.`)
        .addIntegerOption(o => o.setName('index').setDescription('The news post index. Leave blank for the most recent post.').setRequired(true)),

    async run(interaction, client, blacket) {
        let news = await blacket.news();

        let post = news[interaction.options.getInteger('index') - 1 || 0];

        if (!post || interaction.options.getInteger('index') < 1) return interaction.editReply({
            embeds: [
                new discord.EmbedBuilder()
                    .setDescription(`${emojis.Error} **That isn't a valid news post number.**`)
            ],
            ephemeral: true
        })

        interaction.editReply({
            embeds: [
                new discord.EmbedBuilder()
                    .setTitle(post.title.replaceAll('&amp;', '&').replace('<br>', ''))
                    .setDescription(post.body = post.body
                        .replace(/<b>|<\/b>/g, '**')
                        .replace(/<div>/g, '')
                        .replace(/<br>|<\/div>/g, '\n')
                        .replace('&lt;', '<')
                        .replace('&gt;', '>')
                        .replace(/<iframe(.*?)iframe>/g, `[ **EMBED** ]\n\n`)
                        .replace(/<i>|<\/i>/g, '*'))
                    .setImage(post.image.startsWith('https') ? post.image : 'https://blacket.org' + post.image.replaceAll(' ', '%20'))
            ]
        })
    }
}