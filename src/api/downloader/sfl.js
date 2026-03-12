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
error: "Isi parameter apikey."
})
}

const apikeyList = config?.apikey || []

if (!apikeyList.includes(apikey)) {
return res.json({
status: false,
error: "Apikey tidak valid."
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

const subject = random.subject.replace(/\(nama\)/g, nama)
const text = random.text.replace(/\(nama\)/g, nama)

return res.json({
status: true,
creator: config.creator,
subject,
text
})

} catch (err) {

console.error(err)

return res.status(500).json({
status: false,
error: "Gagal mengambil method."
})

}

})

}
