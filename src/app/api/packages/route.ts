import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const packages = db.getPackages();
  const customPricingRules = db.getCustomPricingRules();
  return NextResponse.json({ success: true, packages, customPricingRules });
}
