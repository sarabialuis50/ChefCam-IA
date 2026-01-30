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

        // Get auth token
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            throw new Error('No authorization token');
        }

        // Get user
        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
        if (userError || !user) throw new Error('Invalid user');

        // Subscription details
        const amount = 19900; // COP
        const reference = `cs_${user.id}_${Date.now()}`;

        // Public keys from ePayco (will be fetched from env)
        const publicKey = Deno.env.get('EPAYCO_PUBLIC_KEY') || '8e93337ebb7a9936f770f785bb04c267'; // Default for testing if not set
        const pCustId = Deno.env.get('EPAYCO_P_CUST_ID') || '1554826';

        return new Response(JSON.stringify({
            publicKey,
            pCustId,
            reference,
            amount,
            email: user.email,
            name: user.user_metadata?.name || 'ChefScan User',
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
