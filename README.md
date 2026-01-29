# AZURE UI - Azure Service Bus & Cosmos DB Management


[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A web application for managing Azure Service Bus topics/subscriptions and browsing Cosmos DB data. Built for monitoring message flows, inspecting dead letter queues (DLQ), and reprocessing failed messages.

## What This App Does

### Service Bus Management

This app connects to an Azure Service Bus namespace and provides:

- **Topic & Subscription Overview**: Lists all topics with their subscriptions, showing active message counts and DLQ message counts
- **Message Inspection**: Peek at active messages in any subscription without consuming them
- **Dead Letter Queue (DLQ) Viewer**: View messages that failed processing and ended up in the DLQ
- **Message Resubmission**: Resubmit DLQ messages back to the original topic for reprocessing

**How it works**: The app uses the Azure Service Bus SDK to connect via either a connection string (local dev) or managed identity (production). It uses the Administration Client to list topics/subscriptions and their runtime properties, and the Service Bus Client to peek messages from subscriptions and their DLQs.

### Cosmos DB Explorer

The app also provides a read-only explorer for Cosmos DB:

- **Database Browser**: Lists all databases in the connected Cosmos DB account
- **Container Browser**: View containers within each database with partition key info
- **Item Viewer**: Browse and search items within containers
- **Custom SQL Queries**: Execute custom SQL queries against containers

**How it works**: Uses the Azure Cosmos DB SDK with a connection string to query databases, containers, and items.

## Prerequisites

- Node.js 18+
- Azure CLI (`az`) - for deployment only
- PowerShell - for deployment only

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env.local`

Create a `.env.local` file in the project root with:

```env
# Required - Service Bus connection string from Azure Portal
AZURE_SERVICE_BUS_CONNECTION_STRING="Endpoint=sb://your-namespace.servicebus.windows.net/;SharedAccessKeyName=...;SharedAccessKey=..."

# Required - Cosmos DB connection string from Azure Portal
COSMOS_DB_CONNECTION_STRING="AccountEndpoint=https://your-account.documents.azure.com:443/;AccountKey=..."

# Required - Authentication credentials
AUTH_USERNAME="admin"
AUTH_PASSWORD="your_password"

# Required - Session encryption secret (any random string)
AUTH_SECRET="your-random-secret-string"
```

**Environment Variable Aliases**: The app supports both underscore (`_`) and hyphen (`-`) formats for variable names (e.g., `AZURE_SERVICE_BUS_CONNECTION_STRING` or `AZURE-SERVICE-BUS-CONNECTION-STRING`). This allows flexibility when secrets come from Key Vault references.

### 3. Run the dev server

```bash
npm run dev
```

### 4. Access the app

Open http://localhost:3000 and log in with the credentials you set in `.env.local`.

## Deployment

### Default Deployment (Code Only)

By default, the deploy script deploys to the existing App Service without modifying infrastructure:

```powershell
az login
./deploy.ps1
```

**Default values**:
- **App Name**: `azure-ui-dev`
- **Resource Group**: `rg-azure-store-dev`
- **Location**: `uksouth`

To deploy to a different app:

```powershell
./deploy.ps1 -AppName "your-app-name"
```

### Deploy New Infrastructure

To create new infrastructure (App Service Plan + Web App) and deploy:

```powershell
./deploy.ps1 -DeployInfra -KeyVaultName "your-keyvault-name"
```

### Post-Deployment Configuration

In the Azure Portal, navigate to your App Service > **Settings** > **Environment variables** and set:

| Variable | Description |
|----------|-------------|
| `AZURE_SERVICE_BUS_CONNECTION_STRING` | Service Bus connection string (or Key Vault reference) |
| `COSMOS_DB_CONNECTION_STRING` | Cosmos DB connection string (or Key Vault reference) |
| `AUTH_USERNAME` | Login username |
| `AUTH_PASSWORD` | Login password |
| `AUTH_SECRET` | Random secret for session encryption |

**Alternative for Managed Identity** (production):
| Variable | Description |
|----------|-------------|
| `SERVICE_BUS_FQDN` | Service Bus FQDN (e.g., `your-namespace.servicebus.windows.net`) |
| `AZURE_CLIENT_ID` | User-assigned managed identity client ID (optional) |

These are set automatically by the deploy script:
- `AUTH_TRUST_HOST=true`
- `NEXTAUTH_URL=https://<app-name>.azurewebsites.net`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── topics/          # Service Bus topics API
│   │   ├── dlq/             # Dead letter queue API
│   │   ├── messages/        # Active messages API
│   │   └── cosmos/          # Cosmos DB APIs
│   ├── topics/              # Topic subscription detail pages
│   ├── cosmos/              # Cosmos DB explorer pages
│   ├── instructions/        # User guide page
│   └── login/               # Login page
├── components/
│   ├── TopicList.tsx        # Topics dashboard component
│   ├── DLQViewer.tsx        # Dead letter queue viewer
│   ├── ActiveMessagesViewer.tsx  # Active messages viewer
│   └── ...
└── lib/
    ├── serviceBus.ts        # Service Bus client setup
    ├── cosmosDb.ts          # Cosmos DB client setup
    └── env.ts               # Environment variable helpers
```

## 🔒 Security Considerations

This application handles sensitive Azure credentials and connection strings. Please follow these security practices:

### Environment Configuration
- Use the provided `example.env` as a template for your environment variables
- Never commit actual `.env.local` or any files containing real connection strings
- All sensitive data should be stored in Azure Key Vault for production deployments

### Git Repository Safety
The following files are excluded from Git via `.gitignore`:
- All `.env*` files (except example templates)
- `deploy.ps1` (contains hardcoded subscription ID)
- `.vscode/settings.json` (contains Azure resource URLs)

### Deployment Scripts
- Use `deploy.ps1.template` as a template for deployments
- Never commit the actual `deploy.ps1` with real subscription IDs
- Consider using Azure DevOps variable groups or GitHub Secrets for CI/CD

### Production Best Practices
1. Use managed identities instead of connection strings when possible
2. Store all secrets in Azure Key Vault
3. Use separate service principals for different environments
4. Rotate keys and secrets regularly
5. Enable Azure AD authentication for Azure resources

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5 (Credentials provider)
- **Azure SDKs**:
  - `@azure/service-bus` - Service Bus messaging
  - `@azure/cosmos` - Cosmos DB queries
  - `@azure/identity` - Managed identity support

**⭐ If this project helps you, please give it a star!**