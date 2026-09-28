import { useEffect, useState } from "react";

import useApi from "../utils/axiosInstance.utils";
import { useNavigate, useParams } from "react-router";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const api = useApi();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getProduct = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await api.get(`/api/products/${id}`);

            setProduct(res.data.product);
        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch product details"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading product...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>

                    <button
                        onClick={() => navigate("/products")}
                        className="bg-black text-white px-5 py-2 rounded-lg"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Product not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-10">

            <div className="max-w-6xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate("/home")}
                    className="mb-6 text-gray-600 hover:text-black transition"
                >
                    ← Back to Products
                </button>

                {/* Product Card */}
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

                    <div className="grid grid-cols-1 md:grid-cols-2">

                        {/* Product Image */}
                        <div className="bg-gray-100 min-h-[400px] md:min-h-[600px]">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Product Information */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">

                            {/* Category */}
                            <span className="inline-block w-fit bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full capitalize mb-5">
                                {product.category}
                            </span>

                            {/* Name */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="mt-5">
                                <span className="text-3xl font-bold text-gray-900">
                                    ₹{Number(product.price).toLocaleString("en-IN")}
                                </span>
                            </div>

                            {/* Description */}
                            <div className="mt-8">
                                <h2 className="text-lg font-semibold mb-2">
                                    Description
                                </h2>

                                <p className="text-gray-600 leading-7">
                                    {product.description}
                                </p>
                            </div>

                            {/* Stock */}
                            <div className="mt-8 p-4 rounded-xl bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">
                                        Available Stock
                                    </span>

                                    <span
                                        className={`font-semibold ${product.stock > 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        {product.stock > 0
                                            ? `${product.stock} available`
                                            : "Out of stock"}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetails;