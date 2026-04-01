# Nexxoria - Modo Desarrollo

## Estado Actual: MODO DESARROLLO ✅

Nexxoria está actualmente **desactivado** para desarrollo seguro.

## Qué cambió

1. **Plugin modificado**: `.opencode/plugins/nexxoria.js` ahora tiene una bandera de desarrollo
2. **Flag agregado**: `.nexxoria-dev` activa el modo desarrollo
3. **Efecto**: Nexxoria no se carga automáticamente, no hace bootstrap, no modifica archivos

## Cómo está desactivado

- **Archivo**: `.nexxoria-dev` (presente = modo desarrollo)
- **Alternativa**: Variable `NEXXORIA_DEV=true` en entorno

## Cómo reactivarlo

### Opción 1: Borrar el archivo
```bash
rm .nexxoria-dev
```

### Opción 2: Usar variable de entorno (para una sesión)
```bash
NEXXORIA_DEV=false opencode
```

### Opción 3: Desde el plugin (temporal, no persistido)
```bash
# Antes de usar OpenCode:
unset NEXXORIA_DEV
```

## Para testing manual

Podés probar Nexxoria en este repo sin afectar otros proyectos:

```bash
# En una terminal, sin variable NEXXORIA_DEV:
cd /srv/nexxoria-skill-pack
opencode "tu prompt"

# O especificando el plugin directamente:
opencode --plugin .opencode/plugins/nexxoria.js "tu prompt"
```

## Notas

- El skill en `skills/nexxoria/SKILL.md` sigue existiendo
- El código fuente está intacto
- Solo la activación automática está desactivada
