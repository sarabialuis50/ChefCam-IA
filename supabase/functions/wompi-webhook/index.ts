import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload = await req.json()
        console.log("Receiving Wompi Webhook:", JSON.stringify(payload))

        const { data, timestamp, signature } = payload
        const envSecret = Deno.env.get('WOMPI_EVENTS_SECRET')

        // Fallback for testing due to Supabase Dashboard maintenance issues
        const eventsSecret = envSecret?.startsWith('prod_events')
            ? envSecret
            : 'prod_events_e1LJSK6bHE6i8MDKNtfgk0NQ8hB61JsD';

        if (!eventsSecret) {
            console.error("WOMPI_EVENTS_SECRET is not set correctly in Supabase.")
            return new Response(JSON.stringify({ error: "Server Configuration Error" }), { status: 500 })
        }

        // 1. Validate Webhook Integrity (Checksum)
        if (signature && signature.checksum && signature.properties) {
            let concatenatedValues = "";

            // Wompi sends an array of property paths (e.g. "transaction.id") 
            // that must be concatenated in order to verify the hash.
            for (const prop of signature.properties) {
                const keys = prop.split('.');
                let value: any = data;
                for (const key of keys) {
                    if (value && typeof value === 'object' && key in value) {
                        value = value[key];
                    } else {
                        value = null;
                        break;
                    }
                }
                if (value !== null && value !== undefined) {
                    concatenatedValues += value.toString();
                }
            }

            // The formula is: checksum = sha256(concatenated_values + timestamp + events_secret)
            const signatureInput = `${concatenatedValues}${timestamp}${eventsSecret}`;
            const encoder = new TextEncoder();
            const dataToHash = encoder.encode(signatureInput);
            const hashBuffer = await crypto.subtle.digest('SHA-256', dataToHash);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const localChecksum = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            if (localChecksum !== signature.checksum) {
                console.error("INTEGRITY ERROR: Checksum mismatch. Possible fraud attempt.");
                return new Response(JSON.stringify({ error: "Invalid integrity signature" }), {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
            console.log("Checksum validated successfully. Payment is authentic.");
        } else {
            console.error("SECURITY ERROR: No signature provided in webhook payload.");
            return new Response(JSON.stringify({ error: "Missing signature" }), { status: 400 });
        }

        // 2. Business Logic: Process Transaction
        const transaction = data.transaction
        const reference = transaction.reference // Format: 'cs_USERUUID_TIMESTAMP'

        if (transaction.status !== 'APPROVED') {
            console.log(`Transaction ${reference} status is ${transaction.status}. Skipping profile update.`);
            return new Response(JSON.stringify({ received: true, status: 'ignored' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Extract User ID from Reference (cs_ID_TIMESTAMP)
        const parts = reference.split('_');
        const userId = parts[1];

        if (!userId) {
            console.error("ERROR: No userId found in reference:", reference)
            throw new Error('Invalid Reference format')
        }

        // 3. Activate Premium in Supabase
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({
                is_premium: true,
                subscription_status: 'active',
                subscription_price_id: 'wompi_premium_cop',
                subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            })
            .eq('id', userId)

        if (updateError) {
            console.error("DATABASE ERROR updating profile:", updateError)
            throw updateError
        }

        console.log(`SUCCESS: User ${userId} activated as Premium through reference ${reference}.`)

        return new Response(JSON.stringify({ received: true, status: 'processed' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        })

    } catch (err: any) {
        console.error(`WEBHOOK EXCEPTION: ${err.message}`)
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
})
