# Excel Template Guide

## How to Create Your Trip Excel File

This guide will help you create an Excel file that can be imported into the Travel Itinerary Generator.

## File Format

- Supported formats: `.xlsx` or `.xls`
- Use any Excel application: Microsoft Excel, Google Sheets (export as .xlsx), LibreOffice Calc, etc.

## Structure

### Header Section (Rows 1-4)

| Row | Column A | Column B | Description |
|-----|----------|----------|-------------|
| 1 | Trip Title | (empty) | The name of your trip |
| 2 | Destination | (empty) | Main destination (e.g., "Paris, France") |
| 3 | Start Date | End Date | Format: YYYY-MM-DD |
| 4 | (blank) | (blank) | Leave this row empty |

### Day Section (Repeating Pattern)

Each day starts with a day header, followed by activities and restaurants.

#### Day Header

| Column A | Column B | Column C |
|----------|----------|----------|
| Day X | Day Title | Estimated Cost |

Example: `Day 1 | Arrival Day | $200`

#### Activities Section

Start with an "Activities" header row:

| Column A |
|----------|
| Activities |

Then list activities with these columns:

| Column A | Column B | Column C | Column D | Column E | Column F | Column G |
|----------|----------|----------|----------|----------|----------|----------|
| Time (HH:MM) | Title | Description | Location | Duration | Cost | Tips |

Example:
```
09:00 | Eiffel Tower Visit | Visit the iconic tower | Eiffel Tower | 2 hours | $30 | Book tickets online
```

#### Restaurants Section

Start with a "Restaurants" header row:

| Column A |
|----------|
| Restaurants |

Then list restaurants with these columns:

| Column A | Column B | Column C | Column D | Column E | Column F |
|----------|----------|----------|----------|----------|----------|
| Name | Cuisine | Price Range | Veg-Friendly | Location | Description |

Example:
```
Le Jules Verne | French | $$$ | Yes | Eiffel Tower | Michelin-starred restaurant
```

**Important Notes:**
- Price Range: Use $, $$, or $$$
- Veg-Friendly: Use "Yes" or "No"
- Time format: Use 24-hour format (09:00, 14:30, etc.)

## Complete Example

Here's how your Excel file should look:

### Sheet 1

```
Row 1:  Amazing Tokyo Adventure
Row 2:  Tokyo, Japan
Row 3:  2024-03-15          2024-03-20
Row 4:

Row 5:  Day 1               Arrival & Shibuya        $150
Row 6:  Activities
Row 7:  09:00               Arrival at Narita        Land and clear customs        Narita Airport        2 hours        Free        Exchange some yen at airport
Row 8:  12:00               Hotel Check-in           Settle into Shibuya hotel     Shibuya District      1 hour         $200       Store luggage if early
Row 9:  15:00               Shibuya Crossing         Famous intersection           Shibuya Crossing      1 hour         Free       Best view from Starbucks
Row 10: 17:00               Meiji Shrine             Peaceful shrine visit         Meiji Shrine          2 hours        Free       Closes at sunset
Row 11: Restaurants
Row 12: Ichiran Ramen       Ramen                    $                             Yes                    Shibuya       Famous tonkotsu ramen chain
Row 13: Gonpachi            Izakaya                  $$                            Yes                    Shibuya       Kill Bill restaurant

Row 14: Day 2               Asakusa & Akihabara      $120
Row 15: Activities
Row 16: 09:00               Senso-ji Temple          Ancient Buddhist temple       Asakusa               2 hours        Free       Arrive early to avoid crowds
Row 17: 11:00               Nakamise Shopping        Traditional shopping street   Nakamise-dori         1.5 hours      $50        Great for souvenirs
Row 18: 14:00               Akihabara Electronics    Electronics & anime district  Akihabara             3 hours        $100       Visit Yodobashi Camera
Row 19: Restaurants
Row 20: Daikokuya           Tempura                  $$                            Yes                    Asakusa       Famous tempura since 1887
Row 21: Maidreamin          Themed Cafe              $$                            Yes                    Akihabara     Maid cafe experience
```

## Tips for Best Results

1. **Be Specific with Locations**: Use full location names that Google Maps can find
2. **Detailed Descriptions**: The more detail, the better the itinerary
3. **Realistic Timing**: Use actual times in HH:MM format
4. **Include Tips**: Insider tips make itineraries more valuable
5. **Vegetarian Info**: Accurately mark restaurants to help dietary planning
6. **Cost Estimates**: Include both activity costs and daily totals

## Google Sheets Users

If using Google Sheets:

1. Create your itinerary following the structure above
2. Go to File > Download > Microsoft Excel (.xlsx)
3. Upload the downloaded file to the Travel Itinerary Generator

## Common Mistakes to Avoid

❌ **Don't:**
- Skip the blank row (Row 4)
- Use inconsistent date formats
- Forget the "Day X" prefix in day headers
- Leave out the "Activities" and "Restaurants" section headers
- Use 12-hour time format (use 24-hour instead)

✅ **Do:**
- Follow the exact column structure
- Use clear, searchable location names
- Include all required fields
- Keep formatting consistent
- Test with a small 1-2 day itinerary first

## Download Sample Template

A sample Excel file (`sample-trip-template.xlsx`) is included in this project. Use it as a starting point for your own trips.

## Need Help?

If your Excel file isn't parsing correctly:

1. Check the structure matches this guide exactly
2. Verify date formats (YYYY-MM-DD)
3. Ensure "Day X" headers are present
4. Confirm "Activities" and "Restaurants" headers exist
5. Review the sample template

The app will show helpful error messages if parsing fails.
