# Book Loan

## Description

Book Loan API Spesification

## Tech Stack

- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)

## Installation

- Clone the repository

  ```sh
    git clone https://github.com/hafizulf/book-loan
  ```

- Install dependencies

  ```sh
    # checkout to directory
    cd book-loan

    # install
    npm install
  ```

- Create new database
- Create .`env` file & set database url, etc

  ```sh
    # example
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dbname?schema=public"
  ```

- Run migration

  ```sh
    npx prisma migrate dev
  ```

## Usage

- Start the server

  ```sh
    npm run start
  ```

- Run tests

  ```sh
    npm run test
  ```

- Server is running on `http://localhost:${APP_PORT}`
- Access documentation at `http://localhost:${APP_PORT}/api`

## Contributing

- Fork the repository
- Create a new branch
- Create a pull request

## License

MIT

## Author

Hafizul Furqan

## Version

0.0.1

## Changelog

- 0.0.1: Initial release
