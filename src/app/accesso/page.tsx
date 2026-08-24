const logoUrl = "https://raw.githubusercontent.com/martiola68/studio-manager-pro/main/public/LogoSMP_.png";

export default function Accesso() {
  return (
    <main className="accessPage">
      <header className="accessHeader">
        <a href="/" className="brand">
          <img src={logoUrl} alt="" className="brandLogo" />
          <span className="brandWords">
            <strong>Studio Manager Pro</strong>
            <small>Sistema Gestionale Integrato</small>
          </span>
        </a>
        <a href="/" className="backLink">← Torna al sito</a>
      </header>

      <section className="accessHero">
        <div className="accessCopy">
          <p className="eyebrow lightEyebrow">AREA RISERVATA</p>
          <h1>Entra nel tuo ambiente Studio Manager Pro.</h1>
          <p>
            L’accesso è riservato agli studi e agli utenti già abilitati.
            Scegli l’area corretta per proseguire in sicurezza.
          </p>
        </div>
        <div className="accessChoices">
          <article className="accessCard activeAccess">
            <span className="accessNumber">01</span>
            <div>
              <p className="accessType">GESTIONALE DI STUDIO</p>
              <h2>Studio Manager Pro</h2>
              <p>
                Per amministratori, professionisti e collaboratori dello studio.
                Accedi a dashboard, clienti, scadenze, pratiche e moduli operativi.
              </p>
            </div>
            <a href="https://app.studiomanagerpro.it/login" className="accessButton">
              Accedi al gestionale <span>→</span>
            </a>
          </article>

          <article className="accessCard futureAccess">
            <span className="accessNumber">02</span>
            <div>
              <p className="accessType">PORTALE DEDICATO</p>
              <h2>Area cliente</h2>
              <p>
                Il portale per inviare richieste e documenti allo studio tramite
                credenziali dedicate.
              </p>
            </div>
            <span className="futureLabel">Collegamento in preparazione</span>
          </article>
        </div>
      </section>

      <footer className="accessFooter">
        <p>© 2026 Studio Manager Pro. Creato da Artiola Mario.</p>
        <small>Accesso protetto e riservato agli utenti autorizzati.</small>
      </footer>
    </main>
  );
}
