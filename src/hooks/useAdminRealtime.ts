import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export type ToastEvent = {
  id: string
  type: 'order' | 'message' | 'success' | 'error'
  titleKey?: string
  bodyKey?: string
  message?: string
  name?: string
  timestamp: number
  wilaya?: string
  product_name?: string
}

type Options = {
  onNewOrder: (evt: ToastEvent) => void
  onNewMessage: (evt: ToastEvent) => void
  soundEnabled: boolean
}

// ── Session-scoped deduplication ─────────────────────────────────────────────
const SEEN_ORDERS_KEY   = 'gz_admin_seen_orders'
const SEEN_MESSAGES_KEY = 'gz_admin_seen_messages'

function getSeenIds(key: string): Set<string> {
  try {
    const raw = sessionStorage.getItem(key)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch { return new Set() }
}

function markSeen(key: string, id: string) {
  const seen = getSeenIds(key)
  seen.add(id)
  try { sessionStorage.setItem(key, JSON.stringify([...seen])) } catch { /* quota */ }
}

const SOUND_URL = '/sounds/Notification.wav'

export const notificationAudio: HTMLAudioElement | null =
  typeof window !== 'undefined' ? (() => {
    const a = new Audio()
    a.preload = 'auto'
    a.volume = 0.8
    console.log(`[GZ Audio] Audio element created. Source: ${SOUND_URL}`)
    a.addEventListener('canplaythrough', () => {
      console.log('[GZ Audio] ✅ File ready — canplaythrough fired.')
    }, { once: true })
    a.addEventListener('error', (e) => {
      const mediaErr = (e.target as HTMLAudioElement).error
      console.error(
        `[GZ Audio] ❌ Error loading ${SOUND_URL}`,
        `code=${mediaErr?.code}`,
        `message=${mediaErr?.message}`
      )
    })
    a.src = SOUND_URL
    a.load()
    return a
  })() : null

// Track whether the user has interacted (required for Chrome/Safari autoplay).
// We attach it to `window` so it survives Vite Hot Module Replacement (HMR).
// Otherwise, every time you save a file, HMR resets the module variable to `false`
// but leaves the old event listeners orphaned.

if (typeof window !== 'undefined') {
  if (typeof (window as any).__gz_interacted === 'undefined') {
    (window as any).__gz_interacted = false
  }

  const unlockAudio = () => {
    if ((window as any).__gz_interacted) return
    (window as any).__gz_interacted = true
    console.log('Audio unlocked')

    // Remove listeners so it only triggers once
    window.removeEventListener('pointerdown', unlockAudio, { capture: true })
    window.removeEventListener('click',       unlockAudio, { capture: true })
    window.removeEventListener('keydown',     unlockAudio, { capture: true })
    window.removeEventListener('touchstart',  unlockAudio, { capture: true })
  }

  window.addEventListener('pointerdown', unlockAudio, { capture: true })
  window.addEventListener('click',       unlockAudio, { capture: true })
  window.addEventListener('keydown',     unlockAudio, { capture: true })
  window.addEventListener('touchstart',  unlockAudio, { capture: true })
}

// Shared play function — called both by Realtime and the Test button in Settings.
export async function playNotificationSound(): Promise<void> {
  const audio = notificationAudio
  if (!audio) {
    console.warn('[GZ Audio] No audio instance — cannot play.')
    return
  }

  console.log('[GZ Audio] ▶ playNotificationSound() called')
  console.log(`[GZ Audio]   src        = ${audio.src}`)
  console.log(`[GZ Audio]   readyState = ${audio.readyState}  (4 = HAVE_ENOUGH_DATA)`)
  console.log(`[GZ Audio]   interacted = ${(window as any).__gz_interacted}`)

  try {
    audio.currentTime = 0
    audio.volume = 0.8
    await audio.play()
    console.log('[GZ Audio] ✅ Playback started successfully.')
  } catch (err: any) {
    console.error('[GZ Audio] ❌ play() threw an error:')
    console.error(`[GZ Audio]   name    = ${err?.name}`)
    console.error(`[GZ Audio]   message = ${err?.message}`)
    console.error('[GZ Audio]   full error object:', err)
    if (err?.name === 'NotAllowedError') {
      console.warn('[GZ Audio] ⚠ Autoplay blocked. The user must interact with the page first. Click anywhere, then trigger a notification again.')
    }
    if (err?.name === 'NotSupportedError') {
      console.warn(`[GZ Audio] ⚠ NotSupportedError — the browser cannot decode the file at: ${audio.src}. Check that the file exists and is a valid audio format.`)
    }
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useAdminRealtime({ onNewOrder, onNewMessage, soundEnabled }: Options) {
  const soundRef        = useRef(soundEnabled)
  const onNewOrderRef   = useRef(onNewOrder)
  const onNewMessageRef = useRef(onNewMessage)

  // Keep refs current on every render without re-subscribing
  soundRef.current        = soundEnabled
  onNewOrderRef.current   = onNewOrder
  onNewMessageRef.current = onNewMessage

  useEffect(() => {
    console.log('[Realtime] Subscribing to gz-admin-realtime-v4...')

    const channel = supabase
      .channel('gz-admin-realtime-v4', {
        config: { broadcast: { self: false } }
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log("Received realtime payload (order):", payload)
          
          if (payload.eventType === 'INSERT') {
            const record = payload.new as any
            if (!record?.id) return
            if (getSeenIds(SEEN_ORDERS_KEY).has(record.id)) return
            markSeen(SEEN_ORDERS_KEY, record.id)

            if (soundRef.current) playNotificationSound()
            window.dispatchEvent(new CustomEvent('new-admin-order', { detail: record }))

            onNewOrderRef.current({
              id:           record.id,
              type:         'order',
              titleKey:     'admin.notification.new_order.title',
              bodyKey:      'admin.notification.new_order.body',
              name:         record.customer_name || '—',
              wilaya:       record.wilaya,
              product_name: record.product_name,
              timestamp:    Date.now(),
            })
          } else if (payload.eventType === 'DELETE') {
            window.dispatchEvent(new CustomEvent('delete-admin-order', { detail: payload.old }))
          } else if (payload.eventType === 'UPDATE') {
            window.dispatchEvent(new CustomEvent('update-admin-order', { detail: payload.new }))
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_messages' },
        (payload) => {
          console.log("Received realtime payload (message):", payload)
          
          if (payload.eventType === 'INSERT') {
            const record = payload.new as { id: string; name: string }
            if (!record?.id) return
            if (getSeenIds(SEEN_MESSAGES_KEY).has(record.id)) return
            markSeen(SEEN_MESSAGES_KEY, record.id)

            if (soundRef.current) playNotificationSound()
            
            onNewMessageRef.current({
              id:        record.id,
              type:      'message',
              titleKey:  'admin.notification.new_message.title',
              bodyKey:   'admin.notification.new_message.body',
              name:      record.name || '—',
              timestamp: Date.now(),
            })
          } else if (payload.eventType === 'DELETE') {
            window.dispatchEvent(new CustomEvent('delete-admin-message', { detail: payload.old }))
          }
        }
      )
      .subscribe((status, err) => {
        console.log("Subscription status:", status)
        if (err) console.error("Subscription error:", err)
      })

    return () => {
      console.log('[Realtime] Cleaning up channel...')
      supabase.removeChannel(channel)
    }
  }, [])
}

// ── Browser console test helper ───────────────────────────────────────────────
// Run in DevTools: window.__gz_testSound()
;(window as any).__gz_testSound = () => {
  console.log('[GZ Audio] __gz_testSound() invoked from console.')
  playNotificationSound()
}
