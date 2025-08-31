# YouTube Gesture Controller

A full-stack web application showcasing a Python-based gesture control system for YouTube playback.

## Project Overview

This project consists of two main parts:
1. A Python-based gesture control system for YouTube
2. A web application to showcase and document the system

## Tech Stack

### Frontend
- React
- TailwindCSS
- Framer Motion
- TypeScript

### Backend
- Node.js
- Express
- MongoDB
- TypeScript

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Python 3.8+ (for the gesture controller)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/youtube-gesture-controller.git
cd youtube-gesture-controller
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Set up environment variables:
```bash
# In backend directory
cp .env.example .env
# Edit .env with your configuration
```

5. Start the development servers:

Frontend:
```bash
cd frontend
npm run dev
```

Backend:
```bash
cd backend
npm run dev
```

## Project Structure

```
youtube-gesture-controller/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── styles/       # Global styles
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
│
├── backend/               # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── utils/        # Utility functions
│   └── config/           # Configuration files
│
└── gesture-controller/    # Python gesture control system
    ├── src/              # Source code
    └── requirements.txt  # Python dependencies
```

## Features

- Interactive landing page with project showcase
- Detailed documentation of gesture controls
- Live demo section
- Technical blog with implementation details
- Download section for the gesture controller
- User authentication (optional)
- Gesture recording and testing (optional)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
