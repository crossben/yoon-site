// Code snippets and commands, shared by both languages (code is not translated).
// Every snippet must match the real client APIs — verified against
// $YOON_APP_DIR/clients/php (src/Yoon.php, src/Laravel) and
// $YOON_APP_DIR/clients/java (src/…/Yoon.java, generated models).
// Demo commands come from $YOON_APP_DIR/examples/laravel-shop/README.md.

export type Snippet = { id: string; lang: string; code: string };

export const codeSnippets = {
  laravel: `use Yoon\\Laravel\\Facades\\Yoon;

// Tie the call to your order: a retry can never charge twice.
$payment = Yoon::createPayment([
    'amount' => 5000,                  // XOF has no minor unit: 5 000 FCFA
    'currency' => 'XOF',
    'country' => 'SN',
    'method' => 'wave',                // wave, orange_money, free_money, card
    'customer' => ['phone' => '+221771234567'],
    'reference' => 'order_1042',
    'return_url' => 'https://shop.example/orders/1042',
], 'order-1042');

return redirect()->away($payment->getCheckoutUrl());

// Receiving Yoon's events — routes/web.php:
Route::post('/yoon/webhook', YoonWebhookController::class)
    ->middleware('yoon.webhook');      // verifies the signature, deduplicates

// app/Http/Controllers/YoonWebhookController.php:
public function __invoke(Request $request)
{
    $event = $request->attributes->get('yoon_event');   // Yoon\\Webhook\\Event
    if ($event->type() === 'payment.succeeded') {
        Order::where('yoon_payment_id', $event->object()['id'])
             ->update(['status' => 'paid']);
    }

    return response()->noContent();
}`,

  php: `use Yoon\\Yoon;
use Yoon\\YoonException;

$yoon = new Yoon('https://pay.example.com', getenv('YOON_API_KEY'));

try {
    $payment = $yoon->createPayment([
        'amount' => 5000,              // XOF has no minor unit: 5 000 FCFA
        'currency' => 'XOF',
        'country' => 'SN',
        'method' => 'wave',            // wave, orange_money, free_money, card
        'customer' => ['phone' => '+221771234567'],
        'reference' => 'order_1042',
        'return_url' => 'https://shop.example/orders/1042',
    ], idempotencyKey: 'order-1042');  // a retry can never charge twice

    header('Location: ' . $payment->getCheckoutUrl());
} catch (YoonException $e) {
    $e->problemCode();   // e.g. no_provider_for_method, refund_exceeds_payment
    $e->isRetryable();   // true: retry with the same idempotency key
}`,

  java: `Yoon yoon = new Yoon("https://pay.example.com", System.getenv("YOON_API_KEY"));

Payment payment = yoon.createPayment(new CreatePaymentRequest()
        .amount(5000L).currency("XOF").country("SN").method("wave")
        .customer(new CreatePaymentRequestCustomer().phone("+221771234567"))
        .reference("order_1042")
        .returnUrl(URI.create("https://shop.example/orders/1042")),
    "order-1042");   // idempotency key tied to your order

String checkoutUrl = payment.getCheckoutUrl();   // send the customer here

// Verify Yoon's webhooks:
boolean authentic = WebhookSignature.verify(secret, header, rawBody);`,

  js: `import { Yoon, YoonException } from "@yoonpay/yoon";
import { yoonWebhook } from "@yoonpay/yoon/express";

const yoon = new Yoon("https://pay.example.com", process.env.YOON_API_KEY);

try {
  // Tie the call to your order: a retry can never charge twice.
  const payment = await yoon.createPayment(
    {
      amount: 5000,            // XOF has no minor unit: 5 000 FCFA
      currency: "XOF",
      country: "SN",
      method: "wave",          // wave, orange_money, free_money, card
      customer: { phone: "+221771234567" },
      reference: "order_1042",
      return_url: "https://shop.example/orders/1042",
    },
    "order-1042",
  );

  response.redirect(payment.checkout_url!);    // send the customer here
} catch (e) {
  if (e instanceof YoonException) {
    e.problemCode;   // e.g. no_provider_for_method
    e.isRetryable(); // true: retry with the same idempotency key
  }
}

// Receiving Yoon's events — verified, duplicates answered, remembered only on 2xx:
app.post(
  "/yoon/webhook",
  express.raw({ type: "application/json" }), // keep the raw body
  yoonWebhook({ secret: process.env.YOON_WEBHOOK_SECRET! }),
  (req, res) => {
    const event = req.yoonEvent!;
    if (event.type === "payment.succeeded") markOrderPaid(event.object.id as string);
    res.sendStatus(200);
  },
)`,

  curl: `curl -X POST https://pay.example.com/v1/payments \\
  -H "Authorization: Bearer yk_…" \\
  -H "Idempotency-Key: $(uuidgen)" \\
  -H "Content-Type: application/json" \\
  -d '{"amount":5000,"currency":"XOF","country":"SN","method":"wave",
       "customer":{"phone":"+221771234567"},"reference":"order_1042"}'`,
} satisfies Record<string, string>;

/** The demo settings, from examples/laravel-shop/README.md step 1. */
export const demoEnv = `POSTGRES_PASSWORD=change-me
YOON_PUBLIC_URL=http://localhost:8080
YOON_DEMO_ENABLED=true
YOON_APPS_SHOP_PROVIDERS_DEMO_PRIORITY=1
YOON_APPS_SHOP_WEBHOOK_URL=http://host.docker.internal:8010/yoon/webhook
YOON_APPS_SHOP_WEBHOOK_SECRET=pick-a-secret-of-at-least-32-characters`;

/** examples/laravel-shop/README.md step 1: start Yoon with the demo provider. */
export const demoStepYoon = `git clone https://github.com/crossben/yoonpay.git && cd yoonpay
cp .env.example .env    # paste the settings above
docker compose up --build -d
docker compose run --rm yoon apps create shop   # prints the API key once
docker compose restart yoon                     # picks up the shop's settings`;

/** examples/laravel-shop/README.md step 2: start the example shop. */
export const demoStepShop = `cd examples/laravel-shop
composer install
cp .env.example .env && php artisan key:generate && php artisan migrate
# in .env: YOON_API_KEY=<the key>, YOON_WEBHOOK_SECRET=<the same secret as above>
php artisan serve --host=0.0.0.0 --port=8010`;

/** Lines the terminal animation types. Real commands; output abbreviated, key masked. */
export const terminalLines: { cmd: string; output: string[] }[] = [
  {
    cmd: "cp .env.example .env",
    output: [],
  },
  {
    cmd: "docker compose up --build -d",
    output: [" ✔ Container yoon-db-1    Healthy", " ✔ Container yoon-1       Started"],
  },
  {
    cmd: "docker compose run --rm yoon apps create shop",
    output: ["API key (shown once): yk_****************"],
  },
  {
    cmd: "cd examples/laravel-shop && php artisan serve --port=8010",
    output: ["INFO  Server running on [http://0.0.0.0:8010]."],
  },
];
