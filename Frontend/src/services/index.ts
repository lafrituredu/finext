
export function getName(){
    return 'Jeremy';
}

export async function getProducts(id:number = 0) {
    const url = id  ? `https://dummyjson.com/products/${id}` : 'https://dummyjson.com/products';

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error en la API');
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}