# Nexxoria

Organizá cualquier proyecto con memoria, etapas y próximos pasos claros, directo desde terminal o OpenCode.

## Quick Start

```bash
pnpm install
pnpm build
node packages/cli/dist/index.js init
node packages/cli/dist/index.js prompt "quiero organizar este proyecto"
```

## Qué pasa después

Nexxoria:

- crea `.nexxoria/`
- organiza una etapa inicial
- crea una task base
- guarda contexto y memoria
- te dice cuál es el siguiente paso

## Comandos básicos

- `nexxoria init` → prepara el proyecto
- `nexxoria prompt "..."` → le decís qué querés hacer
- `nexxoria status` → te dice en qué estado está el proyecto
- `nexxoria continue` → sigue desde donde quedó

## Mini demo

```bash
nexxoria prompt "quiero organizar este proyecto"
```

Salida esperada:

- estás en `stage-1`
- ya existe una task base
- el siguiente paso es definir mejor su alcance

## Qué hace Nexxoria

- estructura proyectos
- mantiene contexto
- recuerda decisiones importantes
- guía el siguiente paso

## Qué NO hace

- no ejecuta tu código
- no reemplaza tu IDE
- no toma control del proyecto

## Cierre

Nexxoria no te da respuestas sueltas.

Te da continuidad.
