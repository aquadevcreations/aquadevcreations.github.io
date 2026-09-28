#!/usr/bin/env python3
"""Genera le pagine del sito aquadev creations.
Uso:  python3 _build.py   (dalla cartella del sito). Tutti i file stanno nella stessa cartella, senza sottocartelle.
Per aggiungere un'app: aggiungi una voce in APPS con i suoi testi e rilancia lo script.
"""
import os, html
from urllib.parse import quote

ROOT = os.path.dirname(os.path.abspath(__file__))
EMAIL = "aquadev.creations@gmail.com"
DEV = "aquadev"
TELEGRAM = "https://t.me/donttouchthebutton"
FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Roboto:wght@300;400;600&display=swap" rel="stylesheet">'


def bi(it, en, tag="span"):
    return f'<{tag} class="it">{it}</{tag}><{tag} class="en">{en}</{tag}>'


def gmail(subject, body=""):
    s = f"https://mail.google.com/mail/?view=cm&fs=1&to={EMAIL}&su={quote(subject)}"
    if body:
        s += f"&body={quote(body)}"
    return s


def contact_btns(subject, body="", primary_it="Scrivi con Gmail", primary_en="Write with Gmail"):
    return (f'<div class="btns">'
            f'<a class="btn primary" href="{gmail(subject, body)}" target="_blank" rel="noopener">✉ {bi(primary_it, primary_en)}</a>'
            f'<a class="btn" href="{mailto(subject, body)}">{bi("Apri app email", "Open email app")}</a>'
            f'<button class="btn copy" data-copy="{EMAIL}">{bi("Copia indirizzo", "Copy address")}</button>'
            f'</div>')


def mailto(subject, body=""):
    s = f"mailto:{EMAIL}?subject={quote(subject)}"
    if body:
        s += f"&body={quote(body)}"
    return s


