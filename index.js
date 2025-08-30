const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
// Wrapper custom kamu
module.exports = require("@whiskeysockets/baileys")
const P = require("pino")
const chalk = require("chalk")

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: true
  })

  sock.ev.on("creds.update", saveCreds)

  console.log(chalk.redBright(`
=================================================
🔥 TANJIRO CRASHER (Baileys Rynzz) 🔥
✅ Bot Berhasil berjalan, Terimaksih sudah memakai bayleys bang rynzz
=================================================
  `))

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    const text =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      ""

    if (text.toLowerCase() === ".ping") {
      await sock.sendMessage(m.key.remoteJid, { text: "🏓 Pong! Bot aktif" })
    }

    if (text.toLowerCase() === ".menu") {
      await sock.sendMessage(m.key.remoteJid, {
        text: `
📌 *TANJIRO BOT MENU*
1. .menu → menampilkan menu
2. .ping → cek status bot
        `,
      })
    }
  })
}

startSock()

process.on("uncaughtException", console.error)
process.on("unhandledRejection", console.error)
