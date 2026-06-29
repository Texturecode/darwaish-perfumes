import mongoose, { Schema, Model, Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
    slug: string;
    image?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        image: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// Auto-generate slug from name if not explicitly provided
// CategorySchema.pre("validate", function (this: ICategory) {
//     console.log("NA<E", this.name)
//     if (!this.slug && this.name) {
//         this.slug = this.name
//             .toLowerCase()
//             .trim()
//             .replace(/[^a-z0-9]+/g, "-")
//             .replace(/(^-|-$)/g, "");
//     }
// });

// Virtual: product count is computed via a separate query in practice
// (see lib/queries — kept out of the schema to avoid a circular import
// with the Product model).

const Category: Model<ICategory> =
    mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;