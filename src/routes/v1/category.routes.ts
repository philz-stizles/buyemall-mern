import { Router } from 'express';
import {
  create,
  read,
  update,
  remove,
  list,
  getCategorySubs,
} from '@src/controllers/category.controllers';
import { authenticate } from '@src/middlewares/auth.middlewares';

const router = Router();

/**
 *@swagger
 * tags:
 *    name: Categories
 *    description: The Category managing API
 */

/**
 *@swagger
 * components:
 *  schemas:
 *    CategoryInput:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          description: The name of the category
 *        description:
 *          type: string
 *          description: A description of the new category
 *      example:
 *        name: Shoes
 *        description: Affordable shoes
 */
router
  .route('/categories')
  /**
   *@swagger
   * /categories:
   *    post:
   *      summary: Create a new category
   *      tags: [Categories]
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *                $ref: "#/components/schemas/CategoryInput"
   *      responses:
   *        200:
   *          description: Request was successful
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schemas/CategoryInput"
   *        401:
   *          description: Unauthorized access
   *        404:
   *          description: Dependency was not found
   *        500:
   *          description: Server error
   */
  .post(authenticate, create)
  /**
   *@swagger
   * /categories:
   *    get:
   *      summary: Get a list of all categories
   *      tags: [Categories]
   *      responses:
   *        200:
   *          description: Returns a list of available categories
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: "#/components/schemas/Auth"
   *        400:
   *          description: Returns a list of available categories
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: "#/components/schemas/Auth"
   */
  .get(list);

router
  .route('/categories/:slug')
  /**
   *@swagger
   * /categories/{slug}:
   *    get:
   *      summary: Get a category by its slug
   *      tags: [Categories]
   *      parameters:
   *        - in: path
   *          name: slug
   *          schema:
   *            type: string
   *          required: true
   *          description: Category slug
   *      responses:
   *        200:
   *          description: For signing up or registering new users
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schemas/Auth"
   *        404:
   *          description: The specified category was not found
   */
  .get(read)
  /**
   *@swagger
   * /categories:
   *    put:
   *      summary: Update an existing category
   *      tags: [Categories]
   *      parameters:
   *        - in: path
   *          name: slug
   *          schema:
   *            type: string
   *          required: true
   *          description: The target category's slug
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *                $ref: "#/components/schemas/CategoryInput"
   *      responses:
   *        200:
   *          description: Request was successful
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schemas/CategoryInput"
   *        401:
   *          description: Unauthorized access
   *        404:
   *          description: Dependency was not found
   *        500:
   *          description: Server error
   */
  .put(authenticate, update)
  /**
   *@swagger
   * /categories:
   *    delete:
   *      summary: Delete an existing category
   *      tags: [Categories]
   *      parameters:
   *        - in: path
   *          name: slug
   *          schema:
   *            type: string
   *          required: true
   *          description: The target category's slug
   *      responses:
   *        200:
   *          description: Request was successful
   *          content:
   *            application/json:
   *              schema:
   *                $ref: "#/components/schemas/CategoryInput"
   *        401:
   *          description: Unauthorized access
   *        404:
   *          description: Dependency was not found
   *        500:
   *          description: Server error
   */
  .delete(authenticate, remove);

router.get('/categories/:_id/subs', getCategorySubs);

export default router;
