import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema (
    {
        idCategory: String,
        nameCategory: String
    },
    {
        timestamps: true,
    }
);

const Category =mongoose.models.Category || mongoose.model("Category", CategorySchema);
export default Category;
