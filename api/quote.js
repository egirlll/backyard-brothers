module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, area, service, details } = req.body;

  if (!name || !phone || !area) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const htmlBody = `
    <h2>New Quote Request — Coast Yard Creations</h2>
    <table style="border-collapse:collapse;width:100%;max-width:500px;">
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${name}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="tel:${phone}">${phone}</a></td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${email || 'Not provided'}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Area</td><td style="padding:8px;border-bottom:1px solid #eee;">${area}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Service</td><td style="padding:8px;border-bottom:1px solid #eee;">${service || 'Not specified'}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Details</td><td style="padding:8px;">${details || 'None'}</td></tr>
    </table>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${'re_JbGkzmJ2_7ZBWmTn7BFeCsF5X9eZSe6Qq'}`
      },
      body: JSON.stringify({
        from: 'Coast Yard Creations <onboarding@resend.dev>',
        to: 'Mattmcl706@gmail.com',
        subject: `New Quote Request from ${name} — ${service || 'General'}`,
        html: htmlBody
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: 'Failed to send email', detail: data });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
