-- =========================================================================
-- MIGRACIÓN YA APLICADA EN SUPABASE - REFERENCIA
-- Fecha de aplicación: 2026-02-08
-- Proyecto: vhodqxomxpjzfdvwmaok (ChefCam.IA)
-- =========================================================================

-- La función get_profile_with_reset ha sido mejorada para:
-- 1. Verificar directamente si last_reset_date < CURRENT_DATE
-- 2. Hacer el reinicio de créditos directamente sin depender del trigger
-- 3. Reiniciar recipe_generations_today a 0
-- 4. Reiniciar chef_credits a 5 (free) o 999 (premium)

-- ESTA MIGRACIÓN YA FUE APLICADA - NO EJECUTAR EN SUPABASE
-- Se mantiene aquí solo como referencia y documentación

CREATE OR REPLACE FUNCTION public.get_profile_with_reset(target_user_id uuid)
RETURNS SETOF profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    profile_record profiles%ROWTYPE;
    today_date DATE := CURRENT_DATE;
BEGIN
    -- Obtener el perfil actual
    SELECT * INTO profile_record FROM profiles WHERE id = target_user_id;
    
    -- Si no existe el perfil, retornar vacío
    IF profile_record.id IS NULL THEN
        RETURN;
    END IF;
    
    -- Verificar si necesita reinicio (la fecha del último reinicio es anterior a hoy)
    IF profile_record.last_reset_date IS NULL OR profile_record.last_reset_date < today_date THEN
        -- Hacer el reinicio directamente
        UPDATE profiles
        SET 
            last_reset_date = today_date,
            recipe_generations_today = 0,
            chef_credits = CASE 
                WHEN is_premium = TRUE THEN 999 
                ELSE 5 
            END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = target_user_id;
        
        RAISE NOTICE 'Créditos reiniciados para usuario % (fecha anterior: %, fecha actual: %)', 
            target_user_id, profile_record.last_reset_date, today_date;
    END IF;
    
    -- Retornar el perfil actualizado
    RETURN QUERY SELECT * FROM profiles WHERE id = target_user_id;
END;
$function$;
