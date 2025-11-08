import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Pied de page';
import { Input } from '@/components/interface utilisateur/input';
import { Button } from '@/components/interface utilisateur/button';

export default function Contact() {
  const [lang, setLang] = React.useState<'fr'|'en'>('fr');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');

  const i18n = {
    fr: {
      title: 'Contact',
      subtitle: 'Posez-nous vos questions, nous répondons rapidement.',
      yourName: 'Votre nom',
      yourEmail: 'Votre email',
      yourSubject: 'Sujet',
      yourMessage: 'Message',
      send: 'Envoyer',
      languageLabel: 'Langue / Language:',
    },
    en: {
      title: 'Contact',
      subtitle: 'Ask us your questions, we reply quickly.',
      yourName: 'Your name',
      yourEmail: 'Your email',
      yourSubject: 'Subject',
      yourMessage: 'Message',
      send: 'Send',
      languageLabel: 'Langue / Language:',
    }
  } as const;
  const t = i18n[lang];

  const buildMailto = () => {
    const to = 'minsongipaul@icloud.com';
    const s = encodeURIComponent(subject || (lang==='fr' ? 'Demande de contact' : 'Contact request'));
    const body = encodeURIComponent(`${lang==='fr' ? 'Nom' : 'Name'}: ${name}\nEmail: ${email}\n\n${message}`);
    return `mailto:${to}?subject=${s}&body=${body}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="flex justify-end mb-4">
          <label className="text-sm mr-2">{t.languageLabel}</label>
          <select value={lang} onChange={(e) => setLang(e.target.value as 'fr'|'en')} className="border rounded text-xs px-1 py-0.5">
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-8">{t.subtitle}</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">{t.yourName}</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={lang==='fr' ? 'Ex: Jean Dupont' : 'e.g., John Doe'} />
            </div>
            <div>
              <label className="block text-sm mb-1">{t.yourEmail}</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm mb-1">{t.yourSubject}</label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={lang==='fr' ? 'Sujet de votre message' : 'Message subject'} />
            </div>
            <div>
              <label className="block text-sm mb-1">{t.yourMessage}</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full border rounded p-2 h-40" placeholder={lang==='fr' ? 'Votre message...' : 'Your message...'} />
            </div>
            <div className="flex justify-end">
              <a href={buildMailto()}>
                <Button className="bg-green-600 hover:bg-green-700">{t.send}</Button>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
