const { Schema, Types, model } = require('mongoose');

// Put as much business logic in the models to keep the controllers as simple and lean as possible
// 2. Create a Schema corresponding to the document interface.
const businessSchema = new Schema()(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      unique: true,
    },
    logo: {
      url: String,
      uploadId: String,
    },
    locations: [String],
    images: [
      {
        url: String,
        uploadId: String,
      },
    ],
    users: [{ type: Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// 3. Create a Model.
module.exports = model('Business', businessSchema);
