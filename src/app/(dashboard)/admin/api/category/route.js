import connectMongoDB from "../../libs/mongodb";
import { NextResponse } from "next/server";
import Category from "../../models/category";
import { TouchpadIcon } from "lucide-react";

export async function POST(request){
    const {idCategory, nameCategory} =await request.json();
    await connectMongoDB();
    await Category.create({ idCategory, nameCategory });
    return NextResponse.json({ message: "Category Created" }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const categories = await Category.find();
    return NextResponse.json({ categories });
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await Category.findByIdAndDelete(id);
    return NextResponse.json({messae: "Category Deleted"}, { status: 200 });
}
