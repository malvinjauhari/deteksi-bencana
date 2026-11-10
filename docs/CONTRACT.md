# Data Contracts (JSON Schemas)

```json
// Disaster Object Schema
{
  "id": "string",
  "type": "earthquake | flood | forest_fire",
  "location": {
    "lat": -7.250445,
    "lng": 112.768845,
    "description": "Surabaya"
  },
  "urgency_score": 85,
  "ai_analysis": "Bencana ini berpusat dekat pemukiman padat...",
  "votes_count": 12,
  "status": "monitoring | campaign"
}
```