# ------------------------------------------------------------------ APPS
APPS = [
 dict(
  slug="wobblebrain", name="Wobblebrain", icon="wobblebrain-icon.jpg",
  shots=["wobblebrain-1.jpg", "wobblebrain-2.jpg"], status="test",
  group=dict(email="wobblebrain_closedtest@googlegroups.com", url="https://groups.google.com/g/wobblebrain_closedtest"),
  package="com.aquascape.wobblebrain.puzzle",
  play="https://play.google.com/store/apps/details?id=com.aquascape.wobblebrain.puzzle",
  tagline=("Il puzzle della bilancia cervellotica.", "The brain-teasing balance puzzle."),
  intro=("Piazza i blocchi numerati sui piatti e porta ogni bilancia al valore giusto. Sembra facile, finché i ponti non iniziano a collegarsi tra loro.",
         "Drop numbered blocks on the pans and bring every scale to the right value. Easy, until the bridges start linking together."),
  features=([
    "Somme, differenze e livelli con più ponti collegati",
    "Sfida giornaliera e Laboratorio Zen per giocare libero",
    "Grafica cartoon colorata, partite brevi",
    "In italiano, inglese, spagnolo, francese e tedesco",
  ], [
    "Sums, differences and multi-bridge levels",
    "Daily challenge and a free-play Zen Lab",
    "Colorful cartoon style, short sessions",
    "Available in English, Italian, Spanish, French and German",
  ]),
  updated=("28 settembre 2026", "September 28, 2026"),
  privacy_it=f"""
<p>Questa informativa spiega come l'app <strong>Wobblebrain</strong> ("l'App", "noi") tratta le informazioni quando la usi.</p>
<h2>In breve</h2>
<p>Wobblebrain è un puzzle per giocatore singolo. Non serve un account, non raccoglie dati personali e non salva nulla dei tuoi dati sui nostri server. Tutti i progressi restano sul tuo dispositivo.</p>
<h2>Dati che raccogliamo</h2>
<p><strong>Non raccogliamo, conserviamo né trasmettiamo dati personali.</strong> In particolare:</p>
<ul>
<li>non serve creare un account o fare login;</li>
<li>non raccogliamo nome, email o altri dati identificativi;</li>
<li>non accediamo a contatti, foto, posizione o altri dati del dispositivo che non servono al gioco.</li>
</ul>
<h2>Dati salvati sul dispositivo</h2>
<p>L'App salva i tuoi progressi (livelli completati, punteggi migliori, contenuti sbloccati ed energia residua) sul tuo dispositivo, con il sistema DataStore di Android. Questi dati:</p>
<ul>
<li>non lasciano mai il dispositivo;</li>
<li>non sono accessibili a noi né a terzi;</li>
<li>si cancellano se disinstalli l'App o se ne cancelli i dati dalle impostazioni del dispositivo.</li>
</ul>
<h2>Servizi di terze parti: pubblicità</h2>
<p>L'App mostra annunci forniti da <strong>Google AdMob</strong>, un servizio di Google LLC. Per mostrare gli annunci, anche personalizzati, AdMob può raccogliere e trattare alcuni dati, come identificativi del dispositivo e dati di utilizzo, secondo le proprie regole sulla privacy.</p>
<p>Non controlliamo il modo in cui Google AdMob raccoglie o tratta questi dati. Per i dettagli:</p>
<ul>
<li>Privacy Policy di Google: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a></li>
<li>Come Google usa i dati sulle app dei partner: <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">policies.google.com/technologies/partner-sites</a></li>
</ul>
<p>A seconda del Paese e delle impostazioni, puoi gestire la personalizzazione degli annunci dalle impostazioni del dispositivo (Impostazioni › Google › Annunci) oppure da <a href="https://adssettings.google.com" target="_blank" rel="noopener">adssettings.google.com</a>.</p>
<h2>Notifiche</h2>
<p>Se lo permetti, l'App può inviarti una notifica locale quando l'energia si è ricaricata del tutto. La notifica è programmata interamente sul dispositivo e non comporta l'invio di dati personali a noi o a terzi. Puoi disattivarla in qualsiasi momento dalle impostazioni di sistema.</p>
<h2>Minori</h2>
<p>Wobblebrain è adatto a un pubblico generale, bambini compresi. Non raccogliamo consapevolmente dati personali di nessuno, inclusi i minori di 13 anni (o dell'età minima prevista nel tuo Paese). Gli annunci sono forniti da Google AdMob: se l'App è configurata o usata in un contesto rivolto ai minori, le richieste di annunci possono essere trattate come destinate ai minori secondo le norme applicabili (come la COPPA), il che limita il tipo di annunci e di trattamento dei dati.</p>
<h2>Condivisione e vendita dei dati</h2>
<p>Non vendiamo, affittiamo né condividiamo dati degli utenti, perché oltre a quanto descritto sopra non ne raccogliamo. La parte pubblicitaria è gestita interamente da Google AdMob.</p>
""",
  privacy_en=f"""
<p>This Privacy Policy describes how the mobile application <strong>Wobblebrain</strong> ("the App", "we", "us") handles information when you use it.</p>
<h2>Summary</h2>
<p>Wobblebrain is a single-player puzzle game. It does not require an account, does not collect personal information, and does not store any of your data on our servers. All game progress is stored locally on your device.</p>
<h2>Information we collect</h2>
<p><strong>We do not collect, store, or transmit any personal information.</strong> Specifically:</p>
<ul>
<li>We do not require you to create an account or log in</li>
<li>We do not collect your name, email address, or any other personally identifiable information</li>
<li>We do not access your contacts, photos, location, or any other device data unrelated to gameplay</li>
</ul>
<h2>Local data storage</h2>
<p>The App saves your game progress (completed levels, best scores, unlocked content and remaining energy) locally on your device using Android's DataStore storage system. This data:</p>
<ul>
<li>Never leaves your device</li>
<li>Is not accessible to us or to any third party</li>
<li>Is deleted automatically if you uninstall the App, or if you clear the App's data through your device settings</li>
</ul>
<h2>Third-party services: advertising</h2>
<p>The App displays advertisements provided by <strong>Google AdMob</strong>, a service operated by Google LLC. To deliver ads, including personalized ads, Google AdMob may collect and process certain data such as device identifiers and usage data, in accordance with its own privacy practices.</p>
<p>We do not control how Google AdMob collects or processes this data. For details, please refer to:</p>
<ul>
<li>Google's Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a></li>
<li>How Google uses data when you use our partners' sites or apps: <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">policies.google.com/technologies/partner-sites</a></li>
</ul>
<p>Depending on your region and settings, you can control ad personalization through your device's settings (Settings › Google › Ads) or through Google's Ads Settings: <a href="https://adssettings.google.com" target="_blank" rel="noopener">adssettings.google.com</a>.</p>
<h2>Notifications</h2>
<p>With your permission, the App may send you a local notification when your in-game energy has fully recharged. This notification is scheduled entirely on your device and does not involve sending any personal data to us or to any third party. You can disable notifications at any time through your device's system settings.</p>
<h2>Children's privacy</h2>
<p>Wobblebrain is designed to be suitable for a general audience, including children. We do not knowingly collect personal information from anyone, including children under 13 (or the relevant minimum age in your jurisdiction). Advertising shown in the App is served through Google AdMob; if the App is configured or used in a context directed at children, ad requests may be treated as child-directed in accordance with applicable regulations (such as COPPA), which limits the type of ads and data processing that can occur.</p>
<h2>Data sharing and sale</h2>
<p>We do not sell, rent, or share any user data, because we do not collect any user data beyond what is described above (which is handled entirely by Google AdMob for advertising purposes).</p>
""",
  delete_server=False,
  delete_it="""
<p>Wobblebrain <strong>non salva nessun dato sui nostri server</strong>: progressi, punteggi, energia e impostazioni restano solo sul tuo telefono. Per cancellarli non devi chiederci niente:</p>
<ol class="steps">
<li>Apri <strong>Impostazioni</strong> sul telefono Android.</li>
<li>Vai su <strong>App › Wobblebrain › Spazio di archiviazione</strong>.</li>
<li>Tocca <strong>Cancella dati</strong>, oppure disinstalla l'app. Tutti i dati vengono eliminati subito e per sempre.</li>
</ol>
<h3>Dati pubblicitari (Google AdMob)</h3>
<p>I dati trattati da AdMob per mostrare gli annunci sono gestiti da Google. Puoi azzerare o eliminare il tuo ID pubblicitario da <strong>Impostazioni › Google › Annunci</strong>.</p>
""",
  delete_en="""
<p>Wobblebrain <strong>stores no data on our servers</strong>: progress, scores, energy and settings stay only on your phone. You don't need to ask us anything to delete them:</p>
<ol class="steps">
<li>Open <strong>Settings</strong> on your Android phone.</li>
<li>Go to <strong>Apps › Wobblebrain › Storage</strong>.</li>
<li>Tap <strong>Clear data</strong>, or uninstall the app. All data is deleted immediately and permanently.</li>
</ol>
<h3>Advertising data (Google AdMob)</h3>
<p>Data processed by AdMob to serve ads is managed by Google. You can reset or delete your advertising ID in <strong>Settings › Google › Ads</strong>.</p>
""",
  response=("entro 7 giorni", "within 7 days"),
 ),

 dict(
  slug="irreversible", name="Irreversible", icon="irreversible-icon.jpg",
  shots=["irreversible-1.jpg", "irreversible-2.jpg"], status="test",
  group=dict(email="irreversible-app@googlegroups.com", url="https://groups.google.com/g/irreversible-app"),
  package="com.aistudio.donttouchthebutton.kxmpzq",
  play="https://play.google.com/store/apps/details?id=com.aistudio.donttouchthebutton.kxmpzq",
  tagline=("Un bottone. Una pressione ogni 24 ore. Nessun ritorno.", "One button. One press every 24 hours. No way back."),
  intro=("Puoi premere il bottone una volta al giorno. Se lo premi, una frase generata a caso viene scritta per sempre sulla blockchain Solana. Se resisti, i giorni si accumulano. Sta a te.",
         "You can press the button once a day. Press it, and a random phrase is written forever on the Solana blockchain. Resist, and your days add up. Your call."),
  features=([
    "Ogni pressione lascia una traccia permanente e verificabile",
    "Serie di giorni resistiti e cronologia personale",
    "Eventi rari e scelte che parlano di attaccamento, connessione e accettazione",
    "Design minimale, niente distrazioni",
  ], [
    "Every press leaves a permanent, verifiable trace",
    "Streak of days resisted and personal history",
    "Rare events and choices about attachment, connection and acceptance",
    "Minimal design, no distractions",
  ]),
  extra_btns=[(TELEGRAM, "Telegram", "Telegram")],
  demo="irreversible",
  updated=("28 settembre 2026", "September 28, 2026"),
  privacy_it=f"""
<p>Irreversible ("l'app") è sviluppata e gestita da uno sviluppatore indipendente, {DEV}. Questa informativa spiega quali dati raccoglie l'app, perché e come vengono usati.</p>
<h2>Cosa viene raccolto</h2>
<ul>
<li><strong>Identificativo anonimo del dispositivo.</strong> L'app crea un identificativo anonimo e persistente legato al dispositivo (basato sull'Android ID, o generato a caso se questo non è disponibile). Serve solo a tenere il conteggio dei giorni resistiti, il tempo di attesa tra una pressione e l'altra e la tua cronologia nell'app. Non è collegato al tuo nome, alla tua email o ad altri dati personali.</li>
<li><strong>Messaggi di feedback (facoltativi).</strong> Se invii un messaggio dalla sezione "speak", il testo viene salvato e può essere letto dallo sviluppatore. Non devi inserire nessun dato personale.</li>
<li><strong>Token per le notifiche push (facoltativo).</strong> Se autorizzi le notifiche, viene salvato un token di Firebase Cloud Messaging per mandarti notifiche occasionali e non promozionali (per esempio quando si manifesta un evento ritardato). Il token non è collegato a dati personali.</li>
<li><strong>Dati pubblici sulla blockchain.</strong> Quando premi il bottone, una breve frase generata a caso, che non ha niente a che fare con te, viene scritta sulla blockchain pubblica Solana. Per esempio: "Una porta rimasta socchiusa per anni si è chiusa piano." La frase non contiene dati personali né l'identificativo del dispositivo, né altro che possa identificarti. Il tuo identificativo anonimo non viene mai scritto sulla blockchain.</li>
</ul>
<h2>Cosa NON viene raccolto</h2>
<ul>
<li>Nome, email o numero di telefono</li>
<li>Dati sulla posizione</li>
<li>Contatti, foto o altri contenuti del dispositivo</li>
<li>Identificativi pubblicitari, salvo quelli necessari per mostrare gli annunci (vedi sotto)</li>
</ul>
<h2>Servizi di terze parti</h2>
<p>L'app usa questi servizi di terze parti, ognuno con le proprie regole sulla privacy:</p>
<ul>
<li><strong>Google Firebase</strong> (database Firestore, Cloud Messaging): conserva lo stato dell'app in forma anonima e invia le notifiche facoltative.</li>
<li><strong>Google AdMob</strong>: video pubblicitari con premio, facoltativi. AdMob può raccogliere i normali identificativi pubblicitari come descritto nella <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy Policy di Google</a>.</li>
<li><strong>Blockchain Solana (rete pubblica)</strong>: registra in modo permanente le frasi generate. È un registro pubblico e decentralizzato che lo sviluppatore non controlla.</li>
<li><strong>Cloudflare Workers</strong>: ospita la logica del server dell'app.</li>
</ul>
<h2>Conservazione dei dati</h2>
<p>I dati legati all'identificativo anonimo vengono conservati senza scadenza, per mantenere la tua cronologia e i giorni resistiti. Puoi chiederne la cancellazione in qualsiasi momento: la procedura è nella pagina <a href="{{DEL}}">Cancellazione dati</a>.</p>
<h2>Minori</h2>
<p>L'app non è rivolta ai minori di 13 anni e non raccoglie consapevolmente dati personali di minori.</p>
""",
  privacy_en=f"""
<p>Irreversible ("the app") is built and maintained by an independent developer, {DEV}. This policy explains what data the app collects, why, and how it is used.</p>
<h2>What is collected</h2>
<ul>
<li><strong>Anonymous device identifier.</strong> The app generates a persistent, anonymous identifier tied to your device (based on Android ID, with a random fallback if unavailable). This identifier is used solely to track your resistance streak, cooldown timing, and personal history within the app. It is not linked to your name, email, or any other personal information.</li>
<li><strong>Optional feedback messages.</strong> If you choose to send a message via the in-app "speak" feature, that message text is stored and may be read by the developer. You are not required to provide any personal information in this message.</li>
<li><strong>Optional push notification token.</strong> If you grant notification permission, a Firebase Cloud Messaging token is stored to allow the app to send you occasional, non-promotional notifications (e.g. when a delayed event surfaces). This token is not linked to any personal information.</li>
<li><strong>Public blockchain data.</strong> When you press the button, a short, randomly generated phrase (unrelated to you personally) is written to the Solana public blockchain, for example: "A door that had been left ajar for years quietly clicked shut." This phrase contains no personal information, no device identifier, and nothing that could identify you. Your anonymous device identifier is never written to the blockchain.</li>
</ul>
<h2>What is NOT collected</h2>
<ul>
<li>No name, email address, or phone number</li>
<li>No location data</li>
<li>No contacts, photos, or other device content</li>
<li>No advertising identifiers beyond what is required for standard ad serving (see below)</li>
</ul>
<h2>Third-party services</h2>
<p>The app uses the following third-party services, each with their own privacy practices:</p>
<ul>
<li><strong>Google Firebase</strong> (Firestore database, Cloud Messaging): stores anonymous app state and delivers optional notifications.</li>
<li><strong>Google AdMob</strong>: optional rewarded video ads. AdMob may collect standard advertising identifiers as described in <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google's Privacy Policy</a>.</li>
<li><strong>Solana blockchain (public network)</strong>: permanently records generated event phrases. This is a public, decentralized ledger not controlled by the developer.</li>
<li><strong>Cloudflare Workers</strong>: hosts the app's backend logic.</li>
</ul>
<h2>Data retention</h2>
<p>Data tied to your anonymous device identifier is retained indefinitely to preserve your in-app history and streak. You can request deletion at any time; see the <a href="{{DEL}}">Data deletion</a> page.</p>
<h2>Children's privacy</h2>
<p>This app is not directed at children under 13 and does not knowingly collect personal information from children.</p>
""",
  delete_server=True,
  delete_it=f"""
<p>Irreversible conserva sui nostri server alcuni dati legati a un <strong>identificativo anonimo del dispositivo</strong>. Puoi chiederne la cancellazione in uno di questi modi:</p>
<ol class="steps">
<li><strong>Dall'app:</strong> apri la sezione <strong>"speak"</strong> e scrivi che vuoi cancellare i tuoi dati.</li>
<li><strong>Via email</strong> a <a href="mailto:{EMAIL}">{EMAIL}</a> (o con il pulsante qui sotto), indicando il tuo <strong>identificativo anonimo</strong>, che trovi nell'app.</li>
<li><strong>Via Telegram</strong> su <a href="{TELEGRAM}" target="_blank" rel="noopener">t.me/donttouchthebutton</a>, sempre indicando l'identificativo.</li>
</ol>
<h3>Cosa viene cancellato</h3>
<p>Vengono eliminati per sempre tutti i dati legati al tuo identificativo: cronologia delle pressioni, giorni resistiti, scelte, messaggi di feedback inviati e token delle notifiche.</p>
<h3>Cosa non si può cancellare</h3>
<div class="warn">Le frasi già scritte sulla blockchain pubblica Solana non si possono cancellare, perché su una blockchain pubblica i dati sono immutabili. Quelle frasi però non contengono dati personali e non sono collegabili a te.</div>
<h3>Tempi</h3>
<p>Di solito la richiesta viene gestita <strong>entro 7 giorni</strong>.</p>
""",
  delete_en=f"""
<p>Irreversible stores some data on our servers, linked to an <strong>anonymous device identifier</strong>. You can request its deletion in any of these ways:</p>
<ol class="steps">
<li><strong>In the app:</strong> open the <strong>"speak"</strong> section and write that you want your data deleted.</li>
<li><strong>By email</strong> to <a href="mailto:{EMAIL}">{EMAIL}</a> (or with the button below), including your <strong>anonymous identifier</strong>, visible in the app.</li>
<li><strong>On Telegram</strong> at <a href="{TELEGRAM}" target="_blank" rel="noopener">t.me/donttouchthebutton</a>, also including your identifier.</li>
</ol>
<h3>What is deleted</h3>
<p>All data linked to your identifier is permanently deleted: press history, streak, choices, feedback messages sent and notification token.</p>
<h3>What cannot be deleted</h3>
<div class="warn">Phrases already written to the public Solana blockchain cannot be deleted, because data on a public blockchain is immutable. However, those phrases contain no personal information and cannot be linked back to you.</div>
<h3>Timing</h3>
<p>Requests are typically processed <strong>within 7 days</strong>.</p>
""",
  response=("entro 7 giorni", "within 7 days"),
 ),

 dict(
  slug="pixel-fishing", name="Pixel Fishing", icon="pixelfishing-icon.jpg",
  shots=["pixelfishing-1.jpg", "pixelfishing-2.jpg"], status="test",
  package="com.aquascape.pixelfishing",
  demo="pixelfishing",
  play="https://play.google.com/store/apps/details?id=com.aquascape.pixelfishing",
  group=dict(email="pixelfishing@googlegroups.com", url="https://groups.google.com/g/pixelfishing"),
  tagline=("Pesca in pixel art retrò, per staccare ovunque tu sia.", "Retro pixel-art fishing, to unwind wherever you are."),
  intro=("Prepara la canna, esplora gli specchi d'acqua e metti alla prova i riflessi per catturare pesci unici, guadagnare monete e completare la collezione.",
         "Grab your rod, explore the waters and test your reflexes to catch unique fish, earn coins and complete your collection."),
  features=([
    "<strong>Pixel art retrò</strong> curata nei dettagli e piena di nostalgia",
    "<strong>Comandi touch intuitivi</strong>, adatti a tutte le età",
    "<strong>Pesci comuni, rari e leggendari</strong> con pesi e valori diversi",
    "<strong>Meteo dinamico</strong>, dal cielo sereno ai temporali, con effetti sonori",
    "<strong>100% offline</strong>, nessuna connessione obbligatoria",
    "<strong>Nessuna pubblicità invasiva</strong>",
  ], [
    "<strong>Retro pixel art</strong> full of detail and nostalgia",
    "<strong>Intuitive touch controls</strong> for players of all ages",
    "<strong>Common, rare and legendary fish</strong> with different weights and values",
    "<strong>Dynamic weather</strong>, from clear skies to thunderstorms, with immersive sound",
    "<strong>100% offline</strong>, no internet required",
    "<strong>No intrusive ads</strong>",
  ]),
  updated=("26 settembre 2026", "September 26, 2026"),
  privacy_it=f"""
<p>Questa informativa riguarda l'uso del gioco <strong>Pixel Fishing</strong>, sviluppato e pubblicato da <strong>{DEV}</strong> ("noi"). Vogliamo offrirti un'esperienza trasparente, sicura e rispettosa della privacy.</p>
<h2>1. Raccolta e conservazione dei dati</h2>
<p><strong>Pixel Fishing NON raccoglie, conserva, trasmette né vende dati personali</strong> (come nome, email, numero di telefono, rubrica, indirizzo o posizione precisa).</p>
<h3>A. Dati di gioco salvati sul dispositivo</h3>
<ul>
<li>Tutti i progressi (monete, livelli di canna e mulinello, pesci catturati e voci sbloccate dell'enciclopedia) sono salvati <strong>solo sul tuo dispositivo</strong>, nella memoria locale dell'app (<code>PlayerPrefs</code>).</li>
<li>Nessun progresso o dato di utilizzo viene inviato o sincronizzato su server esterni o nel cloud.</li>
</ul>
<h3>B. Autorizzazioni del dispositivo</h3>
<ul>
<li><strong>Vibrazione (<code>android.permission.VIBRATE</code>):</strong> serve solo a dare un feedback tattile durante la pesca, per esempio quando un pesce abbocca o la lenza è troppo tesa. Nessun dato sulla vibrazione viene registrato o trasmesso.</li>
</ul>
<h2>2. Servizi di terze parti e motore di gioco</h2>
<p>Pixel Fishing è realizzato con il motore <strong>Unity</strong>. Unity Technologies può raccogliere dati tecnici di diagnostica non identificativi, strettamente necessari per far funzionare il motore: versione del sistema operativo, caratteristiche hardware, risoluzione dello schermo e report di crash.</p>
<p>Per saperne di più: <a href="https://unity.com/legal/privacy-policy" target="_blank" rel="noopener">Privacy Policy di Unity</a>.</p>
<h2>3. Pubblicità e statistiche</h2>
<p>Al momento Pixel Fishing <strong>non contiene reti pubblicitarie di terze parti né strumenti di tracciamento o statistiche sugli utenti</strong>. Se in futuro verranno aggiunte reti pubblicitarie (come Google AdMob), questa informativa verrà aggiornata subito, nel rispetto delle norme per sviluppatori di Google Play.</p>
<h2>4. Minori (COPPA e GDPR)</h2>
<p>Pixel Fishing è adatto alle famiglie e pensato per un pubblico generale. Poiché il gioco non raccoglie dati personali di nessun utente, protegge per sua natura la privacy dei minori ed è conforme alla COPPA (Children's Online Privacy Protection Act) e al GDPR.</p>
<h2>5. I tuoi diritti e la cancellazione dei dati</h2>
<p>Tutti i salvataggi sono sul tuo dispositivo, quindi hai sempre il pieno controllo dei tuoi dati. Trovi la procedura nella pagina <a href="{{DEL}}">Cancellazione dati</a>.</p>
""",
  privacy_en=f"""
<p>This Privacy Policy governs your use of the mobile game <strong>Pixel Fishing</strong>, developed and published by <strong>{DEV}</strong> ("we", "us", or "our"). We are dedicated to ensuring a transparent, secure, and privacy-respecting experience for all players.</p>
<h2>1. Information collection and storage</h2>
<p><strong>Pixel Fishing does NOT collect, store, transmit, or sell any Personally Identifiable Information (PII)</strong> (such as real names, email addresses, phone numbers, contact lists, physical addresses, or precise location data).</p>
<h3>A. Local gameplay data and storage</h3>
<ul>
<li>All gameplay progress (collected coins, rod and reel upgrade levels, fish catch records, and unlocked encyclopedia entries) is stored <strong>locally on your device</strong> using local application storage (<code>PlayerPrefs</code>).</li>
<li>No game progress or telemetry is sent or synchronized to any external or cloud servers.</li>
</ul>
<h3>B. Device permissions</h3>
<ul>
<li><strong>Vibration / haptic feedback (<code>android.permission.VIBRATE</code>):</strong> used solely to provide tactile sensations during fishing gameplay (such as fish bites and line tension warnings). No vibration data is recorded or transmitted.</li>
</ul>
<h2>2. Third-party services and game engine</h2>
<p>Pixel Fishing is built using the <strong>Unity</strong> game engine. Unity Technologies may collect non-identifiable technical diagnostic data strictly required to run the game engine (e.g., operating system version, hardware specifications, screen resolution, and crash logs).</p>
<p>For more details, please review the <a href="https://unity.com/legal/privacy-policy" target="_blank" rel="noopener">Unity Privacy Policy</a>.</p>
<h2>3. Advertising and analytics</h2>
<p>Pixel Fishing currently contains <strong>no third-party advertising networks and no user tracking analytics</strong>. If advertising networks (such as Google AdMob) are integrated in future updates, this policy will be promptly updated in full compliance with Google Play Developer Policies.</p>
<h2>4. Children's privacy (COPPA and GDPR)</h2>
<p>Pixel Fishing is family-friendly and designed for a general audience. Because the game does not collect personal data from any user, it inherently protects children's privacy and complies with the Children's Online Privacy Protection Act (COPPA) and the General Data Protection Regulation (GDPR).</p>
<h2>5. Your rights and data deletion</h2>
<p>Because all save data is stored locally on your device, you have complete control over your data at all times. See the <a href="{{DEL}}">Data deletion</a> page.</p>
""",
  delete_server=False,
  delete_it="""
<p>Pixel Fishing funziona offline e <strong>non invia nessun dato ai nostri server</strong>: progressi, monete, potenziamenti e collezione restano solo sul tuo telefono. Per cancellarli:</p>
<ol class="steps">
<li>Apri <strong>Impostazioni</strong> sul telefono Android.</li>
<li>Vai su <strong>App › Pixel Fishing › Spazio di archiviazione</strong>.</li>
<li>Tocca <strong>Cancella dati</strong>, oppure disinstalla l'app. Tutti i progressi, i record e le impostazioni vengono eliminati per sempre.</li>
</ol>
""",
  delete_en="""
<p>Pixel Fishing works offline and <strong>sends no data to our servers</strong>: progress, coins, upgrades and collection stay only on your phone. To delete them:</p>
<ol class="steps">
<li>Open <strong>Settings</strong> on your Android phone.</li>
<li>Go to <strong>Apps › Pixel Fishing › Storage</strong>.</li>
<li>Tap <strong>Clear storage / Clear data</strong>, or uninstall the app. All progress, records and settings are permanently deleted.</li>
</ol>
""",
  response=("entro 48 ore", "within 48 hours"),
 ),

 dict(
  slug="nudge", name="Nudge", icon="nudge-icon.png",
  shots=["nudge-1.jpg", "nudge-2.jpg", "nudge-3.jpg"], status="test",
  package="com.aquascape.nudge",
  play="https://play.google.com/store/apps/details?id=com.aquascape.nudge",
  group=dict(email="nudge-app@googlegroups.com", url="https://groups.google.com/g/nudge-app"),
  tagline=("Sentiti vicino alla persona che ami, ovunque ti trovi.", "Feel close to the one you love, wherever you are."),
  intro=("Nudge è l'app intima ed esclusiva per coppie che trasforma il tocco a distanza in un'esperienza sensoriale reale. Niente chat caotiche o distrazioni dei social: solo uno spazio privato e protetto riservato a voi due. Accoppia il tuo telefono con quello del partner in pochi secondi e inizia a scambiare tocchi invisibili ma indimenticabili.",
         "Nudge is the intimate, exclusive app for couples that turns a long-distance touch into a real sensory experience. No chaotic chats, no social media distractions: just a private, protected space for the two of you. Pair your phone with your partner's in seconds and start sharing invisible but unforgettable touches."),
  features=([
    "<strong>⚡ Il Brivido</strong>: componi un ritmo di vibrazione sul pad tattile. Il telefono del partner vibra con il ritmo esatto del tuo tocco.",
    "<strong>🪰 La Mosca</strong>: fai atterrare una mosca birichina sullo schermo del partner, che ronza finché non la schiaccia con il dito.",
    "<strong>🎨 Lo Schizzo</strong>: lancia una macchia di fango o vernice fluo sullo schermo dell'altro, che dovrà pulirla strofinando col dito.",
    "<strong>💨 Il Soffio</strong>: una carezza di luce e una vibrazione delicata per dire \"ti sto pensando\" senza parole.",
    "<strong>✨ Glow Canvas al neon</strong>: disegna in tempo reale su una tela luminosa ed effimera. Un cuore, una parola, un segno che brilla e poi svanisce.",
    "<strong>💬 Reazioni immediate</strong>: \"Ti penso\", \"Arrivo\", \"Bacio\", che compaiono subito sul display del partner.",
    "<strong>🔒 Privacy al primo posto</strong>: connessione 1 a 1 con codice di accoppiamento privato, nessuna condivisione di dati personali con terzi, interazioni effimere.",
  ], [
    "<strong>⚡ The Thrill</strong>: compose a vibration rhythm on the touch pad. Your partner's phone vibrates with the exact rhythm of your touch.",
    "<strong>🪰 The Fly</strong>: land a cheeky fly on your partner's screen; it buzzes around until they squash it with a finger.",
    "<strong>🎨 The Splash</strong>: throw a splat of mud or neon paint on the other's screen; they'll have to rub it clean.",
    "<strong>💨 The Breath</strong>: a soft glow and a gentle vibration to say \"thinking of you\" without words.",
    "<strong>✨ Neon Glow Canvas</strong>: draw in real time on a glowing, ephemeral canvas. A heart, a word, a mark that shines and then fades.",
    "<strong>💬 Instant reactions</strong>: \"Thinking of you\", \"On my way\", \"Kiss\", shown right away on your partner's display.",
    "<strong>🔒 Privacy first</strong>: 1-to-1 connection with a private pairing code, no personal data shared with third parties, ephemeral interactions.",
  ]),
  updated=("28 settembre 2026", "September 28, 2026"),
  privacy_it=f"""
<h2>1. Introduzione e principi di riservatezza</h2>
<p>Questa informativa descrive come l'applicazione <strong>Nudge</strong>, sviluppata da {DEV}, raccoglie, usa e protegge le informazioni degli utenti.</p>
<p>Nudge è pensata per una connessione sensoriale ed effimera tra coppie. Non chiediamo dati sensibili, non tracciamo la tua posizione, non ascoltiamo l'audio, non memorizziamo foto personali e non vendiamo mai dati a terzi per scopi pubblicitari.</p>
<h2>2. Dati raccolti e finalità</h2>
<p>Per far funzionare le micro-interazioni in tempo reale e consegnare le notifiche, l'app raccoglie solo questi dati:</p>
<ul>
<li><strong>Identificativo utente anonimo (User ID).</strong> All'apertura dell'app viene generato un identificativo casuale tramite Firebase Authentication. Serve a mantenere il collegamento esclusivo tra i due partner tramite il codice di accoppiamento.</li>
<li><strong>Nome o nickname (facoltativo).</strong> Il nome che scegli quando inviti il partner, visibile solo a lui o a lei. Puoi usare un soprannome qualsiasi.</li>
<li><strong>Codice di accoppiamento.</strong> Il codice privato che collega i due telefoni.</li>
<li><strong>Token del dispositivo (FCM Registration Token).</strong> Un token tecnico fornito da Firebase Cloud Messaging, necessario per consegnare notifiche ed effetti sensoriali (Brivido, Mosca, Schizzo, Soffio, Glow Canvas) al telefono del partner anche quando l'app è in background.</li>
<li><strong>Dati di interazione effimeri.</strong> Le interazioni inviate (ritmi di vibrazione, coordinate dei tratti sul canvas, micro-reazioni) transitano sui server di Google Cloud Firestore per sincronizzare i due dispositivi in tempo reale. Sono pensate per essere effimere.</li>
</ul>
<h2>3. Autorizzazioni del dispositivo</h2>
<ul>
<li><strong>Vibrazione</strong>: per riprodurre il Brivido e il Soffio inviati dal partner.</li>
<li><strong>Notifiche e servizio in background</strong>: Nudge resta in ascolto con una notifica discreta, così i trilli arrivano subito anche a schermo spento.</li>
<li><strong>Visualizzazione sopra altre app</strong> (facoltativa): per mostrare la Mosca e lo Schizzo anche quando l'app è chiusa. Non viene mai usata per leggere cosa c'è sullo schermo.</li>
</ul>
<h2>4. Sicurezza e crittografia</h2>
<p>Tutte le comunicazioni tra l'app e i server avvengono tramite protocolli cifrati HTTPS/TLS. I dati sono custoditi sull'infrastruttura di Google Firebase / Google Cloud Platform, conforme ai principali standard di sicurezza (ISO 27001, SOC 1/2/3) e al GDPR.</p>
<h2>5. Fornitori di servizi terzi</h2>
<p>L'app usa servizi di Google LLC:</p>
<ul>
<li><strong>Google Play Services</strong>: distribuzione e servizi di base Android.</li>
<li><strong>Google Firebase</strong> (Authentication, Cloud Firestore, Cloud Messaging): accoppiamento sicuro e consegna istantanea delle notifiche. <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener">Privacy e sicurezza di Firebase</a></li>
</ul>
<h2>6. Eliminazione dei dati</h2>
<p>Puoi chiedere in qualsiasi momento la cancellazione totale e definitiva dei dati associati al tuo dispositivo. La procedura è nella pagina <a href="{{DEL}}">Cancellazione dati</a>.</p>
<h2>7. Minori</h2>
<p>L'app non è rivolta ai minori di 13 anni e non raccoglie consapevolmente dati di minori.</p>
""",
  privacy_en=f"""
<h2>1. Introduction and privacy principles</h2>
<p>This policy describes how the <strong>Nudge</strong> app, developed by {DEV}, collects, uses and protects your information.</p>
<p>Nudge is designed for ephemeral, sensory connection between couples. We do not ask for sensitive data, track your location, record audio or store personal photos, and we never sell data to third parties for advertising.</p>
<h2>2. Data we collect and why</h2>
<p>To run real-time micro-interactions and deliver notifications, the app collects only the following:</p>
<ul>
<li><strong>Anonymous user ID.</strong> A random identifier generated through Firebase Authentication when you open the app, used to keep the exclusive link between the two partners via the pairing code.</li>
<li><strong>Name or nickname (optional).</strong> The name you choose when inviting your partner, visible only to them. Any nickname will do.</li>
<li><strong>Pairing code.</strong> The private code that links the two phones.</li>
<li><strong>Device token (FCM registration token).</strong> A technical token from Firebase Cloud Messaging, needed to deliver notifications and sensory effects (Thrill, Fly, Splash, Breath, Glow Canvas) to your partner's phone even when the app is in the background.</li>
<li><strong>Ephemeral interaction data.</strong> The interactions you send (vibration rhythms, canvas stroke coordinates, micro-reactions) pass through Google Cloud Firestore to sync both devices in real time. They are designed to be ephemeral.</li>
</ul>
<h2>3. Device permissions</h2>
<ul>
<li><strong>Vibration</strong>: to play the Thrill and Breath sent by your partner.</li>
<li><strong>Notifications and background service</strong>: Nudge keeps listening with a discreet notification so nudges arrive instantly, even with the screen off.</li>
<li><strong>Display over other apps</strong> (optional): to show the Fly and the Splash even when the app is closed. It is never used to read what is on your screen.</li>
</ul>
<h2>4. Security and encryption</h2>
<p>All communication between the app and the servers uses encrypted HTTPS/TLS. Data is stored on Google Firebase / Google Cloud Platform infrastructure, which complies with major security standards (ISO 27001, SOC 1/2/3) and the GDPR.</p>
<h2>5. Third-party service providers</h2>
<p>The app uses services from Google LLC:</p>
<ul>
<li><strong>Google Play Services</strong>: distribution and core Android services.</li>
<li><strong>Google Firebase</strong> (Authentication, Cloud Firestore, Cloud Messaging): secure pairing and instant notification delivery. <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener">Firebase privacy and security</a></li>
</ul>
<h2>6. Data deletion</h2>
<p>You can request the complete, permanent deletion of the data associated with your device at any time. See the <a href="{{DEL}}">Data deletion</a> page.</p>
<h2>7. Children</h2>
<p>The app is not directed at children under 13 and does not knowingly collect data from children.</p>
""",
  delete_server=True,
  delete_subject="Richiesta Cancellazione Dati - Nudge",
  delete_it=f"""
<p>Nudge conserva su Firebase alcuni dati tecnici legati al tuo dispositivo: identificativo anonimo, nickname, codice di accoppiamento, token delle notifiche e interazioni in transito. Puoi chiederne la cancellazione totale e definitiva in qualsiasi momento, in due modi.</p>
<ol class="steps">
<li><strong>Dall'app:</strong> apri Nudge, vai in <strong>Impostazioni / Connessione</strong> e tocca <strong>"Scollega Coppia"</strong>. I due telefoni vengono separati subito e il collegamento viene rimosso dai server.</li>
<li><strong>Via email</strong> a <a href="mailto:{EMAIL}">{EMAIL}</a> (o con il pulsante qui sotto), con oggetto <code>Richiesta Cancellazione Dati - Nudge</code>. Indica il tuo <strong>codice coppia</strong> o l'<strong>ID dispositivo</strong> che trovi nelle info dell'app.</li>
</ol>
<h3>Cosa viene cancellato</h3>
<p>Identificativo anonimo, nickname, codice di accoppiamento, token delle notifiche ed eventuali interazioni ancora presenti nel database Firebase.</p>
<h3>Tempi</h3>
<p>I dati vengono eliminati in modo permanente <strong>entro 7 giorni lavorativi</strong> dalla ricezione della richiesta.</p>
""",
  delete_en=f"""
<p>Nudge stores some technical data linked to your device on Firebase: anonymous ID, nickname, pairing code, notification token and interactions in transit. You can request their complete, permanent deletion at any time, in two ways.</p>
<ol class="steps">
<li><strong>In the app:</strong> open Nudge, go to <strong>Settings / Connection</strong> and tap <strong>"Unpair"</strong>. The two phones are disconnected immediately and the link is removed from the servers.</li>
<li><strong>By email</strong> to <a href="mailto:{EMAIL}">{EMAIL}</a> (or with the button below), with the subject <code>Data Deletion Request - Nudge</code>. Include your <strong>couple code</strong> or the <strong>device ID</strong> shown in the app info.</li>
</ol>
<h3>What is deleted</h3>
<p>Anonymous ID, nickname, pairing code, notification token and any interactions still in the Firebase database.</p>
<h3>Timing</h3>
<p>Data is permanently deleted <strong>within 7 business days</strong> of receiving the request.</p>
""",
  response=("entro 7 giorni lavorativi", "within 7 business days"),
 ),
]


