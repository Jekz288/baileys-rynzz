const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} = require("@whiskeysockets/baileys")

const pino = require("pino")

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: true
  })

  sock.ev.on("creds.update", saveCreds)

  // 🚀 Tambahin banner/log sukses
  console.log(`
=========================================
🔥 TANJIRO CRASHER 🔥
✅ Bot berhasil berjalan di Baileys v${version.join(".")}
=========================================
  `)

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ""

    if (text.toLowerCase() === ".ping") {
      await sock.sendMessage(msg.key.remoteJid, { text: "🏓 Pong! Bot aktif" })
    }

    if (text.toLowerCase() === ".menu") {
      await sock.sendMessage(msg.key.remoteJid, { text: `
*📜 TANJIRO BOT MENU*
1. .ping → cek status
2. .menu → tampilkan menu
      ` })
    }
  })
}

startSock()
