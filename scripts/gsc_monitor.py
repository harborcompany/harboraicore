#!/usr/bin/env python3
"""
Harbor ML - Google Search Console Index Monitor
Tracks indexation progress and alerts on issues.

Setup:
1. Create a Google Cloud Project
2. Enable "Google Search Console API"
3. Create a Service Account, download JSON key
4. Add the Service Account email as a user in GSC for your property
5. Set GSC_CREDENTIALS_PATH and GSC_SITE_URL environment variables
"""

import os
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Try to import Google libraries
try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    GOOGLE_LIBS_AVAILABLE = True
except ImportError:
    GOOGLE_LIBS_AVAILABLE = False
    logger.warning("Google API libraries not installed. Run: pip install google-auth google-api-python-client")


class GSCMonitor:
    """Monitor Google Search Console indexation status"""
    
    SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']
    
    def __init__(self, credentials_path: str, site_url: str):
        """
        Initialize the GSC Monitor.
        
        Args:
            credentials_path: Path to service account JSON key file
            site_url: The site URL in GSC format (e.g., 'sc-domain:harborml.com' or 'https://harborml.com/')
        """
        self.site_url = site_url
        self.credentials_path = credentials_path
        self.service = None
        
        if GOOGLE_LIBS_AVAILABLE:
            self._authenticate()
    
    def _authenticate(self):
        """Authenticate with Google API using service account"""
        try:
            credentials = service_account.Credentials.from_service_account_file(
                self.credentials_path,
                scopes=self.SCOPES
            )
            self.service = build('searchconsole', 'v1', credentials=credentials)
            logger.info(f"Authenticated with GSC for {self.site_url}")
        except Exception as e:
            logger.error(f"Failed to authenticate: {e}")
            raise
    
    def get_index_coverage(self) -> Dict[str, Any]:
        """
        Get index coverage statistics.
        
        Note: The Search Console API has limited direct access to coverage data.
        This method uses the URL Inspection API for individual URLs.
        For full coverage stats, you may need to scrape GSC or use the Reporting API.
        
        Returns:
            Dict with coverage statistics
        """
        if not self.service:
            return {"error": "Not authenticated"}
        
        # The GSC API doesn't expose bulk coverage stats directly
        # We simulate by checking our sitemap URLs
        logger.info("Note: GSC API has limited coverage data. Use GSC UI for full stats.")
        
        return {
            "status": "api_limited",
            "message": "Use the search_analytics method for performance data, or inspect individual URLs",
            "recommendation": "Check GSC UI for Coverage Report"
        }
    
    def inspect_url(self, url: str) -> Dict[str, Any]:
        """
        Inspect a specific URL's index status.
        
        Args:
            url: The URL to inspect
            
        Returns:
            Dict with inspection results
        """
        if not self.service:
            return {"error": "Not authenticated"}
        
        try:
            request = {
                'inspectionUrl': url,
                'siteUrl': self.site_url
            }
            response = self.service.urlInspection().index().inspect(body=request).execute()
            
            result = response.get('inspectionResult', {})
            index_status = result.get('indexStatusResult', {})
            
            return {
                "url": url,
                "verdict": index_status.get('verdict', 'UNKNOWN'),
                "coverage_state": index_status.get('coverageState', 'UNKNOWN'),
                "robots_state": index_status.get('robotsTxtState', 'UNKNOWN'),
                "indexing_state": index_status.get('indexingState', 'UNKNOWN'),
                "last_crawl_time": index_status.get('lastCrawlTime'),
                "page_fetch_state": index_status.get('pageFetchState', 'UNKNOWN'),
            }
        except Exception as e:
            logger.error(f"URL inspection failed for {url}: {e}")
            return {"url": url, "error": str(e)}
    
    def get_search_analytics(self, days: int = 7) -> Dict[str, Any]:
        """
        Get search analytics (impressions, clicks, position) for recent days.
        
        Args:
            days: Number of days to look back
            
        Returns:
            Dict with analytics data
        """
        if not self.service:
            return {"error": "Not authenticated"}
        
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        try:
            request = {
                'startDate': start_date.strftime('%Y-%m-%d'),
                'endDate': end_date.strftime('%Y-%m-%d'),
                'dimensions': ['date'],
                'rowLimit': 100
            }
            
            response = self.service.searchanalytics().query(
                siteUrl=self.site_url,
                body=request
            ).execute()
            
            rows = response.get('rows', [])
            
            total_clicks = sum(row.get('clicks', 0) for row in rows)
            total_impressions = sum(row.get('impressions', 0) for row in rows)
            avg_position = sum(row.get('position', 0) for row in rows) / len(rows) if rows else 0
            
            return {
                "period": f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
                "total_clicks": total_clicks,
                "total_impressions": total_impressions,
                "average_position": round(avg_position, 2),
                "daily_data": [
                    {
                        "date": row['keys'][0],
                        "clicks": row.get('clicks', 0),
                        "impressions": row.get('impressions', 0),
                        "ctr": round(row.get('ctr', 0) * 100, 2),
                        "position": round(row.get('position', 0), 1)
                    }
                    for row in rows
                ]
            }
        except Exception as e:
            logger.error(f"Search analytics query failed: {e}")
            return {"error": str(e)}
    
    def get_sitemaps(self) -> Dict[str, Any]:
        """
        Get sitemap status from GSC.
        
        Returns:
            Dict with sitemap information
        """
        if not self.service:
            return {"error": "Not authenticated"}
        
        try:
            response = self.service.sitemaps().list(siteUrl=self.site_url).execute()
            
            sitemaps = []
            for sitemap in response.get('sitemap', []):
                sitemaps.append({
                    "path": sitemap.get('path'),
                    "last_submitted": sitemap.get('lastSubmitted'),
                    "last_downloaded": sitemap.get('lastDownloaded'),
                    "is_pending": sitemap.get('isPending', False),
                    "is_sitemaps_index": sitemap.get('isSitemapsIndex', False),
                    "type": sitemap.get('type'),
                    "errors": sitemap.get('errors', 0),
                    "warnings": sitemap.get('warnings', 0),
                    "contents": [
                        {
                            "type": content.get('type'),
                            "submitted": content.get('submitted', 0),
                            "indexed": content.get('indexed', 0)
                        }
                        for content in sitemap.get('contents', [])
                    ]
                })
            
            # Calculate index ratio
            total_submitted = 0
            total_indexed = 0
            for sm in sitemaps:
                for content in sm.get('contents', []):
                    total_submitted += content.get('submitted', 0)
                    total_indexed += content.get('indexed', 0)
            
            index_ratio = (total_indexed / total_submitted * 100) if total_submitted > 0 else 0
            
            return {
                "sitemaps": sitemaps,
                "summary": {
                    "total_sitemaps": len(sitemaps),
                    "total_submitted": total_submitted,
                    "total_indexed": total_indexed,
                    "index_ratio": round(index_ratio, 2),
                    "health": "GOOD" if index_ratio > 70 else "WARNING" if index_ratio > 40 else "CRITICAL"
                }
            }
        except Exception as e:
            logger.error(f"Sitemap query failed: {e}")
            return {"error": str(e)}
    
    def run_daily_check(self) -> Dict[str, Any]:
        """
        Run a comprehensive daily health check.
        
        Returns:
            Dict with full health report
        """
        logger.info("Starting daily GSC health check...")
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "site": self.site_url,
            "sitemaps": self.get_sitemaps(),
            "analytics": self.get_search_analytics(days=7),
        }
        
        # Determine overall health
        sitemap_health = report['sitemaps'].get('summary', {}).get('health', 'UNKNOWN')
        impressions = report['analytics'].get('total_impressions', 0)
        
        if sitemap_health == 'CRITICAL' or impressions == 0:
            report['overall_health'] = 'CRITICAL'
            report['action'] = 'STOP PUBLISHING - Review indexation issues'
        elif sitemap_health == 'WARNING':
            report['overall_health'] = 'WARNING'
            report['action'] = 'HOLD - Do not add new sitemaps until ratio improves'
        else:
            report['overall_health'] = 'GOOD'
            report['action'] = 'PROCEED - Safe to add next sitemap batch'
        
        logger.info(f"Health check complete: {report['overall_health']}")
        
        return report


