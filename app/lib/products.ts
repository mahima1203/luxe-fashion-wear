
export interface Product {
    id: number;
    brand: string;
    name: string;
    price: number;
    originalPrice: number;
    discount: number;
    image: string;
    badge?: 'New' | 'Bestseller' | 'Trending' | null;
    category: 'men' | 'women';
    subcategory: string;
}

const brands = ['ZARA', 'H&M', 'GUCCI', 'NIKE', 'MANGO', 'RALPH LAUREN', 'PRADA', 'ADIDAS', 'LEVI\'S', 'PUMA'];
const subcategoriesMen = ['Shirts', 'T-shirts', 'Jeans', 'Trousers', 'Jackets'];
const subcategoriesWomen = ['Dresses', 'Tops', 'Tunics', 'Skirts', 'Jeans', 'Jackets'];

const menImageIds = [
    '1594938298603-c8148c4dae35', '1618354691373-d851c5c3a990', '1507003211169-0a1dd7228f2d', '1490114538077-0a7f8cb49891',
    '1561052969311-66c3f3bc64e2', '1539241082711-782b1c22295a', '1552374196-a62a59e7371d', '1489980504021-1d7273dabd5e',
    '1520975661598-648ffecfdbfa', '1599033378103-75c120c03262', '1512432123282-f0896930501d', '1488161628893-a07e9d4a8ad9',
    '1495856458515-063604f3fc23', '1516826435553-ddd39460e642', '1521440639186-0972b23ed721', '1534030339806-5a278c0db3ea',
    '1534126416832-a88f7135eeef', '1543881711-ee7c4305c754', '1554560754-057dfb308be9', '1555529733-a2467160c197',
    '1560243536-a53b59939a9c', '1562144854-ee1fd0520691', '1572833190112-99859f77f0a8', '1574440639-6617f6940854',
    '1584949091858-56ef230a5914', '1588731234179-dbfdd4c274bf', '1590330497605-929f8e8413c4', '1595341888006-a3ec39537073',
    '1602810319428-2d9b97202714', '1617137968425-2b369c7123bc'
];

const womenImageIds = [
    '1595777457583-95e059d581b8', '1548036328-c9fa89d128fa', '1594633312681-425c7b97ccd1', '1487412720507-e7ab37603c6f',
    '1515886657613-9f3515b0c78f', '1469334031218-e382a71b716b', '1490481651871-ab68de25d43d', '1509631179647-0177331693ae',
    '1539106775077-e2ef6db52857', '1581067720541-0967a046274d', '1609357672183-6e07052467a5', '1438761681033-6461ffad8d80',
    '1534528741775-53994a69daeb', '1506794778242-afe5b8451483', '1507003211169-0a1dd7228f2d', '1500648767791-00dcc994a43e',
    '1544005313-94ddf0286df2', '1494790108377-be9c29b29330', '1531746020798-e6953c6e8e04', '1554151228-14d9def656e4',
    '1504703395950-b89145a5445f', '1520155707334-fe52358f237c', '1517411032315-54ef2cb783bb', '1491333078422-dd3a1a601b6c',
    '1517841905240-472988babdf9', '1524504388925-47455079a4de', '1501196351445-30f24ada02c4', '1514315384763-ba401779410f',
    '1526510747471-5700c02c4ac0', '1512432123282-f0896930501d', '1531123897727-8f129e1688ce', '1488423191216-7a4773b15025',
    '1531746790731-f8a01cef3304', '1509003315247-49774c47ae3a', '1529139513092-e84000facd7b', '1552374196-a62a59e7371d',
    '1572833190112-99859f77f0a8', '1597586123412-f74f74d0e7bf', '1604073482922-23c7104b9015', '1611048238315-846a2a536098'
];

const generateProducts = (category: 'men' | 'women', count: number): Product[] => {
    const products: Product[] = [];
    const subcategories = category === 'men' ? subcategoriesMen : subcategoriesWomen;
    const imageIds = category === 'men' ? menImageIds : womenImageIds;

    for (let i = 1; i <= count; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const subcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
        const price = Math.floor(Math.random() * (15000 - 1500 + 1)) + 1500;
        const discount = Math.floor(Math.random() * 50) + 10;
        const originalPrice = Math.floor(price / (1 - discount / 100));

        // Use unique image ID from provided list
        const imageId = imageIds[(i - 1) % imageIds.length];
        const image = `https://images.unsplash.com/photo-${imageId}?w=500&q=80`;

        const badges: Product['badge'][] = ['New', 'Bestseller', 'Trending', null, null, null];
        const badge = badges[Math.floor(Math.random() * badges.length)];

        products.push({
            id: category === 'men' ? 1000 + i : 2000 + i,
            brand,
            name: `${brand} ${subcategory} ${i}`,
            price,
            originalPrice,
            discount,
            image,
            badge,
            category,
            subcategory,
        });
    }
    return products;
};

export const allProducts: Product[] = [
    ...generateProducts('men', 30),
    ...generateProducts('women', 40),
];

export async function fetchProducts(category: string, page: number = 1, limit: number = 20) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const filtered = allProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
        products: filtered.slice(start, end),
        hasMore: end < filtered.length,
        total: filtered.length,
    };
}
