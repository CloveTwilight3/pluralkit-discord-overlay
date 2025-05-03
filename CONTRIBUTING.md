# Contributing to PluralKit Discord Overlay

Thank you for your interest in contributing to the PluralKit Discord Overlay! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Pull Request Process](#pull-request-process)
5. [Coding Standards](#coding-standards)
6. [Testing](#testing)
7. [Documentation](#documentation)
8. [Accessibility Considerations](#accessibility-considerations)

## Code of Conduct

This project is intended to be a safe, welcoming space for collaboration. All contributors are expected to adhere to the following code of conduct:

- Be respectful and inclusive of all individuals
- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/clove-nytrix-doughmination-twilight.git
   cd clove-nytrix-doughmination-twilight
   ```
3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/CloveTwilight3/clove-nytrix-doughmination-twilight.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

## Development Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/your-bugfix-name
   ```

2. Make your changes

3. Run linting and type checking:
   ```bash
   npm run lint
   npm run type-check
   ```

4. Test your changes:
   ```bash
   npm run test
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Build the project to ensure it compiles correctly:
   ```bash
   npm run build
   ```

7. Commit your changes with a descriptive message:
   ```bash
   git commit -m "Add feature: your feature description"
   ```

8. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

## Pull Request Process

1. Update the README.md or documentation with details of your changes, if applicable
2. Update the CHANGELOG.md with your changes under the "Unreleased" section
3. Make sure all tests pass and the build succeeds
4. Submit a pull request to the main repository
5. The PR should clearly describe the changes and their purpose
6. Wait for maintainers to review your PR
7. Address any feedback or requested changes
8. Once approved, your PR will be merged

## Coding Standards

This project follows specific coding standards to maintain consistency:

- Use TypeScript for all new code
- Follow the eslint and prettier configurations in the project
- Use meaningful variable and function names
- Write comments for complex logic
- Use React functional components with hooks
- Follow the existing project architecture
- Keep components small and focused on a single responsibility

## Testing

When adding new features or fixing bugs, please include tests:

- Unit tests for utility functions
- Component tests for React components
- Integration tests for complex features

Run the tests with:
```bash
npm run test
```

## Documentation

Good documentation is crucial for this project:

- Document new features in the README.md and DOCUMENTATION.md
- Update the CHANGELOG.md with your changes
- Add comments to complex code
- Document APIs and interfaces with JSDoc comments
- Update type definitions for better developer experience

## Accessibility Considerations

This project aims to be an accessibility tool for plural systems, so accessibility is a key priority:

- Ensure all UI elements have appropriate contrast ratios
- Add aria attributes to interactive elements
- Make sure the overlay is keyboard navigable
- Test with screen readers
- Consider colorblind-friendly color schemes
- Support different display preferences

Thank you for contributing to the PluralKit Discord Overlay!