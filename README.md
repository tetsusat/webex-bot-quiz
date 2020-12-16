# webex-bot-quiz

`webex-bot-quiz` is a bot application for posting your quiz on Webex Teams.
You can customize your own quiz in YAML file(`quiz.yaml`) and deploy your own `webex-bot-quiz` on Vercel.

## How to use

#### Prerequisite

- Vercel.com account(Hobby account is enough)
- Vercel CLI

#### Step 1. Create WebEx Teams bot

Create your bot for `webex-bot-quiz`.

https://developer.webex.com/my-apps/new/bot

#### Step 2. Create Webhooks

Create two webhooks with a bot access token. `{your_app}` should be the same as your Vercel project name.

https://developer.webex.com/docs/api/v1/webhooks/create-a-webhook

The first webhook is as below.

- name: Webhook for messages
- targetUrl: https://{your_app}.vercel.app/api/webhook1
- resourace: messages
- event: created
- filter: mentionedPeople=me

The second webhook is as below.

- name: Webhook for attachment actions
- targetUrl: https://{your_app}.vercel.app/api/webhook2
- `resourace: attachmentActions
- event: created

#### Step 3. Deploy bot application

Clone `webex-bot-quiz` repository.

```
$ git clone https://github.com/tetsusat/webex-bot-quiz.git
```

Move to `webex-bot-quiz` directory.

```
$ cd webex-bot-quiz
```

Initialize your Vercel app. And give your own project name since this effects on URL and leave the others at offered default values.

```
$ vercel
? Set up and deploy “~/webex-bot-quiz”? [Y/n] 
? Which scope do you want to deploy to? 
? Link to existing project? [y/N]
? What’s your project’s name? your-new-project    <<< give your own project name here!
? In which directory is your code located?
- Setting up project
No framework detected. Default Project Settings:
- Build Command: `npm run vercel-build` or `npm run build`
- Output Directory: `public` if it exists, or `.`
- Development Command: None
? Want to override the settings? [y/N]
```

Set `WEBEX_ACCESS_TOKEN` environment variable on Vercel dashboard.

https://vercel.com/{your_account}/{your_app}/settings/environment-variables

Copy `quiz.yaml` from `quiz.yaml.sample` and modify it to create your quiz.

```
$ cp api/config/quiz.yaml.sample api/config/quiz.yaml
```

Update your application.

```
$ vercel --prod
```

#### (Optional) Step 4. Update quiz

Modify `quiz.yaml` file. Then, update your application.

```
$ vercel --prod
```
