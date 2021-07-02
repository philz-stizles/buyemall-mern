module.exports = {
  components: {
    schemas: {
      Response: {
        type: 'object', // data type
        properties: {
          status: {
            type: 'boolean', // data-type
            description:
              'The status of the request, true - successful, false - failed', // desc
            example: true, // example of an id
          },
          data: {
            type: 'object', // data-type
            description: 'Additional data returned from the api', // desc
          },
          message: {
            type: 'string', // data type
            description: 'A message describing the outcome of the request', // desc
            example: 'Created successfully', // example of a completed value
          },
        },
      },
      SubCategoryInput: {
        type: 'object', // data type
        properties: {
          name: {
            type: 'string', // data-type
            description: 'The name of the sub-category', // desc
            example: 'Sneakers', // example of an id
          },
          description: {
            type: 'string', // data-type
            description: 'A description of the sub-category', // desc
            example: 'Mens sneakers', // example of a title
          },
          parent: {
            type: 'string', // data type
            description: 'The Category that this new category belongs to', // desc
            example: 'Shoes', // example of a completed value
          },
        },
      },
    },
  },
};
