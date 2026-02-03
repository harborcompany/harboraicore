#!/usr/bin/env python3
"""
Harbor ML - Social Media Auto-Poster
Daily automated posts to Reddit + Instagram content generation.

Reddit: Fully automated via PRAW
Instagram: Generates images + captions (manual post or use later.io)
"""

import os
import json
import random
import hashlib
from datetime import datetime, timedelta
from typing import List, Dict, Optional

# Configuration
SITE_URL = os.getenv('SITE_URL', 'https://harborml.com')

# Reddit credentials (set these in .env)
REDDIT_CLIENT_ID = os.getenv('REDDIT_CLIENT_ID', '')
REDDIT_CLIENT_SECRET = os.getenv('REDDIT_CLIENT_SECRET', '')
REDDIT_USERNAME = os.getenv('REDDIT_USERNAME', '')
REDDIT_PASSWORD = os.getenv('REDDIT_PASSWORD', '')
REDDIT_USER_AGENT = os.getenv('REDDIT_USER_AGENT', 'HarborML SEO Bot v1.0')

# Try to import libraries
try:
    import praw
    PRAW_AVAILABLE = True
except ImportError:
    PRAW_AVAILABLE = False
    print("Reddit posting disabled. Install: pip install praw")


class RedditPoster:
    """Automated Reddit posting for SEO backlinks"""
    
    # Subreddits that allow project posts (check rules first!)
    TARGET_SUBREDDITS = [
        # ML/AI focused
        {"name": "MachineLearning", "flair": "[P]", "min_karma": 50},
        {"name": "deeplearning", "flair": None, "min_karma": 10},
        {"name": "artificial", "flair": None, "min_karma": 10},
        {"name": "learnmachinelearning", "flair": None, "min_karma": 10},
        
        # Data focused
        {"name": "datasets", "flair": None, "min_karma": 10},
        {"name": "datascience", "flair": None, "min_karma": 25},
        
        # Side project / startup
        {"name": "SideProject", "flair": None, "min_karma": 1},
        {"name": "startups", "flair": None, "min_karma": 10},
        {"name": "EntrepreneurRideAlong", "flair": None, "min_karma": 1},
        
        # Niche (LEGO content)
        {"name": "lego", "flair": None, "min_karma": 10},
        {"name": "legoMOC", "flair": None, "min_karma": 1},
    ]
    
    # Post templates (rotate to avoid spam detection)
    POST_TEMPLATES = [
        {
            "title": "[P] Harbor ML - Video dataset platform for multimodal AI training",
            "body": """Hey r/{subreddit}!

I've been working on Harbor ML, a platform for building enterprise-grade video and audio datasets for AI training.

**Key features:**
- Auto-annotation pipeline (hand tracking, object detection, speech/transcription)
- Human-in-the-loop validation
- Dataset versioning and provenance tracking
- Sales-ready documentation generator

We're focused on LEGO building videos initially but expanding to other verticals.

Check it out: {url}

Would love feedback from this community!"""
        },
        {
            "title": "Building a multimodal dataset platform - looking for feedback",
            "body": """I'm building Harbor ML ({url}) - a platform that helps create training datasets from video/audio content.

The pipeline includes:
- MediaPipe hand pose detection
- YOLO object detection
- Whisper transcription
- Scene segmentation

Currently focused on instructional/building videos (LEGO, assembly, tutorials).

Any suggestions on what features would be most valuable for ML researchers?"""
        },
        {
            "title": "Open source video annotation pipeline for ML training",
            "body": """Just launched the annotation pipeline for Harbor ML: {url}

It uses:
- MediaPipe for hand tracking
- YOLOv8 for object detection
- OpenAI Whisper for speech-to-text
- PySceneDetect for scene boundaries

All running in a containerized GPU service. Designed for enterprise-scale dataset creation.

Feedback welcome!"""
        }
    ]
    
    def __init__(self):
        self.reddit = None
        if PRAW_AVAILABLE and all([REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD]):
            try:
                self.reddit = praw.Reddit(
                    client_id=REDDIT_CLIENT_ID,
                    client_secret=REDDIT_CLIENT_SECRET,
                    username=REDDIT_USERNAME,
                    password=REDDIT_PASSWORD,
                    user_agent=REDDIT_USER_AGENT
                )
                print(f"✅ Reddit authenticated as u/{self.reddit.user.me()}")
            except Exception as e:
                print(f"❌ Reddit auth failed: {e}")
        else:
            print("⚠️ Reddit credentials not configured. Set REDDIT_* env vars.")
    
    def post_to_subreddit(self, subreddit_name: str, title: str, body: str, flair: str = None) -> Dict:
        """Post to a specific subreddit"""
        if not self.reddit:
            return {"error": "Reddit not authenticated"}
        
        try:
            subreddit = self.reddit.subreddit(subreddit_name)
            
            # Check if we can post
            if subreddit.user_is_banned:
                return {"subreddit": subreddit_name, "error": "Banned from subreddit"}
            
            # Submit post
            submission = subreddit.submit(
                title=title,
                selftext=body,
                flair_id=flair if flair else None
            )
            
            return {
                "subreddit": subreddit_name,
                "success": True,
                "post_id": submission.id,
                "url": f"https://reddit.com{submission.permalink}"
            }
        except Exception as e:
            return {"subreddit": subreddit_name, "error": str(e)}
    
    def daily_post_rotation(self, url: str = None) -> List[Dict]:
        """
        Post to 2-3 subreddits per day (rotating to avoid spam).
        Run this daily via cron.
        """
        if not self.reddit:
            return [{"error": "Reddit not authenticated"}]
        
        url = url or SITE_URL
        
        # Pick random template
        template = random.choice(self.POST_TEMPLATES)
        
        # Pick 2-3 random subreddits (different each day based on date seed)
        day_seed = int(datetime.now().strftime("%Y%m%d"))
        random.seed(day_seed)
        today_subs = random.sample(self.TARGET_SUBREDDITS, min(3, len(self.TARGET_SUBREDDITS)))
        
        results = []
        for sub in today_subs:
            title = template["title"]
            if sub["flair"]:
                title = f"{sub['flair']} {title}"
            
            body = template["body"].format(
                subreddit=sub["name"],
                url=url
            )
            
            result = self.post_to_subreddit(sub["name"], title, body)
            results.append(result)
            
            # Rate limit between posts
            import time
            time.sleep(60)  # 1 minute between posts
        
        return results


