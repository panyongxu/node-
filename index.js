const Koa = require('koa');
const superagent = require('superagent')
const cheerio = require('cheerio')
const request = require('request')
const app = new Koa()





const pics = []
const url = 'https://book.douban.com/subject/33437510/'


superagent.get(url).end((err, res) => {
    if (err) {
        console.log('爬取图书失败')
    }
    else {
        pics.push(getBookCatalog(res))

    }

})



// 处理获取到的图书目录
const getBookCatalog = (res) => {
    const $ = cheerio.load(res.text)
    const htmlAry = $('#info ').contents().filter(function () {
        return this.nodeType == 3;
    })


    const title = $('#wrapper > h1  >span').text()
    // 作者
    const author = $('#info >span:nth-child(1) >a').text()
    // 出版社
    const press = htmlAry[2].data
    // 译者
    const translator = $('#info .pl').eq(4).next().text()
    // 出版日期
    const impD = htmlAry[9].data
    // 价格
    const price = htmlAry[13].data
    const ISBN = htmlAry[19].data
    // 内容简介
    const contentIntro = $('#link-report').find('.intro').eq(0).text()
    // 作者简介
    const authorIntro = $('.related_info').find('.intro').eq(1).text()

    return {
        title,
        author,
        press,
        translator,
        impD,
        price,
        ISBN,
        contentIntro,
        authorIntro
    }
}


app.use(async ctx => {
    ctx.body = JSON.stringify( pics[0],null, 2)
});

const server = app.listen(3000, () => {

    console.log('.....................................................................');

})
