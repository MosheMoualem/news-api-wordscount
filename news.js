const axios = require('axios')
const mockData = require('./mockData.json');

const API_KEY = process.env.API_KEY || '9f1ea255b9b24717987a69bff7cfeda8';
const getArticles = async (from, to) => {
    const params = [
        'language=en',
        'pageSize=100',
        'sortBy=publishedAt',
        'sources=bbc-news',
        `apiKey=${API_KEY}`,
        `from=${from}`,
        `to=${to}`
    ].join('&');
    const url = `http://newsapi.org/v2/everything?${params}`;

    try {
        return await axios.get(url);
    } catch (error) {
        console.error(error)
        return null;
    }
}

// TODO: handle errors from API
const fetchData = async (from, to) => {
    const ret = await getArticles(from, to);
    // return Promise.resolve(mockData);
}

const getWorldsCount = (articles) => {
    return articles.map(({ title, description }) => {
        const wordsCount = {};

        const addWord = (word) => {
            if (wordsCount.hasOwnProperty(word)) {
                wordsCount[word] = wordsCount[word] + 1;
            } else {
                wordsCount[word] = 1;
            }
        }

        // TODO: clear words from special characters
        title.split(' ').forEach(w => addWord(w));
        description.split(' ').forEach(w => addWord(w));

        return {
            title,
            description,
            wordsCount
        }
    })
}

// TODO: put this API to express router
const getWordsCountByDate = async (connection, date = '2022-04-28') => {
    // 1. Check if this date in mongo
    const database = connection.db('news');

    const news = database.collection('news');
    const query = { date };
    const newsForThisDay = await news.findOne(query);

    if (newsForThisDay) {
        console.log('Get from DB');
        return newsForThisDay;
    }

    // 2. If there is no data
    const { articles } = await fetchData(date, date);
    const articlesWithWorldsCount = getWorldsCount(articles);
    const result = { date, articles: articlesWithWorldsCount };

    // 3. Save to DB
    await news.insertOne(result);

    console.log('Get from API');
    return result;
}


// getWordsCountByDate().catch(console.dir);
module.exports = getWordsCountByDate;