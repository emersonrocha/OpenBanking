# OPEN BANKING

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
- **developer_key:** 28f955c90b3a2940134ff1a970050f569a87facf
- **secret_key:** dd385cd0b59c013560400050569a7fac

**Passo 1:** Redirecionamento do cliente para o login. Para iniciar o
processo de Connect, você deverá redirecionar o cliente para a URL do
Original Connect:
https://sb-autenticacao-api.original.com.br/OriginalConnect?scopes=account&callback_url=http://meuservidor.com/myapp&callback_id=1&developer_key=123

Parâmetros:
- developer_key: chave do portal developers para consumo das APIs;
- calbback_url: servidor web que receberá a resposta da requisição de
  login;
- scopes: escopos de consumo das APIs.

Acesso: Utilize as credencias abaixo para realizar o login no Original
Connect:

| Nome      | CPF            | Senha  | Contas                                 |
|:----------|:---------------|:-------|:---------------------------------------|
| John Doe  | 111.111.111-11 | 123456 | 111111                                 |
| Jenny Doe | 222.222.222-22 | 123456 | 222222                                 |
| Jack Doe  | 333.333.333-33 | 123456 | 333331, 333332, 333333, 333334, 333335 |
| Rose Doe  | 444.444.444-44 | 123456 | 444444                                 |

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


