'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    PusherPushNotifications?: any;
  }
}

export default function NotificationClient() {
  useEffect(() => {
    const instanceId = process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID;
    if (!instanceId || !window.PusherPushNotifications) return;

    const beams = new window.PusherPushNotifications.Client({ instanceId });
    beams
      .start()
      .then(() => beams.addDeviceInterest('customers'))
      .catch((e: any) => console.warn('[Beams] init failed', e));
  }, []);

return null;
}