# ------------------------------------------------------------------ TEMPLATES
def head(title, desc, prefix):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="icon" href="favicon.png">
{FONTS}
<link rel="stylesheet" href="style.css">
</head>
<body data-lang="en">
"""


GOATCOUNTER = "aquadev"  # codice scelto su goatcounter.com -> https://aquadev.goatcounter.com


def foot_script(prefix):
    return (f'<script data-goatcounter="https://{GOATCOUNTER}.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>\n'
            f'<script src="site.js"></script>\n'
            '</body>\n</html>\n')


def badge(app):
    if app["status"] == "live":
        return bi("Su Google Play", "On Google Play", "span").replace('class="it"', 'class="badge live it"').replace('class="en"', 'class="badge live en"')
    return bi("Test chiuso", "Closed testing", "span").replace('class="it"', 'class="badge test it"').replace('class="en"', 'class="badge test en"')


def sidebar(app, active):
    P = ""
    items = [
        (f"{app['slug']}.html", "Panoramica", "Overview", "overview"),
        (f"{app['slug']}-privacy.html", "Privacy Policy", "Privacy Policy", "privacy"),
        (f"{app['slug']}-delete-data.html", "Cancellazione dati", "Data deletion", "delete"),
        (f"{app['slug']}-support.html", "Supporto", "Support", "support"),
    ]
    nav = "".join(
        f'<a href="{h}" class="{"active" if k == active else ""}">{bi(it, en)}</a>' for h, it, en, k in items
    )
    others = "".join(
        f'<a href="{o["slug"]}.html"><img src="{o["icon"]}" alt="">{o["name"]}</a>'
        for o in APPS if o["slug"] != app["slug"]
    )
    return f"""<aside class="side">
  <a href="index.html" class="brand"><img src="logo.png" alt="aquadev creations"></a>
  <div class="top-m">
    <a href="{app['slug']}.html" class="app-id" style="text-decoration:none;color:inherit"><img src="{app['icon']}" alt=""><div><b>{app['name']}</b>{badge(app)}</div></a>
    <button class="lang m-only">EN</button>
  </div>
  <div><div class="label">{bi("Menu", "Menu")}</div><nav>{nav}</nav></div>
  <div class="others"><div class="label">{bi("Altre app", "Other apps")}</div><nav>{others}<a href="index.html">← Home</a></nav></div>
  <div class="foot"><span class="copy">© <span class="year"></span> aquadev creations<span class="visits" hidden><br>{bi("Visite", "Visits")}: <strong class="visits-n"></strong></span></span><button class="lang">EN</button></div>
