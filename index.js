const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const P = require("pino")
const qrcode = require("qrcode-terminal")

async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys")
    const { version } = await fetchLatestBaileysVersion()
    const sock = makeWASocket({
        version,
        auth: state,
        logger: P({ level: "silent" }),
        printQRInTerminal: true
    })

    sock.ev.on("creds.update", saveCreds)

    // Banner di console
    const banner = `
████████╗ █████╗ ███╗   ██╗      ██╗██╗██████╗  ██████╗ 
╚══██╔══╝██╔══██╗████╗  ██║      ██║██║██╔══██╗██╔═══██╗
   ██║   ███████║██╔██╗ ██║      ██║██║██████╔╝██║   ██║
   ██║   ██╔══██║██║╚██╗██║ ██   ██║██║██╔═══╝ ██║   ██║
   ██║   ██║  ██║██║ ╚████║ ╚█████╔╝██║██║     ╚██████╔╝
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚════╝ ╚═╝╚═╝      ╚═════╝ 

✨ Terimakasih sudah Membeli script Tanjiro v 2.0.0✨
📢 Join Channel: @rynzzxmods
=================================================
    `
    console.log(banner)

    // Event pesan masuk
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0]
        if (!m.message) return
        const from = m.key.remoteJid
        const type = Object.keys(m.message)[0]

        let textMsg = (type === "conversation") ? m.message.conversation :
                      (type === "extendedTextMessage") ? m.message.extendedTextMessage.text : ""

        // Command menu
        if (textMsg.toLowerCase() === ".menu") {
            let menuText = `👋 Halo! Ini *Tanjiro Bot*
            
📌 Menu yang tersedia:
1. .menu → Menampilkan menu
2. Bisa dipakai di Grup & Pribadi
3. Tambahkan command lain di index.js`

            await sock.sendMessage(from, { text: menuText })
        }

        // Command ping
        if (textMsg.toLowerCase() === ".ping") {
            await sock.sendMessage(from, { text: "🏓 Pong! Bot aktif" })
        }
    })
}

startSock()