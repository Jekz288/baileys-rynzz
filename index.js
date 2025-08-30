const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

const pino = require("pino")

async function startSock() {
  // simpan data auth di folder "auth_info"
  const { state, saveCreds } = await useMultiFileAuthState("auth_info")

  // ambil versi WhatsApp Web terbaru
  const { version } = await fetchLatestBaileysVersion()

  // buat koneksi bot
  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: true
  })

  // simpan session setiap ada update
  sock.ev.on("creds.update", saveCreds)

  // 🚀 Banner saat bot start
  console.log(`
=========================================
🔥 TANJIRO CRASHER 🔥
✅ Bot berhasil berjalan di Baileys v${version.join(".")}
=========================================
  `)

  // handler pesan masuk
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const from = msg.key.remoteJid
    const isGroup = from.endsWith("@g.us")

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ""

    if (text.toLowerCase() === ".ping") {
      await sock.sendMessage(from, { text: "🏓 Pong! Bot aktif" })
    }

    if (text.toLowerCase() === ".menu") {
      let menuText = `
*📜 TANJIRO BOT MENU*
1. .ping → cek status
2. .menu → tampilkan menu
`
      menuText += isGroup
        ? "\n📢 Catatan: Command ini dipakai di *Group Chat*"
        : "\n📩 Catatan: Command ini dipakai di *Private Chat*"

      await sock.sendMessage(from, { text: menuText })
    }
  })
}

startSock()
