
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri);

async function queryBooks() {
    try {
        await client.connect();

        const db = client.db('plp_bookstore');
        const collection = db.collection('books');

        // Queries to perform
        // 1. Find all books by a specific genre
        const genre = 'Dystopian';
        const booksByGenre = await collection.find({ genre }).toArray();
        console.log(`Books in genre "${genre}":`, booksByGenre);

        // 2. Find all books published after 2010
        const year = 2010;
        const recentBooks = await collection.find({ published_year: { $gt: 2010 } }).toArray();
        console.log(`Books published after ${year}:`, recentBooks);

        // 3. Find books by a specific author
        const author = 'Harper Lee';
        const booksByAuthor = await collection.find({ author }).toArray();
        console.log(`Books by ${author}:`, booksByAuthor);

        // 4. Update price of Moby Dick
        const updateResult = await collection.updateOne(
            {
                title: "Moby Dick"
            },
            {
                $set: { price: 15.99 }
            }
        );

        // 4. Update publish year
        // Update The Hobbit
        const updateHobbit = await collection.updateOne(
            { title: "The Hobbit" },
            { $set: { published_year: 2015 } }
        );

        // Update To Kill a Mockingbird
        const updateMockingbird = await collection.updateOne(
            { title: "To Kill a Mockingbird" },
            { $set: { published_year: 2018 } }
        );

        console.log("Updated Moby:", updateResult);

        // 5. Delete books that are out of stock
        const deleteBooksOutOfStock = await collection.deleteMany({ in_stock: false });
        console.log("Deleted out of stock books:", deleteBooksOutOfStock.deletedCount);

        // 6. Delete Books by Title
        const deleteBooksByTitle = await collection.deleteMany({
            title: { $in: ["The Great Gatsby", "1984"] }
        });
        console.log("Deleted books by title:", deleteBooksByTitle.deletedCount);

    } finally {
        await client.close();
    }
}

queryBooks().catch(console.dir);
