const axios = require("axios")
const cheerio = require("cheerio")

async function skipSafelinku(url){

try{

const headers = {
"User-Agent":"Mozilla/5.0"
}

const page = await axios.get(url,{headers})

const $ = cheerio.load(page.data)

let token = $('input[name="_token"]').val()

if(!token){
return {
status:false,
message:"token tidak ditemukan"
}
}

const action = $("form").attr("action")

const post = await axios.post(action,{
_token: token
},{
headers:{
...headers,
"content-type":"application/x-www-form-urlencoded"
},
maxRedirects:0,
validateStatus:null
})

let final = post.headers.location

if(!final){
return {
status:false,
message:"link tidak ditemukan"
}
}

return {
status:true,
result:final
}

}catch(err){

return {
status:false,
message:"gagal bypass safelinku",
error:err.message
}

}

}

module.exports = skipSafelinku