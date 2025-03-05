import { parse } from "https://deno.land/std@0.168.0/path/mod.ts";

export default async (request, context) => {
    // Check if requesting login page or static files
    const url = new URL(request.url);
    const path = url.pathname;

    // Allow access to login page and static files
    if (path === '/login.html' || path.startsWith('/assets/')) {
        return context.next();
    }

    // Check for authentication cookie
    const cookie = request.headers.get('cookie') || '';
    if (cookie.includes('auth=true')) {
        return context.next();
    }

    // Redirect to login page
    return new Response(null, {
        status: 302,
        headers: { 
            'Location': '/login.html' 
        }
    });
};