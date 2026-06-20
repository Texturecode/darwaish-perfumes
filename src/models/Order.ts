import mongoose, {
  Schema,
  Model,
  Document,
  Types,
  CallbackWithoutResultAndOptionalError,
} from "mongoose";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refunded";

export type PaymentStatus = "Unpaid" | "Paid" | "Refunded";

interface IOrderItem {
  product: Types.ObjectId;
  name: string; // snapshot at time of order — survives later product edits/deletion
  image: string;
  price: number; // unit price at time of order, not a live reference
  quantity: number;
}

interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province?: string;
  postalCode?: string;
  country: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer?: Types.ObjectId; // optional — supports guest checkout
  guestEmail?: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string; // e.g. "COD", "Card", "EasyPaisa"
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    province: { type: String },
    postalCode: { type: String },
    country: { type: String, required: true, default: "Pakistan" },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    guestEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    items: {
      type: [OrderItemSchema],
      validate: {
        validator: (arr: IOrderItem[]) => arr.length > 0,
        message: "Order must contain at least one item.",
      },
    },
    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Refunded"],
      default: "Unpaid",
    },
    paymentMethod: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Require either a logged-in customer or a guest email — not neither
(OrderSchema as any).pre("validate", function (next: CallbackWithoutResultAndOptionalError) {
  if (!this.customer && !this.guestEmail) {
    return next(new Error("Order requires either a customer reference or a guest email."));
  }
  next();
});

// Auto-generate a human-readable order number if not supplied
(OrderSchema as any).pre("validate", function (next: CallbackWithoutResultAndOptionalError) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    this.orderNumber = `DAR-${timestamp}`;
  }
  next();
});

OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ customer: 1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;