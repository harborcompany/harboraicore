#!/usr/bin/env python3
"""
Harbor ML - Image Renaming Script
Renames images to SEO-friendly names based on context.
"""

import os
import re
import json
from pathlib import Path

# Mapping of old names to SEO-friendly names
RENAME_MAP = {
    # Hero/Landing images
    "Make_the_background_202601271704.jpeg": "multimodal-data-infrastructure-hero.webp",
    "Do_a_montage_2k_202601271637.jpeg": "harbor-ml-data-montage-hero.webp",
    "Keep_the_same_2k_202601271703.jpeg": "ai-training-data-pipeline.webp",
    
    # Infrastructure images
    "api_infrastructure_preview.png": "harbor-api-infrastructure-diagram.webp",
    "global_media_ingestion_pipeline.webp": "global-media-ingestion-pipeline.webp",
    "diagram_architecture_stack_1769477312827.png": "harbor-architecture-stack-diagram.webp",
    "diagram_rlhf_cycle_1769477296587.png": "rlhf-training-cycle-diagram.webp",
    
    # Ads/Creative images
    "ads_creative_pipeline.webp": "ai-ads-creative-pipeline.webp",
    "real_ads_editor_1769477704902.png": "harbor-ads-editor-interface.webp",
    "bg_ads_studio_1769477459021.png": "ai-ads-studio-background.webp",
    
    # Enterprise images
    "real_enterprise_meeting_1769477739082.png": "enterprise-data-meeting-room.webp",
    "bg_enterprise_server_1769477490212.png": "enterprise-server-infrastructure.webp",
    
    # Robotics images
    "real_robotics_factory_1769477720637.png": "robotics-factory-automation.webp",
    "bg_robotics_arm_1769477475959.png": "industrial-robotics-arm.webp",
    
    # Data/Pipeline images
    "bg_live_data_stream_1769477506479.png": "live-data-streaming-visualization.webp",
    
    # Logos
    "harbor-logo.png": "harbor-ml-logo.webp",
    "harbor-logo-fixed.png": "harbor-ml-logo-dark.webp",
    "mainlogonobg.jpeg": "harbor-ml-logo-transparent.webp",
    
    # Landing assets
    "annotation_preview_v3.png": "video-annotation-preview.webp",
    "dataset_lego_v3.png": "lego-dataset-example.webp",
    "infrastructure_v3.png": "data-infrastructure-overview.webp",
    "pipeline_real_v3.png": "real-time-data-pipeline.webp",
    
    # Generic uploaded media (generate contextual names)
    "uploaded_media_0_1769513332172.png": "harbor-feature-preview-1.webp",
    "uploaded_media_0_1769516241543.png": "harbor-feature-preview-2.webp",
    "uploaded_media_1769514435161.png": "data-annotation-interface.webp",
    "uploaded_media_1769514705185.png": "dataset-browser-preview.webp",
    "uploaded_media_1769514820786.png": "ai-model-training-dashboard.webp",
    "uploaded_media_1769515348447.png": "enterprise-analytics-view.webp",
    "uploaded_media_1769515868371.png": "contributor-onboarding-flow.webp",
    "uploaded_media_1769516104898.png": "harbor-platform-overview.webp",
}

def generate_seo_name(old_name: str) -> str:
    """Generate SEO-friendly name from old name"""
    # Check if we have a mapping
    if old_name in RENAME_MAP:
        return RENAME_MAP[old_name]
    
    # Auto-generate from filename
    base = os.path.splitext(old_name)[0]
    
    # Remove timestamps
    base = re.sub(r'_\d{13}', '', base)
    base = re.sub(r'_\d{12}', '', base)
    base = re.sub(r'_202\d{10}', '', base)
    
    # Replace underscores with hyphens
    base = base.replace('_', '-')
    
    # Lowercase
    base = base.lower()
    
    # Remove leading numbers/special chars
    base = re.sub(r'^[\d\-]+', '', base)
    
    # Ensure .webp extension
    return f"{base}.webp" if base else None


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Rename images to SEO-friendly names')
    parser.add_argument('--dir', '-d', default='frontend/public', help='Image directory')
    parser.add_argument('--dry-run', '-n', action='store_true', help='Show changes without applying')
    parser.add_argument('--output', '-o', help='Output JSON mapping file')
    
    args = parser.parse_args()
    
    print("🖼️  IMAGE SEO RENAMING")
    print("=" * 40)
    print("")
    
    image_dir = Path(args.dir)
    if not image_dir.exists():
        print(f"❌ Directory not found: {image_dir}")
        return 1
    
    renames = []
    
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
        for img in image_dir.rglob(ext):
            old_name = img.name
            new_name = generate_seo_name(old_name)
            
            if new_name and new_name != old_name:
                renames.append({
                    'old': str(img),
                    'new': str(img.parent / new_name),
                    'old_name': old_name,
                    'new_name': new_name
                })
    
    print(f"Found {len(renames)} images to rename\n")
    
    for r in renames[:20]:  # Show first 20
        print(f"  {r['old_name']}")
        print(f"    → {r['new_name']}")
        print("")
    
    if len(renames) > 20:
        print(f"  ... and {len(renames) - 20} more\n")
    
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(renames, f, indent=2)
        print(f"📝 Mapping saved to {args.output}")
    
    if not args.dry_run:
        print("\n🔄 Applying renames...")
        for r in renames:
            try:
                os.rename(r['old'], r['new'])
                print(f"  ✅ {r['old_name']} → {r['new_name']}")
            except Exception as e:
                print(f"  ❌ Failed: {r['old_name']}: {e}")
        print("\n✅ Done!")
    else:
        print("\n⚠️  Dry run - no files changed. Remove --dry-run to apply.")
    
    return 0


if __name__ == '__main__':
    exit(main())
