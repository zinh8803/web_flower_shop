import React, { useState } from "react";
const ProductForm = () => {
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [inventory, setInventory] = useState("");
    const [description, setDescription] = useState("");
    const [originId, setOriginId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [imageFile, setImageFile] = useState(null);


    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("ProductName", productName);
        formData.append("Price", price);
        formData.append("Inventory", inventory);
        formData.append("Description", description);
        formData.append("OriginId", originId);
        formData.append("CategoryId", categoryId);
        formData.append("ImageFile", imageFile);


        console.log("Form data:", formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="productName">Product Name:</label>
                <input
                    type="text"
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="price">Price:</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="inventory">Inventory:</label>
                <input
                    type="number"
                    id="inventory"
                    value={inventory}
                    onChange={(e) => setInventory(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="originId">Origin ID:</label>
                <input
                    type="number"
                    id="originId"
                    value={originId}
                    onChange={(e) => setOriginId(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="categoryId">Category ID:</label>
                <input
                    type="number"
                    id="categoryId"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="imageFile">Image File:</label>
                <input
                    type="file"
                    id="imageFile"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default ProductForm;
