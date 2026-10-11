export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "cod" | "refunded";

export interface OrderAddress {
  firstName: string;
  lastName?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
  personalisation?: { label: string; value: string }[];
}

export interface OrderSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  description?: string;
  completed: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  customerEmail: string;
  shippingAddress: OrderAddress;
  items: OrderItem[];
  summary: OrderSummary;
  estimatedDeliveryDate?: string;
  trackingNumber?: string;
  courier?: string;
  timeline?: OrderTimelineEvent[];
}

// Mock database
const mockOrders: Record<string, Order> = {
  "ORD-12345": {
    id: "ORD-12345",
    createdAt: new Date().toISOString(),
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "UPI",
    transactionId: "pay_xyz123456789",
    customerEmail: "ananya.sharma@example.com",
    shippingAddress: {
      firstName: "Ananya",
      lastName: "Sharma",
      address: "12 Example Street",
      city: "Bhubaneswar",
      state: "Odisha",
      pincode: "751001",
      phone: "9876543210"
    },
    items: [
      {
        id: "item-1",
        productId: "p-1",
        title: "Personalised Minimalist Photo Frame",
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop",
        quantity: 1,
        price: 1499,
        personalisation: [
          { label: "Name", value: "Aarav" },
          { label: "Message", value: "Happy Birthday!" }
        ]
      }
    ],
    summary: {
      subtotal: 1499,
      discount: 0,
      shipping: 99,
      tax: 0,
      total: 1598
    },
    estimatedDeliveryDate: "14 Oct 2026",
    trackingNumber: "TRK987654321",
    courier: "BlueDart Express",
    timeline: [
      {
        status: "pending",
        label: "Order placed",
        timestamp: "8 Oct 2026, 10:42 AM",
        completed: true
      },
      {
        status: "confirmed",
        label: "Order confirmed",
        timestamp: "8 Oct 2026, 10:45 AM",
        description: "Payment successful. We've started processing your order.",
        completed: true
      },
      {
        status: "processing",
        label: "Preparing your gift",
        timestamp: "9 Oct 2026, 09:15 AM",
        description: "Our artisans are personalising your items.",
        completed: true
      },
      {
        status: "shipped",
        label: "Shipped",
        timestamp: "10 Oct 2026, 04:30 PM",
        description: "Your order has been picked up by our courier partner.",
        completed: true
      },
      {
        status: "out_for_delivery",
        label: "Out for delivery",
        timestamp: "14 Oct 2026, 08:00 AM",
        description: "Your package is out for delivery today.",
        completed: false
      },
      {
        status: "delivered",
        label: "Delivered",
        timestamp: "",
        completed: false
      }
    ]
  },
  "ORD-PENDING": {
    id: "ORD-PENDING",
    createdAt: new Date().toISOString(),
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "UPI",
    customerEmail: "guest@example.com",
    shippingAddress: {
      firstName: "Guest",
      address: "45 Unknown Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "9999999999"
    },
    items: [
      {
        id: "item-2",
        productId: "p-2",
        title: "Artisan Chocolate Box",
        image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop",
        quantity: 2,
        price: 899
      }
    ],
    summary: {
      subtotal: 1798,
      discount: 0,
      shipping: 99,
      tax: 0,
      total: 1897
    }
  }
};

export async function fetchOrderDetails(orderId: string): Promise<Order | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOrders[orderId] || null);
    }, 1200); // simulate network latency
  });
}

export async function fetchTrackingDetails(orderId: string, emailOrPhone: string): Promise<Order | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = mockOrders[orderId];
      if (order && (order.customerEmail === emailOrPhone || order.shippingAddress.phone === emailOrPhone)) {
        resolve(order);
      } else {
        resolve(null);
      }
    }, 1000);
  });
}
