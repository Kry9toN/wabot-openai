const qrcode = require('qrcode-terminal')
const { generate_image, chatcompletion } = require('./api/openai')
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { url } = require('inspector');

const prefix = '!'

// Use the saved values
const client = new Client({
    authStrategy: new LocalAuth({ clientId: "client-one" })
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('Scan QR bellow!');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});
 
client.on('message', async message => {
    console.info(`[!] Recived message "${message.body}" from ${message.from}`)
    const messageSplit = message.body.split(" ")
    const cmd = messageSplit[0]
    const args = message.body.trim().split(/ +/).slice(1)
    const agrsMessage = args.slice().join(' ')
    
    if (!message.body.startsWith(prefix)) return

    if (cmd == '!ping') {
        message.reply('pong');
    }
    if (cmd == '!image') {
        message.reply('Processed text to image')
        try {
            const url = await generate_image(agrsMessage);
            if (url.length > 1) {
                for (let i = 0; i < url.length; i++) {
                    const media = await MessageMedia.fromUrl(url[i].url);
                    message.reply(media);
                }
            } 
        } catch(e) {
            console.log(`[!] Error "${e}" from ${message.from}`);
        }
    }
    if (cmd == '!chat') {
        try {
            const chat = await chatcompletion(agrsMessage);
            message.reply(chat);
        } catch(e) {
            console.log(`[!] Error "${e}" from ${message.from}`);
        }
    }
});

client.initialize();