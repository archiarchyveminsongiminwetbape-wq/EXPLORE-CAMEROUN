import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Pied de page';
import { Button } from '@/components/interface utilisateur/button';
import { Input } from '@/components/interface utilisateur/input';

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3001';

export default function AdminTransactions() {
  const [rows, setRows] = React.useState<any[]>([]);
  const [status, setStatus] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [q, setQ] = React.useState('');
  const [limit, setLimit] = React.useState(20);
  const [offset, setOffset] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [token, setToken] = React.useState<string>(() => localStorage.getItem('admin:token') || '');
  const [showDetail, setShowDetail] = React.useState(false);
  const [detail, setDetail] = React.useState<any>(null);
  const [refundAmount, setRefundAmount] = React.useState<string>('');
  const [authed, setAuthed] = React.useState<boolean>(false);
  const [authError, setAuthError] = React.useState<string>('');

  const fetchList = React.useCallback(async () => {
    setLoading(true);
    try {
      if (!token) {
        setAuthed(false);
        setAuthError('');
        return;
      }
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (email) params.set('email', email);
      if (q) params.set('q', q);
      params.set('limit', String(limit));
      params.set('offset', String(offset));
      const resp = await fetch(`${API_BASE}/api/admin/transactions?${params.toString()}`, {
        headers: { 'x-admin-token': token },
      });
      const data = await resp.json();
      if (resp.status === 401) {
        setAuthed(false);
        setAuthError('Token invalide');
        return;
      }
      setRows(data?.rows || []);
      setAuthed(true);
      setAuthError('');
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [status, email, q, limit, offset, token]);

  const verifyToken = React.useCallback(async () => {
    if (!token) { setAuthed(false); setAuthError(''); return; }
    try {
      const resp = await fetch(`${API_BASE}/api/admin/transactions?limit=1`, {
        headers: { 'x-admin-token': token },
      });
      if (resp.status === 200) { setAuthed(true); setAuthError(''); }
      else { setAuthed(false); setAuthError('Token invalide'); }
    } catch {
      setAuthed(false);
      setAuthError('');
    }
  }, [token]);

  React.useEffect(() => { verifyToken(); }, [verifyToken]);
  React.useEffect(() => { if (authed) fetchList(); }, [authed, fetchList]);

  const saveToken = () => {
    localStorage.setItem('admin:token', token);
    verifyToken();
  };

  const openDetail = async (key: string) => {
    try {
      const resp = await fetch(`${API_BASE}/api/admin/transactions/${encodeURIComponent(key)}`, {
        headers: token ? { 'x-admin-token': token } : undefined,
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'failed');
      setDetail(data.row);
      setRefundAmount('');
      setShowDetail(true);
    } catch {
      alert('Impossible de charger le détail');
    }
  };

  const closeDetail = () => {
    setShowDetail(false);
    setDetail(null);
    setRefundAmount('');
  };

  const refund = async () => {
    if (!detail) return;
    try {
      const body = refundAmount ? { amount: Number(refundAmount) } : {};
      const resp = await fetch(`${API_BASE}/api/admin/transactions/${encodeURIComponent(detail.tx_ref)}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'x-admin-token': token } : {}),
        },
        body: JSON.stringify(body),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'refund failed');
      alert('Remboursement demandé');
      fetchList();
      closeDetail();
    } catch (e) {
      alert('Échec du remboursement');
    }
  };

  const resendReceipt = async (tx_ref: string) => {
    try {
      const resp = await fetch(`${API_BASE}/api/admin/transactions/${encodeURIComponent(tx_ref)}/resend-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'x-admin-token': token } : {}),
        },
      });
      if (!resp.ok) throw new Error('resend failed');
      alert('Reçu renvoyé par email');
    } catch {
      alert('Échec de renvoi du reçu');
    }
  };

  const downloadReceipt = async (tx_ref: string) => {
    const url = `${API_BASE}/api/admin/transactions/${encodeURIComponent(tx_ref)}/receipt.pdf`;
    if (!token) {
      window.open(url, '_blank');
      return;
    }
    try {
      const resp = await fetch(url, { headers: { 'x-admin-token': token } });
      if (!resp.ok) throw new Error('download failed');
      const blob = await resp.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = `receipt_${tx_ref}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch {
      alert('Téléchargement échoué');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        {!token || !authed ? (
          <div className="max-w-md mx-auto border rounded p-6">
            <h1 className="text-xl font-semibold mb-4">Accès Admin</h1>
            <p className="text-sm text-gray-600 mb-4">Entrez le mot de passe administrateur pour accéder à cette page.</p>
            <label className="block text-sm mb-1">Admin token</label>
            <Input value={token} onChange={(e)=>setToken(e.target.value)} placeholder="mot de passe admin" />
            {authError && <div className="text-red-600 text-sm mt-2">{authError}</div>}
            <div className="mt-4 flex gap-2">
              <Button onClick={saveToken}>Se connecter</Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold mb-4">Transactions (Admin)</h1>

            <div className="grid md:grid-cols-4 gap-3 mb-4">
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select className="border rounded p-2 w-full" value={status} onChange={(e)=>setStatus(e.target.value)}>
                  <option value="">(tous)</option>
                  <option value="initialized">initialized</option>
                  <option value="successful">successful</option>
                  <option value="failed">failed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Email client</label>
                <Input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="client@example.com" />
              </div>
              <div>
                <label className="block text-sm mb-1">Recherche (ref/tel)</label>
                <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="EXP_..." />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={()=>{setOffset(0); fetchList();}}>Filtrer</Button>
                <Button variant="outline" onClick={()=>{setStatus(''); setEmail(''); setQ(''); setOffset(0);}}>Réinitialiser</Button>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-3 mb-4">
              <div>
                <label className="block text-sm mb-1">Admin token</label>
                <Input value={token} onChange={(e)=>setToken(e.target.value)} placeholder="(optionnel si backend sans token)" />
                <div className="mt-2"><Button variant="secondary" onClick={saveToken}>Enregistrer</Button></div>
              </div>
              <div className="flex items-end gap-2">
                <div>
                  <label className="block text-sm mb-1">Par page</label>
                  <Input type="number" value={limit} onChange={(e)=>setLimit(Number(e.target.value)||20)} className="w-24" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Offset</label>
                  <Input type="number" value={offset} onChange={(e)=>setOffset(Number(e.target.value)||0)} className="w-24" />
                </div>
                <Button onClick={fetchList}>Aller</Button>
              </div>
            </div>

            <div className="overflow-auto border rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Ref</th>
                    <th className="text-left p-2">Montant</th>
                    <th className="text-left p-2">Devise</th>
                    <th className="text-left p-2">Statut</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td className="p-3" colSpan={7}>Chargement...</td></tr>
                  )}
                  {!loading && rows.length === 0 && (
                    <tr><td className="p-3" colSpan={7}>Aucune donnée</td></tr>
                  )}
                  {!loading && rows.map((r)=> (
                    <tr key={r.tx_ref} className="border-t">
                      <td className="p-2">{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</td>
                      <td className="p-2 font-mono break-all">{r.tx_ref}</td>
                      <td className="p-2">{r.amount}</td>
                      <td className="p-2">{r.currency}</td>
                      <td className="p-2">{r.status}</td>
                      <td className="p-2 break-all">{r.customer_email}</td>
                      <td className="p-2 flex gap-2">
                        <Button size="sm" variant="secondary" onClick={()=>openDetail(r.tx_ref)}>Détails</Button>
                        <Button size="sm" onClick={()=>downloadReceipt(r.tx_ref)}>Reçu PDF</Button>
                        <Button size="sm" variant="outline" onClick={()=>resendReceipt(r.tx_ref)}>Renvoyer reçu</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showDetail && detail && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white w-full max-w-3xl rounded shadow-lg p-4 max-h-[90vh] overflow-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-semibold">Détail transaction</div>
                    <button onClick={closeDetail} className="text-gray-600 hover:text-black">✕</button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Référence</div>
                      <div className="font-mono break-all">{detail.tx_ref}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Montant</div>
                      <div>{detail.amount} {detail.currency}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Statut</div>
                      <div>{detail.status}</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-1">Payload brut</div>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-72">{JSON.stringify(detail.raw, null, 2)}</pre>
                  </div>
                  <div className="flex items-end gap-3">
                    <div>
                      <label className="block text-sm mb-1">Montant remboursement (optionnel)</label>
                      <Input type="number" value={refundAmount} onChange={(e)=>setRefundAmount(e.target.value)} placeholder="laisser vide pour total" />
                    </div>
                    <Button onClick={refund} className="bg-red-600 hover:bg-red-700">Rembourser</Button>
                    <Button variant="outline" onClick={()=>resendReceipt(detail.tx_ref)}>Renvoyer reçu</Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
