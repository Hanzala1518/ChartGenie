# Contributing to ChartGenie# Contributing to ChartGenie



Thank you for considering contributing to ChartGenie! We welcome contributions from the community.Thank you for your interest in contributing to ChartGenie! This guide will help you get started.



## 📋 Code of Conduct## 🎯 Ways to Contribute



By participating in this project, you agree to maintain a respectful and collaborative environment.- 🐛 Report bugs

- 💡 Suggest new features

## 🚀 How to Contribute- 📝 Improve documentation

- 🎨 Enhance UI/UX

### Reporting Bugs- ⚡ Optimize performance

- 🧪 Add tests

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/chartgenie/issues)- 🌍 Add internationalization

2. If not, create a new issue with:- 📊 Add new chart types

   - Clear title and description

   - Steps to reproduce## 🚀 Getting Started

   - Expected vs actual behavior

   - Screenshots if applicable### 1. Fork the Repository

   - Your environment (OS, browser, Node version)Click the "Fork" button on GitHub to create your own copy.



### Suggesting Features### 2. Clone Your Fork

```bash

1. Check [existing feature requests](https://github.com/yourusername/chartgenie/issues?q=is%3Aissue+label%3Aenhancement)git clone https://github.com/YOUR_USERNAME/chartgenie.git

2. Create a new issue with:cd chartgenie

   - Clear use case```

   - Expected behavior

   - Why this would be useful### 3. Create a Branch

   - Mockups or examples (if applicable)```bash

git checkout -b feature/your-feature-name

### Pull Requests# or

git checkout -b fix/bug-description

1. **Fork the repository**```

   ```bash

   git clone https://github.com/yourusername/chartgenie.git### 4. Install Dependencies

   cd chartgenie```bash

   ```npm install

```

2. **Create a feature branch**

   ```bash### 5. Set Up Development Environment

   git checkout -b feature/your-feature-nameFollow the instructions in `SETUP.md` to configure Supabase and environment variables.

   ```

## 📝 Development Guidelines

3. **Make your changes**

   - Follow existing code style### Code Style

   - Add comments where needed

   - Update documentation if necessary#### JavaScript/JSX

- Use functional components with hooks

4. **Test your changes**- Follow React best practices

   ```bash- Use destructuring for props

   npm run dev    # Test locally- Keep components small and focused

   npm run build  # Ensure it builds- Add JSDoc comments for complex functions

   ```

