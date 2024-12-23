// src/app/api/data/route.js
import { NextResponse } from 'next/server';
import { mockCategories } from '../../lib/mockData/mockCategories';

export async function GET() {
  return NextResponse.json(mockCategories);
}
