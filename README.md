# Linha 1:64

Site estático sobre colecionismo Hot Wheels, agora conectado ao projeto Firebase `HWlinha164`.

## Firebase e Cloud Firestore

A integração utiliza o aplicativo Web `Linha 1:64` do projeto Firebase `HWlinha164` e o banco Cloud Firestore `(default)`, criado na região `southamerica-east1` (São Paulo).

A configuração pública do SDK está em `assets/js/firebase-config.js`. Em aplicativos Web Firebase, esses identificadores podem ser distribuídos no navegador; a proteção dos dados é aplicada pelas regras do Firestore, não pelo segredo da configuração. **Não adicione chaves privadas ou contas de serviço ao repositório.**

A página inicial carrega os dados por meio de `assets/js/home-firestore.js`. Se o Firestore estiver temporariamente indisponível ou sem registros, o site mantém o conteúdo HTML local como fallback.

## Schema inicial

| Coleção | Documento de exemplo | Campos suportados | Uso no site |
|---|---|---|---|
| `siteContent` | `welcome-content` | `title` (string), `description` (string opcional), `order` (number opcional), `visible` (boolean opcional) | Cards em “Últimos conteúdos” |
| `mural` | `skyline-r34-sth` | `title` (string), `status` (string opcional), `location` (string opcional), `price` (string opcional), `order` (number opcional), `visible` (boolean opcional) | Anúncios em “Mural do Colecionador” |
| `lotes` | — | Reservada para a próxima etapa de migração do catálogo | Futura página dinâmica de lotes |

Os documentos são ordenados pelo campo numérico `order`. Quando o campo não existe, o registro aparece depois dos registros ordenados. Documentos com `visible: false` não são renderizados.

## Regras de segurança atuais

As regras publicadas permitem leitura pública somente para documentos dentro de `siteContent`, `mural` e `lotes`. Gravações pelo navegador permanecem negadas, assim como qualquer caminho que não esteja explicitamente declarado. Isso evita que visitantes alterem o conteúdo diretamente.

Para inserir ou editar dados neste estágio, use o Firebase Console com uma conta administrativa. Caso o site precise receber envios diretamente no futuro, implemente autenticação e regras por usuário antes de liberar `create` ou `update` no cliente.

## Desenvolvimento local

Como o projeto é estático, sirva a pasta por HTTP para que os módulos ES e as chamadas do Firebase funcionem:

```bash
python3 -m http.server 4173
```

Depois, acesse `http://127.0.0.1:4173/index.html`.

O teste de integração esperado é visualizar o indicador **“Dados atualizados a partir do Firestore.”** e ver os dados das coleções substituindo os blocos locais correspondentes.
