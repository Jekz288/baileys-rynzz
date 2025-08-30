const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const P = require("pino")

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys")

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: true
  })

  // simpan kredensial biar gak login ulang
  sock.ev.on("creds.update", saveCreds)

  // Banner
  console.log(`
=================================================
🔥 TANJIRO CRASHER (Baileys Rynzz) 🔥
✅ Bot Berhasil berjalan.... 
=================================================
`)

  // Handler pesan
  sock.ev.on("messages.upsert", async (msg) => {
    const m = msg.messages[0]
    if (!m.message) return

    const text = 
      m.message.conversation || 
      m.message.extendedTextMessage?.text || 
      ""

    if (text.toLowerCase() === ".ping") {
      await sock.sendMessage(m.key.remoteJid, { text: "📢 Pong! Bot aktif ✅" })
    }

    if (text.toLowerCase() === ".menu") {
      await sock.sendMessage(m.key.remoteJid, { text: `
🔹 *TANJIRO BOT MENU* 🔹
1. .menu → menampilkan menu
2. .ping → cek status bot
` })
    }
  })
}

startSock()
