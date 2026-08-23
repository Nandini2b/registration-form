const jsonHeaders = { "Content-Type": "application/json" };

function response(statusCode, payload) {
  return { statusCode, headers: jsonHeaders, body: JSON.stringify(payload) };
}

async function proxyRegistration(body) {
  const scriptURL = process.env.SCRIPT_URL;
  if (!scriptURL) {
    console.error("SCRIPT_URL is not configured.");
    return response(500, { error: "Submission service is not configured" });
  }

  JSON.parse(body);
  const upstream = await fetch(scriptURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  });

  const upstreamText = await upstream.text();
  let upstreamData;
  try { upstreamData = JSON.parse(upstreamText); }
  catch { upstreamData = { success: upstream.ok }; }

  if (!upstream.ok || upstreamData.success === false) {
    console.error("Google Apps Script rejected the request:", upstreamText);
    return response(502, { error: "Registration service rejected the request" });
  }

  return response(200, { success: true });
}

async function netlifyHandler(event) {
  if (event.httpMethod !== "POST") return response(405, { error: "Method not allowed" });
  try {
    const body = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString("utf8")
      : event.body || "{}";
    return await proxyRegistration(body);
  } catch (error) {
    console.error("Registration proxy error:", error);
    return response(500, { error: "Unable to submit registration" });
  }
}

async function vercelHandler(request, result) {
  if (request.method !== "POST") return result.status(405).json({ error: "Method not allowed" });
  try {
    const body = typeof request.body === "string"
      ? request.body
      : JSON.stringify(request.body || {});
    const output = await proxyRegistration(body);
    return result.status(output.statusCode)
      .setHeader("Content-Type", "application/json")
      .send(output.body);
  } catch (error) {
    console.error("Registration proxy error:", error);
    return result.status(500).json({ error: "Unable to submit registration" });
  }
}

// Netlify reads .handler; Vercel calls the exported function directly.
module.exports = vercelHandler;
module.exports.handler = netlifyHandler;