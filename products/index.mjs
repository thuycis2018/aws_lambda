import pkg from 'pg';
import { resList } from './util.mjs';
import { validateIdField, validateTextFields, validateBooleanFields, validateNumberFields } from './validation.mjs';
const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
    ssl: { rejectUnauthorized: false },
});

export const handler = async (event) => {
    try {
        const httpMethod = event.requestContext?.http?.method || 'GET';
        const path = event.rawPath;
        const pathParameters = event.pathParameters;
        const body = event.body ? JSON.parse(event.body) : null;

        switch (httpMethod) {
            case 'GET':
                if (pathParameters && pathParameters.id) {
                    // GET /api/products/{id}
                    const id = pathParameters.id;
                    if (!validateIdField(id)) {
                        return invalidIdRes;
                    }
                    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
                    if (result.rows.length === 0) {
                        return recordNotFoundRes;
                    }
                    return {
                        statusCode: 200,
                        body: JSON.stringify(result.rows[0]),
                    };
                } else {
                    // GET /api/products
                    const result = await pool.query('SELECT * FROM products');
                    return {
                        statusCode: 200,
                        body: JSON.stringify(result.rows),
                    };
                }

            case 'POST':
                // POST /api/products
                const { name, price, description, slug, featured } = body;
                const errors = {};
                const textFields = { name, slug, description };
                const textErrors = validateTextFields(textFields);

                const booleanFields = { featured };
                const booleanErrors = validateBooleanFields(booleanFields);

                const numberFields = { price };
                const numberErrors = validateNumberFields(numberFields);

                // Combine all errors
                Object.assign(errors, textErrors);
                Object.assign(errors, numberErrors);
                Object.assign(errors, booleanErrors);

                if (Object.keys(errors).length > 0) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: errors }),
                    };
                }

                const insertResult = await pool.query(
                    'INSERT INTO products (name, price, description, slug, featured) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                    [name, price, description, slug, featured]
                );
                return {
                    statusCode: 201,
                    body: JSON.stringify(insertResult.rows[0]),
                };

            case 'PUT':
                if (pathParameters && pathParameters.id) {
                    // PUT /api/products/{id}
                    const id = pathParameters.id;
                    if (!validateIdField(id)) {
                        return invalidIdRes;
                    }
                    const { name, price, slug, featured, description } = body || {};
                    try {
                        const currentProductResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
                        if (currentProductResult.rows.length === 0) {
                            return recordNotFoundRes;
                        }

                        const currentProduct = currentProductResult.rows[0];
                        const updatedName = name || currentProduct.name;
                        const updatedPrice = price !== undefined ? price : currentProduct.price;
                        const updatedSlug = slug || currentProduct.slug;
                        const updatedFeatured = featured !== undefined ? featured : currentProduct.featured;
                        const updatedDescription = description || currentProduct.description;

                        const updateResult = await pool.query(
                            'UPDATE products SET name=$1, price = $2, slug = $3, featured = $4, description = $5 WHERE id = $6 RETURNING *',
                            [updatedName, updatedPrice, updatedSlug, updatedFeatured, updatedDescription, id]
                        );

                        return {
                            statusCode: 201,
                            body: JSON.stringify(updateResult.rows[0]),
                        };

                    } catch (error) {
                        console.error('Error:', error);
                        return internalErrorRes;

                    }

                } else {
                    return invalidIdRes;
                }

            case 'DELETE':
                if (pathParameters && pathParameters.id) {
                    // DELETE /api/products/{id}
                    const id = pathParameters.id;
                    if (!validateIdField(id)) {
                        return invalidIdRes;
                    }
                    const deleteResult = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
                    if (deleteResult.rows.length === 0) {
                        return recordNotFoundRes;
                    }
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ message: 'Product deleted successfully' }),
                    };
                } else {
                    return invalidIdRes;
                }

            default:
                return {
                    statusCode: 405,
                    body: JSON.stringify({ error: `Method ${httpMethod} not allowed` }),
                };
        }
    } catch (error) {
        console.error('Error handling request:', error);
        return internalErrorRes;
    }
};
