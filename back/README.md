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

## Banco de dados - MySql

Em caso de uso do banco de dados `MySql`, seguir o passo a passo abaixo.

No arquivo `docker-compose.yml` inserir:

1. Uma nova `URL` de conexão no caminho `services: > node: > environment:`

```yml
- MYSQL_CONNECTION_URL=mysql://riott_root:90e271d9b4ae4a6812e86cee@riott-mysql:3306
```

2. Um novo `link` com o container do mysql no caminho `services: > node: > links:`

```yml
- mysql
```

3. Um novo `service` para o container do mysql no caminho `services:`

```yml
mysql:
    container_name: riott-mysql
    restart: always
    image: mysql:5.7
    volumes:
        - ~/docker/volumes/RIOTT_Mysql:/var/lib/mysql
    environment:
        MYSQL_DATABASE: riott-database
        MYSQL_USER: riott_root
        MYSQL_PASSWORD: 90e271d9b4ae4a6812e86cee
        MYSQL_ROOT_PASSWORD: 327c56a1d1c5803d92a4dad9
    networks:
        - riott-connect
    ports:
        - 3306:3306
```

4. Um novo `link` com o container do mysql no caminho `volumes:`

```yml
riott-mysql-data:
```

No arquivo `src/config/database.ts` substituir a definição na exportação das opções de conexão do banco:

```ts
// Trocar
...mongoOptions
// Por
...mysqlOptions
```

Nas entidades `src/library/database/entity` alterar as colunas primárias de `ObjectIdColumn` para `@PrimaryGeneratedColumn`.

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