Caso tenha alguma dúvida sobre o consumo das api's e do processo de login no original connect temos uma coleção de chamadas das api's na seção [Anexos](#anexos)

## CENÁRIOS

### Conta Corrente

- **Saldo (GET /accounts/v1/balance)**
  - Conta com saldo positivo e com cheque especial
    1. Conta 111111 (CPF 111.111.111-11)
    2. Conta 333331 (CPF 333.333.333-33)
  - Conta com Saldo Positivo e sem cheque especial
    1. Conta 333332 (CPF 333.333.333-33)
  - Conta com Saldo Negativo e com cheque especial
    1. Conta 333333 (CPF 333.333.333-33)
  - Conta com Saldo Negativo e sem cheque especial
    1. Conta 333334 (CPF 333.333.333-33)
    2. Conta 222222 (CPF 222.222.222-22)
  - Conta com Saldo zero
    1. Conta 333335 (CPF 333.333.333-33)

- **Histórico de Saldo (GET
  /accounts/v1/balance-history?date_from=20170728)**
  - Terminar o dia com Saldo Positivo e com cheque especial
    1. Conta 111111 (CPF 111.111.111-11) filtro date_from
    2. Conta 333331 (CPF 333.333.333-33)
  - Terminar o dia com Saldo Positivo sem cheque especial
    1. Conta 333332 (CPF 333.333.333-33)
  - Terminar o dia com Saldo Negativo com cheque especial
    1. Conta 333333 (CPF 333.333.333-33)
  - Terminar o dia com Saldo Negativo sem cheque especial
    1. Conta 333334 (CPF 333.333.333-33)
    2. Conta 222222 (CPF 333.333.333-33)
  - Terminar o dia com Saldo zero
    1. Conta 333335 (CPF 333.333.333-33)

- **Extrato (GET /accounts/v1/balance)**
  - Sem lançamentos
    1. Conta 222222 (CPF 222.222.222-22)
  - Lançamentos positivos e negativos (crédito, débito)
    1. Conta 111111 (CPF 111.111.111-11)
    2. Conta 333331 (CPF 333.333.333-33)
    3. Conta 333332 (CPF 333.333.333-33)
    4. Conta 333333 (CPF 333.333.333-33)
    5. Conta 333334 (CPF 333.333.333-33)
    6. Conta 333335 (CPF 333.333.333-33)
  - Lançamentos com comentário e sem comentário
    1. Conta 111111 (CPF 111.111.111-11)
    2. Conta 333331 (CPF 333.333.333-33)
    3. Conta 333332 (CPF 333.333.333-33)
    4. Conta 333333 (CPF 333.333.333-33)
    5. Conta 333334 (CPF 333.333.333-33)
    6. Conta 333335 (CPF 333.333.333-33)

- **Contrato Cheque Especial (GET
  /accounts/v1/credit-balance-agreement)**
  - Cliente que tem contrato de limite de cheque especial
    1. Conta 111111 (CPF 111.111.111-11)
    2. Conta 333331 (CPF 333.333.333-33)
    3. Conta 333333 (CPF 333.333.333-33)

### Cartões

- **Lista de cartões físicos (GET /cards/v1/)**
  - Cliente com mais de um cartão
    1. CPF 111.111.111-11
       - Cartões (0001, 0002, 0003)
  - Cliente com apenas 1 cartão
    1. CPF 222.222.222-22
  - Cliente sem cartão
    1. CPF 333.333.333-33

- **Detalhe de cartão (GET /cards/v1/{card_number})**
  - Cartão que possui débito automático
    1. CPF 111.111.111-11
       - Cartão de final 0001 (bandeira black)
       - Cartão de final 0002 (bandeira platinum)
    2. CPF 222.222.222-22
       - Cartão de final 0001 (bandeira black)
  - Cartão sem débito automático
    1. CPF 111.111.111-11
       - Cartão de final 0003 (bandeira gold)

- **Fatura aberta (GET /cards/v1/{card_number}/invoices/open)**
  - Fatura com transação (sem paginação)
    1. CPF 111.111.111-11
       - Cartão de final 0001 (fatura com lançamentos em real e
         dólar)
  - Fatura sem transação
    1. CPF 111.111.111-11
       - Cartão de final 0002
       - Cartão de final 0003

- **Fatura fechada (GET /cards/v1/{card_number}/invoices/closed)**
  - Fatura com transação (sem paginação)
    1. CPF 111.111.111-11
       - Cartão de final 0001 (fatura com lançamentos em real e
         dólar)
  - Fatura sem transação
    1. CPF 111.111.111-11
       - Cartão de final 0002
  - Fatura Fechada com mais de 47 transações
    1. CPF 111.111.111-11
       - Cartão de final 0001 (fatura com lançamentos em real e
         dólar)

- **Histórico de faturas (GET
  /cards/v1/{card_number}/invoices/history)**
  - Fatura com transação (sem paginação)
    1. CPF 111.111.111-11
       - Cartão de final 0001 (fatura com lançamentos em real e
         dólar) retorna apenas 1 fatura

### Rewards

- **Saldo Cashback (GET /rewards/v1/balance)**
  - Cliente com saldo de pontos positivo
    1. CPF 111.111.111-11
       - Todas as contas
  - Cliente com saldo de pontos zerado
    1. CPF 222.222.222-22
       - Todas as contas
    2. CPF 333.333.333-33
       - Todas as contas

- **Extrato do Cashback (GET /rewards/v1/transaction-history)**
  - Extrato positivo com créditos e débitos de pontos
    1. CPF 111.111.111-11
       - Todas as contas
  - Extrato de pontos zerado e com créditos e débitos de pontos
    1. CPF 222.222.222-22
       - Todas as contas
    2. CPF 333.333.333-33
       - Todas as contas

### Investimentos

- **Carteira consolidada (GET /investments/v1/portfolio-summary)**
  - Cliente com investimentos
    1. Conta 1111111 (CPF 111.111.111-11)
    2. Três investimentos (Renda Fixa, 2 Fundos Multimercados)
  - Clientes sem investimentos
    1. CPF 222.222.222-22
    2. CPF 333.333.333-33

- **Extrato de fundos (GET /investments/v1/funds/transaction-history?
  date_from=20160101&date_to=20160201)**
  - Conta 1111111 (CPF 111.111.111-11)
    1. Dois resgates no fundo
    2. Uma aplicação no fundo
  - Sem extrato de fundos
    1. CPF 222.222.222-22
    2. CPF 333.333.333-33

- **Extrato renda fixa
  (/investments/v1/fixed-income/transaction-history?
  date_from=20160101&date_to=20160101)**
  - Cliente com renda fixa sem liquidez
    1. Conta 1111111 (CPF 111.111.111-11)
       - Uma aplicação em fundo de renda fixa
       - Dois resgates no fundo de renda fixa
  - Clientes sem resgates e aplicações em fundos de renda fixa
    1. CPF 222.222.222-22
    2. CPF 333.333.333-33

### Pagamentos

Para consumo da API de transferência é necessário primeiro fazer uma
chamada POST na API, para validar a transação. Se ela for aprovada, um
campo security_message será retornado e este campo deverá ser passado
no header da próxima chamada usando o método PUT para efetivar a
transação.

- **Transferência entre contas Original (POST e PUT
  /payments/v2/money-transfer/ between-accounts)**

  - Transferência com Token
    - Do Cliente (CPF 111.111.111-11) para cliente (CPF 222.222.222-22)

  - Transferência com push
    - Do Cliente (CPF 111.111.111-11) para cliente (CPF 222.222.222-22)
      1. POST para registrar a transação e analisar risco.
      2. PUT para fazer a transação:
         - Passar security_response obtido na request anterior.
         - Exatamente o mesmo body da requisição post anterior.

  - Transferência para favorecidos
    - Todos os clients estão cadastrados como favorecidos uns para os
      outros.
    - Deve-se passar favored_id no body da transação.
    - CPF 111.111.111-11 (conta 111111) tem id 1, CPF
      222.222.222-22 (conta 222222) tem id 2, CPF 333.333.333-33
      (conta 333333) tem id 3.
    - Cenários:
      1. Cliente 1 transfere para 2 e 3.
      2. Cliente 2 transfere para 1 e 3.
      3. Cliente 3 transfere para 1 e 2.

  - Transferência sem autenticação
    - Transferência sem estar logado, erro na requisição.

  - Transferência maior de 300 reais
    - Cliente (CPF 111.111.111-11) transfere valor maior que 300 para
      outros clientes (CPF 222.222.222-22 e 333.333.333-33) e vice
      versa, independente de conta.

  - Transferência com nomes iguais
    - Transferir valores para uma mesma conta.
    - Para favorecido ou conta.

  - Transferência sem saldo
    - CPF 333.333.333-33 (conta 333333) transfere para
      qualquer outro cliente

  - Transferência fora de horário
    - Qualquer cliente que tentar transferir para conta 333331, qualquer
      conta

Para consumo da API de Pagamento de Boleto, é necessário primeiro
fazer uma chamada POST na API para validar a transação. Se ela for
válida, deverá ser chamada a API novamente usando o método PUT para
confirmar o pagamento.

- **Pagamento de Boleto (/payments/v1/payment-slip)**

  - Boleto que pode ser agendado e aceita valor intermediário de
    pagamento
    - Número do boleto: 39999876580000007277756018112344930630025100000
    - Pagamento entre 02/12/2017 a 11/12/2017
    - Valor R$10000.00
    - Pagamento mínimo R$1000.00
    - Pagamento máximo R$10000.00

  - Boleto só aceita valor cheio (sem pagamento mínimo e máximo)
    - Número do boleto: 39999876580000007277756018112344930630025100001
    - Pagamento entre 02/12/2017 a 11/12/2017
    - Valor R$5000.00
    - Não aceita pagamento divergente

  - Boleto vencido
    - Número do boleto: 34198765490000007277756018123457333770025200000

### Análise de Crédito

A API de Análise de Crédito foi desenvolvida para que parceiros do
Banco tenham a possibilidade de simular e contratar crédito para
clientes que ainda não possuem conta no Banco Original.

- **Simulação de Crédito (POST /credit_analysis/v1/simulation)**
  - Cliente sem simulação de crédito (correntista do banco). Retorna
    lista de ofertas vazia
    1. Correntistas atuais cadastrados em sandbox
       - 111.111.111-11
       - 222.222.222-22
       - 333.333.333-33
       - 444.444.444-44

  - Simulação para um CPF que já tenha realizado uma solicitação de
    crédito. Retorna informação de que cliente já tem uma
    solicitação de análise de crédito no banco
    1. CPF 555.555.555-55

  - Simulação para um não correntista do banco e que não possui
    solicitação de crédito ainda. Retorna uma lista de oferta para o
    cliente
    1. Utilizar qualquer CPF diferente dos anteriores

- **Solicitação de Crédito (POST
  /credit_analysis/v1/credit_request)**
  - Efetivar a solicitação de crédito
    1. Utilizar o campo “offer_id” da requisição de simulação nessa
       chamada (Sucesso)
  - Erro na solicitação
    1. Utilizar qualquer “offer_id” diferente do retornado na
       simulação de crédito

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
    5. secret_key: dd385cd0b59c013560400050569a7fac
    6. developer_key: 28f955c90b3a2940134ff1a970050f569a87facf

## Exemplos

Nesse diretório encontra-se um exemplo de código escrito em javascript consumindo as api`s do Open Banking

- [NodeJS](samples/nodejs)

## Referências

Caso tenha alguma dúvida o portal abaixo contém a documentação oficial das api`s e exemplos de código em outras linguagens de programação.

- https://developers.original.com.br/docs
