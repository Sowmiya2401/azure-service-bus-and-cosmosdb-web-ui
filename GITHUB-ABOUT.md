# GitHub About Section Description

## Short Description (160 characters max):
A modern web application for managing Azure Service Bus topics/subscriptions and exploring Cosmos DB data with a clean, intuitive interface.

## Full Description:
Azure UI is a comprehensive web application designed to simplify Azure Service Bus and Cosmos DB management. Built with Next.js 16 and TypeScript, it provides a modern, responsive interface for monitoring message flows, inspecting dead letter queues, and browsing database contents.

### 🚀 Key Features:
- **Service Bus Management**: View topics, subscriptions, and message counts in real-time
- **DLQ Viewer**: Inspect and resubmit failed messages from dead letter queues
- **Message Inspection**: Peek at active messages without consuming them
- **Cosmos DB Explorer**: Browse databases, containers, and items with ease
- **SQL Query Editor**: Execute custom queries against your Cosmos DB containers
- **Secure Authentication**: Built-in authentication with NextAuth.js

### 🛠 Tech Stack:
- Frontend: Next.js 16, TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- Authentication: NextAuth.js v5
- Azure Integration: Service Bus SDK, Cosmos DB SDK, Azure Identity

### 🔒 Security First:
- Environment-based configuration
- Support for managed identities
- No hardcoded secrets
- Template files for sensitive configurations

### 📦 Deployment Ready:
- Azure App Service optimized
- Infrastructure as Code with Bicep
- Azure DevOps pipeline included
- PowerShell deployment scripts

Perfect for developers and administrators who need a user-friendly interface to manage their Azure messaging and database services without using the Azure portal directly.
