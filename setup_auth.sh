#!/bin/bash

# Authentication Setup Script
# This script sets up the Django backend and creates test users

echo "=========================================="
echo "Authentication Setup Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to API directory
cd api || { echo -e "${RED}Error: api directory not found${NC}"; exit 1; }

echo -e "${YELLOW}Step 1: Creating virtual environment...${NC}"
python3 -m venv venv
echo -e "${GREEN}✓ Virtual environment created${NC}"
echo ""

echo -e "${YELLOW}Step 2: Activating virtual environment...${NC}"
source venv/bin/activate
echo -e "${GREEN}✓ Virtual environment activated${NC}"
echo ""

echo -e "${YELLOW}Step 3: Installing dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 4: Running migrations...${NC}"
python manage.py makemigrations
python manage.py migrate
echo -e "${GREEN}✓ Migrations completed${NC}"
echo ""

echo -e "${YELLOW}Step 5: Creating test users...${NC}"
python manage.py shell < create_test_users.py
echo -e "${GREEN}✓ Test users created${NC}"
echo ""

echo "=========================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Test Users Created:"
echo "-------------------"
echo "1. Rider:      rider@shyft.com / password123"
echo "2. Admin:      admin@shyft.com / password123"
echo "3. Club:       club@byteorbit.com / password123"
echo "4. Provincial: provincial@byteorbit.com / password123"
echo "5. SAEF:       saef@shyft.com / password123"
echo ""
echo "To start the Django server:"
echo "  cd api"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "To start the Angular frontend:"
echo "  cd full-version"
echo "  npm install"
echo "  npm start"
echo ""

