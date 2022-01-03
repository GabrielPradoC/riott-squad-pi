# Node API Boilerplate

Repositório inicial para os participantes do bootcamp realizarem seus exercícios

## ORM

Para manipulação do banco de dados e entidades está sendo utilizada a biblioteca TypeORM:

Documentação: <https://typeorm.io/#/>

Entidades: <https://typeorm.io/#/entities>

Manipulação: <https://typeorm.io/#/working-with-entity-manager>

Uso com **`MongoDB`**: <https://typeorm.io/#/mongodb>

**`OBS:`** Conforme o banco de dados utilizado, será necessário instalar o driver correspondente (**Getting Started** > # Installation > 4. Install a database driver).

## Banco de dados - MongoDB

Antes de iniciar o servidor é necessário inserir um `usuário` válido para acessar o mongo, assim como a base de dados `riott-database`

Com o **docker** rodando execute os comandos abaixo:

```sh
# conecta no docker
docker exec -it riott-mongo bash

# conecta na base de dados
mongo -u riott_root -p (senha disponível em 'docker-compose > MONGO_INITDB_ROOT_PASSWORD')

# adiciona uma base de dados caso não exista
use riott-database

# adiciona usuário para acesso ao banco
db.createUser({
    user: 'riott_baseapi',
    pwd: '562f71639f6c004e088193f3',
    roles: [ { role: 'readWrite', db: 'baseapi'} ],
    passwordDigestor: 'server'
});
```

## Docker

Para iniciar o projeto é necessário ter o `docker` e o `docker-compose` instalados.

Docker: <https://docs.docker.com/engine/install/>

Docker Compose: <https://docs.docker.com/compose/install/>

## Iniciando o servidor

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

**`OBS`**: Verifique as informações de conexão no arquivo `src/config/database`

Se tudo estiver ok a api e a documentação deve estar rodando nos endereços:

**API**: <http://localhost:4444>

**Documentação dos endpoints**: <http://localhost:4444/swagger>

## NGROK

Em alguns navegadores, para acessar o `swagger` ou a `documentação do código`, será preciso rodar em modo https por meio do ngrok:

```sh
ngrok http 4444
```
