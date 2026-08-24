const modules = [
  {
    code: "01",
    title: "Agenda e promemoria",
    text: "Appuntamenti, riunioni, attività e memo personali o condivisi, con una visione ordinata del lavoro quotidiano.",
    tags: ["Agenda operativa", "Alert automatici", "Calendario Microsoft 365"],
  },
  {
    code: "02",
    title: "Scadenzario centralizzato",
    text: "Un unico motore per governare scadenze fiscali, societarie, amministrative e di studio senza perdere il controllo.",
    tags: ["IVA · LIPE · CU · 770", "IMU · Bilanci · CCGG", "Preavvisi e destinatari"],
  },
  {
    code: "03",
    title: "Pratiche professionali",
    text: "Processi guidati, documenti e avanzamento per operazioni societarie e adempimenti ricorrenti.",
    tags: ["Distribuzione utili", "Liquidazioni e nomine", "Fascicolo digitale"],
  },
  {
    code: "04",
    title: "Revisione e controllo",
    text: "Checklist, verifiche, follow-up e carte di lavoro per rendere le procedure tracciabili e coerenti.",
    tags: ["Programmazione", "Controlli periodici", "Follow-up automatico"],
  },
  {
    code: "05",
    title: "Controllo di gestione",
    text: "Importazione dei dati contabili, mappature per società, indicatori e relazioni per trasformare i numeri in decisioni.",
    tags: ["Dati contabili", "Analisi trimestrale", "Report direzionali"],
  },
  {
    code: "06",
    title: "Contenzioso tributario",
    text: "Avvisi, cartelle, ricorsi, scadenze e responsabilità raccolti in un flusso operativo unico.",
    tags: ["Avvisi bonari", "Cartelle e ricorsi", "Esiti e importi residui"],
  },
  {
    code: "07",
    title: "Antiriciclaggio",
    text: "Pratiche AML, titolari effettivi, valutazioni e documentazione collegate direttamente alle anagrafiche.",
    tags: ["AV1 · AV2 · AV4", "Titolare effettivo", "Storico e rinnovi"],
  },
  {
    code: "08",
    title: "Payroll",
    text: "Presenze, ferie, permessi, smart working e richieste di assunzione gestite tra studio, collaboratori e clienti.",
    tags: ["Presenze", "Ferie e permessi", "Pratiche di assunzione"],
  },
  {
    code: "09",
    title: "Archivi di base",
    text: "Clienti, soci, organi sociali, gruppi societari e relazioni tra soggetti sempre disponibili nel contesto corretto.",
    tags: ["Anagrafiche", "Gruppi societari", "Organi e partecipazioni"],
  },
  {
    code: "10",
    title: "Microsoft 365",
    text: "Calendari, posta e riunioni integrati nel gestionale per evitare passaggi inutili tra applicazioni diverse.",
    tags: ["Sincronizzazione", "Invio email", "Riunioni online"],
  },
  {
    code: "11",
    title: "Area cliente",
    text: "Raccolta strutturata di richieste e documenti, con credenziali dedicate e passaggio diretto allo studio.",
    tags: ["Accesso riservato", "Richieste guidate", "Stato della pratica"],
  },
  {
    code: "12",
    title: "Organizzazione dello studio",
    text: "Utenti, ruoli, settori e responsabilità configurabili per adattare la piattaforma alla struttura reale dello studio.",
    tags: ["Multi-studio", "Ruoli e permessi", "Responsabilità operative"],
  },
];

const advantages = [
  ["Un dato, un solo punto di origine", "Anagrafiche, incarichi, scadenze e documenti non vivono in archivi separati: ogni informazione alimenta i processi collegati."],
  ["Automazioni che seguono il lavoro", "Alert, rinnovi, sincronizzazioni e controlli intervengono nel momento utile, senza trasformarsi in rumore."],
  ["Responsabilità sempre leggibili", "Ogni attività può essere assegnata, seguita e ricondotta al cliente, all’operatore e al processo che l’ha generata."],
  ["Cresce insieme allo studio", "Architettura multi-studio, moduli integrati e configurazioni indipendenti accompagnano strutture di dimensioni diverse."],
];