</aside>"""


def page(app, active, title, desc, main_html):
    return (head(title, desc, "") + '<div class="layout">\n' + sidebar(app, active)
            + f'\n<main class="main"><div class="inner">\n{main_html}\n</div></main>\n</div>\n' + foot_script(""))


def demo_block(app):
    d = app.get("demo")
    if not d:
        return ""
    return (f'<section class="demo-wrap">'
            f'<h2>{bi("Provala qui", "Try it here")}</h2>'
            + (bi("Il gioco vero, direttamente nel browser: niente da installare.", "The real game, right in your browser: nothing to install.", "p") if d == "pixelfishing" else bi("Una demo fedele della schermata principale dell'app, direttamente nel browser.", "A faithful demo of the app's main screen, right in your browser.", "p")).replace('<p class="it">','<p class="it muted">').replace('<p class="en">','<p class="en muted">')
            + f'<div class="demo-stage"><div id="demo-{d}"></div></div>'
            f'<script src="demo-{d}.js" defer></script></section>')


def overview(app):
    feats_it = "".join(f"<li>{f}</li>" for f in app["features"][0])
    feats_en = "".join(f"<li>{f}</li>" for f in app["features"][1])
    btns = ""
    if app.get("group"):
        pass  # i pulsanti sono nei passaggi per i tester, sotto
    elif app["play"] and app["status"] == "live":
        btns += f'<a class="btn primary" href="{app["play"]}" target="_blank" rel="noopener">▶ {bi("Scarica da Google Play", "Get it on Google Play")}</a>'
    else:
        btns += f'<a class="btn primary" href="{mailto("Voglio provare " + app["name"] + " / I want to test " + app["name"])}">{bi("Diventa tester", "Become a tester")}</a>'
    for href, it, en in app.get("extra_btns", []):
        btns += f'<a class="btn" href="{href}" target="_blank" rel="noopener">{bi(it, en)}</a>'
    test_note = ""
    if app.get("group"):
        g = app["group"]
        test_note = f"""<div class="box">
{bi("<strong>L'app è in test chiuso.</strong> Per provarla bastano due passaggi, con lo stesso account Google che usi sul Play Store:", "<strong>The app is in closed testing.</strong> Two steps to try it, using the same Google account you use on the Play Store:", "p")}
<ol class="steps">
<li>{bi("Unisciti al gruppo dei tester", "Join the testers group")} <span class="muted">({g['email']})</span><br><a class="btn primary" style="margin-top:8px" href="{g['url']}" target="_blank" rel="noopener">{bi("Unisciti al gruppo Google", "Join the Google Group")}</a></li>
<li>{bi("Poi apri la pagina Google Play e installa l'app", "Then open the Google Play page and install the app")}<br><a class="btn" style="margin-top:8px" href="{app['play']}" target="_blank" rel="noopener">▶ {bi("Apri su Google Play", "Open on Google Play")}</a></li>
</ol>
{bi("Se Google Play dice che l'app non è disponibile, aspetta qualche minuto dopo esserti iscritto al gruppo e riprova.", "If Google Play says the app isn't available, wait a few minutes after joining the group and try again.", "p").replace('<p class="it">','<p class="it muted" style="margin:0;font-size:.9rem">').replace('<p class="en">','<p class="en muted" style="margin:0;font-size:.9rem">')}
</div>"""
    elif app["status"] == "test":
        test_note = bi("Il gioco è in test chiuso su Google Play. Scrivici per entrare tra i tester e provarlo in anteprima.",
                       "The game is in closed testing on Google Play. Write to us to join the testers and try it early.", "p")
        test_note = test_note.replace('<p class="it">', '<p class="it muted" style="margin-bottom:10px">').replace('<p class="en">', '<p class="en muted" style="margin-bottom:10px">')
    shots = "".join(f'<img src="{s}" alt="{app["name"]} screenshot">' for s in app["shots"])
    return f"""
