import tmi from 'tmi.js'
import dotenv from 'dotenv'
import process from 'node:process'
import IGNORED_USERS from './ignoredUsers.json' assert {type: 'json'}
import {queryGPT} from './modules/gpt.js'

dotenv.config()
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const CHANNEL = 'Juli45G'
// const IGNORED_USERS = ['streamelements']

const client = new tmi.Client({
  options: { debug: false },
  identity: {
    username: USER,
    password: PASSWORD
  },
  channels: [CHANNEL]
})

client.connect()

client.on('message', async (channel, tags, message, self) => {
    if (self) return;

    //console.log(tags)
    const username = tags.username
    const displayName = tags['display-name']
    const isFirstMessage = tags['first-msg']
    const isMod = tags.mod
    const isSubscriber = tags.subscriber
    const isVip = Boolean(tags.vip)

    if (IGNORED_USERS.includes(username)){
      return
    }

    if(username === "juli45g"){
      const { total_tokens, content } = await queryGPT(message)
      console.log(`${displayName}: ${message}`)
      console.log(`${content} (${total_tokens})`)
    }
})