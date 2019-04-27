export const environment = {
    server: {
        port: process.env.SERVER_PORT || 3000
    },
    database: {
        url: process.env.DB_URL || 'mongodb://localhost/nodejs-restify-db'
    },
    security: {
        saltRounds: process.env.SALT_ROUNDS || 10
    }
}