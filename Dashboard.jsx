import { useEffect, useState } from 'react';

function Dashboard({ token, tenantId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Appel à une API backend pour récupérer les stats
    fetch(`http://localhost:5000/api/summary?token=${token}&tenantId=${tenantId}`)
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token, tenantId]);

  if (loading) return <p>Chargement des statistiques...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Résumé des Statistiques</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="border p-3 rounded bg-white shadow">
          <h3>Total des Factures</h3>
          <p>{summary.totalInvoices} €</p>
        </div>
        <div className="border p-3 rounded bg-white shadow">
          <h3>Total des Paiements</h3>
          <p>{summary.totalPayments} €</p>
        </div>
        <div className="border p-3 rounded bg-white shadow">
          <h3>Nombre de Contacts</h3>
          <p>{summary.totalContacts}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
import { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard({ token, tenantId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Appel à une API backend pour récupérer les stats
    fetch(`http://localhost:5000/api/summary?token=${token}&tenantId=${tenantId}`)
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token, tenantId]);

  if (loading) return <p>Chargement des statistiques...</p>;

  // Graphique de total des factures
  const invoiceData = {
    labels: summary.invoiceMonths, // Mois d'émission des factures
    datasets: [
      {
        label: 'Total des Factures',
        data: summary.invoiceValues, // Valeur des factures par mois
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  // Graphique des paiements (pie chart)
  const paymentData = {
    labels: ['Payé', 'En attente', 'Retard'],
    datasets: [
      {
        data: [summary.paidPayments, summary.pendingPayments, summary.overduePayments],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
      },
    ],
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Résumé des Statistiques</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-3 rounded bg-white shadow">
          <h3>Total des Factures</h3>
          <Line data={invoiceData} />
        </div>

        <div className="border p-3 rounded bg-white shadow">
          <h3>Répartition des Paiements</h3>
          <Pie data={paymentData} />
        </div>

        <div className="border p-3 rounded bg-white shadow">
          <h3>Nombre de Contacts</h3>
          <p>{summary.totalContacts}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
import { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard({ token, tenantId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !tenantId) {
      console.error('Token ou tenantId manquant');
      return;
    }

    // Appel à une API backend pour récupérer les stats
    fetch(`http://localhost:5000/api/summary?token=${token}&tenantId=${tenantId}`)
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token, tenantId]);

  if (loading) return <p>Chargement des statistiques...</p>;

  // Graphique de total des factures
  const invoiceData = {
    labels: summary.invoiceMonths, // Mois d'émission des factures
    datasets: [
      {
        label: 'Total des Factures',
        data: summary.invoiceValues, // Valeur des factures par mois
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  // Graphique des paiements (pie chart)
  const paymentData = {
    labels: ['Payé', 'En attente', 'Retard'],
    datasets: [
      {
        data: [summary.paidPayments, summary.pendingPayments, summary.overduePayments],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
      },
    ],
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Résumé des Statistiques</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-3 rounded bg-white shadow">
          <h3>Total des Factures</h3>
          <Line data={invoiceData} />
        </div>

        <div className="border p-3 rounded bg-white shadow">
          <h3>Répartition des Paiements</h3>
          <Pie data={paymentData} />
        </div>

        <div className="border p-3 rounded bg-white shadow">
          <h3>Nombre de Contacts</h3>
          <p>{summary.totalContacts}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
import { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard({ token, tenantId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !tenantId) {
      console.error('Token ou tenantId manquant');
      return;
    }

    // Appel à une API backend pour récupérer les stats
    fetch(`http://localhost:5000/api/summary?token=${token}&tenantId=${tenantId}`)
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur API:', err);
        setLoading(false);
      });
  }, [token, tenantId]);

  if (loading) return <p>Chargement des statistiques...</p>;

  // Graphique de total des factures
  const invoiceData = {
    labels: summary.invoiceMonths, // Mois d'émission des factures
    datasets: [
      {
        label: 'Total des Factures',
        data: summary.invoiceValues, // Valeur des factures par mois
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  // Graphique des paiements (pie chart)
  const paymentData = {
    labels: ['Payé', 'En attente', 'Retard'],
    datasets: [
      {
        data: [summary.paidPayments, summary.pendingPayments, summary.overduePayments],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
      },
    ],
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Résumé des Statistiques</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-3 rounded bg-white shadow">
          <h3>Total des Factures</h3>
          <Line data={invoiceData} />
        </div>

        <div className="border p-3 rounded bg-white shadow">
          <h3>Répartition des Paiements</h3>
          <Pie data={paymentData} />
        </div>

        <div className="border p-3 rounded bg-white shadow">
          <h3>Nombre de Contacts</h3>
          <p>{summary.totalContacts}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
useEffect(() => {
  if (!token || !tenantId) {
    console.error('Token ou tenantId manquant');
    return;
  }

  // Appel à l'API backend pour récupérer les données
  fetch(`http://localhost:5000/api/summary?token=${token}&tenantId=${tenantId}`)
    .then(res => res.json())
    .then(data => {
      setSummary(data); // Mets les données dans l'état
      setLoading(false); // Termine le chargement
    })
    .catch(err => {
      console.error('Erreur API:', err);
      setLoading(false); // Arrête le chargement même en cas d'erreur
    });
}, [token, tenantId]);
import { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard({ token, tenantId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !tenantId) {
      console.error('Token ou tenantId manquant');
      return;
    }

    fetch(`http://localhost:5000/api/summary?token=${token}&tenantId=${tenantId}`)
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur API:', err);
        setLoading(false);
      });
  }, [token, tenantId]);

  if (loading) return <p>Chargement des statistiques...</p>;

  const invoiceData = {
    labels: summary.invoiceMonths,
    datasets: [{
      label: 'Total des Factures',
      data: summary.invoiceValues,
      fill: true,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.1,
    }]
  };

  const paymentData = {
    labels: ['Payé', 'En attente', 'Retard'],
    datasets: [{
      data: [summary.paidPayments, summary.pendingPayments, summary.overduePayments],
      backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
    }]
  };

  return (
    <div>
      <h2>Résumé des Statistiques</h2>
      <div>
        <h3>Total des Factures</h3>
        <Line data={invoiceData} />
      </div>
      <div>
        <h3>Répartition des Paiements</h3>
        <Pie data={paymentData} />
      </div>
    </div>
  );
}

export default Dashboard;
