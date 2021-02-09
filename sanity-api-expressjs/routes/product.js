var express = require('express');
var router = express.Router();
const sanityClient = require('@sanity/client')
const imageUrlBuilder = require('@sanity/image-url')

const client = sanityClient({
    projectId: 'sci63ip4',
    dataset: 'production',
    token: 'skzErIZSVC6HKXKyqell9IleQjiTX5Je02zLv2tCHqZFrNFfpVOVuT53kNIANDbjyFQCwWlSdpSESjH2JO4KnHIPCTYXWEOy4rwedc0KLp7DQK7FvrBgpmP6tA4HDApgFC08evMEsiBK8BbWFVtSuVqGwO5Mp7xh2IZ4ery8trFISbxt44It', // or leave blank to be anonymous user
    useCdn: false // `false` if you want to ensure fresh data
})

const builder = imageUrlBuilder(client)

router.post('/add', function (req, res, next) {
    var data = req.body;
    data['category'] = 'ecomm-products'
    client.create(data).then(resp => {
        res.send(resp)
    })
});


router.get('/', function (req, res, next) {
    const query = '*[category == "ecomm-products"]'
    const params = {}

    client.fetch(query, params).then(products => {
        for (prod of products) {
            if (prod['productimage']) {
                prod['productimage'] = buildImgURL(prod['productimage']['asset']["_ref"])
            }
        }
        res.send(products)
    })
})

function buildImgURL(imageName) {
    var url = builder.image(imageName)

    var finalURL = "";
    if (url.options) {
        let opt = url.options;
        let splitval = opt.source.split("-");
        let fileRef = splitval[1] + "-" + splitval[2] + "." + splitval[3];
        finalURL = opt.baseUrl + "/images/" + opt.projectId + "/" + opt.dataset + "/" + fileRef
    }

    return finalURL;
}

router.get('/:productId', function (req, res, next) {
    const query = '*[category == "ecomm-products" && _id == $productId]'
    const params = { productId: req.params.productId }

    client.fetch(query, params).then(products => {
        for (prod of products) {
            if (prod['productimage']) {
                prod['productimage'] = buildImgURL(prod['productimage']['asset']["_ref"])
            }
        }
        res.send(products)
    })
})


router.delete('/:productId', function (req, res, next) {
    client.delete(req.params.productId).then(response => {
        res.send(response)
    }).catch(err => {
        res.send(err)
    })
})

router.patch('/:productId', function (req, res, next) {
    client.patch(req.params.productId)
        .set(req.body)
        .commit()
        .then(response => {
            res.send(response)
        })
        .catch(err => {
            res.send(err)
        })
})
module.exports = router;