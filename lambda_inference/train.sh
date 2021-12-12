#/bin/bash
set -e

# Get dir of script and move to model dir
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $SCRIPT_DIR

# Start training
train () {
    source tutorial_venv/bin/activate
    cd src/model
    python train.py
}

train