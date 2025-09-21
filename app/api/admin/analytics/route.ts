import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const propertyId = process.env.GA_PROPERTY_ID!;
const client_email = process.env.GA_CLIENT_EMAIL!;
const private_key = process.env.GA_PRIVATE_KEY!.replace(/\\n/g, '\n');

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: { client_email, private_key },
});

export async function GET() {
  if (!propertyId || !client_email || !private_key) {
    return NextResponse.json({ error: 'Missing Google Analytics credentials' }, { status: 500 });
  }

  try {
    const [countryResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit: 5,
    });

    const geographicalBreakdown = countryResponse.rows?.map(row => ({
      country: row.dimensionValues?.[0].value || 'Unknown',
      total: parseInt(row.metricValues?.[0].value || '0', 10),
      // "Today" data would require a separate API call with a date range of "today"
      today: 0, 
    })) || [];

    // You would add more API calls here for other metrics like top pages, etc.

    return NextResponse.json({ geographicalBreakdown });
  } catch (error) {
    console.error('Error fetching Google Analytics data:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}