```javascript

5. **Commit your changes**/**

   ```bash * Generate chart configuration for bar charts

   git add . * @param {Array} data - Array of data objects

   git commit -m "feat: add amazing feature" * @param {Object} config - Chart configuration

   ``` * @returns {Object} ECharts option object

 */

   Use conventional commit messages:export function getBarChartConfig(data, config) {

   - `feat:` - New feature  // Implementation

   - `fix:` - Bug fix}

   - `docs:` - Documentation changes```

   - `style:` - Code style changes (formatting)

   - `refactor:` - Code refactoring#### Component Structure

   - `test:` - Adding tests```javascript

   - `chore:` - Maintenance tasksimport { useState, useEffect } from 'react'

import { Button } from '@/components/ui/Button'

6. **Push to your fork**

   ```bashexport function MyComponent({ prop1, prop2 }) {

   git push origin feature/your-feature-name  // 1. Hooks

   ```  const [state, setState] = useState(null)

  

7. **Create a Pull Request**  // 2. Effects

   - Go to the original repository  useEffect(() => {

   - Click "New Pull Request"    // Side effects

   - Select your branch  }, [dependencies])

   - Describe your changes clearly  

   - Link related issues  // 3. Handlers

  const handleClick = () => {

## 💻 Development Setup    // Handle event

  }

1. Install dependencies:  

   ```bash  // 4. Render

   npm install  return (

   ```    <div>

      {/* JSX */}

2. Set up Supabase:    </div>

   - Create a project at [supabase.com](https://supabase.com)  )

   - Run `supabase/setup.sql` in SQL Editor}

   - Deploy Edge Functions```



3. Configure environment:#### Styling

   ```bash- Use Tailwind CSS utility classes

   cp .env.example .env- Create custom utilities in `index.css` for reusable styles

   # Fill in your Supabase and Groq API keys- Use `cn()` utility for conditional classes

   ```- Follow mobile-first responsive design



4. Start dev server:```javascript

   ```bash<div className={cn(

   npm run dev  "base-classes",

   ```  variant === 'primary' && "primary-classes",

  isActive && "active-classes"

## 📝 Code Style)}>

```

- Use **Prettier** for formatting

- Use **ESLint** for linting### File Organization

- Follow React best practices

- Use meaningful variable names```

- Comment complex logicsrc/

- Keep functions small and focused├── components/        # React components

│   ├── feature/      # Feature-specific components

## 🧪 Testing│   └── ui/           # Reusable UI components

├── hooks/            # Custom React hooks

- Test your changes manually before submitting├── lib/              # Utility functions and configurations

- Ensure all chart types render correctly├── pages/            # Page components (one per route)

- Test with different CSV files└── App.jsx           # Main app component

- Check authentication flows```

- Verify AI chat responses

### Naming Conventions

## 📚 Documentation

- **Components**: PascalCase (`MyComponent.jsx`)

- Update README.md if adding features- **Hooks**: camelCase with 'use' prefix (`useMyHook.js`)

- Add JSDoc comments to new functions- **Utils**: camelCase (`myUtilFunction.js`)

- Update inline comments as needed- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINT`)

- **CSS Classes**: kebab-case or Tailwind utilities

## ⚖️ License

## 🎨 Adding New Features

By contributing, you agree that your contributions will be licensed under the MIT License.

### Adding a New Chart Type

## 🙏 Thank You!

1. **Create chart configuration** in `src/lib/chartConfigs.js`:

Every contribution helps make ChartGenie better. We appreciate your time and effort!

```javascript
export function getMyChartConfig(data, config) {
  return {
    // ECharts configuration
    tooltip: { /* ... */ },
    xAxis: { /* ... */ },
    yAxis: { /* ... */ },
    series: [{ /* ... */ }]
  }
}
```

2. **Update DynamicChart component** in `src/components/charts/DynamicChart.jsx`:

```javascript
case 'mychart':
  return getMyChartConfig(chartData, chartSpec.config)
```

3. **Update AI system prompt** in `supabase/functions/rag-query/index.ts`:

```typescript
- mychart: Description (config: {field1: "col", field2: "col"})
```

4. **Add to auto-generation** in `src/hooks/useGenie.js` if applicable:

```javascript
if (condition) {
  charts.push({
    chartType: 'mychart',
    config: { /* ... */ }
  })
}
```

### Adding a New Page

1. **Create page component** in `src/pages/MyPage.jsx`:

```javascript
export function MyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page content */}
    </div>
  )
}
```

2. **Add route** in `src/App.jsx`:

```javascript
<Route path="/mypage" element={<MyPage />} />
```

3. **Add navigation** where needed:

```javascript
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()
navigate('/mypage')
```

### Adding a New UI Component

1. **Create component** in `src/components/ui/MyComponent.jsx`
2. **Follow shadcn/ui patterns** for consistency
3. **Export from component file**
4. **Document props** with JSDoc

## 🧪 Testing

### Manual Testing
- Test in multiple browsers
- Test responsive design (mobile, tablet, desktop)
- Test with different data types
- Test error scenarios
- Test loading states

### Before Submitting
- [ ] Code runs without errors
- [ ] No console warnings
- [ ] All features work as expected
- [ ] Responsive on all screen sizes
- [ ] No accessibility issues
- [ ] Documentation updated

## 📚 Documentation

### When to Update Documentation

- Adding new features → Update README.md and FEATURES.md
- Changing setup steps → Update SETUP.md
- Fixing common issues → Update TROUBLESHOOTING.md
- Adding APIs → Update QUICK_REFERENCE.md

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Provide step-by-step instructions
- Use emojis for visual hierarchy 🎨

## 🐛 Reporting Bugs

### Before Reporting
1. Check existing issues
2. Try latest version
3. Verify it's not a setup issue (check TROUBLESHOOTING.md)

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Node version: [e.g. 18.17.0]

**Additional context**
Any other relevant information.
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Mockups, examples, or references.
```

## 🔄 Pull Request Process

### 1. Prepare Your Changes
```bash
# Update your branch
git pull origin main

# Make your changes
# ...

# Commit with clear message
git add .
git commit -m "feat: add new chart type for xyz"
```

### 2. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request
- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your fork and branch
- Fill out the PR template

### 4. PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested in multiple browsers

## Screenshots (if applicable)
Add screenshots showing the changes.
```

### Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add heatmap chart type
fix: resolve upload modal not closing
docs: update setup instructions
style: format code with prettier
refactor: simplify chart config logic
perf: optimize CSV parsing
```

## 🎯 Good First Issues

Looking to contribute? Start with these:

- [ ] Add loading spinner to button component
- [ ] Improve error messages
- [ ] Add tooltips to dashboard cards
- [ ] Create dark/light theme toggle
- [ ] Add keyboard shortcuts
- [ ] Improve mobile navigation
- [ ] Add chart export feature
- [ ] Create demo video
- [ ] Translate to another language

## 🌟 Recognition

Contributors will be:
- Listed in README.md
- Credited in release notes
- Given a shoutout on social media (with permission)

## 📞 Getting Help

- 💬 Open a discussion on GitHub
- 📧 Contact maintainers
- 📚 Read documentation
- 🔍 Search existing issues

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

- ✅ Be respectful and inclusive
- ✅ Accept constructive criticism
- ✅ Focus on what's best for the community
- ✅ Show empathy towards others

- ❌ No harassment or trolling
- ❌ No personal attacks
- ❌ No public or private harassment
- ❌ No inappropriate conduct

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to ChartGenie! 🙏✨

Together, we're making data visualization accessible to everyone! 🎨📊
