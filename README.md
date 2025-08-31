# AI-Powered Handsontable Config Generator

An intelligent data table application that fetches data from Mockoon API endpoints and automatically generates optimal Handsontable configurations using OpenAI GPT.

## Features

- 🔄 **Dynamic API Data Loading**: Select from 8 different Mockoon API endpoints
- 🤖 **AI-Generated Table Config**: OpenAI GPT automatically creates optimal column configurations
- 📊 **Smart Column Types**: Automatically detects and applies appropriate column types (text, numeric, date, checkbox, dropdown)
- 🎨 **Rich Table Features**: Includes sorting, filtering, context menus, and manual resizing
- ⚡ **Real-time Updates**: Instant table reconfiguration when switching endpoints

## Available Endpoints

- **Companies**: Fake companies with industry, location, employees
- **Contacts**: Fake contacts with name, email, phone, address  
- **Customers**: Fake customers with personal and contact info
- **Movies**: Fake movies with title, genre, director, rating
- **Posts**: Fake blog posts with title, author, content
- **Sales**: Fake sales data with country, item type, costs
- **Users**: Fake users with name, email, phone, address
- **Todos**: Fake todos with title, status, priority

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure OpenAI API Key**:
   - Ensure your `.env` file contains: `VITE_OPENAI_API_KEY=your_api_key_here`

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## How It Works

1. **Endpoint Selection**: Choose a Mockoon API endpoint from the dropdown
2. **Data Fetching**: Application fetches sample data from the selected endpoint
3. **AI Analysis**: OpenAI GPT analyzes the data structure and content
4. **Config Generation**: AI generates optimal Handsontable column configurations
5. **Table Rendering**: Handsontable displays the data with intelligent formatting

## Technology Stack

- **React 18** with TypeScript
- **Handsontable** for advanced data grid features
- **OpenAI GPT-4** for intelligent config generation
- **Mockoon Playground** for mock API data
- **Vite** for fast development and building

## AI Configuration Features

The AI analyzes your data and automatically:

- Detects numeric fields and applies numeric column type
- Identifies date fields and applies date formatting
- Recognizes boolean fields and uses checkbox inputs
- Finds categorical data and creates dropdown menus
- Sets appropriate column widths based on content
- Generates human-readable column titles

## Demo

Live demo at: [handsontable-config-gen.vercel.app](https://handsontable-config-gen.vercel.app/)
