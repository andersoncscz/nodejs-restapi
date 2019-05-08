module.exports = {
    apps : [{        
        name: 'nodejs-restapi',
        script: './dist/main.js',
        watch: true,
        error_file: 'err.log',
        out_file: 'out.log',
        merge_logs: true,
        instances: 0,
        exec_mode: 'cluster',

        env: {
            SERVER_PORT: 5000,
            DB_URL: 'mongodb://localhost/nodejs-restify-db',
            NODE_ENV: 'development'
        },

        env_production: {
            SERVER_PORT: 5001,
            DB_URL: 'mongodb://localhost/nodejs-restify-db',
            NODE_ENV: 'production'      
        }
    }]
}