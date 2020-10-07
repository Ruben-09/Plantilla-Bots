module.exports = {
  name: 'testcommand',
  cooldown: 1,
  description: 'descripción testcommand',
  usage: 'testcommand',
  categoria: 'Test',
  execute(message, client, args) {
  message.channel.send('TestCommand')
  }
}
