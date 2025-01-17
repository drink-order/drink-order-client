import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "../../../libs/mongodb";
import Category from "../../../models/category";

export async function PUT(request, { params }){
    const { id } = params;
    const {newID: idCategory, newName: nameCategory} = await request.json();
    await connectMongoDB();
    await Category.findByIdAndUpdate(id, {idCategory, nameCategory});
    return NextResponse.json({message: "Category Updated"}, { status: 200 });
}

export async function GET(request, {params}) {
    const { id } = params;
    await connectMongoDB();
    const category = await Category.findOne({_id: id});
    return NextResponse.json({ category }, { status: 200 });
}