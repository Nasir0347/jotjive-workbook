#!/bin/bash

# JotJive Workbook Setup Script
# Usage: ./setup.sh

echo "============================================"
echo "JOTJIVE WORKBOOK SHELL - Setup"
echo "============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version is $NODE_VERSION. Recommended: 18+"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Check for PDF files
echo "📄 Checking for workbook PDF files..."
PDF_DIR="public/workbooks/JJ05SS02"

if [ ! -d "$PDF_DIR" ]; then
    mkdir -p "$PDF_DIR"
fi

PDF_COUNT=$(find "$PDF_DIR" -name "*.pdf" | wc -l)

if [ "$PDF_COUNT" -eq 0 ]; then
    echo "⚠️  No PDF files found in $PDF_DIR"
    echo ""
    echo "Please add the following PDF files:"
    echo "  - T-2.pdf (Teaching page)"
    echo "  - T-3.pdf (Teaching page)"
    echo "  - Q-5.pdf (Question page)"
    echo "  - A-6.pdf (Answer page)"
    echo ""
    echo "Or use placeholder images for testing."
else
    echo "✅ Found $PDF_COUNT PDF file(s)"
fi

echo ""
echo "============================================"
echo "Setup complete!"
echo "============================================"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
echo ""
