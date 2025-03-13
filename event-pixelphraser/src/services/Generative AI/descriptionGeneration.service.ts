// import { ImageData } from '../../interfaces/imageData.interface';
// import { logger } from '../../utils/logger.utils';
// import { model } from '../../config/ai.config';

// export async function generateProductDescription(imageData: ImageData, productTypeKey: string): Promise<string> {
//     try {
//         const prompt = `You are an expert e-commerce copywriter. Write a compelling, SEO-optimized product description for a ${productTypeKey} based on the following image analysis:

//         **Image Analysis Data**:
//         - Labels: ${imageData.labels}
//         - Objects detected: ${imageData.objects}
//         - Dominant colors: ${imageData.colors.join(', ')}
//         - Text detected: ${imageData.detectedText}
//         - Web entities: ${imageData.webEntities}

//         **Description Guidelines**:
//         1. Clearly define the product type and its key attributes.
//         2. Highlight essential features such as material, functionality, design, and unique selling points.
//         3. Describe its intended use, target audience, and benefits.
//         4. If applicable, mention color variations, sizes, or specifications.
//         5. Suggest potential use cases or ideal settings for the product.
//         6. Incorporate natural SEO-friendly language without keyword stuffing.
//         7. Ensure readability with concise yet engaging language.
//         8. Include a persuasive call to action (e.g., "Order now to experience quality and style").

//         **Key Features Section**:
//         - Summarize the most important attributes concisely.
//         - Use keyword-rich yet natural descriptions.

//         Ensure the text flows naturally, maintains professional tone, and is optimized for both customers and search engines.`;

//         const result = await model.generateContent(prompt);
//         if (!result?.response) throw new Error('❌ Generative AI response is null or undefined.');

//         const generatedDescription = result.response.text();
//         logger.info('✅ Generative AI description generated successfully.');
//         return generatedDescription;
//     } catch (error: any) {
//         logger.error('❌ Error during description generation:', { message: error.message, stack: error.stack });
//         throw error;
//     }
// }


import { ImageData } from '../../interfaces/imageData.interface';
import { logger } from '../../utils/logger.utils';
import { model } from '../../config/ai.config';

export async function generateProductDescription(imageData: ImageData, productTypeKey: string): Promise<string> {
    try {
        let prompt = '';

        switch (productTypeKey) {

            case 'clothing':
                prompt = `You are a professional e-commerce product copywriter. Write a compelling, SEO-optimized product description for an apparel item based on the following image analysis:
                
                Image Analysis Data:
                - Labels: ${imageData.labels}
                - Objects detected: ${imageData.objects}
                - Dominant colors: ${imageData.colors.join(', ')}
                - Text detected: ${imageData.detectedText}
                - Web entities: ${imageData.webEntities}
                
                Description Guidelines:
                1. Specify the target category (e.g., men's, women's, kids').
                2. Highlight key features such as style, fit, and comfort.
                3. Describe the fabric’s feel confidently.
                4. Suggest occasions for wearing the item.
                5. Mention styling options and care instructions.
                6. Include sizing or fit information.
                7. Ensure the description is SEO-optimized with natural keyword usage.
                8. Avoid keyword stuffing.
                
                Key Features Section:
                - Summarize fabric, fit, and versatility.
                - Use engaging, keyword-rich language.`;
                break;

            case 'furniture-and-decor':
                prompt = `You are an expert furniture and home decor copywriter. Write a captivating, SEO-optimized product description for a furniture or decor item based on the following image analysis:
                
                Image Analysis Data:
                - Labels: ${imageData.labels}
                - Objects detected: ${imageData.objects}
                - Dominant colors: ${imageData.colors.join(', ')}
                - Text detected: ${imageData.detectedText}
                - Web entities: ${imageData.webEntities}
                
                Description Guidelines:
                1. Clearly define the product type (e.g., sofa, lamp, wall art).
                2. Highlight materials, craftsmanship, and durability.
                3. Describe design elements and how they enhance home aesthetics.
                4. Suggest placement ideas for different room settings.
                5. Mention comfort, practicality, and maintenance tips.
                6. Optimize for SEO with relevant keywords and natural readability.
                7. Avoid keyword stuffing.
                
                Key Features Section:
                - Summarize materials, design, and functionality.
                - Use keyword-rich yet engaging descriptions.`;
                break;

            case 'books':
                prompt = `You are a professional book description writer. Write an engaging, SEO-optimized book description based on the following image analysis:
                
                Image Analysis Data:
                - Labels: ${imageData.labels}
                - Objects detected: ${imageData.objects}
                - Dominant colors: ${imageData.colors.join(', ')}
                - Text detected: ${imageData.detectedText}
                - Web entities: ${imageData.webEntities}
                
                Description Guidelines:
                1. Clearly state the book’s title, genre, and author (if detected).
                2. Provide a brief, compelling synopsis without spoilers.
                3. Highlight the book’s unique appeal (e.g., themes, writing style).
                4. Mention target audience (e.g., fiction lovers, self-help readers).
                5. Suggest ideal reading situations (e.g., casual reading, study material).
                6. Include SEO-friendly language while maintaining natural readability.
                7. Avoid keyword stuffing.
                
                Key Features Section:
                - Summarize genre, themes, and appeal.
                - Use engaging, keyword-rich language.`;
                break;

            default:
                throw new Error('Unsupported product type. Please provide a valid product category.');
        }

        const result = await model.generateContent(prompt);
        if (!result?.response) throw new Error('❌ Generative AI response is null or undefined.');

        const generatedDescription = result.response.text();
        logger.info('✅ Generative AI description generated successfully.');
        return generatedDescription;
    } catch (error: any) {
        logger.error('❌ Error during description generation:', { message: error.message, stack: error.stack });
        throw error;
    }
}
