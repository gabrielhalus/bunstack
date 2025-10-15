| Variable       | Purpose                           | Default     | Required | Apps                   |
| -------------- | --------------------------------- | ----------- | -------- | ---------------------- |
| NODE_ENV       | Node runtime environment          | development | ❌        | api                   |
| HOSTNAME       | Hostname or base URL of the app   | -           | ✅        | api                   |
| AUTH_URL       | Authentication service URL        | -           | ✅        | api                   |
| SITE_URL       | Public URL of the dashboardsite   | -           | ✅        | api                   |
| SUPPORT_EMAIL  | Email address for support contact | -           | ✅        | api                   |
| DATABASE_URL   | Database connection string        | -           | ✅        | api                   |
| RESEND_API_KEY | Resend full-access API key        | -           | ✅        | api                   |
| VITE_API_URL   | Backend API URL for frontend      | -           | ✅        | site, dashboard, auth |
| VITE_AUTH_URL  | Authentication service URL        | -           | ✅        | dashboard             |
| JWT_SECRET     | Secret key for signing JWTs       | -           | ✅        | dashboard             |
