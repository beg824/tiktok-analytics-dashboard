# TikTok Analytics Dashboard

A modern web application to track and analyze TikTok post performance across multiple accounts using Supabase as the database.

## Features

- 📊 **Real-time Analytics**: Track views, likes, comments, and shares
- 📈 **Daily Views Chart**: Visualize daily performance trends
- 🏆 **Top Posts Table**: Identify your best-performing content
- 🔄 **Multi-Account Support**: Switch between different TikTok accounts
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Fast Performance**: Built with Next.js and FastAPI

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Supabase**: PostgreSQL database with real-time features
- **Pydantic**: Data validation and serialization

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Interactive charts and graphs
- **Lucide React**: Beautiful icons

## Prerequisites

- Python 3.8+
- Node.js 18+
- Supabase account and project

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd tiktok_dash
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env with your Supabase credentials
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables (optional for local development)
# The app will use the proxy configuration in next.config.js
```

### 4. Database Setup

Make sure your Supabase `tiktok_raw` table has the following structure:

```sql
CREATE TABLE tiktok_raw (
  id SERIAL PRIMARY KEY,
  account VARCHAR NOT NULL,
  post_id VARCHAR NOT NULL,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Environment Variables

Create a `.env` file in the backend directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the Application

### Development

1. **Start the Backend**:
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Production Deployment

#### Backend (Recommended: Railway, Render, or DigitalOcean)

1. Deploy your FastAPI backend to your preferred platform
2. Update the `vercel.json` file with your backend URL
3. Set environment variables in your deployment platform

#### Frontend (Vercel)

1. **Connect to Vercel**:
   ```bash
   cd frontend
   npx vercel
   ```

2. **Configure Environment Variables**:
   - Go to your Vercel project dashboard
   - Add `NEXT_PUBLIC_API_URL` with your backend URL

3. **Deploy**:
   ```bash
   npx vercel --prod
   ```

## API Endpoints

- `GET /accounts` - Get all TikTok accounts
- `GET /posts/{account}` - Get posts for a specific account
- `GET /stats/{account}` - Get aggregated stats for an account
- `GET /daily-views/{account}` - Get daily view counts
- `GET /top-posts/{account}` - Get top performing posts

## Project Structure

```
tiktok_dash/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── env.example         # Environment variables template
├── frontend/
│   ├── app/                # Next.js app directory
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Main dashboard page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── AccountSelector.tsx
│   │   ├── StatsCard.tsx
│   │   ├── DailyViewsChart.tsx
│   │   └── TopPostsTable.tsx
│   ├── types/              # TypeScript type definitions
│   ├── package.json        # Node.js dependencies
│   ├── next.config.js      # Next.js configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── vercel.json         # Vercel deployment config
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub. 