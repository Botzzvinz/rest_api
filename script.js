const logs = document.getElementById("logs")
const sendBtn = document.getElementById("sendGet")
const responseBox = document.getElementById("response")
const statusCode = document.getElementById("statusCode")

const apikeyInput = document.getElementById("apikey")
const urlInput = document.getElementById("url")

function log(text){

const time = new Date().toLocaleTimeString()

logs.innerHTML += "["+time+"] "+text+"\n"

logs.scrollTop = logs.scrollHeight

}

sendBtn.onclick = async ()=>{

const apikey = apikeyInput.value
const url = urlInput.value

if(!apikey || !url){

responseBox.innerText = JSON.stringify({
status:false,
message:"apikey dan url wajib diisi"
},null,2)

return

}

const endpoint = `/api/skip/safelinku?apikey=${apikey}&url=${encodeURIComponent(url)}`

log("Incoming GET "+endpoint)

try{

const res = await fetch(endpoint)

statusCode.innerText = "Status: " + res.status

const data = await res.json()

responseBox.innerText = JSON.stringify(data,null,2)

if(res.status === 200){

log("Response 200 OK")

}else{

log("Response "+res.status+" ERROR")

}

}catch(err){

statusCode.innerText = "Status: NETWORK ERROR"

responseBox.innerText = JSON.stringify({
status:false,
message:"server tidak dapat dihubungi"
},null,2)

log("Network Error")

}

}   