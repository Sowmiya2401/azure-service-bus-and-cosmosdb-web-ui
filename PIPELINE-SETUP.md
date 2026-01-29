# Azure DevOps Pipeline Setup for AZURE-UI

This document describes how to set up the Azure DevOps pipeline for deploying the AZURE-UI Next.js application.

## Prerequisites

1. **Azure DevOps Project** with access to create pipelines
2. **Azure Subscription** with appropriate permissions
3. **Azure Key Vault** already provisioned in your target resource group
4. **Service Connection** configured in Azure DevOps for your Azure subscription

---

## Variable Groups

The pipeline uses variable groups for environment-specific configuration. Create a variable group for each environment (e.g., `dev-core`, `qa-core`, etc.) with the following variables:

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `IDENTIFIER` | Organization/project identifier | `app` |
| `ENVIRONMENT` | Environment name | `dev`, `qa`, `prod` |
| `SERVICE_CONNECTION` | Azure DevOps service connection name | `azure-subscription-connection` |
| `SharedResourceGroupName` | Target resource group | `rg-azure-store-dev` |
| `KeyVaultName` | Name of the Azure Key Vault | `kv-dev-secrets` |

---

## Key Vault Secrets

The following secrets **must** be created in your Azure Key Vault before deployment:

| Secret Name | Description |
|-------------|-------------|
| `AUTH-SECRET` | NextAuth.js secret for session encryption |
| `SERVICE-BUS-CONNECTION-STRING` | Azure Service Bus connection string (used by app setting `AZURE-SERVICE-BUS-CONNECTION-STRING`) |
| `COSMOS-DB-CONNECTION-STRING` | Cosmos DB connection string (used by app setting `COSMOS-DB-CONNECTION-STRING`) |

### Creating Secrets via Azure CLI

```bash
# Set your Key Vault name
KV_NAME="your-keyvault-name"

# Create secrets
az keyvault secret set --vault-name $KV_NAME --name "AUTH-SECRET" --value "your-auth-secret"
az keyvault secret set --vault-name $KV_NAME --name "SERVICE-BUS-CONNECTION-STRING" --value "Endpoint=sb://..."
az keyvault secret set --vault-name $KV_NAME --name "COSMOS-DB-CONNECTION-STRING" --value "AccountEndpoint=https://...;AccountKey=...;"
```

---

## Pipeline Setup

### 1. Create the Pipeline

1. Go to **Pipelines** > **New Pipeline**
2. Select your repository source (Azure Repos Git, GitHub, etc.)
3. Choose **Existing Azure Pipelines YAML file**
4. Select `/azure-pipelines.yml`
5. Review and run

### 2. Configure Environments

Create environments in Azure DevOps for approval gates:

1. Go to **Pipelines** > **Environments**
2. Create environments matching your `ENVIRONMENT` variable values (e.g., `dev`, `qa`, `prod`)
3. Add approval gates for production environments

---

## Pipeline Parameters

When running the pipeline, you can configure:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `variableGroupName` | Which variable group to use | `dev-core` |
| `agentPool` | Build agent pool | `Azure Pipelines` |
| `deployInfraOnly` | Skip app deployment, only deploy infrastructure | `false` |

---

## How It Works

### Build Stage
1. Installs Node.js 20.x
2. Runs `npm ci` to install dependencies
3. Builds the Next.js application with `npm run build`
4. Prepares the standalone output (copies static assets)
5. Creates a zip artifact

### Deploy Stage
1. Deploys infrastructure via Bicep template
2. Creates/updates App Service with managed identity
3. Grants the App Service access to Key Vault secrets
4. Deploys the application zip to App Service
5. Configures startup command for Next.js standalone

---

## Key Vault Integration

The App Service uses **Key Vault references** for secrets. This means:

- Secrets are **not** stored in App Service configuration
- The App Service uses its **managed identity** to access Key Vault
- Secrets are fetched at runtime from Key Vault
- Rotating secrets in Key Vault automatically updates the app (after restart)

### Key Vault Reference Format

```
@Microsoft.KeyVault(VaultName=your-vault;SecretName=SECRET-NAME)
```

---

## Troubleshooting

### App Service Cannot Access Key Vault

1. Verify the managed identity is enabled on the App Service
2. Check Key Vault access policies include the App Service's principal ID
3. Ensure the secret names match exactly (use hyphens, not underscores)

### Build Failures

1. Ensure `package-lock.json` is committed to the repository
2. Check Node.js version compatibility (20.x required)

### Deployment Failures

1. Verify the service connection has Contributor access to the resource group
2. Check that the Key Vault exists before running the pipeline

---

## Local Development

For local development, continue using `.env.local` with the actual secret values:

```env
AZURE_SERVICE_BUS_CONNECTION_STRING="Endpoint=sb://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
AUTH_USERNAME="your-username"
AUTH_PASSWORD="your-password"
```

`AUTH_USERNAME` and `AUTH_PASSWORD` are always plain environment variables, both locally and in App Service. Set them directly on the Web App for each environment.

**Never commit `.env.local` to source control.**
