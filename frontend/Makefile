# Define Node.js version (optional, adjust as needed)
NODE_VERSION ?= 18

# Detect OS
OS := $(shell uname)

# Install dependencies
install:
	@echo "Checking and installing dependencies..."
	@if ! command -v node > /dev/null; then \
	  echo "Installing Node.js..."; \
	  if [ "$(OS)" = "Darwin" ]; then \
	    brew install node@$(NODE_VERSION); \
	  else \
	    curl -fsSL https://deb.nodesource.com/setup_$(NODE_VERSION).x | sudo -E bash -; \
	    sudo apt install -y nodejs; \
	  fi \
	else \
	  echo "Node.js is already installed."; \
	fi

	@if ! command -v npm > /dev/null; then \
	  echo "npm is missing! Install manually."; \
	  exit 1; \
	fi

	@if ! command -v ng > /dev/null; then \
	  echo "Installing Angular CLI..."; \
	  npm install -g @angular/cli; \
	else \
	  echo "Angular CLI is already installed."; \
	fi

# Install project dependencies
setup:
	@echo "Installing project dependencies..."
	@npm install

# Start Angular development server
start:
	@echo "Starting Angular development server..."
	@ng serve --host 0.0.0.0 --port 4200

# Clean node_modules and reinstall
clean:
	@echo "Cleaning project dependencies..."
	@rm -rf node_modules package-lock.json
	@npm install

# Run install, setup, and start in one command
init:
	@make install
	@make setup
	@make start

.PHONY: install setup start clean init