class InstagramContentGenerator:
    """Generate Instagram-ready images and captions"""
    
    CAPTION_TEMPLATES = [
        """🚀 Building the future of AI training data.

Harbor ML helps create enterprise-grade video datasets with auto-annotation.

Features:
✅ Hand tracking & pose detection
✅ Object recognition
✅ Speech transcription
✅ Scene understanding

Link in bio 👆

#MachineLearning #AI #DeepLearning #DataScience #MLOps #AITraining #VideoData #ComputerVision #NLP #TechStartup""",

        """📊 How do you train AI on video data?

You need:
1️⃣ Raw video content
2️⃣ Precise annotations
3️⃣ Quality validation
4️⃣ Scalable infrastructure

We built Harbor ML to solve this.

Check the link in bio!

#ArtificialIntelligence #MachineLearning #DataAnnotation #VideoAI #MLData #TechInnovation #AIStartup #DeepLearning #NeuralNetworks #DataEngineering""",

        """🔧 Our auto-annotation pipeline:

• MediaPipe → Hand tracking
• YOLOv8 → Object detection
• Whisper → Transcription
• SceneDetect → Segmentation

All running on GPU. Enterprise-ready.

Harbor ML - link in bio.

#MLPipeline #ComputerVision #SpeechToText #ObjectDetection #AIEngineering #TechTools #DataPipeline #MLOps #AIInfrastructure #GPUComputing""",

        """🎯 LEGO + AI = 🔥

We're building video datasets from LEGO building tutorials.

Why? Training AI to understand:
• Hand movements
• Object assembly
• Step-by-step instructions

Perfect for robotics & instruction-following AI.

#LEGO #AITraining #Robotics #InstructionFollowing #VideoDataset #MachineLearning #LEGOBuilder #TechMeetsPlay #AIResearch #DataCollection"""
    ]
    
    def generate_daily_content(self, day_offset: int = 0) -> Dict:
        """Generate content for a specific day"""
        # Rotate captions based on day
        day_index = (datetime.now() + timedelta(days=day_offset)).timetuple().tm_yday
        caption = self.CAPTION_TEMPLATES[day_index % len(self.CAPTION_TEMPLATES)]
        
        # Image prompts for AI generation (use with DALL-E, Midjourney, etc.)
        image_prompts = [
            "Futuristic holographic display showing video annotation interface with bounding boxes and hand tracking, dark tech aesthetic, 4K, professional",
            "Abstract visualization of neural network processing video frames, blue and purple gradient, modern tech art",
            "Clean minimal infographic showing AI pipeline: video input → annotation → dataset, corporate tech style",
            "Robot hand building with LEGO bricks, cinematic lighting, high detail, futuristic lab background"
        ]
        
        return {
            "day": (datetime.now() + timedelta(days=day_offset)).strftime("%Y-%m-%d"),
            "caption": caption,
            "image_prompt": image_prompts[day_index % len(image_prompts)],
            "hashtag_count": caption.count("#"),
            "best_post_times": ["9:00 AM", "12:00 PM", "6:00 PM"]
        }
    
    def generate_week_content(self) -> List[Dict]:
        """Generate a week's worth of Instagram content"""
        return [self.generate_daily_content(i) for i in range(7)]


