# Nexxoria Architecture Rules

## Regla absoluta

Nexxoria se divide en dos capas con responsabilidades INMUTABLES:

- **Módulos = cerebro**
- **Runtime = manos**

Si una pieza decide intención, flujo, etapas, tareas, contexto, memoria o prioridad, entonces pertenece a un módulo.

Si una pieza solo lee archivos, escribe archivos, crea carpetas o persiste estructuras ya decididas, entonces pertenece al runtime.

---

## Regla principal

### Los módulos deciden

Los módulos son responsables de:

- decidir qué hacer
- decidir cuándo hacerlo
- decidir por qué hacerlo
- decidir en qué orden hacerlo

### El runtime ejecuta

El runtime solo puede:

- crear carpetas
- escribir archivos
- leer repositorios
- persistir JSON o Markdown
- exponer helpers mecánicos de filesystem

---

## Prohibición crítica

El runtime NO puede:

- interpretar intención del usuario
- decidir etapas
- decidir tareas
- decidir routing entre módulos
- generar heurísticas de producto
- construir propuestas o recomendaciones
- inferir decisiones de negocio

Si el runtime contiene cualquiera de esas responsabilidades, es un error arquitectónico.

---

## Patrón obligatorio

### Correcto

1. `conversation` recibe el prompt
2. `conversation` decide si necesita `planning`, `tasks`, `memory`, `state` o `context`
3. el módulo correspondiente decide el resultado
4. el runtime persiste o materializa lo decidido

### Incorrecto

1. plugin llama runtime
2. runtime decide intención o routing
3. runtime genera stages, tasks o propuestas por su cuenta

---

## Tabla de responsabilidades

| Pieza | Responsabilidad |
|---|---|
| `modules/conversation` | Decide intención, flujo, contexto conversacional y routing |
| `modules/planning` | Decide stages y estructura funcional |
| `modules/tasks` | Decide tareas y su intención |
| `modules/memory` | Decide qué conocimiento persistir |
| `modules/state` | Decide cómo representar progreso y foco |
| `modules/context` | Decide qué contexto sintetizar y cómo representarlo |
| `runtime/*` | Ejecuta lectura, escritura, scaffold y persistencia |
| `.opencode/plugins/nexxoria.js` | Entra por conversation y transporta resultados al runtime de OpenCode |

---

## Ejemplos correctos vs incorrectos

### Ejemplo 1: stages

**Incorrecto**

`runtime/planning.js` inspecciona el repo y decide:

- Stage 1 = Setup
- Stage 2 = Planning
- Stage 3 = Implementation

**Correcto**

`modules/planning/index.js` decide las stages.

Luego el runtime:

- crea `.nexxoria/stages/stage-*`
- escribe `STAGE.md`
- actualiza `project_state.json`

### Ejemplo 2: routing

**Incorrecto**

`runtime/next-step-routing.js` decide si ir a `tasks` o `planning`.

**Correcto**

`modules/conversation/index.js` decide el routing.

Luego el runtime solo persiste `routing.md`.

### Ejemplo 3: análisis del repo

**Incorrecto**

`runtime/repo-analysis.js` infiere tipo de proyecto, preguntas pendientes y decisiones del sistema.

**Correcto**

el runtime solo expone snapshot mecánico del repo.

el módulo `conversation` interpreta ese snapshot y decide qué significa.

---

## Entry point obligatorio

El entrypoint real del sistema debe ser siempre `conversation`.

Eso significa:

- el plugin no decide lógica de producto
- el plugin no enruta por su cuenta
- el plugin no genera drafts por su cuenta
- el plugin invoca `modules/conversation`

---

## Regla de revisión futura

Antes de aprobar cambios de arquitectura, verificar siempre:

1. ¿esta pieza está decidiendo algo?
2. si decide algo, ¿vive en `modules/`?
3. si solo ejecuta, ¿vive en `runtime/`?

Si la respuesta no respeta esas tres preguntas, el cambio debe rechazarse.
