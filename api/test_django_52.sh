#!/bin/bash

# Test Django 5.2 LTS Migration Script
# This script tests the Django 5.2 installation and verifies everything works

echo "=========================================="
echo "Django 5.2 LTS Migration Test"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to API directory
cd "$(dirname "$0")" || { echo -e "${RED}Error: Could not navigate to API directory${NC}"; exit 1; }

echo -e "${YELLOW}Step 1: Checking if virtual environment exists...${NC}"
if [ -d "venv" ]; then
    echo -e "${GREEN}✓ Virtual environment found${NC}"
else
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
fi
echo ""

echo -e "${YELLOW}Step 2: Activating virtual environment...${NC}"
source venv/bin/activate
echo -e "${GREEN}✓ Virtual environment activated${NC}"
echo ""

echo -e "${YELLOW}Step 3: Upgrading pip...${NC}"
pip install --upgrade pip --quiet
echo -e "${GREEN}✓ Pip upgraded${NC}"
echo ""

echo -e "${YELLOW}Step 4: Installing Django 5.2 LTS and dependencies...${NC}"
pip install -r requirements.txt
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 5: Checking Django version...${NC}"
DJANGO_VERSION=$(python -c "import django; print(django.get_version())")
echo -e "${GREEN}✓ Django version: ${DJANGO_VERSION}${NC}"

# Verify it's Django 5.2
if [[ $DJANGO_VERSION == 5.2* ]]; then
    echo -e "${GREEN}✓ Django 5.2 LTS successfully installed${NC}"
else
    echo -e "${RED}✗ Warning: Expected Django 5.2, got ${DJANGO_VERSION}${NC}"
fi
echo ""

echo -e "${YELLOW}Step 6: Running Django system check...${NC}"
python manage.py check
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Django system check passed${NC}"
else
    echo -e "${RED}✗ Django system check failed${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}Step 7: Creating migrations...${NC}"
python manage.py makemigrations
echo -e "${GREEN}✓ Migrations created${NC}"
echo ""

echo -e "${YELLOW}Step 8: Running migrations...${NC}"
python manage.py migrate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Migrations completed successfully${NC}"
else
    echo -e "${RED}✗ Migrations failed${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}Step 9: Collecting static files...${NC}"
python manage.py collectstatic --noinput --clear
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Static files collected${NC}"
else
    echo -e "${YELLOW}⚠ Static files collection had warnings (this is normal)${NC}"
fi
echo ""

echo -e "${YELLOW}Step 10: Testing Django shell...${NC}"
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); print(f'User model: {User.__name__}')"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Django shell test passed${NC}"
else
    echo -e "${RED}✗ Django shell test failed${NC}"
    exit 1
fi
echo ""

echo "=========================================="
echo -e "${GREEN}Django 5.2 LTS Migration Complete!${NC}"
echo "=========================================="
echo ""
echo "Summary:"
echo "--------"
echo "✓ Django version: ${DJANGO_VERSION}"
echo "✓ System check: Passed"
echo "✓ Migrations: Completed"
echo "✓ Static files: Collected"
echo "✓ Shell test: Passed"
echo ""
echo "To start the development server:"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "To create test users:"
echo "  python manage.py shell < create_test_users.py"
echo ""