<div class="ov-head"><img src="{app['icon']}" alt="{app['name']}"><div><h1>{app['name']}</h1>{badge(app)}</div></div>
{bi(app['tagline'][0], app['tagline'][1], 'p').replace('<p class="it">','<p class="lead it">').replace('<p class="en">','<p class="lead en">')}
{bi(app['intro'][0], app['intro'][1], 'p').replace('<p class="it">','<p class="muted it">').replace('<p class="en">','<p class="muted en">')}
<ul class="feat it">{feats_it}</ul><ul class="feat en">{feats_en}</ul>
{test_note}
<div class="btns">{btns}</div>
{demo_block(app)}
<div class="shots">{shots}</div>
"""


def meta_box(app, lang):
    L = lang == "it"
    rows = [
        ("App", app["name"]),
        ("Package", f"<code>{app['package']}</code>"),
        ("Sviluppatore" if L else "Developer", DEV),
        ("Contatti" if L else "Contact", f'<a href="mailto:{EMAIL}">{EMAIL}</a>'),
    ]
    return '<div class="meta">' + "<br>".join(f"<strong>{k}:</strong> {v}" for k, v in rows) + "</div>"


def privacy(app):
    app = dict(app, privacy_it=app['privacy_it'].replace('{DEL}', app['slug'] + '-delete-data.html'), privacy_en=app['privacy_en'].replace('{DEL}', app['slug'] + '-delete-data.html'))
    common_it = f"""
