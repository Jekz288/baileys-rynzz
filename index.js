const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const P = require("pino")
const qrcode = require("qrcode-terminal")

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys")
  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: true // biar langsung keluar QR di console
  })

  sock.ev.on("creds.update", saveCreds)

  // Pesan banner saat bot start
  console.log("=====================================")
  console.log("✅ Terimakasih sudah memakai Baileys Rynzz")
  console.log("📌 Bot berhasil dijalankan...")
  console.log("=====================================")

  // Event masuk grup / pesan
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    if (m.key.remoteJid === "status@broadcast") return // abaikan status

    const pesan = m.message.conversation || m.message.extendedTextMessage?.text || ""

    if (pesan.toLowerCase() === "menu") {
      await sock.sendMessage(m.key.remoteJid, { text: "Halo! 👋 Selamat menggunakan bayles bang rynzz" }, { quoted: m })
    }
  })
}

startSock()