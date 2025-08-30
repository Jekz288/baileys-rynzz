const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys")
const P = require("pino")
const qrcode = require("qrcode-terminal")

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")
  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: true
  })

  sock.ev.on("creds.update", saveCreds)

  // Auto Reconnect
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log("❌ Koneksi terputus, reconnect =", shouldReconnect)
      if (shouldReconnect) {
        startSock()
      } else {
        console.log("❌ Bot logout, silakan scan ulang.")
      }
    } else if (connection === "open") {
      console.log("✅ Bot berhasil tersambung!")
    }
  })

  // Banner TANJIRO
  const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    cyan: "\x1b[36m"
  }

  const banner = `
${colors.cyan}
████████╗ █████╗ ███╗   ██╗      ██╗██╗██████╗  ██████╗ 
╚══██╔══╝██╔══██╗████╗  ██║      ██║██║██╔══██╗██╔═══██╗
   ██║   ███████║██╔██╗ ██║      ██║██║██████╔╝██║   ██║
   ██║   ██╔══██║██║╚██╗██║ ██   ██║██║██╔═══╝ ██║   ██║
   ██║   ██║  ██║██║ ╚████║ ╚█████╔╝██║██║     ╚██████╔╝
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚════╝ ╚═╝╚═╝      ╚═════╝ 
${colors.reset}

${colors.yellow}THANKS ,SUDAH MEMAKAI BAYLEYS BANG RYNZZ${colors.reset}
${colors.green}📢 Terimakasih sudah memakai Baileys versi RYNZZ${colors.reset}
${colors.red}=================================================${colors.reset}
  `

  console.log(banner)
}

startSock()