# rock-paper-scissors

A multi-player Rock, Paper, Scissors game written in Node.js.

Players are automatically created per session. To test, use two browser sessions that don't share cookies. For example, you could use a regular browser window and an incognito / private browser window.

## Setup

```bash
npm i
# Start docker, which provides a MySQL database.
docker-compose up -d
# Create the MySQL schemas.
./node_modules/.bin/knex migrate:latest
# Start PM2
pm2 start ./pm2.config.js
```

## Web

[http://localhost:5000/]()

1. First Window
    1. Click Start New
    2. Make a choice
2. Second Window
    1. Click an available game
    2. Click Join
    3. Make a choice
3. First Window
    1. Reload to see result 

## Manual

Using [HTTPie](https://httpie.org/), a command-line HTTP client.

```bash
http GET :5005/api/v1/rules
http POST :5010/api/v1/players
http GET :5010/api/v1/players/1
http POST :5010/api/v1/players
http GET :5010/api/v1/players/2
http POST :5005/api/v1/games player1id=1 player2id=2
http GET :5005/api/v1/games/1
http POST :5005/api/v1/games/1/judge
http PATCH :5005/api/v1/games/1 player1choice=rock player2choice=scissors
http POST :5005/api/v1/games/1/judge
http GET :5005/api/v1/games/1
```

## Teardown

Temporary:

```bash
# Stop services.
docker-compose stop
# Turn off PM2.
pm2 kill
```

Permanent (deletes database):

```bash
# Stop and remove containers, networks, images and volumes.
docker-compose down
# Turn off PM2.
pm2 kill
```

