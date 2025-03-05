# 🚰 FlopFaucet

<div align="center">

[![JavaScript](https://img.shields.io/badge/JavaScript-81.9%25-yellow.svg)]()
[![CSS](https://img.shields.io/badge/CSS-18.1%25-blue.svg)]()
[![License](https://img.shields.io/github/license/TechnoVisionDev/FlopFaucet)](LICENSE)
[![Issues](https://img.shields.io/github/issues/TechnoVisionDev/FlopFaucet)](https://github.com/TechnoVisionDev/FlopFaucet/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/TechnoVisionDev/FlopFaucet)](https://github.com/TechnoVisionDev/FlopFaucet/pulls)

_A web-based faucet for distributing free Flopcoin (FLOP) to the community! 🪙_

</div>

## 📝 Description

FlopFaucet is a web application designed to distribute free Flopcoin (FLOP) to community members. This faucet serves as an entry point for new users to obtain their initial FLOP tokens and participate in the Flopcoin ecosystem.

## ✨ Features

- 🌐 User-friendly web interface
- 💧 Automated FLOP token distribution
- ⏱️ Cooldown system to prevent abuse
- 🔒 Secure transaction handling
- 📱 Responsive design for all devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Web3 wallet (e.g., MetaMask)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TechnoVisionDev/FlopFaucet.git
cd FlopFaucet
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## 🛠️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
NETWORK_RPC_URL=your_rpc_url
FAUCET_PRIVATE_KEY=your_private_key
FLOP_CONTRACT_ADDRESS=contract_address
```

## 🔧 Usage

2. Input your Flopcoin wallet address.
3. Complete captcha to verify you are a human.
4. Click "Request FLOP" to receive coins.
5. Wait for the 1 hour cooldown period before requesting again.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- GitHub: [@TechnoVisionDev](https://github.com/TechnoVisionDev)
- Project Link: [https://github.com/TechnoVisionDev/FlopFaucet](https://github.com/TechnoVisionDev/FlopFaucet)

---
<div align="center">
Made with ❤️ by TechnoVision
</div>
