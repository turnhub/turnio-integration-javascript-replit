const TurnIntegration = require('@turnio/integration')

/* IMPORTANT!
* You need to get the integration secret from your Turn integrations settings
* and set it up as an env variable called `SECRET` in your Replit. 
*/
const turn_integration_secret = process.env.SECRET

if (process.env.SECRET == undefined) {
  console.error("[ERROR!] You forgot to set your integration secret as an enviroment variable.")
  process.exit(1)
}

const app = new TurnIntegration(turn_integration_secret)
  .context('Language', 'table', ({ chat, messages }) => ({
    Language: 'English',
    Confidence: 'Very high'
  }))
  .context('A list of things', 'ordered-list', ({ chat, messages }) => [
    'first item',
    'second item',
    'third item'
  ])
  .suggest(({ chat, messages }) => [
    {
      type: 'TEXT',
      title: 'Password reset',
      body: 'To reset your password click the link on the login page.',
      confidence: 0.4
    }
  ])
  .action(({ chat, messages }) => [
    {
      description: 'Change Language',
      payload: {
        really: 'yes'
      },
      options: {
        afr_ZA: 'Afrikaans',
        eng_ZA: 'English',
        zul_ZA: 'Zulu'
      },
      callback: ({ message, option, payload: { really } }, resp) => {
        console.log({ message, option, really })
        // Notify the frontend to refresh the context by setting
        // the response header
        resp.setHeader('X-Turn-Integration-Refresh', 'true')
        // this is return as JSON in the HTTP response
        return { ok: 'done' }
      }
    }
  ])
  .serve()

const port = process.env.PORT || 3000

app.listen(port, () => {
  replit_url = `https://${ process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
  console.log(`Turn UI integration running at ${replit_url}`)
})