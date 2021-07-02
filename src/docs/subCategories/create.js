module.exports = {
  post: {
    tags: ['Sub Categories'],
    summary: 'Summary',
    description: 'Create a new sub-category',
    // operationId: '',
    parameters: [],
    requestBody: {
      // expected request body
      required: true,
      content: {
        // content-type
        'application/json': {
          schema: {
            $ref: '#/components/schemas/SubCategoryInput', // todo input data model
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Sub-category was created',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Response',
            },
          },
        },
      },
      401: { description: 'Unauthorized access' },
      404: { description: 'Dependency was not found' },
      500: { description: 'Server error' },
    },
  },
};
