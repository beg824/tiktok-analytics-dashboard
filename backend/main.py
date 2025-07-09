from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from typing import List, Optional
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables
load_dotenv()

app = FastAPI(title="TikTok Analytics API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase credentials in environment variables")

supabase: Client = create_client(supabase_url, supabase_key)

# Pydantic models
class TikTokPost(BaseModel):
    id: Optional[int]
    account: str
    post_id: str
    likes: int
    views: int
    comments: int
    shares: int
    created_at: Optional[datetime]
    date: Optional[str]

class AccountStats(BaseModel):
    account: str
    total_posts: int
    total_views: int
    total_likes: int
    total_comments: int
    total_shares: int
    avg_views_per_post: float

@app.get("/")
async def root():
    return {"message": "TikTok Analytics API"}

@app.get("/accounts", response_model=List[str])
async def get_accounts():
    """Get all unique TikTok accounts"""
    try:
        response = supabase.table("tiktok_raw").select("account").execute()
        accounts = list(set([row["account"] for row in response.data]))
        return sorted(accounts)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching accounts: {str(e)}")

@app.get("/posts/{account}", response_model=List[TikTokPost])
async def get_posts_by_account(account: str, limit: int = 50):
    """Get posts for a specific account"""
    try:
        response = supabase.table("tiktok_raw")\
            .select("*")\
            .eq("account", account)\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching posts: {str(e)}")

@app.get("/stats/{account}", response_model=AccountStats)
async def get_account_stats(account: str):
    """Get aggregated stats for a specific account"""
    try:
        response = supabase.table("tiktok_raw")\
            .select("*")\
            .eq("account", account)\
            .execute()
        
        posts = response.data
        if not posts:
            raise HTTPException(status_code=404, detail="Account not found")
        
        total_posts = len(posts)
        total_views = sum(post["views"] for post in posts)
        total_likes = sum(post["likes"] for post in posts)
        total_comments = sum(post["comments"] for post in posts)
        total_shares = sum(post["shares"] for post in posts)
        avg_views_per_post = total_views / total_posts if total_posts > 0 else 0
        
        return AccountStats(
            account=account,
            total_posts=total_posts,
            total_views=total_views,
            total_likes=total_likes,
            total_comments=total_comments,
            total_shares=total_shares,
            avg_views_per_post=round(avg_views_per_post, 2)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stats: {str(e)}")

@app.get("/daily-views/{account}")
async def get_daily_views(account: str, days: int = 30):
    """Get daily view counts for the last N days"""
    try:
        # Get posts from the last N days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        response = supabase.table("tiktok_raw")\
            .select("views, created_at")\
            .eq("account", account)\
            .gte("created_at", start_date.isoformat())\
            .lte("created_at", end_date.isoformat())\
            .execute()
        
        # Group by date and sum views
        daily_views = {}
        for post in response.data:
            date = post["created_at"][:10]  # Extract YYYY-MM-DD
            daily_views[date] = daily_views.get(date, 0) + post["views"]
        
        # Fill missing dates with 0
        result = []
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.strftime("%Y-%m-%d")
            result.append({
                "date": date_str,
                "views": daily_views.get(date_str, 0)
            })
            current_date += timedelta(days=1)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching daily views: {str(e)}")

@app.get("/top-posts/{account}", response_model=List[TikTokPost])
async def get_top_posts(account: str, limit: int = 10, sort_by: str = "views"):
    """Get top posts for an account sorted by specified metric"""
    valid_sort_fields = ["views", "likes", "comments", "shares"]
    if sort_by not in valid_sort_fields:
        raise HTTPException(status_code=400, detail=f"Invalid sort field. Must be one of: {valid_sort_fields}")
    
    try:
        response = supabase.table("tiktok_raw")\
            .select("*")\
            .eq("account", account)\
            .order(sort_by, desc=True)\
            .limit(limit)\
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching top posts: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 