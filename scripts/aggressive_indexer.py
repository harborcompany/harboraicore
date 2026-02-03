#!/usr/bin/env python3
"""
Harbor ML - Aggressive Indexing Blitz
Uses IndexNow API + Google Ping + Backlink seeding for rapid indexation.

Target: 500+ indexed pages in 7 days instead of 70.
"""

import os
import json
import time
import hashlib
import requests
from datetime import datetime
from typing import List, Dict
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configuration
SITE_URL = os.getenv('SITE_URL', 'https://harborml.com')
INDEXNOW_KEY = os.getenv('INDEXNOW_KEY', '')  # Generate at https://www.bing.com/indexnow


class AggressiveIndexer:
    """Multi-channel indexing blitz"""
    
    def __init__(self, site_url: str, indexnow_key: str = None):
        self.site_url = site_url.rstrip('/')
        self.indexnow_key = indexnow_key or self._generate_indexnow_key()
        self.results = []
        
    def _generate_indexnow_key(self) -> str:
        """Generate a valid IndexNow key"""
        key = hashlib.md5(f"{self.site_url}-{datetime.now().isoformat()}".encode()).hexdigest()
        print(f"Generated IndexNow Key: {key}")
        print(f"IMPORTANT: Create file at {self.site_url}/{key}.txt containing just: {key}")
        return key
    
    # ==========================================
    # 1. INDEXNOW API (Instant to Bing/Yandex)
    # ==========================================
    
    def indexnow_submit(self, urls: List[str]) -> Dict:
        """
        Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver).
        These engines share data with Google indirectly.
        
        Rate: Up to 10,000 URLs per day
        """
        endpoint = "https://api.indexnow.org/indexnow"
        
        # Batch into chunks of 100
        results = []
        for i in range(0, len(urls), 100):
            batch = urls[i:i+100]
            payload = {
                "host": self.site_url.replace("https://", "").replace("http://", ""),
                "key": self.indexnow_key,
                "keyLocation": f"{self.site_url}/{self.indexnow_key}.txt",
                "urlList": batch
            }
            
            try:
                response = requests.post(endpoint, json=payload, timeout=30)
                results.append({
                    "batch": i // 100 + 1,
                    "count": len(batch),
                    "status": response.status_code,
                    "success": response.status_code in [200, 202]
                })
                print(f"IndexNow Batch {i//100 + 1}: {response.status_code}")
            except Exception as e:
                results.append({"batch": i // 100 + 1, "error": str(e)})
            
            time.sleep(0.5)  # Rate limiting
        
        return {"engine": "IndexNow", "results": results}
    
    # ==========================================
    # 2. GOOGLE PING (Sitemap Notification)
    # ==========================================
    
    def google_ping_sitemap(self, sitemap_url: str) -> Dict:
        """
        Ping Google to re-crawl sitemap.
        This is the official way to notify Google of updates.
        """
        ping_url = f"https://www.google.com/ping?sitemap={sitemap_url}"
        
        try:
            response = requests.get(ping_url, timeout=30)
            return {
                "engine": "Google",
                "sitemap": sitemap_url,
                "status": response.status_code,
                "success": response.status_code == 200
            }
        except Exception as e:
            return {"engine": "Google", "error": str(e)}
    
    # ==========================================
    # 3. BING WEBMASTER SUBMIT
    # ==========================================
    
    def bing_submit_urls(self, urls: List[str], api_key: str = None) -> Dict:
        """
        Submit URLs directly to Bing Webmaster API.
        Requires Bing Webmaster API key.
        
        Rate: 10,000 URLs per day for verified sites
        """
        if not api_key:
            api_key = os.getenv('BING_WEBMASTER_API_KEY', '')
        
        if not api_key:
            return {"engine": "Bing", "error": "No API key. Set BING_WEBMASTER_API_KEY"}
        
        endpoint = "https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch"
        
        # Batch into chunks of 500
        results = []
        for i in range(0, len(urls), 500):
            batch = urls[i:i+500]
            params = {"apikey": api_key}
            payload = {
                "siteUrl": self.site_url,
                "urlList": batch
            }
            
            try:
                response = requests.post(endpoint, params=params, json=payload, timeout=30)
                results.append({
                    "batch": i // 500 + 1,
                    "count": len(batch),
                    "status": response.status_code,
                    "success": response.status_code == 200
                })
            except Exception as e:
                results.append({"batch": i // 500 + 1, "error": str(e)})
        
        return {"engine": "Bing API", "results": results}
    
    # ==========================================
    # 4. PING SERVICES (Legacy but effective)
    # ==========================================
    
    def ping_services(self, urls: List[str]) -> Dict:
        """
        Ping legacy blog/feed services.
        These still help with discovery.
        """
        ping_endpoints = [
            "http://ping.twingly.com/RPC2",
            "http://rpc.pingomatic.com/",
            "http://blogsearch.google.com/ping/RPC2",
            "http://ping.feedburner.com",
        ]
        
        results = []
        for endpoint in ping_endpoints:
            try:
                # XML-RPC ping format
                xml_payload = f'''<?xml version="1.0"?>
                <methodCall>
                    <methodName>weblogUpdates.ping</methodName>
                    <params>
                        <param><value>Harbor ML</value></param>
                        <param><value>{self.site_url}</value></param>
                    </params>
                </methodCall>'''
                
                response = requests.post(
                    endpoint,
                    data=xml_payload,
                    headers={'Content-Type': 'text/xml'},
                    timeout=10
                )
                results.append({"endpoint": endpoint, "status": response.status_code})
            except:
                pass  # Ignore failures, these are bonus
        
        return {"engine": "Ping Services", "results": results}
    
    # ==========================================
    # 5. SOCIAL SIGNALS (Backlink Seeding)
    # ==========================================
    
    def generate_social_posts(self, urls: List[str]) -> Dict:
        """
        Generate ready-to-post social media content.
        Social links = referral traffic = Google trust signal.
        """
        posts = []
        
        templates = [
            {
                "platform": "Twitter/X",
                "template": "🚀 Just discovered {url} - game changer for ML video training data. #MachineLearning #AI #DataScience"
            },
            {
                "platform": "LinkedIn",
                "template": "Excited to share our latest work on multimodal AI training datasets. Check out {url} for details on how we're building enterprise-grade video annotation pipelines."
            },
            {
                "platform": "Reddit (r/MachineLearning)",
                "template": "[P] Harbor ML - Open platform for video/audio dataset curation: {url}"
            },
            {
                "platform": "Hacker News",
                "template": "Show HN: Harbor ML – Video dataset platform for AI training {url}"
            },
            {
                "platform": "Product Hunt",
                "template": "Harbor ML: Enterprise video datasets for AI training. Build custom multimodal datasets with auto-annotation. {url}"
            }
        ]
        
        # Generate posts for top URLs
        for url in urls[:10]:
            for template in templates:
                posts.append({
                    "platform": template["platform"],
                    "content": template["template"].format(url=url),
                    "url": url
                })
        
        return {"social_posts": posts}
    
    # ==========================================
    # 6. RUN FULL BLITZ
    # ==========================================
    
    def run_blitz(self, urls: List[str], sitemaps: List[str] = None) -> Dict:
        """
        Execute full aggressive indexing blitz.
        """
        print(f"\n🚀 AGGRESSIVE INDEXING BLITZ")
        print(f"   Target: {len(urls)} URLs")
        print(f"   Site: {self.site_url}\n")
        
        results = {
            "timestamp": datetime.now().isoformat(),
            "total_urls": len(urls),
            "channels": {}
        }
        
        # 1. IndexNow (fastest)
        print("1️⃣  Submitting to IndexNow...")
        results["channels"]["indexnow"] = self.indexnow_submit(urls)
        
        # 2. Google Sitemap Ping
        if sitemaps:
            print("2️⃣  Pinging Google sitemaps...")
            results["channels"]["google_ping"] = []
            for sitemap in sitemaps:
                results["channels"]["google_ping"].append(
                    self.google_ping_sitemap(sitemap)
                )
        
        # 3. Bing API (if key available)
        print("3️⃣  Submitting to Bing...")
        results["channels"]["bing"] = self.bing_submit_urls(urls)
        
        # 4. Legacy pings
        print("4️⃣  Pinging legacy services...")
        results["channels"]["ping_services"] = self.ping_services(urls)
        
        # 5. Social posts (generate, not auto-post)
        print("5️⃣  Generating social posts...")
        results["channels"]["social"] = self.generate_social_posts(urls)
        
        print("\n✅ BLITZ COMPLETE")
        
        return results


def load_urls_from_sitemap(sitemap_path: str) -> List[str]:
    """Extract URLs from a sitemap XML file"""
    import re
    
    with open(sitemap_path, 'r') as f:
        content = f.read()
    
    urls = re.findall(r'<loc>(.*?)</loc>', content)
    return urls


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Aggressive URL indexing blitz')
    parser.add_argument('--sitemap', '-s', help='Path to sitemap XML file')
    parser.add_argument('--urls', '-u', nargs='+', help='Individual URLs to submit')
    parser.add_argument('--output', '-o', help='Output JSON file')
    parser.add_argument('--key', '-k', help='IndexNow API key')
    
    args = parser.parse_args()
    
    # Collect URLs
    urls = []
    sitemaps = []
    
    if args.sitemap:
        if args.sitemap.startswith('http'):
            # Remote sitemap
            response = requests.get(args.sitemap)
            import re
            urls.extend(re.findall(r'<loc>(.*?)</loc>', response.text))
            sitemaps.append(args.sitemap)
        else:
            # Local sitemap
            urls.extend(load_urls_from_sitemap(args.sitemap))
            # Construct remote URL
            filename = os.path.basename(args.sitemap)
            sitemaps.append(f"{SITE_URL}/{filename}")
    
    if args.urls:
        urls.extend(args.urls)
    
    if not urls:
        # Default: use our standard sitemaps
        print("No URLs specified. Loading from public sitemaps...")
        sitemap_dir = "/Users/akeemojuko/.gemini/antigravity/scratch/harboraicore/frontend/public"
        for filename in ['sitemap-main.xml', 'sitemap-lego.xml']:
            path = os.path.join(sitemap_dir, filename)
            if os.path.exists(path):
                urls.extend(load_urls_from_sitemap(path))
                sitemaps.append(f"{SITE_URL}/{filename}")
    
    print(f"Loaded {len(urls)} URLs from {len(sitemaps)} sitemaps")
    
    # Run blitz
    indexer = AggressiveIndexer(SITE_URL, args.key)
    results = indexer.run_blitz(urls, sitemaps)
    
    # Output
    output = json.dumps(results, indent=2)
    print("\n" + "="*50)
    print(output)
    
    if args.output:
        with open(args.output, 'w') as f:
            f.write(output)
        print(f"\nResults saved to {args.output}")
    
    # Print social post instructions
    if 'social' in results['channels']:
        posts = results['channels']['social'].get('social_posts', [])
        if posts:
            print("\n" + "="*50)
            print("📣 SOCIAL POSTING INSTRUCTIONS")
            print("="*50)
            print("\nPost these TODAY to generate referral signals:\n")
            for i, post in enumerate(posts[:5], 1):
                print(f"{i}. [{post['platform']}]")
                print(f"   {post['content']}\n")


if __name__ == '__main__':
    main()
