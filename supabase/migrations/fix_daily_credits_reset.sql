-- =========================================================================
-- MIGRACIÓN: CORRECCIÓN DEL REINICIO DIARIO DE CRÉDITOS
-- 
-- PROBLEMA: Los créditos se reinician cada 24 horas desde la última recarga
-- en lugar de a las 00:01 de cada nuevo día (medianoche).
--
-- SOLUCIÓN: Cambiar la lógica para comparar FECHAS en lugar de usar INTERVAL.
-- Ahora se reinicia cuando DATE(last_reset) < DATE(NOW()) en UTC.
--
-- EJECUCIÓN: En Supabase Dashboard > SQL Editor > Pegar y ejecutar.
-- =========================================================================

-- 1. Primero, agregar columna last_credits_reset si no existe
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS last_credits_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Agregar columna recipe_generations_today si no existe
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS recipe_generations_today INTEGER DEFAULT 0;

-- 3. Agregar columna chef_credits si no existe
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS chef_credits INTEGER DEFAULT 5;

-- 4. Agregar columna is_premium si no existe  
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- 5. ELIMINAR la función anterior (si existe)
DROP FUNCTION IF EXISTS get_profile_with_reset(UUID);

-- 6. CREAR la nueva función con lógica de reinicio por DÍA CALENDARIO
CREATE OR REPLACE FUNCTION get_profile_with_reset(target_user_id UUID)
RETURNS SETOF profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_timezone TEXT := 'America/Bogota'; -- Zona horaria del usuario (ajustar según necesidad)
    current_date_local DATE;
    last_reset_date_local DATE;
BEGIN
    -- Obtener la fecha actual en la zona horaria del usuario
    current_date_local := (NOW() AT TIME ZONE user_timezone)::DATE;
    
    -- Verificar si el usuario necesita reinicio de créditos
    -- El reinicio ocurre cuando la fecha LOCAL del último reinicio es ANTERIOR a la fecha LOCAL actual
    SELECT (last_credits_reset AT TIME ZONE user_timezone)::DATE 
    INTO last_reset_date_local
    FROM profiles 
    WHERE id = target_user_id;
    
    -- Si es un nuevo día (la fecha del último reinicio es anterior a hoy), reiniciar créditos
    IF last_reset_date_local IS NULL OR last_reset_date_local < current_date_local THEN
        UPDATE profiles
        SET 
            recipe_generations_today = 0,
            chef_credits = CASE WHEN is_premium THEN 999 ELSE 5 END,
            last_credits_reset = NOW()
        WHERE id = target_user_id;
        
        RAISE NOTICE 'Créditos reiniciados para usuario % (último reinicio: %, hoy: %)', 
            target_user_id, last_reset_date_local, current_date_local;
    END IF;
    
    -- Retornar el perfil actualizado
    RETURN QUERY SELECT * FROM profiles WHERE id = target_user_id;
END;
$$;

-- 7. También crear/actualizar la función increment_recipe_generations
DROP FUNCTION IF EXISTS increment_recipe_generations(UUID);

CREATE OR REPLACE FUNCTION increment_recipe_generations(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE profiles
    SET recipe_generations_today = recipe_generations_today + 1
    WHERE id = user_id;
END;
$$;

-- 8. Función para decrementar créditos del chef
DROP FUNCTION IF EXISTS decrement_chef_credits(UUID);

CREATE OR REPLACE FUNCTION decrement_chef_credits(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE profiles
    SET chef_credits = GREATEST(0, chef_credits - 1)
    WHERE id = user_id;
END;
$$;

-- 9. Función para añadir créditos del chef
DROP FUNCTION IF EXISTS add_chef_credits(UUID, INTEGER);

CREATE OR REPLACE FUNCTION add_chef_credits(user_id UUID, amount INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE profiles
    SET chef_credits = chef_credits + amount
    WHERE id = user_id;
END;
$$;

-- 10. Crear un cron job para reinicio automático a medianoche (OPCIONAL - requiere pg_cron)
-- NOTA: Esto es OPCIONAL y solo funciona si tienes pg_cron habilitado en Supabase Pro
-- Si no tienes pg_cron, la función get_profile_with_reset manejará el reinicio al iniciar sesión.

-- DESCOMENTAR LAS SIGUIENTES LÍNEAS SI TIENES Supabase Pro con pg_cron habilitado:
-- SELECT cron.schedule(
--     'reset-daily-credits',
--     '1 0 * * *', -- A las 00:01 todos los días
--     $$
--     UPDATE profiles
--     SET 
--         recipe_generations_today = 0,
--         chef_credits = CASE WHEN is_premium THEN 999 ELSE 5 END,
--         last_credits_reset = NOW()
--     WHERE last_credits_reset::DATE < CURRENT_DATE;
--     $$
-- );

-- =========================================================================
-- VERIFICACIÓN: Ejecutar esta consulta para verificar el estado actual
-- =========================================================================
-- SELECT id, chef_credits, recipe_generations_today, last_credits_reset, is_premium
-- FROM profiles
-- LIMIT 10;
