# Lessons Learned

## Session 2026-02-04

### SEO Architecture
- **Lesson**: Static sitemaps get stale. Always prefer dynamic backend-generated sitemaps for scale.
- **Fix**: Unified all sitemap generation under `/api/seo/*` routes.

### Content Velocity
- **Lesson**: 2,600 submitted pages is insufficient for aggressive organic growth. Need 10x scale.
- **Action**: Implement partitioned PSEO sitemaps and programmatic content generation.

---

## Corrections Log
<!-- Add entries here after any user correction -->
