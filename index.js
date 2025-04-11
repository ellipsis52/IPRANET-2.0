const sessions = new Map(); // id → { token, tenantId }

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  // ... échange code ↔ token comme avant
  const tokens = tokenRes.data;

  // Obtenir tenantId
  const orgs = await axios.get('https://api.xero.com/connections', {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });

  const tenantId = orgs.data[0].tenantId;

  // Créer une session
  const sessionId = crypto.randomUUID(); // ou un cookie/signed JWT
  sessions.set(sessionId, {
    access_token: tokens.access_token,
    tenantId,
  });

  // Redirige vers frontend avec ID session
  res.redirect(`http://localhost:5173/dashboard?session=${sessionId}`);
});
const jwt = require('jsonwebtoken');

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  // ... échange code ↔ token comme avant

  // Générer un JWT avec le token Xero
  const accessToken = tokens.access_token;
  const tenantId = orgs.data[0].tenantId;

  // Crée un token JWT
  const userToken = jwt.sign({ accessToken, tenantId }, 'SECRET_KEY', {
    expiresIn: '1h', // expiration du JWT
  });

  // Stocke le JWT dans un cookie sécurisé
  res.cookie('userToken', userToken, {
    httpOnly: true, // Empêche l'accès JavaScript
    secure: process.env.NODE_ENV === 'production', // Cookies sécurisés en prod
    sameSite: 'Strict', // Empêche l'envoi de cookies cross-site
    maxAge: 3600000, // 1 heure
  });

  res.redirect(`http://localhost:5173/dashboard`);
});
app.get('/api/summary', verifyToken, async (req, res) => {
    const { accessToken, tenantId } = req.user;
  
    try {
      // Récupérer les factures
      const invoices = await axios.get('https://api.xero.com/api.xro/2.0/Invoices', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Xero-tenant-id': tenantId,
        },
      });
  
      const invoiceMonths = [];
      const invoiceValues = [];
  
      invoices.data.Invoices.forEach((invoice) => {
        const month = new Date(invoice.DateString).toLocaleString('default', { month: 'short' });
        const value = parseFloat(invoice.Total);
        
        if (!invoiceMonths.includes(month)) {
          invoiceMonths.push(month);
          invoiceValues.push(value);
        } else {
          const index = invoiceMonths.indexOf(month);
          invoiceValues[index] += value;
        }
      });
  
      // Paiements
      const payments = await axios.get('https://api.xero.com/api.xro/2.0/Payments', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Xero-tenant-id': tenantId,
        },
      });
  
      let paidPayments = 0;
      let pendingPayments = 0;
      let overduePayments = 0;
  
      payments.data.Payments.forEach((payment) => {
        if (payment.Status === 'PAID') {
          paidPayments += payment.Amount;
        } else if (payment.Status === 'PENDING') {
          pendingPayments += payment.Amount;
        } else if (payment.Status === 'OVERDUE') {
          overduePayments += payment.Amount;
        }
      });
  
      // Contacts
      const contacts = await axios.get('https://api.xero.com/api.xro/2.0/Contacts', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Xero-tenant-id': tenantId,
        },
      });
  
      const totalContacts = contacts.data.Contacts.length;
  
      res.json({
        invoiceMonths,
        invoiceValues,
        paidPayments,
        pendingPayments,
        overduePayments,
        totalContacts,
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch summary data' });
    }
  });
  