-- Fix Campaign Counters Script
-- This recalculates campaign statistics from actual recipient statuses

-- First, let's see the current state
SELECT 
    c.id,
    c.name,
    c.total_recipients,
    c.sent,
    c.delivered,
    c.failed,
    c.pending,
    -- Actual counts from recipients
    (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = c.id AND status IN ('sent', 'delivered', 'read')) as actual_sent,
    (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = c.id AND status = 'delivered') as actual_delivered,
    (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = c.id AND status = 'read') as actual_read,
    (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = c.id AND status = 'failed') as actual_failed,
    (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = c.id AND status = 'pending') as actual_pending
FROM campaigns c
WHERE c.created_at >= CURRENT_DATE - INTERVAL '1 day'
ORDER BY c.created_at DESC;

-- Now fix all campaigns by recalculating from recipients
UPDATE campaigns c
SET 
    sent = (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = c.id AND status IN ('sent', 'delivered', 'read')),
    delivered = (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = c.id AND status = 'delivered'),
    read = (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = c.id AND status = 'read'),
    failed = (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = c.id AND status = 'failed'),
    pending = (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = c.id AND status = 'pending'),
    updated_at = NOW()
WHERE c.created_at >= CURRENT_DATE - INTERVAL '1 day';

-- Verify the fix
SELECT 
    c.id,
    c.name,
    c.total_recipients,
    c.sent,
    c.delivered,
    c.read,
    c.failed,
    c.pending,
    -- Success rate
    ROUND((c.delivered::numeric + c.read::numeric) / NULLIF(c.total_recipients, 0) * 100, 1) as success_rate
FROM campaigns c
WHERE c.created_at >= CURRENT_DATE - INTERVAL '1 day'
ORDER BY c.created_at DESC;
