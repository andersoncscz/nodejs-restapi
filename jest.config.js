module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        testURL: `http://localhost:5001`,
        auth: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmRlcnNvbmNzY3pAaG90bWFpbC5jb20iLCJuYW1lIjoiQW5kZXJzb24gQ3J1eiJ9.3Kftr_v871RX1vC2kz6n_LQpnL91q7s-odpJlo0ihPs"
    }
};

/* 
    globals.auth generate at: https://jwt.io/#debugger-io

    payload: 
        "sub": "andersoncscz@hotmail.com",
        "name": "Anderson Cruz",

    secret: nodejs-restapi-secret (the same used in environment.security.apiSecret)
*/