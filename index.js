const Discord = require('discord.js'); //เรียก discord.js มาใช้
const config = require('./config.json')
const axios = require('axios')
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
//ประกาศ client ขึ้นมา
//event นี้ทำงานเมื่อ login สำเร็จ
client.on('ready', () => {
    client.user.setActivity('with by ♥ WANYEN ♥#9999', { type: 'PLAYING' });
    console.log('ready!' + client.user.tag);
});
//รอรับ event message เวลามีข้อความโผล่มาในแชท function นี้ก็จะทำงาน
client.on('message', message => {

    const msg = message.content.split(' ')
    console.log(msg)
    const link = message.content.split('https://gift.truemoney.com/campaign/?v=')
    console.log(link)
    if (msg[0] === config.perfix + 'help') {
        message.reply(config.perfix + config.commad + '  เพื่อเติมเงิน')
    }
    if (msg[0] === config.perfix + config.commad) {
        message.reply(config.perfix + config.commad + ': ลิ้งอังเป่า')
        axios({
                method: 'POST',
                url: 'https://gift.truemoney.com/campaign/vouchers/' + link[1] + '/redeem',
                headers: {
                    'accept': 'application/json',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'en-US,en;q=0.9',
                    'content-length': '59',
                    'content-type': 'application/json',
                    'origin': 'https://gift.truemoney.com',
                    'referer': 'https://gift.truemoney.com/campaign/?v=' + link[1],
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66',
                },
                data: {
                    mobile: config.phone,
                    voucher_hash: link[1],
                }

            })
            .then(function(response) {
                console.log(response);
                if (response.status === 200 || 304) {
                    message.reply('เติมเงินสำเร็จ : ' + response.data.data.voucher.redeemed_amount_baht)
                    var role = message.guild.roles.find(role => role.name === config.role);
                    message.member.addRole(role);
                } else if (response.status === 400 || 404) {
                    message.reply('ไม่สามารถเติมได้')
                }

            })
            .catch(function(error) {
                console.log(error);
            })


    } else if (msg[1] === 'undefined') {
        message.reply('ลิ้งอังเป่าไม่ถูกต้อง')
    }

});
client.login(config.token);