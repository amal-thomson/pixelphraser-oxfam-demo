import { createApiRoot } from '../../client/create.client';
import { logger } from '../../utils/logger.utils';

export async function createProductCustomObject(productId: string, imageUrl: string, productName: string, productType: string) {
    try {
        const apiRoot = createApiRoot();

        logger.info(`✅ Creating custom object for product ID: ${productId}`);
        
        const customObject = await apiRoot.customObjects().post({
            body: {
                container: "temporaryDescription",
                key: productId,
                value: {
                    temporaryDescription_en: null,
                    temporaryDescription_en_US: null,
                    temporaryDescription_en_GB: null,
                    temporaryDescription_de_DE: null,
                    imageUrl: imageUrl,
                    productType,
                    productName: productName
                }
            }
        }).execute();

        logger.info(`✅ Custom object created successfully for product ID: ${productId}.`);
        return customObject;

    } catch (error: any) {
        logger.error(`❌ Failed to create custom object for product ID: ${productId}`, { message: error.message });
        throw error;
    }
}
