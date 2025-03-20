import { Request, Response } from 'express';
import { logger } from '../utils/logger.utils';
import { productAnalysis } from '../services/vision-ai/productAnalysis.service';
import { generateProductDescription } from '../services/generative-ai/descriptionGeneration.service';
import { ProductAttribute } from '../interfaces/productAttribute.interface';
import { createProductCustomObject } from '../repository/custom-object/createCustomObject.repository';
import { updateCustomObjectWithDescription } from '../repository/custom-object/updateCustomObjectWithDescription';
import { fetchProductType } from '../repository/product-type/fetchProductTypeById.repository';
import { translateProductDescription } from '../services/generative-ai/translateProductDescription.service';
import { fetchProduct } from '../repository/product/fetchProductByID.repository';

export const post = async (request: Request, response: Response) => {

    try {
        const pubSubMessage = request.body.message;
        const decodedData = pubSubMessage.data
            ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
            : undefined;

        if (!decodedData) {
            logger.error('🚫No data found in Pub/Sub message.');
            return response.status(400).send();
        }

        const messageData = JSON.parse(decodedData);
        if (messageData.typeId === 'product') {
            logger.info('✅Event message received.', messageData);
            logger.info('⌛Processing event message.');
        }

        // Extract product ID and image URL from message data
        const productId = messageData.id;
        const imageUrl = messageData.image?.url;
        logger.info(`Product Id: ${productId}, Image Url: ${imageUrl}`);

        // Fetch product data
        const productData = await fetchProduct(productId);

        // Extract product type, name and id from product data
        const productType = productData.productType.id;
        const productName = productData?.masterData.current.name.en;
        logger.info(`Product Name: ${productName}, Product Type: ${productType}`);

        // Check if product ID, image URL, product name and product type are available
        if (productId && imageUrl && productName && productType) {

            const attributes: ProductAttribute[] = productData.masterData?.staged?.masterVariant?.attributes || [];
            // Check if attributes are available
            if (!attributes || attributes.length === 0) {
                logger.error('🚫No attributes found in the product data.');
                return response.status(400).send();
            }
            // Check if generateDescription attribute is available
            const genDescriptionAttr = attributes.find(attr => attr.name === 'generateDescription');
            if (!genDescriptionAttr) {
                logger.error('🚫The attribute "generateDescription" is missing.', { productId, imageUrl });
                return response.status(400).send();
            }
            // Check if generateDescription attribute is enabled
            const isGenerateDescriptionEnabled = Boolean(genDescriptionAttr?.value);
            if (!isGenerateDescriptionEnabled) {
                logger.info('🚫The option for automatic description generation is not enabled.', { productId, imageUrl });
                return response.status(200).send();
            }

            // Fetch product type key
            const productTypeKey = await fetchProductType(productType);
            if (!productTypeKey) {
                logger.error('🚫Failed to fetch product type key.');
                return response.status(500).send();
            }

            // Send ACK to Pub/Sub
            logger.info('⌛Sending ACK to Pub/Sub.');
            response.status(200).send();
            logger.info('✅Successfully sent ACK to Pub/Sub.');

            // Process image data
            const imageData = await productAnalysis(imageUrl);

            // Generate product description
            logger.info('⌛Sending image data to Generative AI for generating descriptions.');
            const generatedDescription = await generateProductDescription(imageData, productName, productTypeKey);
            // Translate generated description
            logger.info('⌛Sending generatedDescription to Generative AI for translation.');
            const translations = await translateProductDescription(generatedDescription);
            // Create custom object for product description
            logger.info('⌛Creating custom object for product description.');
            await createProductCustomObject(productId, imageUrl, productName, productTypeKey);
            // Update custom object with generated description
            logger.info('⌛Updating custom object with generated description.');
            const translationsTyped: { "en-US": string; "en-GB": string; "de-DE": string } = translations as {
                "en-US": string;
                "en-GB": string;
                "de-DE": string;
            };
            await updateCustomObjectWithDescription(productId, productName, imageUrl, translationsTyped, productTypeKey);

            logger.info('⌛Waiting for next event message.');

            return response.status(200).send();
        }

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
