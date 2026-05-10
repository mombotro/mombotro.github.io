export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/auth') {
      const params = new URLSearchParams({
        client_id: env.CLIENT_ID,
        redirect_uri: `${url.origin}/callback`,
        scope: 'repo,user',
        state: url.searchParams.get('state') ?? ''
      })
      return Response.redirect(
        `https://github.com/login/oauth/authorize?${params}`,
        302
      )
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code')
      const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: env.CLIENT_ID,
          client_secret: env.CLIENT_SECRET,
          code,
          redirect_uri: `${url.origin}/callback`
        })
      })
      const data = await res.json()
      if (!data.access_token) return new Response('Auth failed', { status: 400 })

      const payload = JSON.stringify({ token: data.access_token, provider: 'github' })
      const html = `<!doctype html><html><body><script>
(function() {
  var payload = 'authorization:github:success:${payload.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}';
  function onMessage(e) {
    window.opener.postMessage(payload, e.origin);
    window.removeEventListener('message', onMessage);
  }
  window.addEventListener('message', onMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
<\/script></body></html>`

      return new Response(html, { headers: { 'Content-Type': 'text/html' } })
    }

    return new Response('Not found', { status: 404 })
  }
}
