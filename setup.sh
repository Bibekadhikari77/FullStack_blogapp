#!/bin/bash

echo "🚀 Setting up Blog Platform..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null
then
    echo "⚠️  MongoDB is not installed or not in PATH"
    echo "Please install MongoDB: https://docs.mongodb.com/manual/installation/"
    echo ""
else
    echo "✅ MongoDB is installed"
    echo ""
fi

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your configuration!"
fi

echo "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd frontend

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file from .env.local.example..."
    cp .env.local.example .env.local
fi

echo "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Make sure MongoDB is running"
echo "2. Edit backend/.env with your configuration"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Start the frontend: cd frontend && npm run dev"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   API:      http://localhost:5000/api"
echo ""
echo "📚 Check README.md for detailed instructions"
