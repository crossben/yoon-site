import type { Content } from "./types";
import { version } from "./facts";

// Copie française — relue pour être du français naturel, pas une traduction mot à
// mot. Les termes techniques (Idempotency-Key, payment.succeeded, webhook…) restent
// en anglais dans le code et les noms d'API. Chaque phrase factuelle renvoie à
// content/facts.ts. (Le propriétaire relit cette copie avant la mise en ligne —
// PLAN.md §10.)

export const fr: Content = {
  lang: "fr",
  otherLang: { href: "/", label: "English" },
  meta: {
    title: "Yoon — une seule API pour les paiements africains",
    description:
      "Yoon est une passerelle de paiement auto-hébergée et open source : une seule API devant PayDunya, DexPay, NabooPay, CinetPay, Wave, Stripe et PI-SPI, avec routage, webhooks vérifiés, idempotence, grand livre et réconciliation.",
  },
  header: {
    skipToContent: "Aller au contenu",
    nav: {
      how: "Fonctionnement",
      guarantees: "Garanties",
      providers: "Fournisseurs",
      code: "Votre code",
      api: "API",
      demo: "Démo",
      run: "Installer",
      pispi: "PI-SPI",
      docs: "Docs",
    },
    themeToggle: { toLight: "Passer en thème clair", toDark: "Passer en thème sombre" },
    homeAria: "Yoon — accueil",
  },
  hero: {
    headline: "Une seule API pour les paiements africains.",
    subline:
      "Une passerelle auto-hébergée et open source devant PayDunya · DexPay · NabooPay · CinetPay · Wave · Stripe · PI-SPI — routage, webhooks vérifiés, idempotence, grand livre, réconciliation.",
    ctaDemo: "Essayer la démo",
    ctaGithub: "GitHub",
    statusLine: `v${version} — adaptateurs pas encore testés contre les sandboxes des fournisseurs.`,
    scene: {
      labels: { app: "Votre app", yoon: "Yoon", providers: ["PayDunya", "DexPay", "NabooPay"] },
      description:
        "Schéma : un paiement part de votre application sous forme d'intention — 5 000 XOF par Wave — parcourt la route jusqu'à Yoon, qui choisit un fournisseur et l'envoie là. Un paiement qui expire reste sur sa route : Yoon attend la réponse de l'API de statut du fournisseur au lieu de l'envoyer chez un autre.",
      pause: "Mettre l'animation en pause",
      play: "Reprendre l'animation",
    },
  },
  independent: {
    heading: "Ni agrégateur, ni commission sur vos paiements.",
    lead: "Yoon n'est pas un agrégateur : vous ouvrez vos propres comptes marchands chez les fournisseurs et apportez vos propres clés. Yoon enlève le travail d'intégration, pas l'inscription.",
    points: [
      {
        title: "Rien à payer à Yoon",
        body: "Le serveur est un logiciel libre sous AGPL-3.0 : aucun frais de licence, aucune part sur vos paiements. Vous l'hébergez vous-même.",
      },
      {
        title: "Les conditions sont celles de la licence",
        body: "Yoon utilisé sans modification : aucune obligation au-delà des mentions de licence. Offert à d'autres sur un réseau : offrez-leur le code source.",
      },
      {
        title: "Vous restez le marchand",
        body: "Les contrats, comptes et clés des fournisseurs sont les vôtres. Yoon se place devant eux ; il n'est pas partie à votre argent.",
      },
    ],
    licensingLabel: "Ce que l'AGPL vous demande, en clair",
  },
  problem: {
    heading: "Le même travail, dans chaque projet",
    cards: [
      {
        title: "Chaque fournisseur, chaque projet",
        body: "Chaque intégration réécrit les mêmes appels aux fournisseurs, dans chaque langage, pour chaque boutique.",
      },
      {
        title: "Des webhooks à vérifier",
        body: "Signatures, doublons, rejeux, rappels tardifs — chaque projet résout ces problèmes, ou vit avec le risque.",
      },
      {
        title: "Des paiements bloqués",
        body: "Un délai d'attente laisse une question : le client a-t-il payé ? Sans réconciliation, commandes et argent finissent par diverger.",
      },
    ],
  },
  how: {
    heading: "Le voyage d'un paiement",
    intro:
      "Vous envoyez une intention, pas des appels aux fournisseurs. Yoon choisit le fournisseur, vérifie ce qui revient et tient le grand livre. Un délai d'attente n'est pas un échec : le paiement reste sur sa route jusqu'à ce que l'API de statut du fournisseur réponde.",
    intent: "5 000 XOF par Wave",
    outcome: "fournisseur choisi",
    timeout: "délai dépassé → inconnu",
    timeoutOutcome: "attend l'API de statut du fournisseur",
    srDescription:
      "Séquence : votre application envoie une intention (5 000 XOF par Wave) à Yoon ; la route se sépare vers PayDunya, DexPay et NabooPay ; Yoon achemine le paiement vers l'un d'eux. Quand un fournisseur ne répond pas, le paiement ne part pas chez un autre : il reste en attente et Yoon interroge l'API de statut du fournisseur.",
    steps: [
      "Votre application envoie une intention — montant, pays, méthode.",
      "Yoon choisit un fournisseur configuré selon capacité, disponibilité et priorité.",
      "Si le fournisseur refuse sans ambiguïté, Yoon essaie le suivant.",
      "Si le fournisseur ne répond pas, Yoon ne réessaie pas et ne change pas de fournisseur — l'API de statut tranche.",
    ],
  },
  guarantees: {
    heading: "Ce que Yoon garantit",
    whyLabel: "Pourquoi c'est important",
    items: [
      {
        key: "timeout",
        title: "Un délai dépassé vaut « inconnu », jamais « échec »",
        body: "Pas de bascule, pas de nouvelle tentative quand la requête a pu atteindre le fournisseur.",
        why: "Le client est peut-être déjà en train de payer. Réessayer pourrait le facturer deux fois.",
      },
      {
        key: "callbacks",
        title: "Les callbacks sont re-confirmés",
        body: "Les callbacks des fournisseurs sont stockés, leur signature vérifiée, puis re-confirmés via l'API de statut avant tout changement.",
        why: "Un callback est un indice, jamais la vérité.",
      },
      {
        key: "amounts",
        title: "Les montants doivent concorder",
        body: "Un paiement n'est réglé que si le montant confirmé égale le montant demandé.",
        why: "Un montant partiel ou faux déclenche une alerte au lieu de marquer la commande payée.",
      },
      {
        key: "ledger",
        title: "Le grand livre est garanti par Postgres",
        body: "Un grand livre en partie double ; la base refuse elle-même toute écriture déséquilibrée ou modifiée.",
        why: "La comptabilité reste alignée sur ce qui s'est vraiment passé.",
      },
      {
        key: "idempotency",
        title: "Chaque écriture est idempotente",
        body: "Les requêtes exigent un Idempotency-Key ; une nouvelle tentative renvoie le résultat d'origine.",
        why: "La même requête envoyée deux fois — ou vingt fois d'un coup — ne s'exécute qu'une fois.",
      },
      {
        key: "payouts",
        title: "Les payouts partent une seule fois",
        body: "Vers exactement un fournisseur, exactement une fois. Une issue inconnue est signalée à un humain, jamais devinée.",
        why: "Payer un bénéficiaire deux fois, aucun logiciel ne sait l'annuler.",
      },
    ],
  },
  providersTable: {
    heading: "Fournisseurs",
    columns: {
      provider: "Fournisseur",
      collect: "Encaissement",
      payout: "Payout",
      refund: "Remboursement",
    },
    none: "—",
    fullRefund: "Montant total",
    partialRefund: "Total et partiel",
    refundNote:
      "PayDunya, DexPay, NabooPay et CinetPay n'offrent pas d'API de remboursement : on rembourse un client en lui envoyant un payout. Wave (direct) et PI-SPI remboursent le montant total ; Stripe rembourse tout montant jusqu'à ce qui a été payé.",
    sandboxNote:
      "Les adaptateurs sont testés contre des API simulées (à partir d'intégrations de production, des documentations publiques de Wave et de Stripe, des SDK de CinetPay et de la spécification de la BCEAO) — pas encore contre les sandboxes des fournisseurs.",
    countryNote:
      "PayDunya, DexPay, NabooPay : Sénégal. Wave : Sénégal, Côte d'Ivoire, Mali, Burkina Faso. PI-SPI : les huit pays de l'UEMOA. CinetPay : neuf pays d'Afrique de l'Ouest et centrale. Stripe : cartes du monde entier.",
  },
  pispi: {
    heading: "Yoon et PI-SPI : deux étages, pas deux concurrents",
    intro:
      "PI-SPI est la plateforme de paiement instantané de la BCEAO : l'infrastructure qui fait circuler l'argent entre banques, émetteurs de monnaie électronique, institutions de microfinance et établissements de paiement dans l'UEMOA. Yoon est un logiciel que vous installez à côté de votre application. PI-SPI déplace l'argent ; Yoon choisit la route de chaque paiement et veille à ce qu'il ne soit ni perdu, ni payé deux fois.",
    stackLabel: "Qui fait quoi, de haut en bas",
    layers: {
      app: {
        title: "Votre application",
        body: "Votre boutique, votre app ou votre ERP. Elle appelle une seule API.",
      },
      yoon: {
        title: "Yoon, sur votre serveur",
        body: "Routage, idempotence, reconfirmation des callbacks, réconciliation, grand livre. Yoon ne détient aucun fonds.",
      },
      providers: {
        title: "Vos prestataires de paiement",
        body: "PayDunya, DexPay, NabooPay et Wave, chacun via votre propre compte marchand.",
        pispiRoute: "PI-SPI, via l'API Business de votre banque",
        plannedBadge: "disponible · pas testé en sandbox",
      },
      rails: {
        title: "PI-SPI, opéré par la BCEAO",
        body: "L'infrastructure entre établissements agréés : instantanée, 24h/24, dans toute l'UEMOA.",
      },
    },
    compare: {
      heading: "Côte à côte",
      columns: { aspect: "Critère", pispi: "PI-SPI", yoon: "Yoon" },
      rows: [
        {
          aspect: "Ce que c'est",
          pispi: "Une infrastructure de paiement régionale",
          yoon: "Un logiciel libre dans votre backend",
        },
        {
          aspect: "Opéré par",
          pispi: "La BCEAO",
          yoon: "Vous, sur votre propre serveur",
        },
        {
          aspect: "Qui s'y connecte",
          pispi:
            "Banques, émetteurs de monnaie électronique, microfinance, établissements de paiement",
          yoon: "Vos applications, avec vos propres comptes marchands",
        },
        {
          aspect: "Son rôle",
          pispi: "Faire circuler l'argent entre établissements, instantanément",
          yoon: "Choisir la route, ne jamais débiter deux fois, vérifier ce que disent les prestataires, réconcilier, prévenir votre application",
        },
        {
          aspect: "Détient des fonds",
          pispi: "Règle entre établissements",
          yoon: "Jamais",
        },
      ],
    },
    use: {
      heading: "Comment Yoon utilise PI-SPI",
      items: [
        "Un prestataire PI-SPI qui parle à l'API Business proposée par votre banque ou votre émetteur de monnaie électronique : l'API standard définie par la BCEAO pour les clients entreprises.",
        "L'encaissement par une demande de paiement envoyée à l'alias PI du client ; il la valide dans sa propre application bancaire ou de portefeuille.",
        "Des paiements vers un alias PI, et des remboursements sous forme de retours de fonds (montant total) : une vraie API de remboursement, qu'aucun autre prestataire ne propose.",
        "Les mêmes garanties que pour toutes les routes : callbacks signés reconfirmés auprès de l'API de statut, un délai dépassé reste « inconnu », les montants doivent correspondre.",
        "Votre code ne change pas : la même API Yoon, une route de plus.",
      ],
    },
    statusNote:
      "Disponible depuis la 0.1.0, construit à partir de la spécification de la BCEAO et pas encore essayé contre la sandbox PI-SPI.",
    caveat:
      "Yoon ne peut pas se connecter directement à PI-SPI : seuls les établissements agréés le peuvent. En production, votre banque ou votre émetteur de monnaie électronique doit proposer l'API Business à ses clients entreprises.",
    links: { site: "PI-SPI (BCEAO)", developer: "Portail développeur de l'API Business" },
  },
  code: {
    heading: "Votre code",
    intro:
      "Des bibliothèques pour PHP, Java, JavaScript et Python — plus un bundle Symfony et un starter Spring Boot — avec des aides orientées clé d'idempotence et vérification des webhooks déjà en place.",
    contractNote:
      "Les quatre clients de langage sont générés depuis api/openapi.yaml — le contrat contre lequel le serveur est testé ; le bundle Symfony et le starter Spring Boot s'appuient sur les clients PHP et Java.",
    clientLabels: {
      php: "PHP / Laravel",
      java: "Java",
      js: "JavaScript / TypeScript",
      symfony: "Symfony",
      python: "Python",
      spring: "Spring Boot",
    },
    e2eNote:
      "Les clients JavaScript et Python passent un scénario de bout en bout partagé, contre un vrai serveur, en CI :",
    tabLabels: {
      laravel: "Laravel",
      php: "PHP",
      symfony: "Symfony",
      java: "Java",
      js: "TypeScript",
      python: "Python",
      curl: "curl",
    },
    responseLabel: "Yoon répond",
    copy: "Copier",
    copied: "Copié",
  },
  api: {
    heading: "L'API en un coup d'œil",
    intro:
      "Une surface versionnée, documentée par un contrat contre lequel le serveur est testé. Les erreurs arrivent en problem+json avec des codes stables.",
    generatedNote: "Généré depuis api/openapi.yaml au moment du build.",
    referenceLabel: "Référence complète",
  },
  demo: {
    heading: "Essayer en cinq minutes",
    firstLine:
      "Sans compte fournisseur, sans argent réel — Yoon embarque un fournisseur de démonstration.",
    step1Title: "Lancer Yoon avec le fournisseur de démo",
    step1Note: "Depuis la racine du dépôt.",
    step2Title: "Lancer la boutique d'exemple",
    step2Note: "Une boutique Laravel d'un seul produit, qui paie à travers Yoon.",
    step3Title: "Payer",
    step3Body:
      "Ouvrez http://localhost:8010, cliquez Buy, puis Pay sur la page de paiement de la démo. Vous revenez sur la page de commande ; le webhook de Yoon la marque payée quelques secondes plus tard (rafraîchissez).",
    terminalLabel: "À quoi ça ressemble",
    terminalNote: "Les commandes complètes sont à gauche.",
    linkLabel: "L'exemple, pas à pas",
    envHint: "Éditez-moi — copiez le résultat dans votre propre .env",
    envRandomise: "Générer les secrets",
    envReset: "Réinitialiser",
  },
  run: {
    heading: "L'installer vous-même",
    intro:
      "Un petit serveur, Docker, vos propres comptes marchands. Le fichier Compose de deploy/ est la configuration de production.",
    steps: [
      {
        title: "Cloner et configurer",
        body: "Copiez .env.example, indiquez votre domaine et vos mots de passe.",
      },
      { title: "docker compose up -d", body: "Caddy obtient le certificat HTTPS tout seul." },
      {
        title: "Créer une application",
        body: "apps create shop affiche la clé d'API une seule fois, ainsi que l'URL de callback à donner à vos fournisseurs.",
      },
    ],
    composeHeading: "Le fichier Compose comprend",
    composeItems: [
      "Postgres",
      "Caddy, HTTPS automatique",
      "sauvegardes chaque nuit, conservées 14 jours",
      "Prometheus et Grafana en option, avec règles d'alerte et tableau de bord",
    ],
    loadTestHeading: "Ce qu'une instance a soutenu",
    columns: {
      rate: "Paiements/s",
      errors: "Erreurs",
      create: "Création p95",
      read: "Lecture p95",
    },
    loadTestCaveat:
      "Ces chiffres mesurent Yoon lui-même, avec le fournisseur de démo en mémoire. Les vrais fournisseurs ajoutent leur propre latence à chaque création.",
  },
  not: {
    heading: "Ce que Yoon n'est pas",
    items: [
      {
        title: "Pas un agrégateur",
        body: "Vous ouvrez votre propre compte marchand chez chaque fournisseur et apportez vos propres clés.",
      },
      {
        title: "Pas un coffre à cartes",
        body: "Yoon ne voit jamais les numéros de carte ; les cartes passent par la page de paiement hébergée du fournisseur.",
      },
      {
        title: "Pas un formulaire de paiement",
        body: "Yoon ne collecte jamais de données de carte ou de portefeuille. Il renvoie l'URL de paiement du fournisseur ou une instruction push/USSD, ou — avec la page de paiement hébergée, en option — laisse le client choisir un moyen de paiement, puis le confie au fournisseur.",
      },
      {
        title: "Pas un service hébergé",
        body: "Vous l'installez vous-même.",
      },
      {
        title: "Pas de télémétrie",
        body: "Il n'envoie rien à personne par défaut.",
      },
    ],
  },
  openSource: {
    heading: "Open source",
    serverLabel: "Serveur, noyau et fournisseurs :",
    clientsLabel: "bibliothèques clientes et exemples :",
    licence: {
      title: "Licences",
      body: "Le serveur est sous AGPL-3.0 — ce que cela vous demande, en clair, est dans le guide des licences. Les bibliothèques clientes et les exemples sont sous Apache-2.0. Une licence commerciale existe.",
    },
    contribute: {
      title: "Contribuer",
      body: "Issues et pull requests bienvenues ; un accord de licence de contributeur (CLA) est demandé.",
    },
    security: {
      title: "Sécurité",
      body: "Yoon fait circuler de l'argent. Signalez les vulnérabilités en privé via le signalement de vulnérabilités de GitHub.",
    },
    commercial: {
      title: "Licence commerciale",
      body: "Ouvrez une issue, ou contactez le mainteneur sur GitHub.",
    },
  },
  docs: {
    heroCta: "Docs",
    navLabel: "Documentation",
    navQuickstart: "Démarrage rapide",
    navClients: "Bibliothèques clientes",
    navProviders: "Fournisseurs",
    sourceLabel: "Source",
    index: {
      title: "Documentation",
      description:
        "Lancer Yoon avec le fournisseur de démo, encaisser un premier paiement, et l'intégrer depuis PHP, Symfony, Java, Spring Boot, JavaScript ou Python.",
      intro:
        "Chaque commande et chaque extrait de ces pages est copié du dépôt de la passerelle — son README et celui de chaque client — et le build échoue s'ils divergent.",
      quickstartBody:
        "Docker Compose, le fournisseur de démo, une clé d'API, un premier paiement avec curl et un webhook signé. Sans compte fournisseur, sans argent réel.",
      clientsBody: "Installer, créer un paiement avec une clé d'idempotence, vérifier un webhook.",
      providersBody: "Ce que fait chaque fournisseur, et où sa configuration est documentée.",
      apiLabel: "Contrat d'API (OpenAPI)",
    },
    quickstart: {
      title: "Démarrage rapide",
      description:
        "Lancer Yoon avec Docker Compose et le fournisseur de démo, créer une clé d'API, encaisser un premier paiement avec curl et recevoir un webhook.",
      intro:
        "Il vous faut Docker et un clone du dépôt. Le fournisseur de démo sert sa propre page de paiement : vous cliquez sur Pay ou Decline, et un callback signé suit le vrai circuit. Aucun argent ne circule — ne l'activez jamais en production.",
      steps: {
        start: {
          title: "Configurer Yoon",
          body: "À la racine du dépôt, créez .env. Il active le fournisseur de démo pour une application nommée shop, et indique où Yoon envoie les événements de cette application. Le secret du webhook doit faire au moins 32 caractères.",
          after:
            "Dans le nom d'une variable, <APP> est le nom de l'application en majuscules, les - devenant des _ : shop devient SHOP.",
        },
        app: {
          title: "Le démarrer, créer l'application et sa clé d'API",
          body: "La ligne de commande d'exploitation crée l'application et affiche sa clé d'API une seule fois : copiez-la. Redémarrez ensuite Yoon, qui lit les réglages des fournisseurs et des webhooks au démarrage.",
        },
        pay: {
          title: "Créer un premier paiement",
          body: "Remplacez yk_… par votre clé. Chaque écriture porte un Idempotency-Key : la même requête renvoyée rend le paiement d'origine au lieu de débiter deux fois.",
          after:
            "Avec le fournisseur de démo activé pour l'application, le paiement revient en pending avec un checkout_url : ouvrez-le et cliquez sur Pay. Sans fournisseur configuré, Yoon répond 422 no_provider_for_method — c'est le routage qui fonctionne.",
        },
        webhook: {
          title: "Recevoir le webhook",
          body: "Quand le paiement aboutit, Yoon envoie en POST un événement signé, par exemple payment.succeeded, à l'URL de webhook de l'application — dans ce .env, le port 8010 de votre machine. Les événements sont aussi listés sur GET /v1/events pour rattraper un retard.",
          signature: "Chaque envoi porte cet en-tête :",
          rules:
            "Calculez ce HMAC sur le corps brut, comparez-le à v1 en temps constant, et refusez l'envoi si t date de plus de 5 minutes. La livraison est « au moins une fois » et sans ordre garanti : dédupliquez sur l'id de l'événement.",
          clients: "Chaque bibliothèque cliente le fait pour vous :",
        },
      },
      cliTitle: "Applications et clés",
      cliBody:
        "La même ligne de commande liste les applications, émet une autre clé pour une rotation et en révoque une. Une clé ne s'affiche qu'une fois.",
    },
    client: {
      titles: {
        php: "PHP et Laravel",
        symfony: "Symfony",
        java: "Java",
        spring: "Spring Boot",
        js: "JavaScript et TypeScript",
        python: "Python",
      },
      description:
        "Installer le client {client} de Yoon, créer un paiement avec une clé d'idempotence et vérifier les webhooks de Yoon.",
      requiresLabel: "Prérequis",
      install: "Installer",
      create: "Créer un paiement",
      createNote:
        "La clé d'idempotence est obligatoire pour toute écriture. Liez-la à votre commande : une nouvelle tentative avec la même clé ne peut jamais débiter deux fois.",
      webhook: "Vérifier un webhook",
      webhookNote:
        "L'outil vérifie la signature sur le corps brut et refuse une signature fausse ou périmée avec 401, répond 200 à un événement déjà traité sans appeler votre code, et ne retient un événement qu'une fois que votre code a répondu 2xx. Les événements arrivent sans ordre : fiez-vous à l'état contenu dans l'objet de l'événement.",
      verifyInline: "Pour vérifier une signature vous-même, sur le corps brut de la requête :",
      agent: "Prompt pour un agent IA",
      agentNote:
        "Copiez ce prompt dans votre agent de code (Claude Code, Cursor, Copilot) pour ajouter Yoon à une application existante. Il indique quoi installer et écrire, les règles qui protègent l'argent (clés d'idempotence, livrer seulement sur payment.succeeded, vérification du webhook sur le corps brut) et comment vérifier le résultat avec le fournisseur de démo. Le prompt est en anglais : les agents le suivent tel quel.",
      captions: {
        "php.create": "PHP seul",
        "php.laravelEnv": "Laravel — .env",
        "php.laravelCreate": "Laravel — la façade",
        "php.laravelWebhook": "Laravel — le middleware yoon.webhook",
        "symfony.bundle": "Enregistrer le bundle",
        "symfony.config": "Le configurer",
        "symfony.create": "Yoon\\Yoon est injectable automatiquement",
        "symfony.webhook": "#[YoonWebhook] sur le contrôleur",
        "spring.config": "Configuration",
        "spring.create": "Injecter le bean Yoon auto-configuré",
        "spring.webhook": "Le filtre du starter vérifie l'événement avant votre contrôleur",
        "js.webhook": "Express",
        "js.verify": "Hors framework",
        "python.webhook": "Django",
        "python.verify": "Hors framework",
      },
      readmeLabel: "Autres frameworks, erreurs et tous les helpers : le README du client",
    },
    providers: {
      title: "Fournisseurs",
      description:
        "Les fournisseurs de paiement pris en charge par Yoon, ce que fait chacun, et où sa configuration est documentée.",
      intro:
        "Vous ouvrez votre propre compte marchand chez chaque fournisseur et apportez vos propres clés : Yoon supprime le travail d'intégration, pas l'inscription. La page de chaque fournisseur liste les identifiants à renseigner, la correspondance entre ses statuts et ceux de Yoon, et ses particularités.",
      columns: {
        provider: "Fournisseur",
        collect: "Encaissement",
        payout: "Versement",
        refund: "Remboursement",
        status: "Statut",
        doc: "Docs",
      },
      notTested: "Pas testé en sandbox",
      docLink: "Configuration",
      configNote:
        "Les fournisseurs s'activent par application avec des variables d'environnement — YOON_APPS_<APP>_PROVIDERS_<PROVIDER>_PRIORITY et _CREDENTIALS_<KEY> — lues au démarrage : redémarrez Yoon après un changement.",
    },
  },
  footer: {
    meaning: "Yoon (wolof) : le chemin, la route.",
    tagline: "Yoon choisit le chemin que prend un paiement.",
    links: [
      { label: "GitHub", href: "https://github.com/crossben/yoonpay" },
      { label: "Changelog", href: "https://github.com/crossben/yoonpay/blob/main/CHANGELOG.md" },
      {
        label: "Licences",
        href: "https://github.com/crossben/yoonpay/blob/main/docs/licensing.md",
      },
      {
        label: "Contrat d'API",
        href: "https://github.com/crossben/yoonpay/blob/main/api/openapi.yaml",
      },
    ],
    copyright: "© 2026 Ben Hattab",
  },
};

export default fr;
