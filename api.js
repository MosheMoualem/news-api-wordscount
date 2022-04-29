const router = require('express').Router();
const getWordsCountByDate = require('./news');

const db = require('./db');

//TODO: move to utility

const getISODate = (d) => {
    return d.toISOString().slice(0, 10);
}
const getLast7Days = (fromDay) => {
    return [...Array(7)].map((_, i) => {
        const d = new Date(fromDay);
        d.setDate(d.getDate() - i)
        return getISODate(d)
    })
}

router.get('/get-news', async (req, res) => {

    const lSevenDays = (getLast7Days(req.query.fromDay));

    //  const newArr = lSevenDays.map(day => `${getWordsCountByDate(db.connection, day)}`);


    const newArr = lSevenDays.map(day => { return getWordsCountByDate(db.connection, day); });
    Promise.all(newArr).then(results => { res.json(results); });

    /*
    Promise.all([
        await getWordsCountByDate(db.connection, '2022-04-28'),
        await getWordsCountByDate(db.connection, '2022-04-27'),
        await getWordsCountByDate(db.connection, '2022-04-26')
    ]).then(results => {
        res.json(results);
    });/**/


    // const result = await getWordsCountByDate();
    // 
})

module.exports = router;