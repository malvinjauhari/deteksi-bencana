# Database Schema

- **Collection `users`:** `id`, `email`, `role`, `verified_status`
- **Collection `disasters`:** `id`, `source_api`, `lat`, `lng`, `urgency_score`, `ai_analysis`, `created_at`
- **Collection `votes`:** `id`, `disaster_id`, `user_id`, `weight`
- **Collection `donations`:** `id`, `campaign_id`, `user_id`, `amount`, `status`, `payment_ref`