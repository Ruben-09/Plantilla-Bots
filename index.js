require('dotenv').config()
const { Client, Collection } = require('discord.js')
const client = new Client({ ws: { properties: { $browser: 'Discord Android' }}})
const { readdirSync, statSync } = require('fs')

const ascii = require('ascii-table')
const table = new ascii().setHeading('Comando', 'Carpeta')
const event = new ascii().setHeading('Evento')

client.commands = new Collection()
client.devs = require('./src/utils/devs.json').devs

function getDirectorios() {
  return readdirSync('./src/commands').filter(function subFolder(file) {
    return statSync(`./src/commands/${file}`).isDirectory()
  })
}

const cmdFiles = readdirSync('./src/commands').filter(file => file.endsWith('.js'))

for (const Folder of getDirectorios()) {
  const FolderFile = readdirSync(`./src/commands/${Folder}`).filter(end => end.endsWith('.js'))
  for (const File of FolderFile) {
    cmdFiles.push([Folder, File])
  }
}

for (const file of cmdFiles) {
  let cmd;
  if(Array.isArray(file)) {
    cmd = require(`./src/commands/${file[0]}/${file[1]}`)
  } else {
    cmd = require(`./src/commands/${file}`)
  }
  client.commands.set(cmd.name, cmd)
  table.addRow(cmd.name, file[0])
}
console.log(table.toString())

for(const file of readdirSync('./src/events/')) {
	if(file.endsWith('.js')) {
		let fileName = file.substring(0, file.length - 3)
		let fileContents = require(`./src/events/${file}`)
		client.on(fileName, fileContents.bind(null, client))
    event.addRow(fileName)
	}
}
console.log(event.toString())

client.login(process.env.TOKEN).then(() => {
  console.log('Bot iniciado correctamente')
}).catch(error => {
  console.log('Error al iniciar sesion: '+error)
})
