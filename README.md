# Teste de Código Python/Django
Autor: Pedro Henrique Carvalho Grizotte

Projeto full stack com `Django + DRF` no backend e `React + Vite` no frontend.

A ideia da aplicação é simples: empresas publicam vagas, candidatos se cadastram, se candidatam e a empresa consegue acompanhar candidatos e relatórios.

## Stack usada

### Backend
- Django
- Django REST Framework
- Token Authentication
- Pytest
- Pytest-Django
- Coverage

### Frontend
- React
- TypeScript
- Vite
- React Router
- React Query
- Tailwind

## Como rodar o projeto

### 1. Clonar o projeto

```bash
git clone <url-do-repositorio>
cd DjangoDemoApp
```

### 2. Criar e ativar a virtualenv do backend

No Mac/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

No Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

## Backend

### Instalar dependências

```bash
cd backend
pip install -r requirements.txt
```

### Aplicar migrations

```bash
python manage.py migrate
```

### Rodar o servidor

```bash
python manage.py runserver
```

Backend disponível em:

```txt
http://127.0.0.1:8000/
```

Principais rotas da API:

- `api/contas/registro/`
- `api/contas/login/`
- `api/contas/eu/`
- `api/trabalhos/`
- `api/trabalhos/aplicacoes/`
- `api/trabalhos/relatorios/`

## Frontend

Instale o Node.js: 

No Mac/Linux: 

```bash
# Download o Homebrew:
curl -o- https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh | bash

# Download e instale Node.js: 
brew install node@24

# Verificar a versão do Node.js: 
node -v | minha versão: v24.1.0.

# Verificar a versão do npm:
npm -v | minha versão: v11.3.0 
```

Abra outro terminal, ative novamente o ambiente virtual: 

No Mac/Linux:

```bash
source .venv/bin/activate
```

No Windows:

```bash
.venv\Scripts\activate
```

Volta para a raiz do projeto e rode:

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em:

```txt
http://127.0.0.1:5173/
```

## Ordem prática para subir tudo

Se quiser fazer do jeito mais simples:

1. Na raiz do projeto, ative a virtualenv com `source .venv/bin/activate`
2. Entre em `backend`
3. Rode `pip install -r requirements.txt`
4. Rode `python manage.py migrate`
5. Rode `python manage.py runserver`
6. Abra outro terminal
7. Entre em `frontend`
8. Rode `npm install`
9. Rode `npm run dev`

## Fluxo da aplicação

## Fluxo do candidato

O fluxo principal do candidato é:

1. Fazer registro
2. Fazer login
3. Ver a lista de vagas
4. Abrir os detalhes de uma vaga
5. Enviar candidatura
6. Acompanhar suas candidaturas

Telas principais do candidato:

- `/registro`
- `/login`
- `/`
- `/empregos/:id`

### Imagens do fluxo do candidato

(Ainda sem imagens)

## Fluxo da empresa

O fluxo principal da empresa é:

1. Fazer registro
2. Fazer login
3. Criar vaga
4. Ver suas vagas
5. Editar vaga
6. Ver candidatos por vaga
7. Ver relatórios

Telas principais da empresa:

- `/login`
- `/empresa/trabalhos`
- `/empresa/trabalhos/novo`
- `/empresa/trabalhos/:id/editar`
- `/empresa/trabalhos/:id/candidatos`
- `/relatorios`

### Imagens do fluxo da empresa

(Ainda sem imagens)

## Testes do backend

Os testes do backend foram feitos com:

- `pytest`
- `pytest-django`
- `pytest-cov`

### Como rodar os testes

Com a virtualenv ativa:

```bash
cd backend
pytest
```

### Como rodar com coverage

```bash
cd backend
pytest --cov-report=html
```

Isso gera:

- `htmlcov/`
- `coverage.xml`

Se quiser abrir o relatório HTML no Mac:

```bash
open htmlcov/index.html
```

### O que está sendo testado

Hoje a suíte cobre principalmente:

- registro de usuário
- login
- endpoint de usuário autenticado
- criação e listagem de vagas
- candidatura
- permissões de empresa e candidato
- score da aplicação
- relatório da empresa

## Estrutura do projeto

```txt
DjangoDemoApp/
├── backend/
│   ├── apps/
│   │   ├── contas/
│   │   └── trabalhos/
│   ├── config/
│   ├── manage.py
│   ├── pytest.ini
│   └── requirements.txt
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.ts
```

## Observações

- O backend usa autenticação por token
- O frontend consome a API do Django
- Para rodar os testes, use a virtualenv ativada