const appUrl = "https://app.studiomanagerpro.it/login";

const features = [
  ["Agenda e promemoria", "Appuntamenti, attività e avvisi riuniti in una visione operativa."],
  ["Scadenzario", "Scadenze fiscali e di studio con alert centralizzati e controllo immediato."],
  ["Pratiche", "Fascicoli, documenti e avanzamento delle attività in un unico flusso."],
  ["Revisione e controllo", "Procedure guidate e strumenti di verifica per un lavoro più ordinato."],
  ["Controllo di gestione", "Dati e indicatori utili per leggere l'andamento dello studio."],
  ["AML e payroll", "Moduli dedicati agli adempimenti antiriciclaggio e alla gestione payroll."],
];

const audiences = [
  "Commercialisti e consulenti fiscali",
  "Consulenti del lavoro",
  "Studi professionali associati",
  "Società di servizi amministrativi",
];

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Studio Manager Pro">
          <span className="brandMark">SM</span>
          <span>Studio Manager Pro</span>
        </a>
        <nav aria-label="Navigazione principale">
          <a href="#funzioni">Funzioni</a>
          <a href="#piani">Piani</a>
          <a href="#faq">FAQ</a>
          <a className="loginLink" href={appUrl}>Accedi</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="heroCopy">
          <p className="eyebrow">IL GESTIONALE COSTRUITO PER LO STUDIO</p>
          <h1>Più controllo sul lavoro.<br />Più tempo per i clienti.</h1>
          <p className="heroText">
            Studio Manager Pro riunisce organizzazione, scadenze e processi
            professionali in un solo ambiente, semplice da consultare e pronto
            ad accompagnare il lavoro quotidiano.
          </p>
          <div className="actions">
            <a className="primaryButton" href="#piani">Scopri i piani</a>
            <a className="secondaryButton" href={appUrl}>Accedi all’applicazione</a>
          </div>
          <p className="microcopy">Servizio dedicato agli studi professionali italiani.</p>
        </div>
        <div className="heroPanel" aria-label="Anteprima delle aree operative">
          <div className="panelHead">
            <span>Panoramica dello studio</span>
            <span className="status">Operativo</span>
          </div>
          <div className="stats">
            <div><small>Clienti</small><strong>858</strong><span>Gestione centralizzata</span></div>
            <div><small>Appuntamenti</small><strong>12</strong><span>Prossimi 7 giorni</span></div>
            <div><small>Scadenze</small><strong>215</strong><span>Sotto controllo</span></div>
            <div><small>Pratiche</small><strong>64</strong><span>In lavorazione</span></div>
          </div>
        </div>
      </section>

      <section className="trustLine">
        <span>Un’unica piattaforma</span>
        <span>Accesso sicuro</span>
        <span>Processi organizzati</span>
        <span>Assistenza in Italia</span>
      </section>

      <section className="section" id="funzioni">
        <div className="sectionIntro">
          <p className="eyebrow">TUTTO NEL POSTO GIUSTO</p>
          <h2>Gli strumenti essenziali, collegati tra loro</h2>
          <p>Dal primo promemoria alla chiusura della pratica, ogni informazione resta disponibile nel contesto corretto.</p>
        </div>
        <div className="featureGrid">
          {features.map(([title, text], index) => (
            <article className="featureCard" key={title}>
              <span className="number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section split">
        <div>
          <p className="eyebrow">PENSATO PER CHI LAVORA CON LE SCADENZE</p>
          <h2>Una base comune per persone e attività diverse</h2>
          <p className="largeText">
            Ruoli, responsabilità e informazioni rimangono leggibili. Ogni
            collaboratore trova ciò che serve senza perdere la visione generale.
          </p>
        </div>
        <ul className="audienceList">
          {audiences.map((audience) => <li key={audience}>{audience}<span>→</span></li>)}
        </ul>
      </section>

      <section className="pricingSection" id="piani">
        <div className="sectionIntro">
          <p className="eyebrow">ABBONAMENTI</p>
          <h2>Scegli la configurazione adatta al tuo studio</h2>
          <p>I piani commerciali e la sottoscrizione online sono in fase di definizione.</p>
        </div>
        <div className="pricingGrid">
          <article className="priceCard">
            <p className="plan">Essenziale</p>
            <h3>Per iniziare</h3>
            <p>Organizzazione dello studio, clienti, agenda, promemoria e scadenze.</p>
            <span className="coming">Disponibile a breve</span>
          </article>
          <article className="priceCard featured">
            <p className="plan">Professionale</p>
            <h3>Per crescere</h3>
            <p>Strumenti operativi completi, controllo e moduli professionali integrati.</p>
            <span className="coming">Disponibile a breve</span>
          </article>
          <article className="priceCard">
            <p className="plan">Studio Plus</p>
            <h3>Per strutturarsi</h3>
            <p>Configurazione estesa per studi con più aree, utenti e processi.</p>
            <span className="coming">Disponibile a breve</span>
          </article>
        </div>
      </section>

      <section className="section faq" id="faq">
        <div className="sectionIntro">
          <p className="eyebrow">DOMANDE FREQUENTI</p>
          <h2>Prima di cominciare</h2>
        </div>
        <details><summary>Studio Manager Pro funziona online?</summary><p>Sì. L’applicazione è accessibile tramite browser e non richiede installazioni sul singolo computer.</p></details>
        <details><summary>È pensato solo per il mercato italiano?</summary><p>Sì. Funzioni e terminologia sono progettate per l’operatività degli studi professionali italiani.</p></details>
        <details><summary>Posso già sottoscrivere un abbonamento?</summary><p>La sottoscrizione online è in preparazione. Questa pagina verrà aggiornata con piani, prezzi e condizioni.</p></details>
      </section>

      <section className="closing">
        <p className="eyebrow">STUDIO MANAGER PRO</p>
        <h2>Il nuovo modo di tenere insieme il lavoro dello studio.</h2>
        <a className="primaryButton light" href={appUrl}>Accedi all’applicazione</a>
      </section>

      <footer>
        <div className="brand footerBrand"><span className="brandMark">SM</span><span>Studio Manager Pro</span></div>
        <p>© 2026 Studio Manager Pro. Tutti i diritti riservati.</p>
        <div><a href={appUrl}>Accesso applicazione</a></div>
      </footer>
    </main>
  );
}