<h2>I tuoi diritti (GDPR)</h2>
<p>In base al Regolamento UE 2016/679 puoi chiedere di accedere ai tuoi dati, di correggerli o cancellarli, di limitarne il trattamento, di opporti al trattamento e di riceverli in un formato portabile. Puoi anche presentare reclamo al <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">Garante per la protezione dei dati personali</a>.</p>
<h2>Modifiche a questa informativa</h2>
<p>Potremmo aggiornare questa informativa, per esempio se cambiano le funzioni dell'app o le norme. Le modifiche vengono pubblicate su questa pagina con la nuova data di aggiornamento.</p>
<h2>Contatti</h2>
<p>Per domande su questa informativa: <a href="mailto:{EMAIL}">{EMAIL}</a></p>"""
    common_en = f"""
<h2>Your rights (GDPR)</h2>
<p>Under EU Regulation 2016/679 you can ask to access, correct or delete your data, restrict or object to its processing, and receive it in a portable format. You can also lodge a complaint with your data protection authority (in Italy, the <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">Garante per la protezione dei dati personali</a>).</p>
<h2>Changes to this policy</h2>
<p>We may update this policy from time to time, for example to reflect changes in the app's features or in applicable law. Any changes will be posted on this page with an updated date.</p>
<h2>Contact</h2>
<p>For any questions about this policy: <a href="mailto:{EMAIL}">{EMAIL}</a></p>"""
    body = f"""<article class="doc">
<div class="it"><h1>Privacy Policy — {app['name']}</h1><p class="updated">Ultimo aggiornamento: {app['updated'][0]}</p>{meta_box(app,'it')}{app['privacy_it']}{common_it}</div>
<div class="en"><h1>Privacy Policy — {app['name']}</h1><p class="updated">Last updated: {app['updated'][1]}</p>{meta_box(app,'en')}{app['privacy_en']}{common_en}</div>
</article>"""
    return page(app, "privacy", f"Privacy Policy — {app['name']}", f"Privacy policy of {app['name']} by {DEV}.", body)


def delete(app):
    subj = f"Data Deletion Request - {app['name']}"
    body_mail = (f"App: {app['name']}\nPackage: {app['package']}\n"
                 + ("Device ID / Identificativo: \n" if app["delete_server"] else "")
                 + "\nI request the deletion of all data associated with my use of the app.\n"
                 "Chiedo la cancellazione di tutti i dati associati al mio utilizzo dell'app.\n")
    btn = contact_btns(subj, body_mail, "Invia richiesta con Gmail", "Send request with Gmail")
    req_it = f"""<div class="box"><h3 style="margin-top:0">Richiesta formale</h3>
<p>Per qualsiasi domanda sui tuoi dati, o per una richiesta formale di cancellazione, scrivi a <a href="mailto:{EMAIL}">{EMAIL}</a> con oggetto <code>{subj}</code>. Rispondiamo {app['response'][0]}.</p>{btn}</div>"""
    req_en = f"""<div class="box"><h3 style="margin-top:0">Formal request</h3>
<p>For any question about your data, or to submit a formal deletion request, email <a href="mailto:{EMAIL}">{EMAIL}</a> with the subject <code>{subj}</code>. We respond {app['response'][1]}.</p>{btn}</div>"""
    body = f"""<article class="doc">
<div class="it"><h1>Cancellazione dei dati — {app['name']}</h1><p class="updated">App <strong>{app['name']}</strong> dello sviluppatore <strong>{DEV}</strong> su Google Play</p>{app['delete_it']}{req_it}</div>
<div class="en"><h1>Data deletion — {app['name']}</h1><p class="updated">App <strong>{app['name']}</strong> by developer <strong>{DEV}</strong> on Google Play</p>{app['delete_en']}{req_en}</div>
</article>"""
    return page(app, "delete", f"Data deletion — {app['name']}", f"How to delete your data for {app['name']} by {DEV}.", body)


def support(app):
    subj = f"Supporto {app['name']} / {app['name']} support"
    body_mail = f"App: {app['name']}\nTelefono / Phone: \nVersione Android / Android version: \n\nProblema / Issue:\n"
    tg = ""
    if app.get("extra_btns"):
        tg_it = f'<p>Puoi scriverci anche sul canale <a href="{TELEGRAM}" target="_blank" rel="noopener">Telegram</a> o dalla sezione <strong>"speak"</strong> nell\'app.</p>'
        tg_en = f'<p>You can also reach us on the <a href="{TELEGRAM}" target="_blank" rel="noopener">Telegram</a> channel or through the in-app <strong>"speak"</strong> section.</p>'
        tg = bi(tg_it, tg_en, "div")
    body = f"""<article class="doc">
<h1>{bi("Supporto", "Support")} — {app['name']}</h1>
{bi("Problemi, domande o idee? Scrivici, rispondiamo di solito entro 48 ore.", "Problems, questions or ideas? Write to us, we usually reply within 48 hours.", "p").replace('<p class="it">','<p class="updated it">').replace('<p class="en">','<p class="updated en">')}
<div class="box"><p style="margin-bottom:4px" class="muted">Email</p>
<p class="email-big"><a href="mailto:{EMAIL}">{EMAIL}</a></p>
{contact_btns(subj, body_mail)}
</div>
{tg}
<h2>{bi("Cosa scrivere", "What to include")}</h2>
<ul class="it"><li>il modello del telefono e la versione di Android</li><li>cosa stavi facendo quando è successo il problema</li><li>se puoi, uno screenshot</li></ul>
<ul class="en"><li>your phone model and Android version</li><li>what you were doing when the problem happened</li><li>a screenshot, if you can</li></ul>
</article>"""
    return page(app, "support", f"Support — {app['name']}", f"Support for {app['name']} by {DEV}.", body)


def home():
    cards = ""
    for a in APPS:
        cards += f"""<a class="app-card" href="{a['slug']}.html">
  <div class="cover">{f'<img src="{a["shots"][0]}" alt="">' if a["shots"] else f'<div class="cover-icon" style="background:{a.get("cover_bg","#eef3f2")}"><img src="{a["icon"]}" alt=""></div>'}</div>
  <div class="body">
    <div class="row"><img src="{a['icon']}" alt=""><div><h2>{a['name']}</h2>{badge(a)}</div></div>
    {bi(a['tagline'][0], a['tagline'][1], 'p')}
    <span class="more">{bi("Scopri di più →", "Learn more →")}</span>
  </div>
</a>"""
    links = " · ".join(f'<a href="{a["slug"]}-privacy.html">{a["name"]}</a>' for a in APPS)
    return (head("aquadev creations", "aquadev creations — Android games and apps: Wobblebrain, Irreversible, Pixel Fishing.", "")
            + f"""<div class="topbar"><button class="lang">EN</button></div>
<section class="hero">
  <div class="hero-video"><video src="aquadev-intro.mp4" autoplay muted playsinline preload="auto" onerror="this.parentNode.classList.add('fallback');this.outerHTML='&lt;img src=&quot;logo.png&quot; alt=&quot;aquadev creations&quot;&gt;'"></video></div>
  {bi("Giochi e app per Android, fatti con cura da uno sviluppatore indipendente.", "Android games and apps, lovingly made by an independent developer.", "p")}
</section>
<section class="apps">{cards}</section>
<footer class="home-foot">
  <p style="margin-bottom:6px"><strong>Privacy Policy:</strong> {links}</p>
  <p style="margin-bottom:6px"><a href="mailto:{EMAIL}">{EMAIL}</a></p>
  <p style="margin-bottom:6px;font-size:.8rem">{bi("Il sito conta le visite in forma anonima con GoatCounter, senza cookie e senza dati personali.", "This site counts visits anonymously with GoatCounter, with no cookies and no personal data.")}</p>
  <p class="visits" hidden style="margin-bottom:6px">{bi("Visite", "Visits")}: <strong class="visits-n"></strong></p>
  © <span class="year"></span> aquadev creations · {bi("Android e Google Play sono marchi di Google LLC.", "Android and Google Play are trademarks of Google LLC.")}
</footer>
""" + foot_script(""))


def write(path, content):
    full = os.path.join(ROOT, path)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)
    print("✓", path)


if __name__ == "__main__":
    write("index.html", home())
    for a in APPS:
        write(f"{a['slug']}.html", page(a, "overview", f"{a['name']} — aquadev creations", f"{a['name']}: {a['tagline'][1]}", overview(a)))
        write(f"{a['slug']}-privacy.html", privacy(a))
        write(f"{a['slug']}-delete-data.html", delete(a))
        write(f"{a['slug']}-support.html", support(a))
