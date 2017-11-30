# OpenBanking

Para interagir com as APIs, você utilizará o mecanismo de
autenticação Original Connect, nosso OAuth2. Ele disponibiliza a
única forma segura e aprovada pelos padrões de segurança do Banco
Original para que aplicações de terceiros acessem os recursos das
APIs.

Siga os passos abaixo para se conectar e interagir com os serviços e
APIs:

**Passo 0:** Obter suas credencias de acesso aos recursos do Banco
Original.

**Credenciais de acesso:** As informações seguintes são geradas pelo
Portal Developers do Banco Original. Se você já tiver uma conta no
Portal, pode utilizar suas credencias, caso contrário, utilize as
seguintes chaves disponibilizadas para uso durante o Hackathon:
- **developer_key:** XXX
- **secret_key:** XXX

**Passo 1:** Redirecionamento do cliente para o login. Para iniciar o
processo de Connect, você deverá redirecionar o cliente para a URL do
Original Connect:
https://sb-autenticacao-api.original.com.br/OriginalConnect?scopes=account&callback_url=http://meuservidor.com/myapp&callback_id=1&developer_key=123

Parâmetros:
- developer_key: chave do portal developers para consumo das APIs;
- calbback_url: servidor web que receberá a resposta da requisição de
  login;
- scopes: escopos de consumo das APIs.

**Passo 2:** Armazenar os parâmetros “uid” e “auth_code” retornados
pelo processo anterior. Exemplo de retorno:
http://meuservidor.com/myapp?auth_code=111111&uid=2222

**Passo 3:** Gerar um access_token para consumo das APIs:
https://sb-autenticacao-api.original.com.br/OriginalConnect/AccessTokenController
Um access_token será gerado através de uma chamada HTTP na url acima
utilizando o método **POST** e passando como payload os parâmetros a
seguir: **{"uid": "", "auth_code": "", "developer_key": "",
"secret_key": ""}**

**Passo 4:** Consumir as APIs Para consumir as APIS do Banco Original,
é necessário informar no Header das chamadas dois parâmetros
obrigatórios:
- **Authorization:** **access_token** gerado no passo anterior
- **developer-key:** **developer_key**


**Caso tenha alguma dúvida sobre o consumo das api's e do processo de login no original connect temos uma coleção de chamadas das api's nas seções na seção [Anexos](#anexos) localizada no final desse arquivo.**

## CENÁRIOS

### Conta Corrente

- **Saldo (GET /accounts/v1/balance)**

- **Histórico de Saldo (GET
  /accounts/v1/balance-history?date_from=20170728)**

- **Extrato (GET /accounts/v1/balance)**

- **Contrato Cheque Especial (GET
  /accounts/v1/credit-balance-agreement)**

### Cartões

- **Lista de cartões físicos (GET /cards/v1/)**

- **Detalhe de cartão (GET /cards/v1/{card_number})**

- **Fatura aberta (GET /cards/v1/{card_number}/invoices/open)**

- **Fatura fechada (GET /cards/v1/{card_number}/invoices/closed)**

- **Histórico de faturas (GET
  /cards/v1/{card_number}/invoices/history)**

### Rewards

- **Saldo Cashback (GET /rewards/v1/balance)**

- **Extrato do Cashback (GET /rewards/v1/transaction-history)**

### Investimentos

- **Carteira consolidada (GET /investments/v1/portfolio-summary)**

- **Extrato de fundos (GET /investments/v1/funds/transaction-history?
  date_from=20160101&date_to=20160201)**

- **Extrato renda fixa
  (/investments/v1/fixed-income/transaction-history?
  date_from=20160101&date_to=20160101)**

### Pagamentos

Para consumo da API de transferência é necessário primeiro fazer uma
chamada POST na API, para validar a transação. Se ela for aprovada, um
campo security_message será retornado e este campo deverá ser passado
no header da próxima chamada usando o método PUT para efetivar a
transação.

- **Transferência entre contas Original (POST e PUT
  /payments/v2/money-transfer/ between-accounts)**

Para consumo da API de Pagamento de Boleto, é necessário primeiro
fazer uma chamada POST na API para validar a transação. Se ela for
válida, deverá ser chamada a API novamente usando o método PUT para
confirmar o pagamento.

- **Pagamento de Boleto (/payments/v1/payment-slip)**

### Análise de Crédito

A API de Análise de Crédito foi desenvolvida para que parceiros do
Banco tenham a possibilidade de simular e contratar crédito para
clientes que ainda não possuem conta no Banco Original.

- **Simulação de Crédito (POST /credit_analysis/v1/simulation)**

- **Solicitação de Crédito (POST
  /credit_analysis/v1/credit_request)**

## Anexos

Junto deste documento temos o arquivo [postman_collection.json](postman_collection.json) com alguns exemplos de requisições dos cenários descritos aqui
descritas aqui. Para utilizar o arquivo siga os seguintes passos:
  - Importar o arquivo no software de
consumo de APIs "Postman" (https://www.getpostman.com/)
  - Configurar as seguintes variáveis de ambiente no postman:
    1. sandbox_auth_url: sb-autenticacao-api.original.com.br
    2. sandbox_api_url: sandbox.original.com.br
    3. uid: (gerado pelo login do usuário no original connect)
    4. auth_code: (gerado pelo login do usuário no original connect)
    5. secret_key: XXX
    6. developer_key: XXX


## Referências

- https://developers.original.com.br/docs
