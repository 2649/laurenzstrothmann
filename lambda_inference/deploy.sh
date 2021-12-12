#!/bin/bash
set -e

# Get dir of script and move to this dir
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $SCRIPT_DIR


# Copy class map to lambda code, upload model.onnx and add 
./deploy.py

# Runt test of lambda
source tutorial_venv/bin/activate; pytest

# Deploy via taskcat
cd src/lambda
taskcat test run -n