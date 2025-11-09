import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Pied de page';
import { useCart } from '@/crochets/utiliser-panier';
import { useCurrency } from '@/crochets/utiliser-devise';
import { Button } from '@/components/interface utilisateur/button';
import { Input } from '@/components/interface utilisateur/input';
import { useNavigate } from 'react-router-dom';

const ZONES = [
  { code: 'XAF', labelFr: 'Cameroun', labelEn: 'Cameroon', countries: ['CM'] },
  { code: 'XAF', labelFr: 'Autre Pays dʼAfrique', labelEn: 'Other Africa', countries: ['CI','SN','GA','TD','GN'] },
  { code: 'EUR', labelFr: 'Europe', labelEn: 'Europe', countries: ['FR', 'BE', 'ES', 'DE', 'IT', 'PT','NL'] },
  { code: 'USD', labelFr: 'États-Unis/Canada', labelEn: 'US/Canada', countries: ['US','CA'] },
];

type PaymentMethod = 'mtn' | 'orange' | 'card';

export default function Checkout() {
  const { items, totalFormatted, clear } = useCart();
  const { currency, setCurrency } = useCurrency();
  const [method, setMethod] = React.useState<PaymentMethod>('mtn');
  const [email, setEmail] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const [zone, setZone] = React.useState('CM'); // code pays par défaut Cameroun
  const [lang, setLang] = React.useState<'fr'|'en'>('fr');
  const navigate = useNavigate();

  const i18n = {
    fr: {
      languageLabel: 'Langue / Language:',
      originLabel: 'Votre pays ou zone de provenance',
      cameroon: 'Cameroun',
      otherAfrica: "Autre pays d'Afrique",
      europe: 'Europe',
      usCanada: 'États-Unis / Canada',
      paymentTitle: 'Paiement',
      recap: 'Récapitulatif',
      total: 'Total',
      contact: 'Contact',
      detailsTitle: 'Coordonnées & Paiement',
      emailConfirmation: 'Email de confirmation',
      emailPlaceholder: 'vous@exemple.com',
      payMethod: 'Moyen de paiement',
      mtn: 'MTN Mobile Money',
      orange: 'Orange Money',
      card: 'Carte bancaire',
      mtnNumber: 'Numéro MTN',
      orangeNumber: 'Numéro Orange',
      cardNumber: 'Numéro de carte',
      cardExpiry: 'Expiration',
      cardCvc: 'CVC',
      processing: 'Traitement...',
      pay: 'Payer',
      emailSendLog: (mail: string) => `Envoi confirmation à: ${mail}`,
      paymentSuccess: (mail: string) => `Paiement réussi. Email de confirmation envoyé à ${mail}. Référence: ${Date.now()}`,
    },
    en: {
      languageLabel: 'Langue / Language:',
      originLabel: 'Your country of origin',
      cameroon: 'Cameroon',
      otherAfrica: 'Other African country',
      europe: 'Europe',
      usCanada: 'United States / Canada',
      paymentTitle: 'Checkout',
      recap: 'Summary',
      total: 'Total',
      contact: 'Contact',
      detailsTitle: 'Contact & Payment',
      emailConfirmation: 'Confirmation email',
      emailPlaceholder: 'you@example.com',
      payMethod: 'Payment method',
      mtn: 'MTN Mobile Money',
      orange: 'Orange Money',
      card: 'Credit card',
      mtnNumber: 'MTN Number',
      orangeNumber: 'Orange Number',
      cardNumber: 'Card number',
      cardExpiry: 'Expiry',
      cardCvc: 'CVC',
      processing: 'Processing...',
      pay: 'Pay',
      emailSendLog: (mail: string) => `Sending confirmation to: ${mail}`,
      paymentSuccess: (mail: string) => `Payment successful. Confirmation email sent to ${mail}. Ref: ${Date.now()}`,
    },
  } as const;
  const t = i18n[lang];

  // Ajout de la gestion devise dynamique
  React.useEffect(() => {
    if (zone === 'CM') {
      setCurrency('XAF');
    } else if (['FR', 'BE', 'ES', 'DE', 'IT', 'PT', 'NL'].includes(zone)) {
      setCurrency('EUR');
    } else if (['US', 'CA'].includes(zone)) {
      setCurrency('USD');
    } else {
      setCurrency('XAF');
    }
  }, [zone, setCurrency]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = method === 'mtn' ? '/pay/mtn' : method === 'orange' ? '/pay/orange' : '/pay/card';
    navigate(target);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-row justify-end mb-3">
          <label className="text-sm mr-2">{t.languageLabel} </label>
          <select value={lang} onChange={e => setLang(e.target.value as 'fr'|'en')} className="border rounded text-xs px-1 py-0.5">
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">{t.originLabel}</label>
          <select className="border rounded p-2" value={zone} onChange={e => setZone(e.target.value)}>
            <option value="CM">🇨🇲 {t.cameroon}</option>
            <option value="AF">🌍 {t.otherAfrica}</option>
            <option value="EU">🇪🇺 {t.europe}</option>
            <option value="US">🇺🇸 {t.usCanada}</option>
          </select>
        </div>
        <h1 className="text-2xl font-semibold mb-4">{t.paymentTitle}</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-lg font-medium mb-2">{t.recap}</h2>
            <ul className="divide-y border rounded-md">
              {items.map((i) => (
                <li key={i.id} className="p-3 flex justify-between">
                  <span>
                    {i.title} × {i.quantity}
                  </span>
                  <span className="font-medium">{totalFormatted(currency)}</span>
                </li>
              ))}
            </ul>
            <div className="text-right mt-3 text-xl font-bold">{t.total}: {totalFormatted(currency)}</div>
            <p className="text-sm text-gray-500 mt-2">{t.contact}: 657029080 | minsongipaul@icloud.com</p>
          </section>
          <section>
            <h2 className="text-lg font-medium mb-2">{t.detailsTitle}</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">{t.emailConfirmation}</label>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.emailPlaceholder} />
              </div>
              <div>
                <label className="block text-sm mb-2">{t.payMethod}</label>
                <div className="grid grid-cols-3 gap-3">
                  <button type="button" onClick={() => setMethod('mtn')} className={`border rounded p-3 flex flex-col items-center hover:shadow ${method==='mtn' ? 'ring-2 ring-yellow-500' : ''}`}>
                    <img src="/assets/mtn.svg" alt="MTN Mobile Money" className="w-10 h-10" />
                    <span className="text-xs mt-2 text-center">{t.mtn}</span>
                  </button>
                  <button type="button" onClick={() => setMethod('orange')} className={`border rounded p-3 flex flex-col items-center hover:shadow ${method==='orange' ? 'ring-2 ring-orange-500' : ''}`}>
                    <img src="/assets/orange.svg" alt="Orange Money" className="w-10 h-10" />
                    <span className="text-xs mt-2 text-center">{t.orange}</span>
                  </button>
                  <button type="button" onClick={() => setMethod('card')} className={`border rounded p-3 flex flex-col items-center hover:shadow ${method==='card' ? 'ring-2 ring-blue-600' : ''}`}>
                    <img src="/assets/card.svg" alt="Carte bancaire" className="w-10 h-10" />
                    <span className="text-xs mt-2 text-center">{t.card}</span>
                  </button>
                </div>
              </div>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={processing}>
                {processing ? t.processing : t.pay}
              </Button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}



