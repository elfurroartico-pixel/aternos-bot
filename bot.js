const mineflayer = require('mineflayer')

const SERVER_IP = 'survivalrarito.aternos.me'
const USERNAME = 'BotAFK'

function startBot(){

console.log("Intentando conectar al servidor...")

const bot = mineflayer.createBot({
  host: SERVER_IP,
  port: 39057,
  username: USERNAME,
  version: false
})

bot.on('login', () => {
  console.log("Bot logeado")
})

bot.on('spawn', () => {

  console.log("Bot conectado al mundo")

  // ponerse en espectador
  setTimeout(()=>{
    bot.chat('/gamemode spectator')
  },5000)

  startAntiAFK(bot)

})

function startAntiAFK(bot){

  setInterval(()=>{

    const actions = ['forward','back','left','right']

    const action = actions[Math.floor(Math.random()*actions.length)]

    bot.setControlState(action,true)

    // girar cámara
    const yaw = Math.random() * Math.PI * 2
    const pitch = (Math.random()-0.5) * Math.PI

    bot.look(yaw,pitch,true)

    // saltar
    bot.setControlState('jump',true)

    setTimeout(()=>{
      bot.setControlState(action,false)
      bot.setControlState('jump',false)
    },2000)

  },25000)

}

function randomClicks(bot){

  setInterval(()=>{

    try{

      bot.swingArm()

      if(bot.entity){
        bot.look(
          bot.entity.yaw + (Math.random()-0.5),
          bot.entity.pitch + (Math.random()-0.5),
          true
        )
      }

    }catch(e){}

  },15000)

}

randomClicks(bot)

bot.on('kicked', reason=>{
  console.log("Kick:",reason)
})

bot.on('error',err=>{

  if(err.code === "ECONNRESET"){
    console.log("ECONNRESET detectado")
  }

  console.log("Error:",err)
})

bot.on('end',()=>{

  console.log("Desconectado del servidor")
  console.log("Reconectando en 20 segundos...")

  setTimeout(startBot,20000)

})

}

startBot()