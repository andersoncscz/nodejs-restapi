module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        testURL: `http://localhost:3001`,
        auth: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmRlcnNvbmNzY3pAaG90bWFpbC5jb20iLCJuYW1lIjoiQW5kZXJzb24gQ3J1eiIsImlhdCI6MTUxNjIzOTAyMn0.uu3MoY429ravVw_qc_iEAF-rv7R6c0iv53tixj6dCc8"
    }
};

/* 
    globals.auth generate at: https://jwt.io/#debugger-io

    payload: 
        "sub": "andersoncscz@hotmail.com",
        "name": "Anderson Cruz",

    secret: nodejs-restapi-secret (the same used in environment.security.apiSecret)
*/