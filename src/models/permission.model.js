const { Schema, model } = require('mongoose');

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A permission must have a name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'A description is required'],
      trim: true,
    },
    isActive: { type: Boolean, default: true, select: false },
  },
  { timestamps: true }
);

module.exports = model('Permission', permissionSchema);
