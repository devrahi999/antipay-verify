# AntiPay Gateway (Verify Flow)

A minimalist and secure payment gateway integration for mobile financial services (bKash, Nagad, etc.) in Bangladesh.


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
---
**Secured by AntiPay Gateway**