def main():
    """Main entry point for CLI usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Monitor Google Search Console indexation')
    parser.add_argument('--credentials', '-c', 
                        default=os.getenv('GSC_CREDENTIALS_PATH', 'gsc-credentials.json'),
                        help='Path to service account JSON key')
    parser.add_argument('--site', '-s',
                        default=os.getenv('GSC_SITE_URL', 'sc-domain:harborml.com'),
                        help='Site URL in GSC format')
    parser.add_argument('--action', '-a',
                        choices=['check', 'sitemaps', 'analytics', 'inspect'],
                        default='check',
                        help='Action to perform')
    parser.add_argument('--url', '-u',
                        help='URL to inspect (for inspect action)')
    parser.add_argument('--output', '-o',
                        help='Output file for JSON report')
    
    args = parser.parse_args()
    
    if not GOOGLE_LIBS_AVAILABLE:
        print("ERROR: Google API libraries not installed.")
        print("Run: pip install google-auth google-api-python-client")
        return 1
    
    if not os.path.exists(args.credentials):
        print(f"ERROR: Credentials file not found: {args.credentials}")
        print("\nSetup Instructions:")
        print("1. Go to Google Cloud Console")
        print("2. Create a project and enable 'Search Console API'")
        print("3. Create a Service Account and download the JSON key")
        print("4. In GSC, add the service account email as a user")
        print("5. Set GSC_CREDENTIALS_PATH environment variable")
        return 1
    
    monitor = GSCMonitor(args.credentials, args.site)
    
    if args.action == 'check':
        result = monitor.run_daily_check()
    elif args.action == 'sitemaps':
        result = monitor.get_sitemaps()
    elif args.action == 'analytics':
        result = monitor.get_search_analytics()
    elif args.action == 'inspect':
        if not args.url:
            print("ERROR: --url required for inspect action")
            return 1
        result = monitor.inspect_url(args.url)
    
    # Output
    output = json.dumps(result, indent=2, default=str)
    print(output)
    
    if args.output:
        with open(args.output, 'w') as f:
            f.write(output)
        logger.info(f"Report saved to {args.output}")
    
    return 0


if __name__ == '__main__':
    exit(main())
