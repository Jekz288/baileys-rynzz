const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const P = require("pino")
const qrcode = require("qrcode-terminal")

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys")
  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: true
  })

  sock.ev.on("creds.update", saveCreds)

  // Pesan banner saat bot start
  const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    green: "\x1b[32m"
  };

  const banner = `
${colors.red}
████████╗ █████╗ ███╗   ██╗      ██╗██╗██████╗  ██████╗ 
╚══██╔══╝██╔══██╗████╗  ██║      ██║██║██╔══██╗██╔═══██╗
   ██║   ███████║██╔██╗ ██║      ██║██║██████╔╝██║   ██║
   ██║   ██╔══██║██║╚██╗██║ ██   ██║██║██╔═══╝ ██║   ██║
   ██║   ██║  ██║██║ ╚████║ ╚█████╔╝██║██║     ╚██████╔╝
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚════╝ ╚═╝╚═╝      ╚═════╝ 
${colors.reset}

${colors.yellow}✨ Terimakasih sudah memakai Baileys bang RYNZZ ✨${colors.reset}
${colors.green}📢 Join Channel: @rynzzxmods${colors.reset}
${colors.red}=================================================${colors.reset}
  `;

  console.log(banner)
}

// panggil function biar jalan
startSock()
