const { Collection } = require('discord.js')
const cooldowns = new Collection()

module.exports = (client, message) => {
  if(message.author.bot) return
  if(message.channel.type === 'dm') return
  if(message.content.indexOf(process.env.PREFIX) !== 0) return

  const messageArray = message.content.split(' ')
  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  let cmd = client.commands.get(command) || client.commands.find(x => x.aliases && x.aliases.includes(command))
  if(!cmd) return
  if(!cooldowns.has(cmd.name)) {
    cooldowns.set(cmd.name, new Collection())
  }
  const now = Date.now()
  const timestamps = cooldowns.get(cmd.name)
  const cooldownAmount = (cmd.cooldown || 1) * 1000

  if(timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount

    if(now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      return message.reply(`Espera ${timeLeft.toFixed(1)} segundos para volver a usar el comando`).then(x => x.delete({timeout: 4000}))
    }
  }
  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
  
  try {
    cmd.execute(message, client, args)
  } catch(err) {
    console.error(err)
  } finally {
    console.log(`[${message.guild.name}] ${message.author.tag} » ${message.content}`)
  }
}
