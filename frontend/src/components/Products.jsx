import { useContext, useEffect, useState } from "react";
import useApi from "../utils/axiosInstance.utils";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";


const Products = () => {
    const api = useApi();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const {user} = useContext(AuthContext)

    const navigate = useNavigate();

    const getProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await api.get("/api/products");

            setProducts(res.data.products);
        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message || "Failed to fetch products"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    // Delete product
    const deleteProduct = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/api/products/delete/${id}`);

            // Remove deleted product from UI
            setProducts((prevProducts) =>
                prevProducts.filter((product) => product._id !== id)
            );
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete product"
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>

                    <button
                        onClick={getProducts}
                        className="bg-black text-white px-5 py-2 rounded-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-10">

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Products
                        </h1>

                        <p className="text-gray-500 mt-1">
                            {products.length} products available
                        </p>
                    </div>

                    {/* Create Product */}
                    <button
                        onClick={() => navigate("/home/createProduct")}
                        className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition"
                    >
                        + Add Product
                    </button>

                </div>

                {/* Empty state */}
                {products.length === 0 ? (

                    <div className="bg-white rounded-2xl p-12 text-center">

                        <h2 className="text-xl font-semibold">
                            No products found
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Create your first product to see it here.
                        </p>

                        <button
                            onClick={() => navigate("/home/createProduct")}
                            className="mt-5 bg-black text-white px-5 py-2 rounded-lg"
                        >
                            Create Product
                        </button>

                    </div>

                ) : (

                    /* Products */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {products.map((product) => (

                            <div
                                key={product._id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
                            >

                                {/* Image */}
                                <div className="h-56 bg-gray-100 overflow-hidden">

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                    />

                                </div>

                                {/* Content */}
                                <div className="p-5">

                                    <div className="flex items-start justify-between gap-3">

                                        <h2 className="font-semibold text-lg text-gray-900 line-clamp-1">
                                            {product.name}
                                        </h2>

                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full capitalize whitespace-nowrap">
                                            {product.category}
                                        </span>

                                    </div>

                                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-5">

                                        <div>
                                            <p className="text-xl font-bold text-gray-900">
                                                ₹{Number(product.price).toLocaleString("en-IN")}
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                Stock: {product.stock}
                                            </p>
                                        </div>

                                        {/* View */}
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/home/productDetails/${product._id}`
                                                )
                                            }
                                            className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                                        >
                                            View
                                        </button>

                                    </div>

                                    {/* Edit & Delete */}
                                    {!user ? "" : (
                                        <div className="flex gap-3 mt-4">

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/home/editProduct/${product._id}`
                                                    )
                                                }
                                                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteProduct(product._id)
                                                }
                                                className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};

export default Products;