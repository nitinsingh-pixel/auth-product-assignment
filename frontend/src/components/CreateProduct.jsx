import { useForm } from "react-hook-form";
import useApi from "../utils/axiosInstance.utils";
import { useNavigate } from "react-router";

const CreateProduct = () => {
    const api = useApi();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const navigate = useNavigate();
    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("stock", data.stock);
            formData.append("price", data.price);
            formData.append("category", data.category);
            formData.append("image", data.image[0]);

            const res = await api.post("/api/products/create", formData);

            console.log(res.data);

            reset();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg px-8 py-5">
                <p className="mb-8 cursor-pointer" onClick={() => navigate("/home")}> &#x2190; Back to Home</p>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Create Product
                </h1>

                <p className="text-gray-500 mb-8">
                    Add a new product to your store.
                </p>

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

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Product Image
                        </label>

                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                            {...register("image", {
                                required: "Product image is required",
                            })}
                        />

                        {errors.image && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.image.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-black text-white rounded-lg py-3 font-medium hover:bg-gray-800 transition"
                    >
                        Create Product
                    </button>

                </form>
            </div>
        </div>
    );
};

export default CreateProduct;