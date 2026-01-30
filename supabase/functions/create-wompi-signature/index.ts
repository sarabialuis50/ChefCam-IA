import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-version',
}

Deno.serve(async (req) => {
    // 1. Handle CORS Preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        console.log("Iniciando creación de firma Wompi...");

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const authHeader = req.headers.get('Authorization');

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Configuración de Supabase incompleta en el servidor.');
        }

        // Usamos Service Key para poder verificar al usuario de forma segura internamente
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        // Intentar obtener el usuario. Si el header falta o es inválido, 
        // daremos un error claro en lugar de un 401 genérico de Supabase.
        let user = null;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            const { data: { user: identifiedUser }, error: userError } = await supabaseAdmin.auth.getUser(token);
            if (!userError && identifiedUser) {
                user = identifiedUser;
            } else {
                console.warn("No se pudo identificar al usuario por el token:", userError?.message);
            }
        }

        if (!user) {
            return new Response(JSON.stringify({
                error: 'No autenticado',
                details: 'No se pudo verificar tu sesión. Por favor intenta cerrar sesión e ingresar de nuevo.'
            }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        console.log(`Usuario validado exitosamente: ${user.id}`);

        // Get Wompi Config (Fallback to hardcoded for testing due to Supabase Dashboard maintenance issues)
        const publicKey = Deno.env.get('WOMPI_PUBLIC_KEY')?.startsWith('pub_prod')
            ? Deno.env.get('WOMPI_PUBLIC_KEY')
            : 'pub_prod_STokbhGE9eMNFwRI8H3EWRDVAke5mab7';

        const integritySecret = Deno.env.get('WOMPI_INTEGRITY_SECRET')?.startsWith('prod_integrity')
            ? Deno.env.get('WOMPI_INTEGRITY_SECRET')
            : 'prod_integrity_j667tsJMAt5LjN4QeN7qt9g7M6QSbITq';

        console.log(`Debug - Public Key starts with: ${publicKey?.substring(0, 15)}...`);
        console.log(`Debug - Integrity Secret starts with: ${integritySecret?.substring(0, 15)}...`);

        if (!publicKey || !integritySecret) {
            throw new Error(`Faltan llaves de Wompi en Supabase: ${!publicKey ? 'WOMPI_PUBLIC_KEY ' : ''}${!integritySecret ? 'WOMPI_INTEGRITY_SECRET' : ''}`)
        }

        // 1. Generate a unique Reference for Wompi
        // cs_USERID_TIMESTAMP (Limit 64 chars)
        const reference = `cs_${user.id}_${Date.now()}`

        // 2. Generate the Integrity Signature
        // Formula: SHA256(reference + amountInCents + currency + integritySecret)
        const amountInCents = 1990000
        const currency = 'COP'

        const signatureInput = `${reference}${amountInCents}${currency}${integritySecret}`

        console.log(`Debug - Gererating integrity for: ${reference} | Amount: ${amountInCents} | Currency: ${currency}`);

        const encoder = new TextEncoder()
        const data = encoder.encode(signatureInput)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const integritySignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

        console.log(`Firma generada: ${integritySignature.substring(0, 10)}...`);

        return new Response(
            JSON.stringify({
                reference,
                integritySignature,
                amountInCents,
                currency,
                publicKey, // Asegurémonos de que esto sea pub_prod_...
                status: 'success'
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error: any) {
        console.error("Error crítico en signature-function:", error.message);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
