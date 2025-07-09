#!/bin/bash

echo "🚀 Setting up TikTok Analytics Dashboard..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Python and Node.js are installed"

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit backend/.env with your Supabase credentials"
fi

cd ..

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

cd ..

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your Supabase credentials"
echo "2. Start the backend: cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo "3. Start the frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "🌐 For production deployment:"
echo "- Backend: Deploy to Railway, Render, or DigitalOcean"
echo "- Frontend: Deploy to Vercel using 'npx vercel'" 