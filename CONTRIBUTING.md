# Contributing to Azure UI

Thank you for your interest in contributing to Azure UI! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs
- Use the [Issues](https://github.com/bradmca/azure-service-bus-and-cosmosdb-web-ui/issues) page
- Provide clear description of the bug
- Include steps to reproduce
- Add screenshots if applicable
- Specify your environment (OS, browser, Node.js version)

### Suggesting Features
- Open an issue with the "enhancement" label
- Describe the feature and its use case
- Explain why it would be valuable

### Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📋 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Azure CLI (for Azure deployment)
- Git

### Setup Steps
```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/azure-service-bus-and-cosmosdb-web-ui.git
cd azure-service-bus-and-cosmosdb-web-ui

# Install dependencies
npm install

# Create environment file
cp example.env .env.local
# Edit .env.local with your Azure credentials

# Run development server
npm run dev
```

## 🎯 Coding Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### React/Next.js
- Use functional components with hooks
- Follow React best practices
- Keep components small and focused
- Use proper TypeScript types

### CSS/Styling
- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistency with existing design system

### Code Style
- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas where appropriate
- Keep lines under 100 characters

## 📝 Commit Guidelines

Use semantic commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for adding or updating tests
- `chore:` for maintenance tasks

Examples:
```
feat: add Cosmos DB query export functionality
fix: resolve DLQ message pagination issue
docs: update API documentation
```

## 🧪 Testing

### Running Tests
```bash
# Run linting
npm run lint

# Run type checking
npm run type-check
```

### Test Coverage
- Add tests for new features
- Ensure all critical paths are tested
- Maintain test coverage above 80%

## 📖 Documentation

- Update README.md for significant changes
- Add inline comments for complex logic
- Update API documentation for endpoint changes
- Add examples for new features

## 🚀 Pull Request Process

1. Ensure your PR description clearly describes the changes
2. Link to relevant issues
3. Include screenshots for UI changes
4. Update documentation if needed
5. Ensure CI/CD passes
6. Request code review from maintainers

## 🏷️ Labels

Common labels used:
- `bug` - Bug reports and fixes
- `enhancement` - Feature requests
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Community help requested
- `priority/high` - High priority issues

## 💬 Getting Help

- Check existing issues and discussions
- Read the documentation
- Ask questions in discussions
- Join our community (link to be added)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Code of Conduct

Please be respectful and professional in all interactions. Follow the [Code of Conduct](CODE_OF_CONDUCT.md).

---

Thank you for contributing to Azure UI! 🎉
