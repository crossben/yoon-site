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
      "Yoon est une passerelle de paiement auto-hébergée et open source : une seule API devant PayDunya, DexPay et NabooPay, avec routage, webhooks vérifiés, idempotence, grand livre et réconciliation.",
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
    },
    themeToggle: { toLight: "Passer en thème clair", toDark: "Passer en thème sombre" },
    homeAria: "Yoon — accueil",
  },
  hero: {
    headline: "Une seule API pour les paiements africains.",
    subline:
      "Une passerelle auto-hébergée et open source devant PayDunya · DexPay · NabooPay — routage, webhooks vérifiés, idempotence, grand livre, réconciliation.",
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
    refundNote:
      "L'API sait rembourser, mais aucun des trois fournisseurs n'offre d'API de remboursement : on rembourse un client en lui envoyant un payout.",
    sandboxNote:
      "Les adaptateurs sont testés contre des API simulées, reconstruites à partir d'intégrations de production — pas encore contre les sandboxes des fournisseurs.",
    countryNote: "Sénégal, XOF uniquement.",
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
        body: "PayDunya, DexPay et NabooPay aujourd'hui, chacun via votre propre compte marchand.",
        pispiRoute: "PI-SPI, via l'API Business de votre banque",
        plannedBadge: "développé · prochaine version",
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
      "Développé sur la branche principale, pas encore publié dans une version, et pas encore essayé contre la sandbox PI-SPI. Les versions publiées passent par PayDunya, DexPay et NabooPay.",
    caveat:
      "Yoon ne peut pas se connecter directement à PI-SPI : seuls les établissements agréés le peuvent. En production, votre banque ou votre émetteur de monnaie électronique doit proposer l'API Business à ses clients entreprises.",
    links: { site: "PI-SPI (BCEAO)", developer: "Portail développeur de l'API Business" },
  },
  code: {
    heading: "Votre code",
    intro:
      "Trois bibliothèques clientes, générées depuis le contrat d'API, avec des aides orientées clé d'idempotence et vérification des webhooks déjà en place.",
    contractNote:
      "Les trois bibliothèques sont générées depuis api/openapi.yaml — le contrat contre lequel le serveur est testé.",
    tabLabels: { laravel: "Laravel", php: "PHP", java: "Java", js: "TypeScript", curl: "curl" },
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
        title: "Pas d'interface de paiement",
        body: "Yoon renvoie l'URL de paiement du fournisseur ou une instruction push/USSD ; votre application affiche sa propre interface.",
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
