# xndr.site

Personal site and blog built with Next.js.

## Email Notifications

Send a notification email to all confirmed subscribers with the latest blog post:

```bash
curl -X POST https://xndr.site/api/notify -H "Authorization: Bearer $NOTIFY_SECRET"
```
