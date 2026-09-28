import { useEffect } from "react";
import { useForm } from "react-hook-form";

import useApi from "../utils/axiosInstance.utils";
import { useNavigate, useParams } from "react-router";

const EditProduct = () => {
    const { id } = useParams();
    const api = useApi();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await api.get(`/api/products/${id}`);

                const product = res.data.product;

                reset({
                    name: product.name,
                    description: product.description,
                    stock: product.stock,
                    price: product.price,
                    category: product.category,
                });
            } catch (error) {
                console.log(error);
            }
        };

        getProduct();
    }, [id]);

    const onSubmit = async (data) => {
        try {

            await api.put(`/api/products/update/${id}`, data);

            navigate("/home");
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message ||
                "Failed to delete product"
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg px-8 py-5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Product Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter product name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            {...register("name", {
                                required: "Product name is required",
                            })}
                        />

                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Description
                        </label>

                        <textarea
                            rows="4"
                            name="description"
                            placeholder="Enter product description"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black resize-none"
                            {...register("description", {
                                required: "Description is required",
                            })}
                        />

                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Price + Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Price
                            </label>

                            <input
                                type="number"
                                name="price"
                                min="0"
                                placeholder="Enter price"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                                {...register("price", {
                                    required: "Price is required",
                                    min: {
                                        value: 0,
                                        message: "Price cannot be negative",
                                    },
                                })}
                            />

                            {errors.price && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.price.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Stock
                            </label>

                            <input
                                type="number"
                                min="0"
                                name="stock"
                                placeholder="Enter stock quantity"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                                {...register("stock", {
                                    required: "Stock is required",
                                    min: {
                                        value: 0,
                                        message: "Stock cannot be negative",
                                    },
                                })}
                            />

                            {errors.stock && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.stock.message}
                                </p>
                            )}
                        </div>

                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Category
                        </label>

                        <select
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-black"
                            name="category"
                            {...register("category", {
                                required: "Category is required",
                            })}
                        >
                            <option value="">Select category</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="shoes">Shoes</option>
                            <option value="accessories">Accessories</option>
                            <option value="home">Home</option>
                            <option value="beauty">Beauty</option>
                            <option value="other">Other</option>
                        </select>

                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.category.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-black text-white rounded-lg py-3 font-medium hover:bg-gray-800 transition"
                    >
                        Update Product
                    </button>

                </form>
            </div>
        </div>
    );
};

export default EditProduct;