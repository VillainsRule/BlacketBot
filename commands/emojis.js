import * as discord from 'discord.js';

export default {
    deploy: new discord.SlashCommandBuilder()
        .setName(`emojis`)
        .setDescription(`Server emojis. Built for bot debugging.`)
        .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator),

    async run(interaction, client, blacket) {
        interaction.guild.emojis.fetch().then(async (emojis) => {
            let blooks = await blacket.blooks();
            let emojiString = '';
            let emojiString2 = '';

            let edited = {};
            let moreShit = {};

            emojis.forEach(emoji => {
                Object.entries(blooks).forEach(a => moreShit[a[0].toLowerCase().replaceAll(' ', '').replaceAll('\'', '')] = {
                    ...a[1],
                    name: a[0]
                });
                Object.entries(moreShit).forEach(blook => {
                    if (emoji.name === blook[0]) edited[blook[1].name] = `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`;
                });
                if ([...emojis.keys()].indexOf(emoji.id) > 25) emojiString2 += `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}> \`<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>\`\n`;
                else emojiString += `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}> \`<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>\`\n`;
            });

            interaction.editReply({
                embeds: [
                    new discord.EmbedBuilder()
                        .setTitle(`Guild Emojis`)
                        .setDescription(emojiString),
                    new discord.EmbedBuilder()
                        .setDescription(emojiString2 === '' ? 'See first embed.' : emojiString2)
                ]
            })
        });
    }
}