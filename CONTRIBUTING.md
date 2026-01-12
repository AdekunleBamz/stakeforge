# Contribution Guidelines

Thank you for your interest in contributing to StakeForge! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- MetaMask or compatible wallet
- Base mainnet ETH for testing

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/stakeforge.git
   cd stakeforge
   ```
3. Install dependencies:
   ```bash
   npm install
   cd stakeforge-ui && npm install
   ```
4. Create a branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Code Style

- Use TypeScript for all new frontend code
- Follow Solidity style guide for smart contracts
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat(staking): add batch stake functionality
fix(ui): resolve wallet connection timeout
docs: update deployment instructions
test(contracts): add edge case tests for rewards
```

### Pull Request Process

1. Ensure all tests pass locally
2. Update documentation if needed
3. Add tests for new features
4. Fill out the PR template completely
5. Request review from maintainers
6. Address review feedback promptly

### Testing

#### Smart Contracts
```bash
npx hardhat test
npx hardhat coverage
```

#### Frontend
```bash
cd stakeforge-ui
npm run test
npm run test:coverage
```

## Code Review Guidelines

### For Authors

- Keep PRs focused and small
- Provide context in the description
- Respond to feedback constructively
- Test your changes thoroughly

### For Reviewers

- Be respectful and constructive
- Explain the reasoning behind suggestions
- Approve when satisfied, don't block unnecessarily
- Focus on correctness, security, and maintainability

## Security

### Reporting Vulnerabilities

- DO NOT open public issues for security vulnerabilities
- Email security@stakeforge.io
- See [SECURITY.md](./SECURITY.md) for details

### Security Considerations

- All smart contract changes require extra scrutiny
- Gas optimizations should not compromise security
- Access control changes need thorough review

## Smart Contract Guidelines

### Best Practices

1. **Access Control**: Use OpenZeppelin's access control patterns
2. **Reentrancy**: Apply ReentrancyGuard where needed
3. **Events**: Emit events for all state changes
4. **Validation**: Check inputs before processing
5. **Gas**: Optimize for Base mainnet's low fees

### Testing Requirements

- Unit tests for all public functions
- Integration tests for contract interactions
- Edge case coverage
- Gas usage benchmarks

## Frontend Guidelines

### Component Structure

```
src/
├── components/     # React components
├── hooks/          # Custom hooks
├── utils/          # Helper functions
├── types/          # TypeScript types
├── constants/      # App constants
└── config/         # Configuration
```

### Styling

- Use CSS modules or styled-components
- Follow BEM naming convention for CSS classes
- Ensure responsive design
- Test on multiple browsers

### State Management

- Use React hooks for local state
- Custom hooks for shared logic
- Keep components focused

## Documentation

- Update README.md for user-facing changes
- Document all public APIs
- Add inline comments for complex logic
- Keep documentation current

## Community

### Code of Conduct

- Be respectful and inclusive
- Help newcomers
- Accept constructive criticism
- Focus on the best outcome for the project

### Getting Help

- Open a GitHub Discussion for questions
- Join our Discord for real-time chat
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

*Thank you for contributing to StakeForge! 🔨*
