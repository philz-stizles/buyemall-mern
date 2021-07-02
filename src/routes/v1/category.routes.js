const { Router } = require('express');
const {
  createCategory,
  getCategory,
  getCategoryAndProducts,
  updateCategory,
  removeCategory,
  list,
  listMyCategories,
  getCategoryAndSubs,
} = require('../../controllers/category.controllers');
const { authenticate } = require('../../middlewares/auth.middlewares');

const router = Router();

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
  .route('/')
  .post(authenticate, createCategory)
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

router.route('/me').get(authenticate, listMyCategories);

router
  .route('/:slug')
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
  .get(getCategory)
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
  .put(authenticate, updateCategory)
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
  .delete(authenticate, removeCategory);

router.get('/:slug/products', getCategoryAndProducts);

router.get('/:slug/subCategories', getCategoryAndSubs);

module.exports = router;
