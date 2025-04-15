# Google Reviews Integration

## Current Configuration

The Google Places API integration is configured to:

1. **Server-Side Hourly Updates**: Reviews are automatically refreshed once per hour on the server side
2. **Always Fetch Newest Reviews**: The system always retrieves and displays the most recent reviews
3. **Filter Inappropriate Content**: Reviews containing inappropriate language are automatically filtered out
4. **Prioritize Positive Reviews**: The system prioritizes 4-5 star reviews

## How It Works

1. The API route (`/api/google-reviews`) has a server-side revalidation period of 1 hour
2. When the revalidation period expires, Next.js automatically fetches fresh data from Google
3. The API always requests the newest reviews from Google and sorts them by recency
4. Users see updated reviews when they load or refresh the page

## Environment Variables

The following environment variables are used:

- `GOOGLE_MAPS_API_KEY`: Your Google Maps API key with Places API enabled
- `GOOGLE_MAPS_PLACE_ID`: The Place ID for your business on Google Maps

## Content Filtering

The system automatically filters out reviews containing inappropriate language. The filter checks for common inappropriate words and ensures they don't appear in the displayed reviews.

If no appropriate reviews are found after filtering, the system will fall back to pre-defined positive reviews.

## Troubleshooting

If you're experiencing issues with the Google Reviews integration:

1. **Verify Environment Variables**:
   - Check that both environment variables are set correctly in your Vercel project
   - Make sure there are no extra spaces or characters in the values

2. **Check API Key Permissions**:
   - Make sure your Google Maps API key has the Places API enabled
   - Verify there are no restrictions preventing server-side usage

3. **Test the API Directly**:
   - You can test the Google Places API directly using a tool like Postman
   - Use this URL (replace with your values):
   \`\`\`
   https://maps.googleapis.com/maps/api/place/details/json?place_id=YOUR_PLACE_ID&fields=name,rating,user_ratings_total,reviews&key=YOUR_API_KEY
   \`\`\`

4. **Check Server Logs**:
   - Review the Vercel logs to see any errors or warnings
   - Look for messages about the API response status and structure

5. **Force a Refresh**:
   - If you need to see the latest reviews immediately, you can deploy a new version of your site
   - This will clear the server-side cache and fetch fresh data

## Updating the Place ID

If you need to update your Place ID in the future:

1. **Find Your Place ID**:
   - Go to [Google's Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)
   - Enter your business name and address
   - Click on your business on the map
   - Copy the Place ID that appears in the info window

2. **Update the Environment Variable**:
   - In your Vercel project settings, update the `GOOGLE_MAPS_PLACE_ID` environment variable
   - No code changes are needed since we're using the environment variable

## Fallback Data

The system will automatically use fallback data in these cases:
- If the environment variables are missing
- If the API returns an error
- If no reviews are found
- If all reviews contain inappropriate content

You can update the fallback reviews in the `getFallbackReviews()` function in `app/api/google-reviews/route.ts`.
