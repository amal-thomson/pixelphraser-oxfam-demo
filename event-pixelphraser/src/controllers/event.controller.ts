import { Request, Response } from 'express';
import { logger } from '../utils/logger.utils';

export const post = async (request: Request, response: Response) => {

    try {
        const pubSubMessage = request.body.message;
        logger.info('✅ Pub/Sub message received.', pubSubMessage);

        const decodedData = pubSubMessage.data
            ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
            : undefined;

        if (!decodedData) {
            logger.error('❌ No data found in Pub/Sub message.');
            return response.status(400).send();
        }

        const jsonData = JSON.parse(decodedData);
        logger.info('✅ Parsed JSON data from Pub/Sub message.', jsonData);

        return response.status(200).send();

    } catch (error) {
        if (error instanceof Error) {
            logger.error('🚫Error processing request', { error: error.message });
            return response.status(500).send({
                error: '🚫Internal server error. Failed to process request.',
                details: error.message,
            });
        }
        logger.error('🚫Unexpected error', { error });
        return response.status(500).send({
            error: '🚫Unexpected error occurred.',
        });
    }
};
