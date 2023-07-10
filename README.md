# Installation

```bash
pnpm i
```

# Usage

1. Make sure your current branch is `fhoerth__give-freely-coding-challenge`
2. Use .env.example to create an .env file at the root of the project.
3. Modify PARTICIPANTS_API_URL and PARTICIPANTS_API_X_ACCESS_KEY values with the ones provided in the original READE.md file

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
```

## Testing (e2e)

```bash
npm run test:e2e
```

## Few notes before reviewing

- As you will notice, project didn't take me 3-4 hours as suggested in the original `README.md` file.
  I would say it took me 3 to 4 days without investing full time.
  There are some points I would really like to discuss if the review is positive.

- I didn't rely on third party code to stablish communication between contexts (background-contents-popup).

- `communication-channel` has to be polished, it doesn't remove information when tabs are detached. I didn't
  test really what happens after the background goes into iddle mode, a revive method could be implemented
  to handshake again with all scripts.

- There are some parts in `communication-channel` that could be reused (specially error handling), but I couldn't do it and didn't want to invest time in how things are serialized, you will see repeated code
  all over error handling.

- I didn't implement any caching in the API client since `CF-Cache-Status` response header value is `DYNAMIC`

- There's a little bug in `getDomain` which I would've liked to fix it.

- There are not unit tests yet, which I'd like to add them. The strategy is to use `puppeteer` to check that the extension is working properly, intercepting the API request and used mock data.

- I wouldn't recommend to split this project in 4 scripts since each script would imply more memory usage due to any third-party dependency such as `react` and `react-dom`.

- I just did it this way to have a deep understanding of how communication can be done, and how the `broadcast` really can help to trigger events between `content scripts`.

- I used tailwind CSS just because it was easy to install following Plasmo docs and it's really lightweight.

- I didn't use conventional commits just to save time.

- I splitted my work into small `PR's` which can be reviewed as well.

- Lastly, I took this project very personal, that's the reason why it took me more time than expected.
  At Matterway, there is a platform developed in V2 extension system and not compatible with V3 specs, so it cannot be migrated.
  My job was to develop from scratch a platform outside V3 extension system and replicate exactly how it works on the existing extension. I centralized more on communication since for me it's a very interesting.topic.
