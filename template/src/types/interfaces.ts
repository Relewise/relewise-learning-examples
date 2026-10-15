export interface CategoryName {
    displayName: string;
    language: string;
}

export interface Category {
    id: string;
    name: CategoryName[];
    subCategory?: { id: string; name: CategoryName[] };
}

export interface Price {
    amount: number;
    currency: string;
}

export interface ProductData {
    unique_id: string;
    brand: { id: string; displayName: string };
    name: { language: string; name: string }[];
    description: { language: string; text: string }[];
    list_price: Price[];
    sales_price: Price[];
    availability: { language: string; number: number }[];
    mainCategory: Category;
    image: string;
}
