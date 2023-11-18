import tmi from 'tmi.js'
import dotenv from 'dotenv'
import process from 'node:process'
import IGNORED_USERS from './ignoredUsers.json' assert {type: 'json'}
import {queryGPT, queryGPTChiste} from './modules/gpt.js'
import {queryGPTFirstMessage} from './modules/gpt.js'

dotenv.config()
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const CHANNEL = 'Juli45G'

const express = require("express");
const app = express();

// This line is important to ensure your app listens to the PORT env var
const port = process.env.PORT ?? 8080;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

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

    const isChoosen = Math.floor(Math.random() * 10) === 0

    const isLongMessage = message.length > 30

    const split = message.split(' ')

    if(split[0] === "@juli45g_ia"){

      if(split[1] === "chiste"){
        const { total_tokens, content, type } = await queryGPTChiste(message)
        if (type === "error" || total_tokens === 0) {
          return
        }
        client.say(CHANNEL, `@${username}, ${content}`)
      } else{
        const { total_tokens, content, type } = await queryGPT(message.slice(11))
        if (type === "error" || total_tokens === 0) {
          return
        }
        client.say(CHANNEL, `@${username} Personalidad: ${type}, ${content}`)
      }
      // console.log(`${displayName}: ${message}`)
      // console.log(`${content} (${total_tokens}), (${type})`)
    } else if(isChoosen && isLongMessage){
      const { total_tokens, content, type } = await queryGPT(message)
      if (type === "error" || total_tokens === 0) {
        return
      }
      client.say(CHANNEL, `@${username} Personalidad: ${type}, ${content}`)
      // console.log(`${displayName}: ${message}`)
      // console.log(`${content} (${total_tokens}), (${type})`)
    } else if(isFirstMessage){
      const { total_tokens, content } = await queryGPTFirstMessage(message)
      if (total_tokens === 0) {
        return
      }
      client.say(CHANNEL, `@${username}, ${content}`)
    } 
    // else if(username === "juli45g"){
    //   const { total_tokens, content, type } = await queryGPT(message)
    //   if (type === "error" || total_tokens === 0) {
    //     return
    //   }
    //   client.say(CHANNEL, `@${username} Personalidad: ${type}, ${content}`)
    // }
})