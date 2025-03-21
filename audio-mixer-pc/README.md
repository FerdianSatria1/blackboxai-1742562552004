# Audio Mixer PC

A cross-platform desktop audio mixer application similar to GoXLR, built with Electron, React, and Tailwind CSS.

## Features

- Multi-channel audio mixing
- Real-time volume control
- Audio routing matrix
- VU meters with peak detection
- Preset management
- Modern, responsive UI
- Cross-platform support (Windows, macOS, Linux)

## Prerequisites

- Node.js 16.x or later
- npm 7.x or later

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/audio-mixer-pc.git
cd audio-mixer-pc
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

This will:
- Start the Electron application
- Watch for changes in React components
- Compile Tailwind CSS
- Enable hot reloading

## Building

Build the application for your current platform:
```bash
npm run build
```

Build for specific platforms:
```bash
npm run package:win    # Windows
npm run package:mac    # macOS
npm run package:linux  # Linux
```

## Project Structure

```
audio-mixer-pc/
├── src/
│   ├── components/    # React components
│   ├── audio/        # Audio processing logic
│   ├── utils/        # Utility functions
│   ├── styles/       # CSS styles
│   ├── App.js        # Main React component
│   └── index.html    # HTML template
├── main.js           # Electron main process
├── preload.js        # Electron preload script
└── package.json      # Project configuration
```

## Technology Stack

- **Electron**: Cross-platform desktop application framework
- **React**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Web Audio API**: Audio processing
- **Webpack**: Module bundling
- **Babel**: JavaScript compilation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Inspired by the TC Helicon GoXLR
- Built with modern web technologies
- Uses Tailwind CSS for styling
- Font Awesome for icons
- Google Fonts for typography