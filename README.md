# notification-server
Point chain events cache and a server exposing JSON RPC API similar to the Ethereum JSON RPC. The only method available is `eth_getLogs`.

## Install and build
```
npm i
npm run build
```

## Run dev database service
A test database will be created automatically and the service will be available for connections as soon as it's state becomes `healthy` 
```
# MacOS
docker-compose up -d database
# Linux
sudo docker-compose up -d database
```

## Run the server
```
# Start the built app
npm start
# Start in development mode (using ts-node, doesn't require a built)
npm start:dev
# Watch
npm run watch
```

## Run dev environment
Running the bellow will start and set up a dev database, build server image and run containerized app in watch mode. Any changes to the source code will make the server restart automatically. Adding new server dependency requires the image rebuild.
```
# MacOS
docker-compose up -d
# Linux
sudo docker-compose up -d
```
