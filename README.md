# ChartGenie 🧞‍♂️

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?style=flat&logo=vite&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Powered-F55036?style=flat&logo=lightning&logoColor=white)

**Transform CSV files into beautiful, interactive visualizations with AI-powered insights.**

![ChartGenie Banner](https://via.placeholder.com/1200x400/667eea/ffffff?text=ChartGenie+-+AI-Powered+Data+Visualization)

## 🌟 Why ChartGenie?

ChartGenie is a modern, full-stack data visualization platform powered by **Moonshot AI's Kimi model** via Groq's ultra-fast inference engine. 

### 🆓 100% Open Source AI - No Vendor Lock-in

- ✅ **No OpenAI dependency** - Uses Moonshot's open Kimi K2 model
- ✅ **No Gemini dependency** - Completely independent from Google
- ✅ **Ultra-fast inference** - Groq's LPU technology delivers responses in milliseconds
- ✅ **Cost-effective** - Open source model with generous free tier
- ✅ **Privacy-focused** - Your data processed by open models, not proprietary APIs

Upload your data, ask questions in natural language, and get instant insights with stunning charts—all powered by cutting-edge open source AI.- 🎨 **Beautiful Charts** - Bar, Line, Scatter, Tree Map, Geo Map, Heat Map, and Gantt charts

- 🤖 **AI Chat Interface** - Ask questions in natural language to create custom visualizations

---- 🚀 **Instant Insights** - Auto-generates intelligent default visualizations

- 🔒 **Secure** - Row-level security with Supabase

## ✨ Features- 📱 **Responsive** - Beautiful UI that works on all devices



### 🚀 Core Features## 🛠️ Tech Stack



- **📊 Instant CSV Upload & Analysis**### Frontend

  - Drag-and-drop CSV file upload- **React 18** + **Vite** - Fast, modern development

  - Automatic data type detection (numbers, categories, dates)- **Tailwind CSS** - Utility-first styling with custom glassmorphism effects

  - Smart schema inference with preview- **Apache ECharts** - Professional charting library

  - Storage in Supabase with RLS (Row Level Security)- **React Query** - Powerful data fetching and caching

- **React Router** - Client-side routing

- **🎨 Auto-Generated Dashboards**- **Framer Motion** - Smooth animations

  - 4 automatic visualizations generated on upload

  - Bar charts, line charts, scatter plots, and treemaps### Backend

  - No configuration needed - just upload and visualize- **Supabase** - Backend-as-a-Service

  - PostgreSQL database

- **🤖 AI-Powered Chat Interface (RAG)**  - Authentication (Email, Google, GitHub)

  - Chat with your data using natural language  - Storage for CSV files

  - Powered by **Moonshot Kimi K2** (via Groq API)  - Edge Functions (Deno runtime)

  - Ask ANY question: "What's the average?", "Show me trends", "Compare categories"- **Groq API** - Ultra-fast AI inference with Moonshot Kimi K2

  - Get intelligent text answers OR visualizations

  - ChatGPT-level response quality with detailed insights## 🚀 Getting Started



- **💡 Smart Suggested Questions**### Prerequisites

  - AI generates dataset-specific questions on upload

  - One-click to ask pre-generated questions- Node.js 18+ and npm

  - Contextual and relevant to your data- Supabase account ([supabase.com](https://supabase.com))

- Groq API key ([console.groq.com/keys](https://console.groq.com/keys))

- **📈 7 Chart Types**

  - **Bar Chart**: Category comparisons, rankings### Installation

  - **Line Chart**: Time series, trends over time

  - **Scatter Plot**: Correlations between two variables1. **Clone the repository**

  - **Tree Map**: Hierarchical data, proportions   ```bash

  - **Heat Map**: Matrix data, intensity comparisons   git clone https://github.com/yourusername/chartgenie.git

  - **Gantt Chart**: Project timelines, task scheduling   cd chartgenie

  - ~~Map Chart~~ (Disabled - requires GeoJSON setup)   ```



- **🎯 Advanced Chart Customization**2. **Install dependencies**

  - Custom titles, axis labels   ```bash

  - Min/max scale configuration   npm install

  - Unit formatting ($, %, etc.)   ```

  - Download charts as PNG (2x resolution)

  - Enlarge to full-screen modal3. **Set up Supabase**

   - Create a new Supabase project

### 🌊 Coral Reef Design System   - Run the migration: `supabase/migrations/001_initial_schema.sql` in the SQL editor

   - Enable Google/GitHub OAuth in Authentication settings (optional)

- **Vibrant Color Palette**: Teal (#1ABC9C), Coral Pink (#F1948A), Sand (#FAD7B0)

- **Modern UI**: 6px border radius, enhanced icons (stroke-width: 2.25)4. **Configure environment variables**

- **Dark Mode Support**: Beautiful light and dark themes   ```bash

- **Responsive Design**: Works on desktop, tablet, and mobile   cp .env.example .env

   ```

### 🔐 Authentication & Security   

   Edit `.env` and add your credentials:

- **Supabase Auth**: Email/password, Google OAuth, GitHub OAuth   ```env

- **Row Level Security**: Users can only access their own datasets   VITE_SUPABASE_URL=your_supabase_project_url

- **Secure Storage**: Files stored in Supabase Storage with access policies   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   ```

### 🧠 AI Capabilities (RAG System)

5. **Deploy Edge Functions**

The RAG (Retrieval-Augmented Generation) system can:   

- ✅ Answer ANY question about your dataset   Install Supabase CLI:

- ✅ Perform calculations (sum, average, count, min, max, percentages)   ```bash

- ✅ Identify patterns, trends, correlations, outliers   npm install -g supabase

- ✅ Make comparisons and rankings   ```

- ✅ Provide insights and recommendations   

- ✅ Handle ambiguous queries intelligently   Login and link your project:

- ✅ Format responses with markdown, emojis, and structure   ```bash

   supabase login

**Example Questions:**   supabase link --project-ref your-project-ref

```   ```

"What's the average sales by region?"   

"How many unique products are there?"   Set Groq API key secret:

"Which category has the highest revenue?"   ```bash

"Show me the top 5 performers"   supabase secrets set GROQ_API_KEY=your_groq_api_key
   supabase secrets set GROQ_MODEL=moonshotai/kimi-k2-instruct-0905

"Compare Q1 vs Q2 sales"   ```

"Tell me something interesting about this data"   

"Show me sales by region" (creates chart)   Deploy functions:

"Plot revenue over time" (creates chart)   ```bash

```   supabase functions deploy analyze-dataset

   supabase functions deploy rag-query

---   ```



## 🏗️ Tech Stack6. **Start development server**

   ```bash

### Frontend   npm run dev

- **React 18.2** - UI framework   ```

- **Vite 5.0** - Build tool and dev server

- **Tailwind CSS** - Utility-first CSS frameworkVisit `http://localhost:5173` and start visualizing data! 🎉

- **shadcn/ui** - Accessible component library

- **Apache ECharts** - Data visualization library## 📖 Usage

- **React Query** - Server state management

- **Framer Motion** - Animation library### 1. Sign Up / Login

- **PapaParse** - CSV parsingCreate an account using email or social login (Google/GitHub).



### Backend### 2. Upload CSV

- **Supabase** - Backend-as-a-ServiceClick "Upload Dataset" and drag & drop your CSV file. ChartGenie will automatically:

  - PostgreSQL database- Detect column types (numbers, dates, categories, geo-data)

  - Authentication- Generate intelligent default visualizations

  - Storage- Store your data securely

  - Edge Functions (Deno)

- **Groq API (Moonshot Kimi K2)** - Ultra-fast AI model for RAG### 3. Explore Auto-Generated Charts

View automatically generated visualizations based on your data structure:

### Deployment- Time series → Line charts

- **Vercel** - Frontend hosting (optional)- Categories + numbers → Bar charts

- **Supabase Cloud** - Backend hosting- Geographic data → Choropleth maps

- And more!

---

### 4. Chat with the Genie

## 📋 PrerequisitesAsk questions in natural language:

- "Show me sales by region"

Before you begin, ensure you have:- "Compare revenue and profit over time"

- "Create a heat map of customer activity"

- **Node.js** 18+ and npm/yarn- "Show the project timeline"

- **Supabase Account** ([Sign up free](https://supabase.com))

- **Google AI API Key** ([Get it here](https://makersuite.google.com/app/apikey))The AI will generate custom visualizations tailored to your question!

- **Git** for version control

## 📊 Supported Chart Types

---

| Chart Type | Use Case | Config Example |

## 🚀 Quick Start|------------|----------|----------------|

| **Bar** | Categories vs values | `{category: "Region", value: "Sales"}` |

### 1. Clone the Repository| **Line** | Time series data | `{x: "Date", y: "Revenue"}` |

| **Scatter** | Correlation analysis | `{x: "Price", y: "Sales"}` |

```bash| **Tree Map** | Hierarchical data | `{category: "Product", value: "Revenue"}` |

git clone https://github.com/yourusername/chartgenie.git| **Geo Map** | Geographic distribution | `{region: "State", value: "Population"}` |

cd chartgenie| **Heat Map** | Matrix/density data | `{x: "Day", y: "Hour", value: "Traffic"}` |

```| **Gantt** | Project timelines | `{task: "Task", start: "Start", end: "End"}` |



### 2. Install Dependencies## 🏗️ Project Structure



```bash```

npm installchartgenie/

```├── src/

│   ├── components/

### 3. Set Up Supabase│   │   ├── auth/          # Login/Signup forms

│   │   ├── dashboard/     # Dataset cards, upload modal

#### A. Create a New Supabase Project│   │   ├── charts/        # Dynamic chart rendering

│   │   ├── genie/         # AI chat interface

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)│   │   └── ui/            # Reusable UI components

2. Click "New Project"│   ├── hooks/             # Custom React hooks

3. Name it "ChartGenie" and set a strong database password│   ├── lib/               # Utilities and chart configs

4. Wait for the project to initialize (~2 minutes)│   ├── pages/             # Route pages

│   └── App.jsx            # Main app with routing

#### B. Run Database Setup├── supabase/

│   ├── functions/         # Edge Functions

1. Go to **SQL Editor** in your Supabase dashboard│   │   ├── analyze-dataset/

2. Copy the contents of `supabase/setup.sql`│   │   └── rag-query/

3. Click "Run" to execute the SQL│   └── migrations/        # Database schema

└── package.json

This will:```

- Create the `datasets` table with all columns

- Set up Row Level Security (RLS) policies## 🔐 Security

- Create the `datasets` storage bucket

- Configure storage access policies- **Row Level Security (RLS)** - Users can only access their own datasets

- **Secure Storage** - Files are stored with user-specific paths

#### C. Set Up Edge Functions- **Authentication** - Powered by Supabase Auth with JWT tokens

- **API Keys** - Stored securely in Supabase secrets (not in client code)

```bash

# Install Supabase CLI (if not already installed)## 🎨 Design Features

npm install -g supabase

- **Glassmorphism** - Modern frosted glass effect cards

# Login to Supabase- **Gradient Text** - Eye-catching color gradients

npx supabase login- **Smooth Animations** - Framer Motion transitions

- **Dark Theme** - Professional dark mode interface

# Link to your project (get ref from dashboard URL: supabase.com/dashboard/project/YOUR-REF)- **Responsive** - Mobile-first design

npx supabase link --project-ref your-project-ref

## 🚢 Deployment

# Deploy Edge Functions

npx supabase functions deploy analyze-dataset### Deploy to Vercel

npx supabase functions deploy rag-query

1. Push your code to GitHub

# Set secrets for Edge Functions2. Connect your repository to Vercel

# Set secrets for Edge Functions2. Connect your repository to Vercel
npx supabase secrets set GROQ_API_KEY=your_groq_api_key_here
npx supabase secrets set GROQ_MODEL=moonshotai/kimi-k2-instruct-0905
3. Add environment variables in Vercel dashboard3. Add environment variables in Vercel dashboard

```4. Deploy!



### 4. Configure Environment VariablesThe app is optimized for Vercel with automatic optimizations.



Create a `.env` file in the root directory:### Deploy Edge Functions



```envEdge Functions are deployed separately to Supabase:

# Supabase Configuration```bash

VITE_SUPABASE_URL=https://your-project-ref.supabase.cosupabase functions deploy

VITE_SUPABASE_ANON_KEY=your-anon-key-here```



# Groq API Key (Optional)## 🤝 Contributing

# Groq API Key## 🤝 Contributing
# Groq API Key## 🤝 Contributing
VITE_GROQ_API_KEY=your_groq_api_key_here

```Contributions are welcome! Please feel free to submit a Pull Request.



**Get these values:**## 📝 License

- **Supabase URL & Anon Key**: Project Settings → API

- **Groq API Key**: [Groq Console](https://console.groq.com/keys)MIT License - feel free to use this project for personal or commercial purposes.



### 5. Run the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 🙏 Acknowledgments

### Open Source AI - No Vendor Lock-in

- **[Moonshot AI](https://www.moonshot.cn/)** - Kimi K2 Instruct open source model (NO OpenAI or Gemini needed!)
- **[Groq](https://groq.com/)** - Ultra-fast LPU inference engine for Moonshot Kimi

### Infrastructure & Tools

- **[Supabase](https://supabase.com)** - Amazing open-source backend platform
- **[Apache ECharts](https://echarts.apache.org)** - Powerful charting library
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework

**ChartGenie is built entirely on open-source AI models - free from proprietary API dependencies like OpenAI GPT or Google Gemini!**

The app will open at `http://localhost:5173`

## 📧 Contact

### 6. Build for Production

Have questions or suggestions? Open an issue or reach out!

```bash

npm run build---

npm run preview  # Test production build locally

```Made with ❤️ and ✨ by the ChartGenie team


---

## 📁 Project Structure

```
chartgenie/
├── src/
│   ├── components/
│   │   ├── auth/              # Login, Signup forms
│   │   ├── charts/            # Chart components (DynamicChart, ChartCard, AutoDashboard)
│   │   ├── dashboard/         # Dataset management (DatasetCard, UploadModal)
│   │   ├── genie/             # AI chat interface (ChatInterface, Message, SuggestedQuestions)
│   │   └── ui/                # shadcn/ui components (Button, Card, Input, Badge)
│   ├── hooks/
│   │   ├── useAuth.js         # Authentication hook
│   │   ├── useDatasets.js     # Dataset management hook
│   │   └── useGenie.js        # AI chat hook
│   ├── lib/
│   │   ├── chartConfigs.js    # ECharts configuration for all chart types
│   │   ├── supabase.js        # Supabase client initialization
│   │   └── utils.js           # Utility functions (color palette, etc.)
│   ├── pages/
│   │   ├── Landing.jsx        # Landing page with auth
│   │   ├── Dashboard.jsx      # Main dashboard (dataset list)
│   │   └── DatasetDetail.jsx  # Dataset detail page (charts + chat)
│   ├── App.jsx                # Main app component with routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles (Coral Reef theme)
├── supabase/
│   ├── functions/
│   │   ├── analyze-dataset/   # Edge Function for dataset analysis
│   │   │   └── index.ts       # Analyzes CSV, generates suggestions
│   │   └── rag-query/         # Edge Function for AI chat
│   │       └── index.ts       # RAG system with Groq (Moonshot Kimi K2)
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   └── 20251105125718_add_suggested_questions.sql
│   └── setup.sql              # Complete database setup (use this!)
├── sample-data/               # Sample CSV files for testing
│   ├── sales-data.csv
│   ├── student-marks.csv
│   └── product-inventory.csv
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🗄️ Database Schema

### `datasets` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to auth.users |
| `dataset_name` | TEXT | Name of the dataset |
| `storage_object_path` | TEXT | Path to CSV file in storage |
| `status` | TEXT | PENDING, ANALYZING, READY, ERROR |
| `column_schema` | JSONB | Column names and types |
| `preview_data` | JSONB | First 5 rows for preview |
| `suggested_questions` | JSONB | AI-generated questions |
| `created_at` | TIMESTAMP | Creation timestamp |

**Indexes:**
- `idx_datasets_user_id` on `user_id`
- `idx_datasets_status` on `status`

**RLS Policies:**
- Users can only SELECT, INSERT, UPDATE, DELETE their own datasets

---

## 🎨 Color Palette (Coral Reef Theme)

| Color | Hex | Usage |
|-------|-----|-------|
| **Coral Teal** | `#1ABC9C` | Primary buttons, focus rings, brand |
| **Coral Pink** | `#F1948A` | Secondary accents, highlights |
| **Coral Sand** | `#FAD7B0` | Warm backgrounds, accents |
| **Stone-50** | `#F9FAFB` | Light mode background |
| **Stone-900** | `#1C1917` | Dark mode cards, light mode text |
| **Stone-950** | `#0C0A09` | Dark mode background |

---

## 🧪 Sample Data

The project includes 3 sample CSV files for testing:

1. **sales-data.csv** (20 rows)
   - Columns: Date, Region, Product, Quantity, Revenue
   - Use case: Sales analysis, regional comparisons

2. **student-marks.csv** (100 rows)
   - Columns: Student, Subject, Marks, Grade
   - Use case: Educational analytics, performance tracking

3. **product-inventory.csv** (100 rows)
   - Columns: Product, Category, Stock, Price, Supplier
   - Use case: Inventory management, stock analysis

---

## 🤖 RAG System Details

### How It Works

1. **User uploads CSV** → Stored in Supabase Storage
2. **Auto-analysis** → `analyze-dataset` Edge Function extracts schema, generates suggestions
3. **User asks question** → Sent to `rag-query` Edge Function
4. **RAG retrieves data** → Fetches full CSV, schema, and statistics
5. **AI processes** → Groq (Moonshot Kimi K2) analyzes with comprehensive prompt
6. **Response generated** → Either TEXT (analysis) or VIZ (chart specification)
7. **UI renders** → Formatted text or ECharts visualization

### Prompt Engineering

The RAG system uses a **200+ line system prompt** with:
- Core capabilities description
- Response format schemas (TEXT vs VIZ)
- Decision logic for choosing response type
- Chart type selection guide
- Response quality standards
- 4 detailed examples of excellent responses
- Critical rules and best practices

**Configuration:**
- Model: `moonshotai/kimi-k2-instruct-0905` (via Groq)
- Temperature: 0.1 (very precise)
- Max Tokens: 1024 (detailed answers)
- Top P: 0.9

### Fallback System

If Groq API fails, an intelligent rule-based fallback:
- Performs actual calculations on data
- Detects question intent (average, count, max, min, unique)
- Returns formatted text with real statistics
- Handles 10+ question types

---

## 🚀 Deployment

### Deploy to Vercel (Frontend)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" and import your GitHub repo
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GROQ_API_KEY` (optional - for frontend AI features)
5. Click "Deploy"

### Supabase Edge Functions (Backend)

Edge Functions are deployed via Supabase CLI:
```bash
npx supabase functions deploy analyze-dataset
npx supabase functions deploy rag-query
npx supabase secrets set GROQ_API_KEY=your_key_here
npx supabase secrets set GROQ_MODEL=moonshotai/kimi-k2-instruct-0905
```

---

## 🐛 Troubleshooting

### Common Issues

**1. "Cannot read properties of undefined" error**
- Make sure all environment variables are set correctly
- Check that Supabase project is initialized
- Verify Edge Functions are deployed

**2. Charts not displaying**
- Open browser console and check for errors
- Verify column names match exactly (case-sensitive)
- Check that data is loaded (Network tab)

**3. AI not responding**
- Verify `GROQ_API_KEY` and `GROQ_MODEL` are set in Supabase secrets
- Check Edge Function logs in Supabase dashboard
- Ensure you have API quota remaining

**4. CSV upload fails**
- Check file size (should be < 50MB)
- Verify CSV is properly formatted (headers in first row)
- Check Supabase storage bucket exists

**5. Authentication issues**
- Verify Supabase URL and anon key are correct
- Check that email confirmation is disabled (for testing) or configured
- Review Supabase Auth settings

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

### 🌟 Open Source AI - No Proprietary Dependencies

- **[Moonshot AI](https://www.moonshot.cn/)** - Kimi K2 Instruct model (Open source alternative to GPT/Gemini)
- **[Groq](https://groq.com/)** - Lightning-fast LPU inference (10x faster than traditional GPUs)

**Why This Matters:** ChartGenie uses fully open-source AI models. You're not locked into expensive APIs like OpenAI or Google Gemini. Switch models anytime without vendor lock-in!

### 🛠️ Infrastructure & Tools

- **Supabase** - Backend infrastructure
- **Apache ECharts** - Beautiful visualizations
- **shadcn/ui** - Accessible components
- **Tailwind CSS** - Styling framework

---

## 🗺️ Roadmap

Future enhancements:

- [ ] Multi-turn conversations (chat memory)
- [ ] Support for more open-source models (LLaMA, Mistral, etc.)
- [ ] Export insights to PDF/Word
- [ ] Custom chart themes and branding
- [ ] Real-time collaboration
- [ ] API for programmatic access
- [ ] Advanced analytics (regression, forecasting)
- [ ] Data transformation tools
- [ ] Integration with Google Sheets, Excel
- [ ] Mobile app (React Native)
- [ ] Self-hosted AI option (run models locally)

---

<div align="center">

**Made with ❤️ using React, Supabase & Open Source AI (Moonshot Kimi via Groq)**

🆓 **No OpenAI. No Gemini. No Vendor Lock-in.**

⭐ Star us on GitHub | 🐛 Report Bug | 💡 Request Feature

</div>
