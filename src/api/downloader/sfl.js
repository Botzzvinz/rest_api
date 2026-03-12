const config = require('../../settings')

const methods = [
  {
    subject: "[URGENT] Group-IB Scam Report - (nama)",
    text: `FAKE GROUP-IB ACCOUNT
DATE: 10 March 2026
TOTAL ACCOUNT DETECTED: 1

Hello Group-IB Team,

I have identified a fake account impersonating Group-IB on Telegram.

SUSPECT ACCOUNT:
(nama)

REQUESTED ACTIONS:
Apply [FAKE] label to the listed account.
Apply [SCAM] label if the account is actively soliciting funds.

Priority: HIGH`
  }
]

module.exports = function (app) {

  app.get("/mail/method", async (req, res) => {

    const { apikey, nama } = req.query

    if (!apikey) {
      return res.json({
        status: false,
        error: "Isi Parameter Apikey."
      })
    }

    if (!config.apikey.includes(apikey)) {
      return res.json({
        status: false,
        error: "Apikey Tidak Valid!"
      })
    }

    if (!nama) {
      return res.json({
        status: false,
        error: "Parameter nama diperlukan."
      })
    }

    try {

      const random = methods[Math.floor(Math.random() * methods.length)]

      const subject = random.subject.replace("(nama)", nama)
      const text = random.text.replace(/\(nama\)/g, nama)

      res.json({
        status: true,
        subject,
        text
      })

    } catch (err) {

      res.status(500).json({
        status: false,
        error: "Gagal mengambil method"
      })

    }

  })

}
