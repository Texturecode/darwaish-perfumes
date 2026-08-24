import mongoose, { Schema, Model, Document } from "mongoose";

export interface IHomeSlider extends Document {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HomeSliderSchema = new Schema<IHomeSlider>(
  {
    src: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      default: "Homepage slider image",
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

HomeSliderSchema.index({ isActive: 1, order: 1 });

const HomeSlider: Model<IHomeSlider> =
  mongoose.models.HomeSlider || mongoose.model<IHomeSlider>("HomeSlider", HomeSliderSchema);

export default HomeSlider;
