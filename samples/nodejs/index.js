//
// Openbanking
//

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let path = require('path');
let request = require('superagent');

//
// Configurations
//

const port = 3001
const url = `http://localhost:${port}/`;

let api_url = 'https://sandbox.original.com.br';
let auth_url = 'https://sb-autenticacao-api.original.com.br';
let auth_callback_url = `http://localhost:${port}/callback`
let developer_key = 'XXX';
let secret_key = 'XXX';
let access_token = '';

//
// Resources
//

let amount = '10.00';
let account_number = '222222';
let comments = 'Transferência';
let favored_id = '2';

let resources = {
    balance: {
        method: 'get',
        path: '/accounts/v1/balance'
    },
    balance_history: {
        method: 'get',
        path: '/accounts/v1/balance-history?date_from=20170623'
    },
    history: {
        method: 'get',
        path: '/accounts/v1/transaction-history'
    },
    favored_accounts: {
        method: 'get',
        path: '/payments/v1/money-transfer/favored-accounts'
    },
    tef: {
        title: 'Confirme a transferência de R$ 10,00',
        method: 'post',
        path: '/payments/v2/money-transfer/between-accounts',
        data: {
            amount,
            comments,
            callback_url: 'http://localhost:3001/',
            favored_id,
            // account_number
        }
    },
    tef_confirm: {
        title: 'Transferência executada com sucesso.',
        method: 'put',
        path: '/payments/v2/money-transfer/between-accounts',
        headers: {
            security_response: ''
        },
        data: {
            amount,
            comments,
            callback_url: `${url}`,
            favored_id,
            // account_number
        }
    }
};

let show = (...messages) => {
    io.emit('message', messages.map(message => JSON.stringify(message, null, 4)));
    console.log(messages);
};

let execute_api = name => {
    let resource = resources[name];
    show(`EXECUTING ${name}`);
    let action =
        request
            [resource.method](`${api_url}${resource.path}`)
            .set('developer-key', developer_key)
            .set('Authorization', access_token);

    if ('headers' in resource)
        for (let key in resource.headers)
            action.set(key, resource.headers[key]);

    if ('data' in resource)
        action.send(resource.data);

    show(action);

    action.end((err, res) => {
        if (err) {
            show(err);
        }
        else {
            show(res.body);

            if ('security_message' in res.body) {
                resources.tef_confirm.headers.security_response = res.body.security_message
            }
        }
    });
};

//
// OAuth
//

app.get('/', (req, res) => {
    res.sendFile(path.join(`${__dirname}/index.html`));
});

app.get('/oauth', (req, res) => {
    let url = `${auth_url}/OriginalConnect?scopes=account&callback_url=${auth_callback_url}&callback_id=1&developer_key=${developer_key}`;
    show('Starting oauth', `Redirect to ${url}`);
    res.redirect(url);
});

// Access_token generation

app.get('/callback', (req, res) => {
    show(
        'Callback oauth received',
        req.query,
        'Requesting access token'
    );

    request
        .post(`${auth_url}/OriginalConnect/AccessTokenController`)
        .set('Content-Type', 'application/json')
        .send({
            auth_code: req.query.auth_code,
            uid: req.query.uid,
            developer_key,
            secret_key
        })
        .end((err, response) => {
            show(
                'Response', response.statusMessage, response.statusCode,
                'Headers', response.headers,
                'Content', response.text
            );

            access_token = response.body.access_token;

            res.send('<script>window.close();</script>');
        });
});

io.on('connection', socket => {
    socket.on('operation', operation => {
        execute_api(operation);
    });

    socket.on('exec', text => {
        let res = null;
        try {
            res = eval(text);
        } catch (e) {
            res = `${e.message}`;
        }
        if (res) {
            show(res);
        }
    });
});

http.listen(port, () => {
    console.log('OpenBanking Debugger');
    console.log(`${url}`);
});
