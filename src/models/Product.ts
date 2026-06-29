import mongoose, { Schema, Model, Document, Types } from "mongoose";

export type ProductStatus = "Active" | "Draft" | "Sold Out";
export type Concentration =
  | "Eau de Toilette"
  | "Eau de Parfum"
  | "Extrait de Parfum"
  | "Attar";

interface IFragranceNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: Types.ObjectId; 
  notes?: string; // short "Inspired by..." line shown in italics on the PDP
  description?: string;
  fragranceNotes?: IFragranceNotes;
  concentration?: Concentration;
  sku?: string;
  images: string[];
  price: number;
  isFeatured: boolean;
  compareAtPrice?: number;
  stock: number;
  status: ProductStatus;
  rating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const FragranceNotesSchema = new Schema<IFragranceNotes>(
  {
    top: { type: [String], default: [] },
    middle: { type: [String], default: [] },
    base: { type: [String], default: [] },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    isFeatured: Boolean,
    fragranceNotes: {
      type: FragranceNotesSchema,
      default: () => ({ top: [], middle: [], base: [] }),
    },
    concentration: {
      type: String,
      enum: ["Eau de Toilette", "Eau de Parfum", "Extrait de Parfum", "Attar"],
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "Product must have at least one image.",
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
      // validate: {
      //   validator: function (this: IProduct, value: number) {
      //     // compareAtPrice only makes sense if it's higher than price
      //     return value == null || value > this.price;
      //   },
      //   message: "Compare-at price must be greater than the price.",
      // },
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Draft", "Sold Out"],
      default: "Draft",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name if not explicitly provided
ProductSchema.pre("validate", function (this: IProduct) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

// Keep status honest: if stock hits zero, don't silently show "Active"
ProductSchema.pre("save", function (this: IProduct) {
  if (this.stock === 0 && this.status === "Active") {
    this.status = "Sold Out";
  }
});

ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ name: "text", notes: "text" });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;