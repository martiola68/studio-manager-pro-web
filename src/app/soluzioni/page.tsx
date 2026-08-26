const piani = [
  {
    codice: "essential",
    nome: "Essential",
    prezzo: "149 €",
    descrizione: "La base operativa per centralizzare anagrafiche, agenda, promemoria e scadenze.",
  },
  {
    codice: "professional",
    nome: "Professional",
    prezzo: "199 €",
    descrizione: "Gestione professionale dei processi, delle pratiche e dell'operatività dello studio.",
  },
  {
    codice: "studio_plus",
    nome: "Studio Plus",
    prezzo: "249 €",
    descrizione: "Configurazione estesa per studi con più utenti, anagrafiche e responsabilità operative.",
  },
];

const moduli = [
  ["Antiriciclaggio", "149 € / mese", "Adeguata verifica, documenti e gestione operativa AML."],
  ["Revisione e controllo", "199 € / mese", "Checklist, verifiche, carte di lavoro e follow-up."],
  ["Controllo di gestione", "129 € / mese", "Importazione dati contabili, mappature, indicatori e analisi."],
  ["Pacchetto +3 utenti", "45 € / mese", "Tre utenti aggiuntivi."],
  ["Pacchetto +5 utenti", "69 € / mese", "Cinque utenti aggiuntivi."],
  ["Pacchetto +500 anagrafiche", "49 € / mese", "Incremento di 500 anagrafiche attive."],
];

function Brand() {
  return <span className="brand"><img src="https://raw.githubusercontent.com/martiola68/studio-manager-pro/main/public/LogoSMP_.png" alt="" className="brandLogo" /><span className="brandWords"><strong>Studio Manager Pro</strong><small>Sistema Gestionale Integrato</small></span></span>;
}

export default function SoluzioniPage() {
  return <main>
    <header className="topbar"><a href="/" aria-label="Studio Manager Pro"><Brand /></a><nav><a href="/">Sito</a><a href="/accesso">Area riservata</a></nav></header>

    <section className="statement" style={{ paddingTop: 84 }}>
      <p className="eyebrow">SOLUZIONI E PREZZI</p>
      <h2>Una configurazione chiara.<br />Un abbonamento costruito sullo studio.</h2>
      <div className="statementText"><p>Scegli il piano di partenza e aggiungi solo i moduli e le capacità che ti servono.</p><p>Il contratto ha durata annuale con corrispettivo rateizzato mensilmente, salvo quanto previsto nelle condizioni contrattuali.</p></div>
    </section>

    <section className="solutionsSection" style={{ paddingTop: 30 }}>
      <div className="solutionGrid">
        {piani.map((piano, index) => <article key={piano.codice} className={index === 1 ? "solutionFeatured" : ""}>
          <span>{piano.nome.toUpperCase()}</span>
          <h3>{piano.prezzo} / mese</h3>
          <p>{piano.descrizione}</p>
          <a href={`/sottoscrizione?piano=${piano.codice}`}><b>Sottoscrivi {piano.nome} →</b></a>
        </article>)}
      </div>
    </section>

    <section className="workflowSection" style={{ paddingTop: 30 }}>
      <div className="sectionHead"><div><p className="eyebrow">MODULI E CAPACITÀ AGGIUNTIVE</p><h2>Completa il piano<br />solo dove serve.</h2></div><p>Tutte le componenti aggiuntive sono ricorrenti mensili e possono essere selezionate durante la sottoscrizione.</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 16 }}>
        {moduli.map(([nome, prezzo, descrizione]) => <article key={nome} style={{ padding: 24, border: "1px solid #dce5ef", borderRadius: 14, background: "white" }}><p className="eyebrow">{prezzo}</p><h3 style={{ fontSize: 24, margin: "8px 0" }}>{nome}</h3><p style={{ color: "#62718a", lineHeight: 1.7 }}>{descrizione}</p></article>)}
      </div>
    </section>

    <section className="accessBanner">
      <div><p className="eyebrow lightEyebrow">PRONTO A PARTIRE?</p><h2>Configura il tuo abbonamento e completa il contratto.</h2></div>
      <div className="accessActions"><a className="primaryButton whiteButton" href="/sottoscrizione">Sottoscrivi abbonamento/contratto <span>→</span></a></div>
    </section>

    <footer><Brand /><div className="footerCenter"><p>© 2026 Studio Manager Pro. Creato da Artiola Mario.</p><small>Opera tutelata ai sensi della Legge 22 aprile 1941, n. 633, e successive modificazioni.</small></div><a href="/accesso">Area riservata</a></footer>
  </main>;
}
