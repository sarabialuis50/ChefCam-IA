# 🔧 CORRECCIONES DEFINITIVAS - ChefScan.IA

## Resumen de Cambios Realizados

### ✅ Problema 1: Imágenes Repetidas - SOLUCIONADO

**Causa raíz identificada:**
- El servicio de Pexels solicitaba `per_page=1`, devolviendo siempre la misma imagen para queries similares.
- No había sistema de cache para evitar repetición de imágenes en la misma sesión.

**Solución implementada en `services/pexelsService.ts`:**
1. Ahora solicita **15 imágenes** por búsqueda (`per_page=15`)
2. Sistema de **cache en memoria** que evita repetir imágenes usadas en la sesión
3. **Selección aleatoria** de imágenes disponibles
4. Fallback único usando timestamp + contador cuando Pexels falla
5. Función `clearImageCache()` que se ejecuta al inicio de cada generación

**Cambios en `services/geminiService.ts`:**
1. Se importa y usa `clearImageCache()` al inicio de `generateRecipes()`
2. Procesamiento **secuencial** de recetas (en lugar de paralelo) para evitar condiciones de carrera
3. IDs únicos con formato `recipe-{timestamp}-{index}`
4. Prompt mejorado para que Gemini genere `photoQuery` ÚNICOS para cada receta

---

### ✅ Problema 2: Reinicio de Créditos Cada 24 Horas - SOLUCIONADO

**Causa raíz identificada:**
- La función RPC `get_profile_with_reset` usaba comparación de INTERVAL (24 horas)
- Esto causaba que los créditos se reiniciaran exactamente 24 horas después del último reinicio
- No respetaba el cambio de día calendario (medianoche)

**Solución implementada en `supabase/migrations/fix_daily_credits_reset.sql`:**
1. Nueva lógica que compara **FECHAS** en lugar de intervalos
2. Soporte para **zona horaria** (configurado para America/Bogota)
3. Reinicio ocurre cuando `DATE(last_reset) < DATE(now())` en hora local
4. Columna `last_credits_reset` agregada si no existía

---

## 📋 PASOS PARA APLICAR LA MIGRACIÓN

### Paso 1: Ejecutar la Migración SQL en Supabase

1. Ve a [Supabase Dashboard](https://app.supabase.com/)
2. Selecciona el proyecto **ChefScan** (vhodqxomxpjzfdvwmaok)
3. Ve a **SQL Editor** en el menú lateral
4. Copia TODO el contenido del archivo:
   ```
   supabase/migrations/fix_daily_credits_reset.sql
   ```
5. Pégalo en el SQL Editor
6. Haz clic en **Run** para ejecutar

### Paso 2: Verificar la Migración

Ejecuta esta consulta en el SQL Editor para verificar:
```sql
SELECT id, chef_credits, recipe_generations_today, last_credits_reset, is_premium
FROM profiles
LIMIT 10;
```

### Paso 3: Subir los Cambios al Repositorio

```bash
git add .
git commit -m "fix: corrección definitiva de imágenes repetidas y reinicio diario de créditos"
git push origin main
```

### Paso 4: Desplegar en Producción

Después de hacer push a GitHub, Hostinger debería desplegar automáticamente los cambios (si tienes CI/CD configurado) o necesitarás hacer el deploy manualmente.

---

## 🧪 Cómo Probar las Correcciones

### Probar Imágenes Únicas:
1. Genera una nueva receta desde el escáner o modo manual
2. Verifica que cada receta tiene una imagen diferente
3. Revisa la consola del navegador para ver los logs:
   - `🗑️ Cache de imágenes limpiado`
   - `📸 [1/3] Buscando imagen para: "..." con query: "..."`
   - `📸 Imagen única seleccionada para "..."`

### Probar Reinicio de Créditos:
1. Anota los créditos actuales del usuario antes de medianoche
2. Después de medianoche (00:00), cierra sesión y vuelve a iniciar
3. Los créditos deberían reiniciarse a 5 (usuarios free) o 999 (premium)
4. El contador `recipe_generations_today` debería ser 0

---

## ⚠️ Notas Importantes

1. **Zona Horaria**: La migración está configurada para `America/Bogota`. Si necesitas otra zona horaria, modifica la variable `user_timezone` en la función `get_profile_with_reset`.

2. **pg_cron (Opcional)**: Si tienes Supabase Pro con pg_cron habilitado, puedes descomentar las líneas del cron job para un reinicio automático a medianoche independiente del login del usuario.

3. **Compatibilidad**: Los cambios son retrocompatibles. Los usuarios existentes no perderán datos.
