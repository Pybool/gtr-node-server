var builder = require('xmlbuilder', { encoding: 'utf-8' });
const fs = require('fs');

/* var xml = builder.create('sitemapindex')
    .att('xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance")
    .att('xsi:schemaLocation', "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd")
    .att('xmlns', "http://www.sitemaps.org/schemas/sitemap/0.9")
    .ele('sitmap')
    .ele('loc', 'https://ghanatalksradio.com/sitemap-misc.xml')
    .ele('lastmod', '2021-12-05T16:36:36+00:00')
    .end({ pretty: true }); */
function defaultSitemap(data) {
    var obj = {
        sitemapindex: {

            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@xsi:schemaLocation': 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd',
            '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
            sitemap: data
        }
    };

    var xml = builder.create(obj).dec('1.0', 'UTF-8').end({ pretty: true });
    var result = xml.replace('?>', '?><?xml-stylesheet type="text/xsl" href="https://www.ghanatalksradio.com/sitemap/sitemap.xsl"?>')
    fs.writeFileSync('./sitemap.xml', result);
}

function postSitemap(data, name) {
    var obj = {
        urlset: {

            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@xsi:schemaLocation': 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd',
            '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
            url: data
        }
    };

    var xml = builder.create(obj).dec('1.0', 'UTF-8').end({ pretty: true });
    var result = xml.replace('?>', '?><?xml-stylesheet type="text/xsl" href="https://www.ghanatalksradio.com/sitemap/sitemap.xsl"?>')
    fs.writeFileSync('sitemap/' + name, result);
}

function categorySitemap(data, name) {
    var obj = {
        urlset: {

            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@xsi:schemaLocation': 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd',
            '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
            url: data
        }
    };

    var xml = builder.create(obj).dec('1.0', 'UTF-8').end({ pretty: true });
    var result = xml.replace('?>', '?><?xml-stylesheet type="text/xsl" href="https://www.ghanatalksradio.com/sitemap/sitemap.xsl"?>')
    fs.writeFileSync('sitemap/' + name, result);
}
const axios = require('axios');

// Make a request for a user with a given ID
axios.get('https://dev.ghanatalksradio.com/index.php/sitemap/sitemap/2019-06-01')
    .then(function(response) {
        // handle success
        var res = response.data;
        var yu = []
        if (res.status) {
            var ft = res.data.reverse()
            yu.push({
                loc: {
                    '#text': 'https://www.ghanatalksradio.com/sitemap/sitemap-tax-category.xml',

                },
                lastmod: {
                    '#text': res.timer.split('+')[0] + "+00:00",
                }
            })
            var cat = [];
            res.category.forEach(v => {
                cat.push({
                    loc: {
                        '#text': 'https://www.ghanatalksradio.com/category/' + v,

                    },
                    lastmod: {
                        '#text': res.timer.split('+')[0] + "+00:00",
                    },
                    changefreq: {
                        '#text': 'daily',
                    },
                    priority: {
                        '#text': '0.3',
                    }
                })
            })
            categorySitemap(cat, 'sitemap-tax-category.xml')
            ft.forEach(element => {

                if (element[1].length > 0) {
                    yu.push({
                            loc: {
                                '#text': 'https://www.ghanatalksradio.com/sitemap/' + 'sitemap-pt-post-' + element[0] + '.xml',

                            },
                            lastmod: {
                                '#text': element[1][element[1].length - 1].date.split('+')[0] + "+00:00",
                            }
                        }

                    )
                    post = [];
                    element[1].forEach(e => {
                        post.push({
                            loc: {
                                '#text': 'https://www.ghanatalksradio.com/' + e.post,

                            },
                            lastmod: {
                                '#text': e.date.split('+')[0] + "+00:00",
                            },
                            changefreq: {
                                '#text': 'always',
                            },
                            priority: {
                                '#text': '1.0',
                            }
                        })
                    })

                    postSitemap(post, 'sitemap-pt-post-' + element[0] + '.xml')
                }
            });

            defaultSitemap(yu)
        }

    })
    .catch(function(error) {
        // handle error
        console.log(error);
    })
    .then(function() {
        // always executed
    });