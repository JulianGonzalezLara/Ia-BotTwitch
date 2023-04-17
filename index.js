import tmi from 'tmi.js'
import dotenv from 'dotenv'
import process from 'node:process'

dotenv.config()
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const CHANNEL = 'Juli45G'

const client = new tmi.Client({
  options: { debug: false },
  identity: {
    username: USER,
    password: PASSWORD
  },
  channels: [CHANNEL]
})

client.connect()

client.on('message', (channel, tags, message, self) => {
    if (self) return;

    console.log(tags)
    const username = tags.username
    const displayName = tags['display-name']
    const isFirstMessage = tags['first-msg']
    const isMod = tags.mod
    const isSubscriber = tags.subscriber
	console.log(`${channel} ${displayName}: ${message}`)
    client.say(CHANNEL, 'Hola')
})