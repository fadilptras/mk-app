import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Ini untuk mengelabui browser agar mengizinkan CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { users, title, message } = await req.json();
    
    // Taruh Secret API Key Novu kamu di sini (sementara di-hardcode untuk testing)
    const NOVU_SECRET_KEY = "2ba6b52213f62371fe769d7e898c159d";

    const promises = users.map((u: any) => fetch('https://api.novu.co/v1/events/trigger', {
        method: 'POST',
        headers: {
            'Authorization': `ApiKey ${NOVU_SECRET_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'mk-app', // ID Workflow Novu
            to: { subscriberId: u.id, email: u.email },
            payload: { title, message }
        })
    }));

    await Promise.all(promises);

    return new Response(JSON.stringify({ success: true }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 
    });
  }
})