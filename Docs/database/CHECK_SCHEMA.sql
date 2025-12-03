-- Run this FIRST to see what columns actually exist in your camps table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'camps'
ORDER BY ordinal_position;

-- Also show the actual data
SELECT * FROM camps LIMIT 5;
