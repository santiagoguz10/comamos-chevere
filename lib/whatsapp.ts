export async function sendWhatsAppMessage(to: string, body: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const version = process.env.WHATSAPP_API_VERSION || "v18.0";
  if (!token || !phoneNumberId) {
    console.log("[whatsapp:disabled] To:", to, "Message:", body);
    return { ok: false, reason: "not_configured" };
  }
  const phone = to.replace(/[^0-9]/g, "");
  if (!phone) return { ok: false, reason: "no_phone" };
  try {
    const res = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body },
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("[whatsapp:error]", data);
      return { ok: false, reason: data };
    }
    return { ok: true, data };
  } catch (e) {
    console.error("[whatsapp:error]", e);
    return { ok: false, reason: e };
  }
}