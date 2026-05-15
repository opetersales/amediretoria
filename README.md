# Cédula de Confiança

Sistema de votação institucional anônimo — mobile first, design iOS.

---

## Rodar localmente (testes)

```bash
npm install
npm run dev
```

Acesse em `http://localhost:5000`.  
Os dados ficam **em memória** — reiniciar o servidor zera todos os votos.

---

## Deploy no Vercel (produção)

### 1. Criar conta no Upstash (banco de dados)

O sistema usa Redis para persistir votos e identificação de dispositivos.

1. Acesse **[upstash.com](https://upstash.com)** e crie uma conta gratuita
2. Clique em **Create Database**
3. Dê um nome (ex: `cedula`), escolha a região **South America (São Paulo)**
4. Após criar, clique na aba **REST API**
5. Copie os dois valores:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

---

### 2. Criar conta no Vercel e instalar o CLI

1. Acesse **[vercel.com](https://vercel.com)** e crie uma conta gratuita (pode entrar com GitHub)
2. No terminal, instale o CLI:

```bash
npm install -g vercel
```

3. Faça login:

```bash
vercel login
```

---

### 3. Fazer o primeiro deploy

Na pasta do projeto:

```bash
vercel
```

O CLI vai perguntar algumas coisas — confirme tudo com Enter. Ao final, ele vai gerar uma URL de preview (ex: `cedula-abc123.vercel.app`).

---

### 4. Configurar as variáveis de ambiente

No painel do Vercel:  
**Seu projeto → Settings → Environment Variables**

Adicione as quatro variáveis abaixo:

| Variável | O que é | Como obter |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | URL do banco Redis | Copiada do Upstash (passo 1) |
| `UPSTASH_REDIS_REST_TOKEN` | Token do banco Redis | Copiado do Upstash (passo 1) |
| `FINGERPRINT_SECRET` | Chave secreta para anonimizar dispositivos | Qualquer texto longo e aleatório — ex: `minha-chave-secreta-2024` |
| `ADMIN_PASSWORD` | Senha para resetar a votação | Escolha uma senha forte |

---

### 5. Fazer o deploy final (produção)

Após configurar as variáveis:

```bash
vercel --prod
```

Sua URL de produção será algo como `cedula-confianca.vercel.app`.  
Compartilhe esse link com os membros no dia da votação.

---

## Personalizar os nomes dos membros

Edite o arquivo `config.js` na raiz do projeto:

```js
const MEMBERS = [
  "Nome 01",
  "Nome 02",
  // ...
];
```

Após editar, rode `vercel --prod` para publicar a mudança.

---

## Resetar a votação (apagar todos os votos)

Se precisar zerar e recomeçar durante o processo:

```bash
curl -X POST https://SUA-URL.vercel.app/api/admin/reset \
  -H "Content-Type: application/json" \
  -d '{"password":"SUA_ADMIN_PASSWORD"}'
```

Substitua `SUA-URL` e `SUA_ADMIN_PASSWORD` pelos valores reais.  
Se preferir, pode também apagar os dados diretamente no painel do Upstash (aba **Data Browser → Flush DB**).

---

## Como funciona o anonimato

1. Quando o membro abre o app, o navegador gera um **fingerprint** do dispositivo — uma combinação de User-Agent, resolução de tela, GPU, fuso horário e outros dados técnicos
2. Esse fingerprint é enviado ao servidor, onde é transformado em um hash irreversível com HMAC-SHA256
3. Apenas o **hash** fica salvo no banco (na lista de dispositivos que já votaram) — nunca o fingerprint original
4. As escolhas de cada cargo são salvas **separadamente**, sem nenhum vínculo com o hash
5. Resultado: é impossível saber quem escolheu quem
