# Wordle Clone

Forked from [hannahcode/wordle](https://github.com/hannahcode/wordle) and reduced the word renew time from a day to 10 minutes. Set a github action to deploy it on github page.

- Go play the real Wordle [here](https://www.powerlanguage.co.uk/wordle/)
- Read the story behind it [here](https://www.nytimes.com/2022/01/03/technology/wordle-word-game-creator.html)
- Try a demo of the original clone project [here](https://wordle.hannahmariepark.com)
- Have fun in every 10 mins of this forked project [page](https://ben196888.github.io/wordle/)

_Inspiration:_
This game is an open source clone of the immensely popular online word guessing game Wordle. Like many others all over the world, I saw the signature pattern of green, yellow, and white squares popping up all over social media and the web and had to check it out. After a few days of play, I decided it would be great for my learning to try to rebuild Wordle in React!

_Design Decisions:_
I used a combination of React, Typescript, and Tailwind to build this Wordle Clone. When examining the original Wordle, I assumed the list might come from an external API or database, but after investigating in chrome dev tools I found that the list of words is simply stored in an array on the front end. I'm using the same list as the OG Wordle uses, but watch out for spoilers if you go find the file in this repo! The word match functionality is simple: the word array index increments each day from a fixed game epoch timestamp (only one puzzle per day!) roughly like so:

```
WORDS[Math.floor((NOW_IN_MS - GAME_EPOCH_IN_MS) / ONE_DAY_IN_MS)]
```

For more general words increment in every period of time:

```js
WORDS[ Math.floor((NOW_IN_MS - GAME_EPOCH_IN_MS) / PERIOD_TIME_IN_MS) % WORDS.length ]
```

React enabled me to componentize the littlest parts of the game - keys and letter cells - and use them as the building blocks for the keyboard, word grid, and winning solution graphic. As for handling state, I used the built in useState and useEffect hooks to track guesses, whether the game is won, and to conditionally render popups.

In addition to other things, Typescript helped ensure type safety for the statuses of each guessed letter, which were used in many areas of the app and needed to be accurate for the game to work correctly.

I implemented Tailwind mostly because I wanted to learn how to use Tailwind CSS, but I also took advantage of [Tailwind UI](https://tailwindui.com/) with their [headless package](https://headlessui.dev/) to build the modals and notifications. This was such an easy way to build simple popups for how to play, winning the game, and invalid words.

_To Run Locally:_
Clone the repository and perform the following command line actions:
```bash
$ cd wordle
$ npm install
$ npm run start
```

_To build/run docker container:_
```bash
$ docker build -t notwordle .
$ docker run -d -p 3000:3000 notwordle
```
open http://localhost:3000 in browser.

## For github pages deployment

You can simply update the `homepage` field in `package.json` file to be your github page URL. It would be something like `<username>.github.io/<repo_name>`. e.g. my username is ben196888 and this repo name is wordle so `"homepage": "ben196888@github.io/wordle"` should be setup in the `package.json`

```json
  "homepage": "<username>.github.io/<repo_name>"
```
