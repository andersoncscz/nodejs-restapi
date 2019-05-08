export const environment = {
    server: {
        port: process.env.SERVER_PORT || 3000
    },
    database: {
        url: process.env.DB_URL || 'mongodb://localhost/nodejs-restify-db'
    },
    security: {
        saltRounds: process.env.SALT_ROUNDS || 10,
        apiSecret: process.env.API_SECRET || 'nodejs-restapi-secret',
        enableHTTPS: process.env.ENABLE_HTTPS || false,
        certificate: process.env.CERTIFICATE_FILE || './security/keys/cert.pem',
        key: process.env.CERTIFICATE_KEY_FILE || './security/keys/key.pem'
    },

    log: {
        level: process.env.LOG_LEVEL || 'debug',
        name: 'nodejs-restapi-logger'
    }
}