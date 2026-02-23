export interface CartItem {
    id: string;
    title: string;
    author: string;
    price: number;
    format: string;
    coverUrl: string;
    quantity: number;
}

export interface Product {
    id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    format: string;
    category: string;
    coverUrl: string;
    filePath: string;
    sampleUrl: string;
    featured: boolean;
    active: boolean;
    createdAt: string;
}

export interface Order {
    id: string;
    total: number;
    status: string;
    couponCode?: string;
    discountAmount: number;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    createdAt: string;
    items: OrderItemWithProduct[];
    downloadTokens: DownloadTokenInfo[];
}

export interface OrderItemWithProduct {
    id: string;
    price: number;
    product: {
        id: string;
        title: string;
        author: string;
        coverUrl: string;
        format: string;
    };
}

export interface DownloadTokenInfo {
    id: string;
    token: string;
    productId: string;
    expiresAt: string;
    maxDownloads: number;
    downloadCount: number;
}

export interface CouponValidation {
    valid: boolean;
    discountPercent?: number;
    message: string;
}
