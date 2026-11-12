import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Le nostre App | Studio Manager Pro",
  description: "Scopri MediMemo, FISIO PRO, PrimaNota Pro, Hair Agenda Pro e Il Mio Bilancio. Applicazioni Android semplici, dedicate alla salute, alla professione e alla vita quotidiana.",
  alternates: { canonical: "https://studiomanagerpro.it/app" },
};

type AppCard = {
  id: string;
  nome: string;
  tipo: string;
  descrizione: string;
  caratteristiche: string[];
  prezzo: string;
  dettaglio: string;
  tema: "verde" | "blu" | "viola" | "arancio" | "ciano";
  simbolo: string;
  categoria: string;
  stato: "coming" | "play";
};

const applicazioni: AppCard[] = [
  {
    id: "medimemo",
    nome: "MediMemo",
    tipo: "Salute e benessere",
    categoria: "PER LA TUA SALUTE",
    descrizione: "Terapie, promemoria e farmaci organizzati in un unico posto. Controlla le assunzioni, consulta i giorni passati e tieni d'occhio le scorte.",
    caratteristiche: ["Promemoria delle terapie", "Storico delle assunzioni", "Scorte dei medicinali"],
    prezzo: "10 €",
    dettaglio: "all'anno",
    tema: "verde",
    simbolo: "✚",
    stato: "coming",
  },
  {
    id: "fisio-pro",
    nome: "FISIO PRO",
    tipo: "Fisioterapisti e osteopati",
    categoria: "PER I PROFESSIONISTI",
    descrizione: "Dall'agenda alle prestazioni: pazienti, valutazioni e fatture in un gestionale Android pensato per il lavoro quotidiano.",
    caratteristiche: ["Agenda e pazienti", "Prestazioni e valutazioni", "Fatturazione e report"],
    prezzo: "50 €",
    dettaglio: "all'anno · prova di 10 giorni prevista",
    tema: "blu",
    simbolo: "✳",
    stato: "coming",
  },
  {
    id: "primanota-pro",
    nome: "PrimaNota Pro",
    tipo: "Amministrazione e contabilità",
    categoria: "PER IL TUO LAVORO",
    descrizione: "Registra incassi e pagamenti, controlla banche, carte e contanti e prepara i movimenti da inviare allo studio contabile.",
    caratteristiche: ["Prima nota offline", "Conti e movimenti", "Esportazioni CSV e PDF"],
    prezzo: "50 €",
    dettaglio: "all'anno",
    tema: "viola",
    simbolo: "≡",
    stato: "coming",
  },
  {
    id: "hair-agenda-pro",
    nome: "Hair Agenda Pro",
    tipo: "Parrucchieri e saloni",
    categoria: "PER IL TUO SALONE",
    descrizione: "L'agenda per organizzare gli appuntamenti in salone, con schede cliente, trattamenti e durata prevista dei servizi.",
    caratteristiche: ["Agenda appuntamenti", "Anagrafica clienti", "Trattamenti e durata"],
    prezzo: "50 €",
    dettaglio: "all'anno",
    tema: "arancio",
    simbolo: "✂",
    stato: "coming",
  },
  {
    id: "il-mio-bilancio",
    nome: "Il Mio Bilancio",
    tipo: "Finanze personali e familiari",
    categoria: "PER OGNI GIORNO",
    descrizione: "Una vista ordinata su conti, entrate, uscite, carte e impegni, per conoscere il saldo reale e la disponibilità prevista.",
    caratteristiche: ["Saldo e movimenti", "Entrate, costi e impegni", "Riepiloghi e report"],
    prezzo: "Google Play",
    dettaglio: "Prezzi e abbonamenti sullo Store",
    tema: "ciano",
    simbolo: "€",
    stato: "play",
  },
];

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function AppCardView({ app, index }: { app: AppCard; index: number }) {
  return (
    <article id={app.id} className={[styles.appCard, styles[app.tema]].join(" ")}>
      <div className={styles.appTop}>
        <div className={styles.iconBox} aria-hidden="true">{app.simbolo}</div>
        <span className={styles.appState}>{app.stato === "play" ? "Su Google Play" : "Vendita in preparazione"}</span>
      </div>
      <div className={styles.appBody}>
        <p className={styles.category}>{app.categoria}</p>
        <h3>{app.nome}</h3>
        <p className={styles.appType}>{app.tipo}</p>
        <p className={styles.appDescription}>{app.descrizione}</p>
        <ul className={styles.features}>{app.caratteristiche.map((feature) => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}</ul>
      </div>
      <div className={styles.appBottom}>
        <div><span className={styles.price}>{app.prezzo}</span><span className={styles.priceDetail}>{app.dettaglio}</span></div>
        {app.stato === "play"
          ? <a className={styles.appLink} href="/il-mio-bilancio/brochure.pdf" target="_blank" rel="noopener noreferrer" aria-label="Apri la brochure di Il Mio Bilancio">Scopri l'app <ArrowIcon /></a>
          : <span className={styles.inactiveLink} aria-label="Acquisto non ancora disponibile">Acquisto a breve</span>}
      </div>
      <span className={styles.cardNumber} aria-hidden="true">0{index + 1}</span>
    </article>
  );
}

export default function CatalogoApp() {
  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <a href="/" className={styles.brand} aria-label="Torna a Studio Manager Pro">
          <span className={styles.brandMark}>S<span>+</span></span>
          <span><strong>Studio Manager Pro</strong><small>LE NOSTRE APPLICAZIONI</small></span>
        </a>
        <nav className={styles.nav} aria-label="Navigazione catalogo">
          <a href="#applicazioni">Le App</a>
          <a href="#come-funziona">Come funziona</a>
          <a href="/" className={styles.backLink}>Sito principale <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span className={styles.dot} /> ECOSISTEMA STUDIO MANAGER PRO</p>
            <h1>Le app giuste.<br /><em>Ogni giorno.</em></h1>
            <p className={styles.heroLead}>Soluzioni pratiche per la salute, la gestione delle finanze e il lavoro. Semplici da usare, progettate per accompagnarti nelle attività che contano.</p>
            <a href="#applicazioni" className={styles.heroCta}>Esplora le applicazioni <ArrowIcon /></a>
            <p className={styles.heroNote}>Per smartphone e tablet Android · Realizzate in Italia</p>
          </div>
          <div className={styles.heroScene} aria-hidden="true">
            <div className={styles.orbitOne} /><div className={styles.orbitTwo} />
            <div className={styles.sceneMain}><span className={styles.sceneHeader}>LE NOSTRE APP</span><span className={styles.sceneBig}>05</span><span className={styles.sceneCaption}>soluzioni per te</span></div>
            <div className={[styles.sceneChip, styles.sceneChipOne].join(" ")}><span className={styles.chipHeart}>✚</span>MediMemo</div>
            <div className={[styles.sceneChip, styles.sceneChipTwo].join(" ")}><span className={styles.chipFinance}>€</span>Il Mio Bilancio</div>
            <div className={[styles.sceneChip, styles.sceneChipThree].join(" ")}><span className={styles.chipPro}>✳</span>FISIO PRO</div>
          </div>
        </div>
      </section>

      <section className={styles.catalog} id="applicazioni">
        <div className={styles.sectionHead}>
          <div><p className={styles.kicker}>IL CATALOGO</p><h2>Scegli la tua applicazione.</h2></div>
          <p>Ogni app nasce per un'esigenza concreta. Scopri le funzionalità e il modello di licenza previsto per ciascun prodotto.</p>
        </div>
        <div className={styles.appsGrid}>{applicazioni.map((app, index) => <AppCardView key={app.id} app={app} index={index} />)}</div>
        <p className={styles.catalogNote}>I prezzi annuali indicati sono il listino previsto per la distribuzione diretta. I pagamenti, i download APK e l'attivazione delle licenze non sono ancora disponibili da questa pagina. Il Mio Bilancio continua a utilizzare i prezzi e le condizioni di Google Play.</p>
      </section>

      <section className={styles.how} id="come-funziona">
        <div className={styles.howIntro}><p className={styles.kicker}>LICENZE ANNUALI</p><h2>Una formula semplice.<br />Senza rinnovi automatici.</h2><p>Stiamo preparando un sistema di acquisto diretto con codice personale, valido per 12 mesi. Sarà attivato solo dopo il completamento dei controlli di pagamento e distribuzione.</p></div>
        <div className={styles.steps}>
          <div><span>01</span><h3>Acquista</h3><p>Scegli l'app e completa il pagamento annuale quando il servizio sarà disponibile.</p></div>
          <div><span>02</span><h3>Attiva</h3><p>Ricevi un codice personale e attiva l'app sul tuo dispositivo Android.</p></div>
          <div><span>03</span><h3>Rinnova se vuoi</h3><p>Alla scadenza decidi tu se rinnovare. Nessun addebito automatico.</p></div>
        </div>
      </section>

      <section className={styles.banner}><div><p className={styles.kicker}>STUDIO MANAGER PRO</p><h2>Un unico riferimento per<br />le nostre soluzioni digitali.</h2><p>La vetrina delle applicazioni è il primo passo. Pagamenti, codici di licenza e aggiornamenti saranno disponibili qui dopo il loro rilascio.</p></div><a href="/" className={styles.bannerLink}>Scopri Studio Manager Pro <ArrowIcon /></a></section>

      <footer className={styles.footer}>
        <div><strong>Studio Manager Pro</strong><p>© 2026 · Creato da Artiola Mario</p></div>
        <div className={styles.footerLinks}><a href="/">Sito principale</a><a href="/privacy">Privacy</a><a href="/cookie-policy">Cookie policy</a></div>
      </footer>
    </main>
  );
}
