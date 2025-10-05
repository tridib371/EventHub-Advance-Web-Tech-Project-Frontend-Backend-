import { Injectable, Logger } from '@nestjs/common';
import PushNotifications from '@pusher/push-notifications-server';

@Injectable()
export class BeamsService {
  private readonly logger = new Logger(BeamsService.name);
  private readonly client: PushNotifications | null;

  constructor() {
    const instanceId = process.env.BEAMS_INSTANCE_ID;
    const secretKey = process.env.BEAMS_SECRET_KEY;

    if (!instanceId || !secretKey) {
      this.logger.warn('Beams disabled: missing BEAMS_INSTANCE_ID/BEAMS_SECRET_KEY');
      this.client = null;
      return;
    }

    this.client = new PushNotifications({ instanceId, secretKey });
  }

  async publish(title: string, body: string) {
    if (!this.client) return;
    try {
      await this.client.publishToInterests(['customers'], {
        web: { notification: { title, body } },
      });
      this.logger.log(`Beams published: ${title} - ${body}`);
    } catch (e) {
      this.logger.error('Beams publish error', e as any);
}
}
}
