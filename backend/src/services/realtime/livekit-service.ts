import { AccessToken } from 'livekit-server-sdk';

export class LiveKitService {
    private apiKey: string;
    private apiSecret: string;
    private wsUrl: string;

    constructor() {
        this.apiKey = process.env.LIVEKIT_API_KEY || '';
        this.apiSecret = process.env.LIVEKIT_API_SECRET || '';
        this.wsUrl = process.env.LIVEKIT_URL || 'ws://localhost:7880';

        if (!this.apiKey || !this.apiSecret) {
            console.warn('LiveKit keys missing. Realtime features will not work.');
        }
    }

    /**
     * Generate a JWT token for a client to connect to a room
     */
    async generateToken(roomName: string, participantName: string, identity: string): Promise<string> {
        const at = new AccessToken(this.apiKey, this.apiSecret, {
            identity,
            name: participantName,
        });

        // Grant permissions
        at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true
        });

        return at.toJwt();
    }
}

export const liveKitService = new LiveKitService();