class TwitterPoster:
    """Twitter/X posting (requires API access - $100/mo for basic)"""
    
    TWEET_TEMPLATES = [
        "🚀 Just shipped: Auto-annotation pipeline for video AI datasets.\n\nMediaPipe + YOLO + Whisper running on GPU.\n\n{url}\n\n#MachineLearning #AI",
        "Building enterprise video datasets for AI training.\n\nHarbor ML now supports:\n• Hand tracking\n• Object detection\n• Speech transcription\n• Scene segmentation\n\n{url}",
        "How we're creating training data for instruction-following AI:\n\n1. Capture LEGO building videos\n2. Auto-annotate with ML\n3. Human validation\n4. Ship lab-ready datasets\n\n{url}",
        "🔧 Our ML annotation stack:\n\n• MediaPipe (hands)\n• YOLOv8 (objects)\n• Whisper (speech)\n• PySceneDetect (scenes)\n\nAll containerized. All GPU-optimized.\n\n{url}"
    ]
    
    def generate_daily_tweets(self, url: str = None, count: int = 3) -> List[str]:
        """Generate tweets for the day"""
        url = url or SITE_URL
        random.shuffle(self.TWEET_TEMPLATES)
        return [t.format(url=url) for t in self.TWEET_TEMPLATES[:count]]


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Social media automation for SEO')
    parser.add_argument('--platform', '-p', 
                        choices=['reddit', 'instagram', 'twitter', 'all'],
                        default='all',
                        help='Platform to generate content for')
    parser.add_argument('--post', action='store_true',
                        help='Actually post to Reddit (requires credentials)')
    parser.add_argument('--url', '-u', default=SITE_URL,
                        help='URL to promote')
    parser.add_argument('--output', '-o', help='Output JSON file')
    
    args = parser.parse_args()
    
    results = {"timestamp": datetime.now().isoformat(), "content": {}}
    
    # Reddit
    if args.platform in ['reddit', 'all']:
        reddit = RedditPoster()
        if args.post and reddit.reddit:
            print("\n📱 POSTING TO REDDIT...")
            results["content"]["reddit_posts"] = reddit.daily_post_rotation(args.url)
        else:
            print("\n📱 REDDIT CONTENT (use --post to actually post):")
            template = random.choice(reddit.POST_TEMPLATES)
            for sub in reddit.TARGET_SUBREDDITS[:3]:
                print(f"\n--- r/{sub['name']} ---")
                print(f"Title: {template['title']}")
                print(f"Body: {template['body'].format(subreddit=sub['name'], url=args.url)[:200]}...")
            results["content"]["reddit_templates"] = {
                "subreddits": [s["name"] for s in reddit.TARGET_SUBREDDITS],
                "template_count": len(reddit.POST_TEMPLATES)
            }
    
    # Instagram
    if args.platform in ['instagram', 'all']:
        instagram = InstagramContentGenerator()
        print("\n📸 INSTAGRAM CONTENT:")
        week_content = instagram.generate_week_content()
        results["content"]["instagram"] = week_content
        
        # Print today's content
        today = week_content[0]
        print(f"\n--- Today's Post ({today['day']}) ---")
        print(f"Caption:\n{today['caption'][:300]}...")
        print(f"\nImage Prompt: {today['image_prompt']}")
        print(f"Best times to post: {', '.join(today['best_post_times'])}")
    
    # Twitter
    if args.platform in ['twitter', 'all']:
        twitter = TwitterPoster()
        print("\n🐦 TWITTER CONTENT:")
        tweets = twitter.generate_daily_tweets(args.url)
        results["content"]["twitter"] = tweets
        
        for i, tweet in enumerate(tweets, 1):
            print(f"\n--- Tweet {i} ---")
            print(tweet)
    
    # Save output
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"\n✅ Content saved to {args.output}")
    
    return results


if __name__ == '__main__':
    main()
