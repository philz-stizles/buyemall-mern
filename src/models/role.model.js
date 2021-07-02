const { Schema, Types, model } = require('mongoose');

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A role must have a name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'A user must have an email'],
      trim: true,
      lowercase: true,
    },
    permissions: [{ type: Types.ObjectId, ref: 'Permission' }],
  },
  { timestamps: true }
);

module.exports = model('Role', roleSchema);
