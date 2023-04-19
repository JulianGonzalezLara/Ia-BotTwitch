import personalities from '../personalities.json' assert { type: 'json' }

export const getPersonality = () => {
    const i = Math.floor(Math.random() * personalities.length)
    return personalities[i]
}