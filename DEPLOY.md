# Akina Motorsport — publicar o site

Mesmo sistema do site Drift Factory: Next.js + base de dados SQLite (Prisma) +
painel de administração. Precisa de um servidor Node.js (ex. cPanel → "Setup Node.js App").

## 1. Criar a app no cPanel
- **Node.js version**: 20.9 ou superior (idealmente 22+)
- **Application mode**: Production
- **Application startup file**: `server.js`

## 2. Enviar os ficheiros
Envia tudo **exceto** `node_modules`, `.next` e `app/generated`.

## 3. Variáveis de ambiente (`.env` ou painel do cPanel)
```
DATABASE_URL="file:./dev.db"
SESSION_SECRET="um-valor-aleatorio-longo"
ADMIN_EMAIL="o-teu-email@dominio.pt"
ADMIN_PASSWORD="uma-password-forte"
```

## 4. Instalar, preparar a base de dados e compilar
```bash
npm install
npx prisma generate
npx prisma migrate deploy
node prisma/seed.mjs      # só na 1ª vez: cria o admin + dados de exemplo (APAGA pilotos/produtos/etc.)
npm run build
```
Depois clica **Restart** na app do cPanel.

## 5. Usar
- Site: o teu domínio
- Painel: `/admin/login` com o email/password do passo 3
  (podes mudar a password depois em Painel → Definições)

## Notas
- Imagens carregadas no painel ficam em `public/uploads/` — a pasta precisa de permissão de escrita.
- Faz cópias de segurança regulares do ficheiro `dev.db` (é lá que estão encomendas, marcações e conteúdos).
- **Não corras o seed outra vez depois de ir ao ar** — substitui os conteúdos pelos de exemplo.

## Desenvolvimento local
```bash
npm install
npx prisma generate
npx prisma migrate dev
node prisma/seed.mjs
npx next dev -p 3001
```
