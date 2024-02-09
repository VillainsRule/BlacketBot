import * as discord from 'discord.js';
import items from '../data/items.js';
import emojis from '../data/emojis.js';

export default {
    deploy: new discord.SlashCommandBuilder()
        .setName(`shop`)
        .setDescription(`Get information about the Blacket shop.`)
        .addSubcommand(s => s.setName('weekly').setDescription('Get the weekly shop.'))
        .addSubcommand(s => s.setName('item').setDescription('Get the item shop.')),

    async run(interaction, client, blacket) {
        if (interaction.options.getSubcommand() === 'weekly') {
            let shop = await blacket.shop.weekly();

            await interaction.editReply({
                embeds: [
                    new discord.EmbedBuilder()
                        .setTitle(`**Weekly Shop**`)
                        .setColor(`#a90be3`)
                        .addFields(Object.entries(shop).map(item => {
                            return {
                                name: item[0],
                                value: `${emojis.Token} ${item[1].price}`
                            };
                        }))
                        .setThumbnail(`https://blacket.org/content/mark.png`)
                ]
            });
        } else {
            await interaction.editReply({
                embeds: [
                    new discord.EmbedBuilder()
                        .setTitle(`**Item Shop**`)
                        .setColor(`#a90be3`)
                        .addFields([{
                            name: 'Stealth Disguise Kit',
                            price: 250000
                        }, {
                            name: 'Fragment Grenade',
                            price: 100000
                        }, {
                            name: 'Clan Shield',
                            price: 100000
                        }].map(item => {
                            return {
                                name: item.name,
                                value: `${emojis.Token} ${item.price}`
                            };
                        }))
                        .setThumbnail(`https://blacket.org/content/mark.png`)
                ]
            });
        }
    }
}