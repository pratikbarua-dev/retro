import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const packages = db.getPackages();
  const customPricing = db.getCustomPricingRules();
  return NextResponse.json({ success: true, packages, customPricing });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, packageId, updates, members, duration, price } = body;

    if (type === 'package' && packageId) {
      const updated = db.updatePackage(packageId, updates);
      return NextResponse.json({ success: true, package: updated });
    }

    if (type === 'custom' && members && duration && price !== undefined) {
      const updated = db.updateCustomPricingRule(members, duration, price);
      return NextResponse.json({ success: true, rule: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid pricing update parameters' }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}
