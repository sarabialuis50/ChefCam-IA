import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform',
};

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        // ePayco sends data either in body (POST) or query params
        let data;
        if (req.method === 'POST') {
            try {
                data = await req.json();
            } catch (e) {
                // Fallback for form-encoded if necessary
                const formData = await req.formData();
                data = Object.fromEntries(formData.entries());
            }
        } else {
            const url = new URL(req.url);
            data = Object.fromEntries(url.searchParams.entries());
        }

        console.log("ePayco Webhook received data:", JSON.stringify(data));

        // ePayco uses 'x_cod_response' for status: 1 = Aceptada
        // 'x_id_invoice' or 'x_extra1' usually contains our reference 'cs_USERID_TIMESTAMP'
        const status = data.x_cod_response || data.x_response_reason_code;
        const reference = data.x_id_invoice || data.x_extra1 || data.x_ref_payco;

        // In ePayco Onpage, the reference we sent as 'invoice' is 'x_id_invoice'
        if (status == '1') {
            console.log(`Payment Approved for reference: ${reference}`);

            // Extract User ID from Reference (cs_ID_TIMESTAMP)
            const parts = reference?.split('_');
            const userId = parts?.[1];

            if (userId) {
                console.log(`Updating user ${userId} to Premium`);
                const { error: updateError } = await supabaseAdmin
                    .from('profiles')
                    .update({ is_premium: true, chef_credits: 999 })
                    .eq('id', userId);

                if (updateError) throw updateError;
                console.log("User updated successfully");
            } else {
                console.warn("Could not find userId in reference:", reference);
            }
        } else {
            console.log(`Payment status not approved: ${status}`);
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error("Webhook Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
