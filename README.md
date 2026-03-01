# Rural Women Backend

This repository provides the backend API for a Bangladeshi e‑commerce/mentorship platform. It uses Node.js, Express and MongoDB.

## Running the server

1. Copy `.env.example` to `.env` and fill in values (especially `BANK_INSTRUCTIONS`).
2. Install dependencies:

```bash
npm install
```

3. Start MongoDB locally (e.g. `docker run -d -p 27017:27017 --name mongo mongo:6`).
4. Run the server:

```bash
npm run dev    # development with nodemon
# or
npm start      # production
```

The API will listen on port `5000` by default (`PORT` env can override).

## New payment integration

A new payments module has been added without changing the existing `Order` schema:

- `models/Payment.js` — stores payment records linked to orders.
- `routes/paymentRoutes.js` & `controllers/paymentController.js` — endpoints:
  - `POST /api/payments/bank`  → create bank-transfer payment (returns instructions).
  - `POST /api/payments/bkash` → placeholder for bKash integration.
  - `POST /api/payments/rocket`→ placeholder for Rocket integration.
  - `POST /api/payments/webhook`→ generic webhook listener to update payment status.

### Bank transfer example

```bash
curl -X POST http://localhost:5000/api/payments/bank \
  -H "Content-Type: application/json" \
  -d '{"orderId":"<orderId>","amount":1200}'
```

Response includes `instructions` to show to the customer.

### Next steps

1. Fill in bKash / Rocket APIs using credentials in `.env`.
2. Implement webhook handlers for those providers to mark payments `Completed`.
3. Optionally, add a simple frontend checkout page or expand orders logic.

## Existing API

Routes remain unchanged (see `server.js` for a list).

---

Feel free to expand or ask for more features!