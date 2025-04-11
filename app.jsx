import { component$, useSignal } from '@builder.io/qwik'

import qwikLogo from './assets/qwik.svg'
import viteLogo from '/vite.svg'
import './app.css'

export const App = component$(() => {
  const count = useSignal(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://qwik.dev" target="_blank">
          <img src={qwikLogo} class="logo qwik" alt="Qwik logo" />
        </a>
      </div>
      <h1>Vite + Qwik</h1>
      <div class="card">
        <button onClick$={() => count.value++}>count is {count.value}</button>
        <p>
          Edit <code>src/app.jsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Qwik logos to learn more
      </p>
    </>
  )
})
import Invoices from './components/Invoices';

function App() {
  const token = "ACCESS_TOKEN"; // à récupérer dynamiquement après auth
  const tenantId = "TENANT_ID"; // idem

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Xero Dashboard</h1>
      <Invoices token={token} tenantId={tenantId} />
    </div>
  );
}
import LoginButton from './components/LoginButton';

function App() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Xero Dashboard</h1>
      <LoginButton />
    </div>
  );
}
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Invoices from './components/Invoices';
import Contacts from './components/Contacts';
import Payments from './components/Payments';
import Accounts from './components/Accounts';
import LoginButton from './components/LoginButton';

function App() {
  const token = "ACCESS_TOKEN"; // à récupérer dynamiquement après auth
  const tenantId = "TENANT_ID"; // idem

  return (
    <Router>
      <div className="p-6">
        <nav className="mb-6">
          <Link to="/" className="mr-4">Factures</Link>
          <Link to="/contacts" className="mr-4">Contacts</Link>
          <Link to="/payments" className="mr-4">Paiements</Link>
          <Link to="/accounts" className="mr-4">Comptes</Link>
          <LoginButton />
        </nav>

        <Routes>
          <Route path="/" element={<Invoices token={token} tenantId={tenantId} />} />
          <Route path="/contacts" element={<Contacts token={token} tenantId={tenantId} />} />
          <Route path="/payments" element={<Payments token={token} tenantId={tenantId} />} />
          <Route path="/accounts" element={<Accounts token={token} tenantId={tenantId} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function App() {
  const [token, setToken] = useState(null);
  const [tenantId, setTenantId] = useState(null);

  useEffect(() => {
    const userToken = Cookies.get('userToken');
    if (userToken) {
      const decoded = jwtDecode(userToken);
      setToken(decoded.accessToken);
      setTenantId(decoded.tenantId);
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Xero Dashboard</h1>
      <nav>
        <Link to="/">Factures</Link>
        <Link to="/contacts">Contacts</Link>
        <Link to="/payments">Paiements</Link>
        <Link to="/accounts">Comptes</Link>
      </nav>

      <Invoices token={token} tenantId={tenantId} />
    </div>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Invoices from './components/Invoices';
import Contacts from './components/Contacts';
import Payments from './components/Payments';
import Accounts from './components/Accounts';
import LoginButton from './components/LoginButton';

// Composant PrivateRoute pour vérifier l'authentification
function PrivateRoute({ children }) {
  const userToken = Cookies.get('userToken');
  if (!userToken) {
    return <p>Vous devez être connecté pour accéder à cette page.</p>;
  }
  return children;
}

function App() {
  const [token, setToken] = useState(null);
  const [tenantId, setTenantId] = useState(null);

  useEffect(() => {
    const userToken = Cookies.get('userToken');
    if (userToken) {
      const decoded = jwtDecode(userToken);
      setToken(decoded.accessToken);
      setTenantId(decoded.tenantId);
    }
  }, []);

  return (
    <Router>
      <div className="p-6">
        <nav className="mb-6">
          <Link to="/" className="mr-4">Factures</Link>
          <Link to="/contacts" className="mr-4">Contacts</Link>
          <Link to="/payments" className="mr-4">Paiements</Link>
          <Link to="/accounts" className="mr-4">Comptes</Link>
          <LoginButton />
        </nav>

        <Routes>
          <Route path="/" element={<PrivateRoute><Invoices token={token} tenantId={tenantId} /></PrivateRoute>} />
          <Route path="/contacts" element={<PrivateRoute><Contacts token={token} tenantId={tenantId} /></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute><Payments token={token} tenantId={tenantId} /></PrivateRoute>} />
          <Route path="/accounts" element={<PrivateRoute><Accounts token={token} tenantId={tenantId} /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';

function App() {
  const token = Cookies.get('userToken');
  const tenantId = 'tenantId_example'; // Récupère tenantId selon ton application

  return (
    <Router>
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard token={token} tenantId={tenantId} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
