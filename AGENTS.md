# 🧠 AGENTS.md — Reglas Inmutables de Nexxoria (MVP Fase 1)

## 📌 PROPÓSITO

Este archivo define las reglas obligatorias para cualquier agente, modelo o herramienta (OpenCode, ChatGPT, etc.) que trabaje en el repositorio de Nexxoria.

Estas reglas NO son sugerencias.  
Son restricciones de arquitectura y producto.

Si una implementación rompe estas reglas, está incorrecta.

---

# 🧱 PRINCIPIO CENTRAL

Nexxoria es un sistema estructurado donde:

- los módulos piensan
- el runtime ejecuta
- el SDK contiene toda la lógica
- el CLI y el plugin solo llaman al SDK

---

# 🧠 ARQUITECTURA INMUTABLE

## 1. LOS MÓDULOS SON EL CEREBRO

Toda la lógica de producto vive en módulos dentro del SDK.

Módulos oficiales MVP:

- conversation
- planning
- tasks
- memory
- state
- context

### Responsabilidades:

- conversation → interpreta intención y dirige flujo
- planning → define etapas
- tasks → divide trabajo
- memory → decide qué guardar
- state → controla progreso y next_step
- context → decide qué cargar

❌ PROHIBIDO:
- meter lógica de producto fuera de los módulos

---

## 2. EL RUNTIME SON LAS MANOS

El runtime solo ejecuta acciones mecánicas.

Ejemplos:

- crear carpetas
- escribir archivos
- leer archivos
- manejar JSON/Markdown
- resolver rutas

❌ PROHIBIDO:
- tomar decisiones de producto
- interpretar intención
- decidir flujo

---

## 3. EL SDK ES EL NÚCLEO DEL SISTEMA

Todo el comportamiento de Nexxoria vive dentro del SDK.

El SDK debe:

- bootstrapear `.nexxoria/`
- analizar repositorios
- manejar memoria
- manejar estado
- construir contexto
- ejecutar el flujo vía conversation
- enrutar a módulos

❌ PROHIBIDO:
- duplicar lógica en CLI o plugin

---

## 4. CLI Y PLUGIN SON CAPAS DELGADAS

### CLI:
- ejecuta comandos (`init`, `analyze`, `continue`)
- llama al SDK

### Plugin OpenCore:
- recibe prompts del usuario
- llama al SDK
- devuelve respuestas

❌ PROHIBIDO:
- meter lógica de producto aquí
- reimplementar comportamiento del SDK

---

# 📁 ESTRUCTURA DEL REPO (OBLIGATORIA)

packages/
  sdk/               → núcleo del sistema
  cli/               → interfaz por terminal
  plugin-opencore/   → integración con OpenCore

---

# 🧠 FLUJO OBLIGATORIO DEL SISTEMA

handlePrompt()
  → bootstrapIfNeeded()
  → analyzeRepository() (si aplica)
  → buildContext()
  → conversation module (SIEMPRE PRIMERO)
  → routing
  → otros módulos
  → persistencia en .nexxoria/
  → respuesta

---

# 💾 PERSISTENCIA — .NEXXORIA/

Toda la memoria del sistema vive en:

.nexxoria/

Debe contener:

- context/
- memory/
- stages/
- state/
- logs/

---

# 🚀 REGLAS DE IMPLEMENTACIÓN

## SIEMPRE:

1. Revisar qué ya existe antes de crear
2. No duplicar código ni estructura
3. Mantener separación módulos vs runtime
4. Mantener SDK como única fuente de lógica
5. Crear código simple, no sobreingeniería
6. Hacer cambios incrementales

---

## NUNCA:

- mezclar lógica de producto con filesystem
- crear lógica en CLI o plugin
- inventar arquitectura no definida
- sobrecomplicar Fase 1
- romper la estructura `.nexxoria/`

---

# 🎯 ALCANCE DE FASE 1

Incluye:

- SDK funcional
- bootstrap de `.nexxoria/`
- análisis básico
- contexto mínimo
- conversación básica
- CLI básico
- plugin básico

No incluye:

- SaaS
- backend cloud
- base de datos externa
- multiusuario
- dashboards

---

# 🧭 PRINCIPIO FINAL

La lógica vive en módulos dentro del SDK.  
El runtime solo ejecuta.  
El SDK es el centro del sistema.

---

# 🔒 CARÁCTER

Este archivo es permanente. Romper estas reglas rompe Nexxoria.
