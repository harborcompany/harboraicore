#!/bin/bash

# Harbor AI - Exclusive Dev Environment Starter
# Reserves ports 3000 (Backend) and 8000 (Annotator)
# Kills any existing processes on these ports to ensure exclusivity.

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_ROOT="/Users/akeemojuko/.gemini/antigravity/scratch/harboraicore"
BACKEND_DIR="$PROJECT_ROOT/backend"
ANNOTATOR_DIR="$PROJECT_ROOT/auto-annotator"

echo -e "${GREEN}🔒 HARBOR AI - Exclusive Dev Mode${NC}"
echo "-----------------------------------"

# Function to check and free port
check_port() {
    PORT=$1
    echo -n "Checking Port $PORT... "
    
    PID=$(lsof -ti:$PORT || true)
    
    if [ -n "$PID" ]; then
        echo -e "${YELLOW}OCCUPIED by PID $PID${NC}"
        PROCESS_NAME=$(ps -p $PID -o comm=)
        echo "   Process: $PROCESS_NAME"
        
        # Kill strictly
        echo -e "   ${RED}Killing conflicting process to enforce exclusivity...${NC}"
        kill -9 $PID
        echo "   Port $PORT freed."
    else
        echo -e "${GREEN}FREE${NC}"
    fi
}

# 1. Enforce Port Exclusivity
check_port 3000
check_port 8000

echo "-----------------------------------"

# 2. Setup Python Environment (Annotator)
echo -e "${YELLOW}>> Setting up Auto-Annotator (Port 8000)...${NC}"
cd "$ANNOTATOR_DIR"

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

# Start Uvicorn in background
echo -e "${GREEN}>> Starting Uvicorn (Auto-Annotator)...${NC}"
uvicorn src.main:app --reload --port 8000 > "$PROJECT_ROOT/annotator.log" 2>&1 &
ANNOTATOR_PID=$!
echo "   PID: $ANNOTATOR_PID"

# 3. Setup Node Environment (Backend)
echo "-----------------------------------"
echo -e "${YELLOW}>> Setting up Backend (Port 3000)...${NC}"
cd "$BACKEND_DIR"

# Check node_modules
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install > /dev/null 2>&1
fi

# Start Backend
echo -e "${GREEN}>> Starting Express Server...${NC}"
# We execute this in foreground so user can see main logs, 
# but trap exit to kill python service
trap "kill $ANNOTATOR_PID" EXIT

npm run dev
