// Removed accidental code fence
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { WebHookRequest } from '../../types/webhook';
import { createServiceClient } from '@/lib/supabase/service-client';
import { DBTables } from '@/lib/enums/Tables';
import { downloadMedia } from './media';
import { updateBroadCastReplyStatus, updateBroadCastStatus } from './bulk-send-events';

export const revalidate = 0

export async function GET(request: Request) {
  const urlDecoded = new URL(request.url)
  const urlParams = urlDecoded.searchParams
  let mode = urlParams.get('hub.mode');
  let token = urlParams.get('hub.verify_token');
  let challenge = urlParams.get('hub.challenge');
  if (mode && token && challenge && mode == 'subscribe') {
    const isValid = token == process.env.WEBHOOK_VERIFY_TOKEN
    if (isValid) {
      return new NextResponse(challenge)
    } else {
      return new NextResponse(null, { status: 403 })
    }
  } else {
    return new NextResponse(null, { status: 400 })
  }
}

export async function POST(request: NextRequest) {
  const headersList = headers();
  // Debug: log incoming headers for troubleshooting (safe in dev only)
  try {
    const headerObj = Object.fromEntries(headersList.entries());
    // sanitize sensitive headers before logging
    const sanitized: Record<string, string> = {};
    for (const [k, v] of Object.entries(headerObj)) {
      const kl = k.toLowerCase();
      if (kl === 'authorization' || kl === 'accept') {
        sanitized[k] = '[REDACTED]';
      } else {
        sanitized[k] = v as string;
      }
    }
    console.debug('Incoming webhook headers (sanitized):', sanitized);
  } catch (e) {
    // ignore
  }

  // Accept multiple common header names and be case-insensitive
  const xHubSignature256 =
    headersList.get('x-hub-signature-256') ??
    headersList.get('x-hub-signature') ??
    headersList.get('X-Hub-Signature-256') ??
    headersList.get('X-Hub-Signature') ??
    null;

  const rawRequestBody = await request.text();

  // Non-production debug: log trimmed secret length and a small preview of the raw body
  if (process.env.NODE_ENV !== 'production') {
    try {
      const trimmedSecretLength = (process.env.FACEBOOK_APP_SECRET || '').trim().length;
      console.debug('FB secret length (chars):', trimmedSecretLength);
      console.debug('Raw request body preview (first 300 chars):', rawRequestBody.slice(0, 300));
      // use Buffer.byteLength for accurate byte count
      console.debug('Raw body byte length:', Buffer.byteLength(rawRequestBody, 'utf8'));
    } catch (e) {
      // ignore debug errors
    }
  }

  // Allow disabling verification in dev or via env var for local testing
  const skipVerify = process.env.DISABLE_WEBHOOK_SIGNATURE === 'true' || process.env.NODE_ENV !== 'production';
  if (!xHubSignature256 && !skipVerify) {
    console.warn('Missing signature header');
    return new NextResponse(null, { status: 401 });
  }

  // If skipping verification, log and continue
  if (skipVerify) {
    console.warn('Skipping webhook signature verification (DISABLE_WEBHOOK_SIGNATURE=' + (process.env.DISABLE_WEBHOOK_SIGNATURE || 'false') + ', NODE_ENV=' + (process.env.NODE_ENV || 'unknown') + ')');
  } else {
    // Verify signature using raw body bytes
    const secret = (process.env.FACEBOOK_APP_SECRET || '').trim();

    // CRITICAL: Convert raw string to Buffer and compute HMAC on exact bytes
    const bodyBuffer = Buffer.from(rawRequestBody, 'utf8');
    const computedSignature = 'sha256=' +
      crypto.createHmac('sha256', secret)
        .update(bodyBuffer as any)
        .digest('hex');

    console.debug('Received signature:', xHubSignature256);
    console.debug('Computed signature:', computedSignature);

    // Compare signatures
    if (xHubSignature256 !== computedSignature) {
      console.warn(`Invalid signature: received=${xHubSignature256}, computed=${computedSignature}`);
      return new NextResponse(null, { status: 401 });
    }

    console.log('✅ Signature verified successfully');
  }
  const webhookBody = JSON.parse(rawRequestBody) as WebHookRequest;
  if (webhookBody.entry.length > 0) {
    const supabase = createServiceClient()
    let { error } = await supabase
      .from(DBTables.Webhook)
      .insert(webhookBody.entry.map((entry) => {
        return { payload: entry }
      }))
    if (error) throw error
    const changes = webhookBody.entry[0].changes;
    if (changes.length > 0) {
      if (changes[0].field === "messages") {
        const changeValue = changes[0].value;
        const contacts = changeValue.contacts;
        const messages = changeValue.messages;
        const statuses = changeValue.statuses;
        if (contacts && contacts.length > 0) {
          for (const contact of contacts) {
            let { error } = await supabase
              .from(DBTables.Contacts)
              .upsert({
                wa_id: contact.wa_id,
                profile_name: contact.profile.name,
                last_message_at: new Date(),
                last_message_received_at: new Date(),
                in_chat: true,
              })
            if (error) throw error
          }
        }
        if (messages) {
          let { error } = await supabase
            .from(DBTables.Messages)
            .upsert(messages.map(message => {
              return {
                chat_id: message.from,
                message: message,
                wam_id: message.id,
                created_at: new Date(Number.parseInt(message.timestamp) * 1000),
                is_received: true,
              }
            }), { onConflict: 'wam_id', ignoreDuplicates: true })
          if (error) throw new Error("Error while inserting messages to database", { cause: error})
          for (const message of messages) {
            if (message.type === 'image' || message.type === 'video' || message.type === 'document') {
              await downloadMedia(message)
            }
          }
          await updateBroadCastReplyStatus(messages)
          await supabase.functions.invoke('update-unread-count', { body: {
            chat_id: messages.map(m => m.from).filter((m, i, a) => a.indexOf(m) === i)
          }})
        }
        if (statuses && statuses.length > 0) {
          for (const status of statuses) {
            const update_obj: {
              wam_id_in: string,
              sent_at_in?: Date,
              delivered_at_in?: Date,
              read_at_in?: Date,
              failed_at_in?: Date,
            } = {
              wam_id_in: status.id,
            }
            let functionName: 'update_message_delivered_status' | 'update_message_read_status' | 'update_message_sent_status' | 'update_message_failed_status' | null = null;
            if (status.status === 'sent') {
              update_obj.sent_at_in = new Date(Number.parseInt(status.timestamp) * 1000)
              functionName = 'update_message_sent_status'
            } else if (status.status === 'delivered') {
              update_obj.delivered_at_in = new Date(Number.parseInt(status.timestamp) * 1000)
              functionName = 'update_message_delivered_status'
            } else if (status.status === 'read') {
              update_obj.read_at_in = new Date(Number.parseInt(status.timestamp) * 1000)
              functionName = 'update_message_read_status'
            } else if (status.status === 'failed') {
              update_obj.failed_at_in = new Date(Number.parseInt(status.timestamp) * 1000)
              functionName = 'update_message_failed_status'
            } else {
              console.warn(`Unknown status : ${status.status}`)
              console.warn('status', status)
              return new NextResponse()
            }
            if (functionName) {
              const { data, error: updateDeliveredStatusError } = await supabase.rpc(functionName, update_obj)
              if (updateDeliveredStatusError) throw new Error(`Error while updating status, functionName: ${functionName} wam_id: ${status.id} status: ${status.status}`, { cause: updateDeliveredStatusError })
              console.log(`${functionName} data`, data)
              if (data) {
                await updateBroadCastStatus(status)
              } else {
                console.warn(`Status already updated : ${status.id} : ${status.status}`)
              }
            }
          }
        }
      }
    }
  }
  return new NextResponse()
}
