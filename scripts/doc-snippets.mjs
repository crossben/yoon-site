// Every code snippet on the docs pages (/docs/…), and where it comes from in the gateway.
//
// Snippets are never retyped: lib/docs.ts reads the fenced code block of `file` (in the
// gateway snapshot) that contains `marker` — exactly one block must match, or the build
// fails. scripts/gateway.mjs adds every marker to REQUIRED_STRINGS, so check-facts fails
// too when a README changes under the site. `inline` entries are inline code quoted from the
// README prose: the text must appear in the file verbatim.
//
// Plain JavaScript (no TypeScript): the Node scripts and the Next build both import it.

export const DOC_SNIPPETS = {
  // Quickstart: the demo setup of the example shop, the root README's first call and CLI.
  "quickstart.env": { file: "examples/laravel-shop/README.md", marker: "YOON_DEMO_ENABLED=true" },
  "quickstart.up": {
    file: "examples/laravel-shop/README.md",
    marker: "docker compose run --rm yoon apps create shop     # copy the printed key",
  },
  "quickstart.curl": { file: "README.md", marker: "curl -X POST localhost:8080/v1/payments" },
  "quickstart.cli": {
    file: "README.md",
    marker: "docker compose run --rm yoon apps add-key <name>",
  },
  "quickstart.signatureHeader": {
    file: "README.md",
    marker: "Yoon-Signature: t=<unix seconds>,v1=<hex>",
    inline: true,
  },
  "quickstart.signatureHmac": {
    file: "README.md",
    marker: 'HMAC-SHA256(secret, "<t>.<raw body>")',
    inline: true,
  },

  // PHP / Laravel — clients/php/README.md
  "php.install": { file: "clients/php/README.md", marker: "composer require yoonpay/yoon-php" },
  "php.create": { file: "clients/php/README.md", marker: "idempotencyKey: 'order-1042'" },
  "php.laravelEnv": { file: "clients/php/README.md", marker: "YOON_WEBHOOK_SECRET=…" },
  "php.laravelCreate": {
    file: "clients/php/README.md",
    marker: "Yoon::createPayment([...], 'order-' . $order->id);",
  },
  "php.laravelWebhook": {
    file: "clients/php/README.md",
    marker: "->middleware('yoon.webhook');",
  },
  "php.verify": {
    file: "clients/php/README.md",
    marker: "Yoon\\Webhook\\Signature::verify($secret, $header, $rawBody)",
    inline: true,
  },

  // Symfony — the bundle in clients/php/README.md
  "symfony.install": { file: "clients/php/README.md", marker: "composer require yoonpay/yoon-php" },
  "symfony.bundle": {
    file: "clients/php/README.md",
    marker: "Yoon\\Symfony\\YoonBundle::class => ['all' => true],",
  },
  "symfony.config": { file: "clients/php/README.md", marker: "api_key: '%env(YOON_API_KEY)%'" },
  "symfony.create": {
    file: "clients/php/README.md",
    marker: "$payment = $yoon->createPayment([...], 'order-' . $order->getId());",
  },
  "symfony.webhook": { file: "clients/php/README.md", marker: "    #[YoonWebhook]\n" },

  // Java — clients/java/README.md
  "java.install": { file: "clients/java/README.md", marker: "<artifactId>yoon-java</artifactId>" },
  "java.create": { file: "clients/java/README.md", marker: '"order-1042");' },
  "java.verify": {
    file: "clients/java/README.md",
    marker: "WebhookSignature.verify(secret, header, rawBody)",
    inline: true,
  },

  // Spring Boot — clients/java-spring-boot-starter/README.md
  "spring.install": {
    file: "clients/java-spring-boot-starter/README.md",
    marker: "<artifactId>yoon-spring-boot-starter</artifactId>",
  },
  "spring.config": {
    file: "clients/java-spring-boot-starter/README.md",
    marker: "yoon.api-key=${YOON_API_KEY}",
  },
  "spring.create": {
    file: "clients/java-spring-boot-starter/README.md",
    marker: "class Checkout {",
  },
  "spring.webhook": {
    file: "clients/java-spring-boot-starter/README.md",
    marker: "class YoonWebhookController {",
  },

  // JavaScript / TypeScript — clients/js/README.md
  "js.install": { file: "clients/js/README.md", marker: "npm install @yoonpay/yoon" },
  "js.create": {
    file: "clients/js/README.md",
    marker: 'import { Yoon, YoonException } from "@yoonpay/yoon";',
  },
  "js.webhook": {
    file: "clients/js/README.md",
    marker: 'import { yoonWebhook } from "@yoonpay/yoon/express";',
  },
  "js.verify": {
    file: "clients/js/README.md",
    marker: 'import { verifySignature, YoonWebhookEvent } from "@yoonpay/yoon";',
  },

  // Python — clients/python/README.md
  "python.install": { file: "clients/python/README.md", marker: "pip install yoonpay " },
  "python.create": {
    file: "clients/python/README.md",
    marker: "from yoonpay import Yoon, YoonException",
  },
  "python.webhook": {
    file: "clients/python/README.md",
    marker: "from yoonpay.django import yoon_webhook",
  },
  "python.verify": {
    file: "clients/python/README.md",
    marker: "from yoonpay import Event, verify_signature",
  },
};
