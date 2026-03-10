const axios = require("axios")
const cheerio = require("cheerio")
const config = require("../config")

async function skipSafelinku(url) {
    try {

        const headers = {
            "User-Agent": "Mozilla/5.0",
            "Referer": url
        }

        // ambil halaman pertama
        const page = await axios.get(url, { headers })

        const $ = cheerio.load(page.data)

        const token = $('input[name="_token"]').val()

        if (!token) {
            return {
                status: false,
                message: "Token tidak ditemukan"
            }
        }

        const action = $("form").attr("action")

        const postUrl = action.startsWith("http")
            ? action
            : new URL(action, url).href

        const data = new URLSearchParams()
        data.append("_token", token)

        const post = await axios.post(
            postUrl,
            data.toString(),
            {
                headers: {
                    ...headers,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                maxRedirects: 0,
                validateStatus: null
            }
        )

        const final = post.headers.location

        if (!final) {
            return {
                status: false,
                message: "Link tujuan tidak ditemukan"
            }
        }

        return {
            status: true,
            result: final
        }

    } catch (err) {
        return {
            status: false,
            message: "Gagal bypass safelinku",
            error: err.message
        }
    }
}

module.exports = function (app) {

    app.get("/download/safelinku", async (req, res) => {

        const { apikey, url } = req.query

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

        if (!url) {
            return res.json({
                status: false,
                error: "URL Safelinku tidak boleh kosong."
            })
        }

        const safelinkuDomains = [
            "safelinku.com",
            "sfl.gl",
            "safelink.me",
            "safelink.id"
        ]

        const isSafelinku = safelinkuDomains.some(domain => url.includes(domain))

        if (!isSafelinku) {
            return res.json({
                status: false,
                error: "URL Safelinku tidak valid."
            })
        }

        try {

            const result = await skipSafelinku(url)

            res.json(result)

        } catch (error) {

            console.error(error)

            res.status(500).json({
                status: false,
                error: "Gagal bypass safelinku."
            })

        }

    })

}