export default ({
    name: 'product',
    title: "Add Product",
    type: "document",
    fields: [
        {
            title: "Product Name",
            name: "name",
            type: "string",
            validation: Rule => Rule.required().error('Product name is required')
        }, {
            title: "Product Description",
            name: "description",
            type: "array",
            of: [{ type: 'block' }]
        }, {
            title: "Product Price",
            name: "price",
            type: "number",
            validation: Rule => [Rule.required().error('Product price is required'), Rule.precision(2)]
        },
        {
            title: "category",
            name: "category",
            type: "string",
            hidden: true
        },
        {
            title: "Product Image",
            name: "productimage",
            type: "image"
        },
        {
            title: "Product Type",
            name: "type",
            type: "string",
            options: {
                list: [
                    { title: 'camera', value: 'camera' },
                    { title: 'mobile', value: 'mobile' }
                ]
            }
        }
    ],
    initialValue: {
        category: "ecomm-products"
    }
})