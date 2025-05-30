# SizeWise Suite

Professional HVAC engineering calculation tools for duct sizing, pressure loss analysis, and system design.

## 🚀 Features

- **Air Duct Sizer**: Calculate duct dimensions, velocity, and pressure loss with SMACNA compliance
- **Real-time Validation**: Instant feedback and standards compliance checking
- **Dark/Light Theme**: Professional interface with accessibility support
- **Offline Ready**: Works seamlessly without internet connection
- **Mobile Responsive**: Optimized for field use on tablets and phones

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design tokens
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
/
├── app/                    # Core application modules
│   ├── config/            # Environment configurations
│   ├── core/              # Shared logic and validators
│   ├── tools/             # Individual HVAC tools
│   └── ...
├── src/                   # React application source
│   ├── components/        # UI components
│   ├── pages/             # Page components
│   ├── providers/         # Context providers
│   └── ...
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SizeWise_Suite
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 🏗️ Building

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run storybook` - Start Storybook (coming soon)

## 🎯 Roadmap

### Phase 0.1 - Foundation ✅
- [x] Project setup with modern toolchain
- [x] Core UI components and layout
- [x] Air Duct Sizer (basic implementation)
- [x] Testing infrastructure
- [x] CI/CD pipeline

### Phase 0.2 - Enhanced Duct Sizer
- [ ] SMACNA table integration
- [ ] Advanced pressure loss calculations
- [ ] Material and gauge selection
- [ ] Export functionality

### Phase 0.3 - Additional Tools
- [ ] Grease Duct Sizer (NFPA 96 compliance)
- [ ] Boiler Vent Sizer
- [ ] Engine Exhaust Sizer

### Phase 1.0 - Advanced Features
- [ ] Simulation canvas
- [ ] Multi-language support
- [ ] Cloud sync
- [ ] Advanced reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built following SMACNA, NFPA, and UL standards
- Designed for professional HVAC engineers and estimators
- Inspired by the need for accurate, field-ready calculation tools
