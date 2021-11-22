# angular-boilerplate
Repositório inicial para os participantes do bootcamp realizarem seus exercícios

## Docker

Para iniciar o projeto é necessário ter o `docker` e o `docker-compose` instalados.

Docker: <https://docs.docker.com/engine/install/>

Docker Compose: <https://docs.docker.com/compose/install/>

## Iniciando o projeto

Instale as dependências rodando o comando abaixo na raiz do diretório:

```sh
npm install
```

Na primeira vez que iniciar o projeto é necessário gerar o build do `Dockerfile` com o comando:

```sh
docker-compose up --build
```

Para rodar o projeto basta executar o comando:

```sh
docker-compose up
```

Quando terminar o build só acessar pelo link: <http://localhost:4200>
