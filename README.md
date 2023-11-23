# pricecloud

Prototype web aplication for cost evaluation and provisioning with Libcloud on Amazon Web Services

## Propagate `env vars` configuration

`api-01`: Ensure the vars are correly put on the `validation-schema.ts` and docker-compose.yml

## Network scheme

![network scheme](https://raw.githubusercontent.com/sebastianaf/pricecloud/dev/latex/gfx/services.drawio.png)

## Requirements

This code was built using NodeJS, ExpressJS, React and other packages (please see the `package.json` files for more info).

To run this project make sure to install [Docker](https://docs.docker.com/).

Now let's follow the next steps.

### 1.Clone the repo

First thing is to clone the whole proyect.

```shell
git clone https://github.com/sebastianaf/pricecloud
cd pricecloud
```

### 2.Create environment variables

Create a `.env` from `.env.example` file into the folders completing all environment variables, these will be used by the containers created by `docker-compose.yml` and the development services.

Inside `ui` make sure to create `.env.production` for production. (Based on [create-react-app](https://create-react-app.dev/))

### 3. [Optional] Setting up a reverse proxy for Internet deploy

The `docker-compose.yml` file will deploy a extra service named `uv-pricecloud-duckdns`, it is a DDNS container named [DuckDNS](https://www.duckdns.org) which is very usefull if you don`t have a static public IP. We highly recommend to use a reverse proxy like [nginx-proxy-manager](https://nginxproxymanager.com/) and to configure your port forwarding ISP modem, do not forget try to configure a firewall, (e.g. [OPNSense](https://opnsense.org/)).

Make sure to include the reverse proxy container into the project network using the following setup in the reverse proxy `docker-compose.yml` file to reach the pricecloud's containers.

```yml
version: "3.8"
    services:
        proxy-container
                .
                .
                .

            networks:
                - uv-pricecloud
        .
        .
        .

networks:
  proxy-container-network:
    name: proxy-container-network
  uv-pricecloud:
    external: true
```

### 4. Run

Now is time to wake up the services and access it thought the `uv-pricecloud` docker network.
If you need to access it locally uncomment the local service's ports deleting the # charapter from the `docker-compose.yml` file and then run the app with:

```shell
docker compose -p uv-pricecloud -up -d --build
```

This commands will wake up the services access it thought port specified as follow.

```
Server ports:
9010: api-01
9010: api-02
9020: db
9030: ui
9040: pgadmin
```

If you set the environment variable `API_CREATE_ADMIN` to `1` then the user credentials for first access are:

```
Username: admin
Password: price22cloud
```

After first start up make sure to set `API_CREATE_ADMIN` to `0`
