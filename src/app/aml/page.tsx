import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import {amlPlans} from "../../lib/aml-pricing";

export const metadata: Metadata = {
  title: "Studio Manager Pro AML | Antiriciclaggio per studi professionali",
  description:
    "Studio Manager Pro AML: adeguata verifica, modelli AV1 AV2 AV4, fascicoli, clienti, Microsoft 365 e alert in un'interfaccia professionale dedicata.",
};

const funzioni = [
  { n: "01", title: "Pratiche antiriciclaggio", text: "Un unico ambiente per aprire, seguire e aggiornare le pratiche AML, utilizzando le procedure operative originali di Studio Manager Pro." },
  { n: "02", title: "Adeguata verifica e modelli", text: "Gestione dei modelli AV1, AV2, AV4 e delle rispettive verifiche, senza cambiare il motore documentale del gestionale." },
  { n: "03", title: "Fascicoli e documenti", text: "Documenti collegati alla pratica, acquisizione AV4 dal cliente e controllo degli elementi da completare." },
  { n: "04", title: "Centro Alert AML", text: "Alert e notifiche relative alle attività antiriciclaggio, con controlli e scadenze specifiche." },
  { n: "05", title: "Microsoft 365", text: "Collegamento alle funzioni Microsoft 365 già integrate nel gestionale per gestire le comunicazioni e le attività dello studio." },
  { n: "06", title: "Dati Studio e Utenti", text: "Informazioni dello studio, utenti, ruoli e autorizzazioni basati sulle stesse anagrafiche e regole di SMP." },
];

export default function AMLCommercialPage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandShield}>◆</span>
          <span><strong>Studio Manager Pro</strong><small>AML · Antiriciclaggio</small></span>
        </Link>
        <nav aria-label="Navigazione">
          <Link href="/">Sito principale</Link>
          <Link href="/soluzioni">Soluzioni e prezzi</Link>
        </nav>
      </header>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>STUDIO MANAGER PRO · SOLUZIONE SPECIALISTICA</p>
          <h1>Tutto l&apos;antiriciclaggio. <em>Una sola interfaccia.</em></h1>
          <p className={styles.lead}>Il motore completo di Studio Manager Pro, dedicato ai processi AML. Pratiche, adeguata verifica, fascicoli, utenti, Microsoft 365 e alert generali: la stessa tecnologia, un ambiente di lavoro focalizzato.</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#funzioni">Esplora le funzionalità <span aria-hidden="true">→</span></a>
            <a className={styles.secondaryButton} href="#prezzi">Piani e prezzi</a>
          </div>
          <div className={styles.heroFoot}><span>Unico backend SMP</span><i/> <span>Dati e funzioni condivisi</span><i/> <span>Interfaccia AML dedicata</span></div>
        </div>
        <div className={styles.preview} aria-label="Anteprima illustrativa dell'interfaccia AML">
          <div className={styles.previewSidebar}>
            <div className={styles.previewLogo}>SMP <span>AML</span></div>
            {["Cruscotto","Dati Studio","Utenti","Microsoft 365","Centro Alert","Clienti","Pratiche AML","Adeguata verifica","Fascicoli"].map((name,i)=><div className={i===0?styles.previewSelected:styles.previewLink} key={name}><span className={styles.miniIcon}>◈</span>{name}</div>)}
          </div>
          <div className={styles.previewMain}>
            <div className={styles.previewHeading}><div><strong>Cruscotto AML</strong><small>La tua attività, sotto controllo</small></div><span className={styles.previewButton}>+ Nuova pratica</span></div>
            <div className={styles.previewKpis}>
              <div><span className={styles.kpiIcon}>▤</span><b>Pratiche AML</b><small>Gestione operativa</small></div>
              <div><span className={styles.kpiIcon}>◷</span><b>Verifiche</b><small>Scadenze e controlli</small></div>
              <div><span className={styles.kpiIcon}>♢</span><b>Fascicoli</b><small>Documentazione</small></div>
            </div>
            <div className={styles.previewPanels}>
              <div><b>Stato pratiche</b><div className={styles.bars}><span/><span/><span/><span/></div><small>Aperte · In lavorazione · Completate</small></div>
              <div><b>Centro Alert</b><div className={styles.alertRow}><span className={styles.alertDot}/> Scadenze in evidenza</div><div className={styles.alertRow}><span className={styles.alertDotYellow}/> Controlli periodici</div><div className={styles.alertRow}><span className={styles.alertDotGreen}/> Notifiche gestite</div></div>
            </div>
            <div className={styles.previewBottom}><b>Microsoft 365</b><span>Outlook · Teams · Calendario</span></div>
          </div>
          <span className={styles.previewCaption}>Anteprima illustrativa · dati non reali</span>
        </div>
      </section>
      <section id="funzioni" className={styles.functions}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>UN AMBIENTE AML COMPLETO</p>
          <h2>Ogni funzione al posto giusto.</h2>
          <p>Un&apos;interfaccia autonoma, costruita attorno ai moduli e alle procedure antiriciclaggio del gestionale originale.</p>
        </div>
        <div className={styles.functionGrid}>{funzioni.map(f=><article className={styles.functionCard} key={f.n}><span>{f.n}</span><h3>{f.title}</h3><p>{f.text}</p></article>)}</div>
      </section>
      <section id="prezzi" className={styles.pricing}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>LICENZE PER VOLUME DI PRATICHE</p>
          <h2>Un piano adatto al tuo studio.</h2>
          <p>Canone annuale in funzione del numero massimo di pratiche AML gestibili. Prezzi annuali. IVA non applicata ai sensi dell’art. 1, comma 58, L. 190/2014 (regime forfettario).</p>
        </div>
        <div className={styles.pricingGrid}>
          {amlPlans.map(plan=><article className={styles.priceCard} key={plan.id}>
            <h3>{plan.name}</h3>
            <p className={styles.practiceCap}>Fino a <strong>{plan.maxPractices}</strong> pratiche</p>
            <div className={styles.priceAmount}>€ {plan.annualEur}<span> /anno</span></div>
            <ul>{plan.features.map(feature=><li key={feature}>{feature}</li>)}</ul>
            <a className={styles.priceAction} href={"/aml/acquisto?piano="+plan.id}>Seleziona piano</a>
          </article>)}
        </div>
        <p className={styles.pricingNote}>L'attivazione avviene dopo la verifica del pagamento e la configurazione della licenza. Il conteggio e l'applicazione del limite pratiche saranno operativi dopo il collaudo del sistema di licenze.</p>
      </section>
      <section id="architettura" className={styles.architecture}>
        <div><p className={styles.eyebrow}>UN MOTORE, DUE ESPERIENZE</p><h2>Autonomo nell&apos;interfaccia. Condiviso nella tecnologia.</h2></div>
        <p>Studio Manager Pro AML riutilizza il backend originale per autenticazione, autorizzazioni, database, funzioni AML, documenti, Microsoft 365 e Centro Alert. Non è una copia indipendente dei dati: è un altro modo di lavorare con lo stesso sistema.</p>
      </section>
      <footer className={styles.footer}><Link href="/">Studio Manager Pro</Link><span>© {new Date().getFullYear()} Studio Manager Pro · Tutti i diritti riservati.</span></footer>
    </main>
  );
}
