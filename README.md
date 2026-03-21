# Pé na Porta

Site editorial em português de Portugal, focado em opinião, política, instituições e debate público, gerado com Hugo e publicado na Vercel.

## Objetivo

O projeto existe para publicar textos de análise e opinião com uma base editorial clara:

- foco em perguntas estruturais sobre Portugal;
- escrita em Markdown, sem dependência de CMS;
- publicação rápida, versionada e transparente;
- repositório público, legível e fácil de manter.

## Stack

- Hugo Extended
- Tema PaperMod, integrado como submódulo Git
- CSS e layouts personalizados sobre o tema
- Deploy na Vercel

## Estrutura do repositório

```text
.
|- archetypes/          # Template base para novos conteúdos
|- assets/              # CSS e JavaScript processados pelo Hugo
|- content/             # Páginas e artigos em Markdown
|- layouts/             # Overrides ao tema PaperMod
|- static/              # Ficheiros estáticos servidos diretamente
|- themes/PaperMod/     # Tema Hugo como submódulo Git
|- hugo.toml            # Configuração principal do site
`- .gitignore
```

## Como correr localmente

Pré-requisitos:

- Git
- Hugo Extended

Clonar com submódulos:

```bash
git clone --recurse-submodules <repo-url>
cd penaporta.vercel.app
```

Se o repositório já tiver sido clonado sem o tema:

```bash
git submodule update --init --recursive
```

Iniciar servidor local:

```bash
hugo server -D
```

Gerar build de produção local:

```bash
hugo --gc --minify
```

## Fluxo editorial

Criar novo artigo a partir do archetype:

```bash
hugo new content/posts/nome-do-artigo.md
```

Regras práticas para conteúdo:

- manter títulos, descrições e summaries consistentes;
- usar slugs curtos e estáveis;
- preencher categorias, tags e imagem de capa quando fizer sentido;
- rever links internos antes de publicar;
- evitar HTML desnecessário dentro do Markdown.

## Deploy na Vercel

Configuração recomendada:

- Framework Preset: Hugo
- Build Command: `hugo --gc --minify`
- Output Directory: `public`
- Install Command: deixar em branco, salvo necessidade específica

Variáveis úteis:

- `HUGO_VERSION=0.155.3`
- `HUGO_ENV=production`

Se a Vercel não resolver automaticamente o tema, confirmar que o repositório foi importado com suporte a submódulos Git.

## Qualidade do projeto

Este repositório foi organizado para ser simples de ler e manter:

- conteúdo separado da lógica de apresentação;
- overrides mínimos ao tema, concentrados em `layouts/` e `assets/`;
- saída gerada fora do controlo de versão;
- documentação de arranque, build e deploy na raiz do projeto.

## Próximas melhorias recomendadas

- otimizar imagens grandes para WebP ou AVIF;
- definir domínio final e alinhar `baseURL` com produção;
