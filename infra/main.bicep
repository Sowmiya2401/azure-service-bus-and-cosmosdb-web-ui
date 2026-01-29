// Parameters
param location string = resourceGroup().location
param environment string = 'dev'
param locationAbbreviation string = 'uks'
param identifier string = 'app'
param keyVaultName string

// Computed names
var appName = 'azure-ui-${environment}'
var appServicePlanName = 'asp-${appName}'
var skuName = environment == 'prod' ? 'P1v2' : 'B1'

// Reference to existing Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
}

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: skuName
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// Web App with System-Assigned Managed Identity
resource webApp 'Microsoft.Web/sites@2022-03-01' = {
  name: appName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|22-lts'
      appCommandLine: 'node server.js'
      appSettings: [
        {
          name: 'NEXTAUTH_URL'
          value: 'https://${appName}.azurewebsites.net'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'AUTH_TRUST_HOST'
          value: 'true'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'false'
        }
        // Key Vault references for secrets
        {
          name: 'AUTH_SECRET'
          value: ''  // Set this manually in Azure portal after deployment
        }
        {
          name: 'AZURE_SERVICE_BUS_CONNECTION_STRING'
          value: ''  // Set this manually in Azure portal after deployment
        }
        {
          name: 'COSMOS_DB_CONNECTION_STRING'
          value: ''  // Set this manually in Azure portal after deployment
        }
      ]
    }
  }
}

// Outputs
output appServiceUrl string = 'https://${webApp.properties.defaultHostName}'
output appName string = webApp.name
output keyVaultName string = keyVaultName
output principalId string = webApp.identity.principalId
