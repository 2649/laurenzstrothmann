#!/bin/bash
set -e

# Get dir of script and move to this dir
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $SCRIPT_DIR

# Install venvs for lambda test and neural network training
python3 -m venv tutorial_venv

install () {
    source tutorial_venv/bin/activate
    pip install -r src/lambda/lambda_functions/source/object_detection/requirements.txt
    pip install -r src/model/requirements.txt
    pip3 install taskcat
}

install