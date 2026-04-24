# AntiPay Gateway (Verify Flow)

A minimalist and secure payment gateway integration for mobile financial services (bKash, Nagad, etc.) in Bangladesh.

## 🚀 Getting Started

To push this project to your GitHub repository, run the following commands in your terminal:

```bash
git init
git add .
git commit -m "first commit: full antipay gateway implementation"
git branch -M main
git remote add origin https://github.com/devrahi999/antipay-verify.git
git push -u origin main
```

## 🛠 Features
- **Dynamic Payment Methods**: Fetches merchant-specific numbers and active methods from Firestore.
- **Smart Session IDs**: Encodes userId into sessionId for clean URLs (`/s/userId_random`).
- **Webhooks**: Notifies merchant backend on payment verification and cancellation.
- **Atomic Transactions**: Ensures a transaction ID is only used once and amounts match perfectly.
- **Responsive UI**: Pro-level minimalist design for checkout, success, and cancel pages.

## 📡 API Documentation

### 1. Create Payment Session
**Endpoint:** `POST /api/v1/create`  
**Headers:** `x-api-key: YOUR_API_KEY`
**Body:**
```json
{
  "amount": 100,
  "val_id": "your_unique_id",
  "webhook_url": "https://your-site.com/api/webhook"
}
```

### 2. Verify Payment
**Endpoint:** `POST /api/v1/verify`  
**Headers:** `x-api-key: YOUR_API_KEY`
**Body:**
```json
{
  "sessionId": "userId_randomStr",
  "trxId": "TRX123456",
  "method": "bkash"
}
```

### 3. Cancel Payment
**Endpoint:** `POST /api/v1/cancel`  
**Body:**
```json
{
  "sessionId": "userId_randomStr",
  "userId": "merchant_id"
}
```

## 🗄 Firestore Structure
- `payment_sessions/{userId}/sessions/{sessionId}`: Stores payment state and results.
- `stores/{apiKeyId}`: Stores merchant settings, active methods, and website URLs.
- `transactions/{trxId}`: Raw logs from MFS providers to match against.

---
**Secured by AntiPay Gateway**