function Brand() {
  return (
    <span className="brand">
      <img src="https://raw.githubusercontent.com/martiola68/studio-manager-pro/main/public/LogoSMP_.png" alt="" className="brandLogo" />
      <span className="brandWords">
        <strong>Studio Manager Pro</strong>
        <small>Sistema Gestionale Integrato</small>
      </span>
    </span>
  );
}

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a href="#home" aria-label="Studio Manager Pro"><Brand /></a>
        <nav aria-label="Navigazione principale">
          <a href="#piattaforma">Piattaforma</a>
          <a href="#moduli">Funzioni</a>
          <a href="#vantaggi">Potenzialità</a>
          <a href="#piani">Soluzioni</a>
          <a className="installLink" href="https://app.studiomanagerpro.it/login?install=1">Installa l’app <span>↓</span></a>
          <a className="reservedLink" href="/accesso">Area riservata <span>↗</span></a>
        </nav>
      </header>

      <section className="heroV2" id="home">
        <div className="heroGlow one" />
        <div className="heroGlow two" />
        <div className="heroMain">
          <p className="eyebrow lightEyebrow">PIATTAFORMA DIGITALE PER STUDI PROFESSIONALI</p>
          <h1>Il lavoro dello studio.<br /><em>Finalmente connesso.</em></h1>
          <p className="heroLead">
            Studio Manager Pro porta persone, clienti, scadenze e processi in
            un unico sistema gestionale. Non un insieme di funzioni isolate,
            ma una piattaforma costruita per governare davvero lo studio.
          </p>
          <div className="heroActions">
            <a className="primaryButton whiteButton" href="#moduli">Esplora la piattaforma <span>↓</span></a>
            <a className="textButton" href="#piani">Scopri le soluzioni <span>→</span></a>
          </div>
          <div className="heroProof">
            <span>Cloud</span><i />
            <span>Multi-studio</span><i />
            <span>Accesso sicuro</span><i />
            <span>Progettato in Italia</span>
          </div>
        </div>

        <div className="productStage" aria-label="Ecosistema Studio Manager Pro">
          <div className="stageGrid" />
          <div className="logoCore">
            <img src="https://raw.githubusercontent.com/martiola68/studio-manager-pro/main/public/LogoSMP_.png" alt="Logo Studio Manager Pro" />
            <strong>Studio Manager Pro</strong>
            <span>Sistema Gestionale Integrato</span>
          </div>
          <div className="floatingModule fm1"><b>SCADENZE</b><span>Motore alert centralizzato</span></div>
          <div className="floatingModule fm2"><b>PRATICHE</b><span>Processi e documenti</span></div>
          <div className="floatingModule fm3"><b>CONTROLLO</b><span>Dati, verifiche e report</span></div>
          <div className="floatingModule fm4"><b>CLIENTI</b><span>Anagrafiche collegate</span></div>
          <div className="signal s1" /><div className="signal s2" /><div className="signal s3" />
        </div>
      </section>

      <section className="statement" id="piattaforma">
        <p className="eyebrow">OLTRE IL GESTIONALE TRADIZIONALE</p>
        <h2>Una piattaforma che conosce il contesto, collega le informazioni e fa avanzare il lavoro.</h2>
        <div className="statementText">
          <p>
            Lo studio professionale non lavora per compartimenti stagni.
            Un cliente genera pratiche, scadenze, documenti, responsabilità e controlli.
            SMP mantiene queste relazioni vive e consultabili.
          </p>
          <p>
            Ogni modulo dialoga con gli altri: l’informazione nasce una volta,
            viene utilizzata dove serve e rimane tracciata nel tempo.
          </p>
        </div>
      </section>

      <section className="moduleSection" id="moduli">
        <div className="sectionHead darkHead">
          <div>
            <p className="eyebrow lightEyebrow">L’ECOSISTEMA SMP</p>
            <h2>Tutto ciò che serve allo studio.<br />Dentro un’unica regia.</h2>
          </div>
          <p>
            Dall’operatività quotidiana ai processi professionali più complessi:
            dodici aree integrate, una sola esperienza di lavoro.
          </p>
        </div>
        <div className="moduleGrid">
          {modules.map((module) => (
            <article className="moduleCard" key={module.code}>
              <div className="moduleTop"><span>{module.code}</span><i>↗</i></div>
              <h3>{module.title}</h3>
              <p>{module.text}</p>
              <ul>{module.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="workflowSection">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">DAL DATO ALL’AZIONE</p>
            <h2>Un flusso continuo,<br />senza passaggi a vuoto.</h2>
          </div>
          <p>
            SMP mette in relazione ciò che normalmente resta disperso tra
            fogli di calcolo, email, calendari e cartelle condivise.
          </p>
        </div>
        <div className="flow">
          <div><span>01</span><b>Il dato nasce</b><p>Cliente, evento, documento o incarico entrano nel sistema.</p></div>
          <i>→</i>
          <div><span>02</span><b>Il processo si attiva</b><p>Regole, scadenze e responsabilità vengono collegate.</p></div>
          <i>→</i>
          <div><span>03</span><b>Lo studio governa</b><p>Alert, attività e controlli arrivano alle persone giuste.</p></div>
          <i>→</i>
          <div><span>04</span><b>Il lavoro resta tracciato</b><p>Stato, esiti e storico rimangono sempre consultabili.</p></div>
        </div>
      </section>

      <section className="advantagesSection" id="vantaggi">
        <div className="advantageIntro">
          <p className="eyebrow lightEyebrow">CAPACITÀ E POTENZIALITÀ</p>
          <h2>Non aggiunge complessità.<br />La governa.</h2>
          <p>
            SMP è progettato intorno al modo in cui lo studio lavora davvero:
            molte responsabilità, molte scadenze, un’unica necessità di controllo.
          </p>
        </div>
        <div className="advantageList">
          {advantages.map(([title, text], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="securitySection">
        <div className="securityPanel">
          <p className="eyebrow">UNA BASE SOLIDA PER IL LAVORO</p>
          <h2>Accesso controllato.<br />Dati separati. Ruoli definiti.</h2>
          <p>
            L’architettura multi-tenant separa gli ambienti di ciascuno studio.
            Utenti, ruoli e permessi rendono visibile ogni funzione alle persone
            autorizzate, mentre log e storico supportano la tracciabilità.
          </p>
          <div className="securityTags">
            <span>Multi-tenant</span><span>Ruoli e permessi</span><span>Tracciabilità</span><span>Cloud</span>
          </div>
        </div>
        <div className="architecture">
          <div className="archTop">STUDIO MANAGER PRO CLOUD</div>
          <div className="archRows">
            <div><span>Studio A</span><small>Ambiente separato</small></div>
            <div><span>Studio B</span><small>Ambiente separato</small></div>
            <div><span>Studio C</span><small>Ambiente separato</small></div>
          </div>
          <div className="archBase"><b>Dati · Processi · Documenti</b><span>Protezione e continuità operativa</span></div>
        </div>
      </section>

      <section className="solutionsSection" id="piani">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">SOLUZIONI</p>
            <h2>La configurazione giusta<br />per ogni fase dello studio.</h2>
          </div>
          <p>
            I pacchetti commerciali saranno costruiti per accompagnare realtà
            diverse, senza rinunciare alla logica integrata della piattaforma.
          </p>
        </div>
        <div className="solutionGrid">
          <article><span>ESSENTIAL</span><h3>Organizzare</h3><p>La base operativa per centralizzare clienti, agenda, promemoria e scadenze.</p><b>In definizione</b></article>
          <article className="solutionFeatured"><span>PROFESSIONAL</span><h3>Governare</h3><p>Moduli professionali, automazioni e controllo completo dei processi dello studio.</p><b>In definizione</b></article>
          <article><span>STUDIO PLUS</span><h3>Scalare</h3><p>Configurazione estesa per strutture articolate, più utenti, settori e responsabilità.</p><b>In definizione</b></article>
        </div>
      </section>

      <section className="accessBanner">
        <div>
          <p className="eyebrow lightEyebrow">SEI GIÀ UN UTENTE SMP?</p>
          <h2>Il tuo ambiente di lavoro è nell’Area riservata.</h2>
        </div>
        <div className="accessActions">
          <a className="installBannerButton" href="https://app.studiomanagerpro.it/login?install=1">Installa l’app <span>↓</span></a>
          <a className="primaryButton whiteButton" href="/accesso">Vai all’Area riservata <span>→</span></a>
        </div>
      </section>

      <footer>
        <Brand />
        <div className="footerCenter">
          <p>© 2026 Studio Manager Pro. Creato da Artiola Mario.</p>
          <small>Opera tutelata ai sensi della Legge 22 aprile 1941, n. 633, e successive modificazioni.</small>
        </div>
        <a href="/accesso">Area riservata</a>
      </footer>
    </main>
  );
}
