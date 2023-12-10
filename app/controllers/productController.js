const Product = require("../models/productModel.js");
const Media = require("../models/mediaModel.js");
const config = require("../config/config.js");

exports.addNewProduct = async (req, res, next) => {
    try {
        console.log(req.body);
        const name = req.body.name;
        const brand = req.body.brand;
        const price = +req.body.price;
        const quantity = +req.body.quantity;
        const category = req.body.category;
        const description = req.body.description;
        const mediaIds = req.body.mediaIds;
        const images = await Media.find({
            _id: {
                $in: mediaIds
            }
        })
        console.log("images:", images)
        const imageUrl = images.map((image) => `http://localhost:5000/${image.name}`)

        //create product
        const newProduct = new Product({
            name: name,
            brand: brand,
            price: price,
            category: category,
            quantity: quantity,
            description: description,
            images: imageUrl,
        })
        const product = await newProduct.save();
        return res.status(201).json({ product: product })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" })
    }
}

exports.getProducts = async (req, res, next) => {
    const { page, limit, search } = req.query;

    const findOptions = search ? {
        name: {
            $regex: search,
            $options: "i"
        }
    } : {}

    try {
        const products = await Product.find(findOptions).skip((page - 1) * limit).limit(limit)
        const totalProducts = await Product.count(findOptions)
        const totalPage = totalProducts / +limit

        return res.json({ products, totalProducts, totalPage, page })
    } catch (error) {
        console.log(error)
    }
}

exports.getProductDetail = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const productDetail = await Product.findById(productId);
        return res.status(200).json({ productDetail: productDetail })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

exports.editProduct = async (req, res, next) => {
    const productId = req.body.productId;
    const values = req.body.values;

    const updatedProduct = await Product.findByIdAndUpdate(productId, values, {
        new: true
    })
    res.status(200).json({ updatedProduct: updatedProduct });
}

exports.deleteProduct = async (req, res, next) => {
    const productId = req.body.productId;
    try {
        const product = await Product.findById(productId);
        await product.deleteOne();

        const productMedias = product.images;
        // console.log("productMedias", productMedias);
        // const nameDeletedImages = productMedias.map(i => i.split(`${config.baseUrl}/`).pop())
        // console.log("nameDeletedImages", nameDeletedImages);

        const deletedImages = await Media.deleteMany({
            name: {
                $in: productMedias.map(i => i.split(`${config.baseUrl}/`).pop())
            }
        })

        console.log("deletedImages", deletedImages);

        productMedias.forEach(media => {
            const filename = media.split(`${config.baseUrl}`).pop()

            if (FileSystem.existsSync(`${process.cwd()}/upload/${filename}`)) {
                fs.unlinkSync(`${process.cwd()}/upload/${filename}`)
            }
        })

        res.status(200).json({ deletedProduct: product })

    } catch (err) {
        console.log(err);
    }
}