require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const seed = async () => {
  await connectDB();

  try {
    // Xoa du lieu cu
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Da xoa du lieu cu');

    // Tao admin
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@khovatchat.vn',
      password: 'admin123',
      isAdmin: true,
    });
    await adminUser.save();

    console.log('Da tao admin: admin@khovatchat.vn / admin123');

    // Tao categories
    const categories = await Category.insertMany([
      { name: 'Kho Bo & Kho Ga', slug: 'kho-bo-kho-ga', description: 'Cac loai kho bo, kho ga, kho trau', order: 0 },
      { name: 'Hai San Kho', slug: 'hai-san-kho', description: 'Muc rim, muc xe, ca thieu, da ca', order: 1 },
      { name: 'Trai Cay Say', slug: 'trai-cay-say', description: 'Mit say, xoai say, chuoi say, khoai say', order: 2 },
      { name: 'Dau & Hat', slug: 'dau-hat', description: 'Dau ha lan, dau phong, hat dieu, macca', order: 3 },
      { name: 'Banh & Snack', slug: 'banh-snack', description: 'Banh gau, banh quy, nui chien, bap say', order: 4 },
    ]);

    console.log('Da tao', categories.length, 'danh muc');

    const [khoBo, haiSan, traiCay, dauHat, banh] = categories;

    // Tao products
    const products = [
      // Kho Bo & Ga
      { name: 'Kho ga la chanh', slug: 'kho-ga-la-chanh', category: khoBo._id, price: 85000, countInStock: 100, shortDescription: 'Kho ga tam la chanh thom mat, vi cay nhe', description: 'Kho ga tuoi 100%, tam uop la chanh tu nhien, say kho gion ngon.', isFeatured: true },
      { name: 'Kho trau vi bo (mieng)', slug: 'kho-trau-vi-bo-mieng', category: khoBo._id, price: 150000, countInStock: 80, shortDescription: 'Kho trau mieng day, vi bo dam da', description: 'Thit trau say kho, tam gia vi bo truyen thong.', isFeatured: true },
      { name: 'Kho trau vi bo (xe soi)', slug: 'kho-trau-vi-bo-xe-soi', category: khoBo._id, price: 160000, countInStock: 60, shortDescription: 'Kho trau xe soi mem dai', description: 'Kho trau xe soi nho, de an, vi dam da.', isFeatured: false },
      { name: 'Kho trau vi bo (que)', slug: 'kho-trau-vi-bo-que', category: khoBo._id, price: 140000, countInStock: 70, shortDescription: 'Kho trau que tien loi', description: 'Kho trau cat que nho, tien mang di.', isFeatured: false },
      // Hai san
      { name: 'Muc xe soi hap dua', slug: 'muc-xe-soi-hap-dua', category: haiSan._id, price: 120000, countInStock: 50, shortDescription: 'Muc xe soi thom mui dua', description: 'Muc tuoi xe soi, hap nuoc cot dua thom beo.', isFeatured: true },
      { name: 'Muc can tam vi', slug: 'muc-can-tam-vi', category: haiSan._id, price: 110000, countInStock: 60, shortDescription: 'Muc can dep, tam vi vua an', description: 'Muc can mong, tam gia vi cay ngot.', isFeatured: false },
      { name: 'Muc rim me', slug: 'muc-rim-me', category: haiSan._id, price: 130000, countInStock: 40, shortDescription: 'Muc rim me chua ngot', description: 'Muc tuoi rim voi me, vi chua ngot hap dan.', isFeatured: true },
      { name: 'Kho ca thieu que', slug: 'kho-ca-thieu-que', category: haiSan._id, price: 90000, countInStock: 80, shortDescription: 'Ca thieu cat que gion', description: 'Ca thieu say gion, cat que tien an.', isFeatured: false },
      { name: 'Da ca trung muoi', slug: 'da-ca-trung-muoi', category: haiSan._id, price: 75000, countInStock: 100, shortDescription: 'Da ca chien gion vi trung muoi', description: 'Da ca chien gion phu trung muoi beo ngay.', isFeatured: true },
      // Trai cay say
      { name: 'Mit thai A say', slug: 'mit-thai-a-say', category: traiCay._id, price: 65000, countInStock: 120, shortDescription: 'Mit Thai say gion tan', description: 'Mit Thai loai A say chan khong, gion ngot tu nhien.', isFeatured: true },
      { name: 'Mit la bang say', slug: 'mit-la-bang-say', category: traiCay._id, price: 60000, countInStock: 100, shortDescription: 'Mit la bang say gion', description: 'Mit la bang say chan khong, vi ngot nhe.', isFeatured: false },
      { name: 'Xoai say deo', slug: 'xoai-say-deo', category: traiCay._id, price: 55000, countInStock: 150, shortDescription: 'Xoai say deo mem ngot', description: 'Xoai chin say deo, giu nguyen vi ngot tu nhien.', isFeatured: true },
      { name: 'Xoai say deo muoi ot', slug: 'xoai-say-deo-muoi-ot', category: traiCay._id, price: 60000, countInStock: 100, shortDescription: 'Xoai say vi muoi ot cay cay', description: 'Xoai say deo tam muoi ot, chua cay ngot.', isFeatured: false },
      { name: 'Chuoi say gion', slug: 'chuoi-say-gion', category: traiCay._id, price: 45000, countInStock: 200, shortDescription: 'Chuoi say gion tan', description: 'Chuoi say chan khong gion, khong dau.', isFeatured: false },
      { name: 'Khoai lang tim say', slug: 'khoai-lang-tim-say', category: traiCay._id, price: 50000, countInStock: 120, shortDescription: 'Khoai lang tim say gion ngot', description: 'Khoai lang tim say chan khong, ngot tu nhien.', isFeatured: true },
      // Dau & Hat
      { name: 'Dau ha lan toi ot', slug: 'dau-ha-lan-toi-ot', category: dauHat._id, price: 35000, countInStock: 200, shortDescription: 'Dau ha lan gion vi toi ot', description: 'Dau ha lan rang gion, tam toi ot thom cay.', isFeatured: true },
      { name: 'Dau ha lan wasabi', slug: 'dau-ha-lan-wasabi', category: dauHat._id, price: 35000, countInStock: 180, shortDescription: 'Dau ha lan vi wasabi cay nong', description: 'Dau ha lan phu wasabi, cay nong muon.', isFeatured: false },
      { name: 'Dau phong da ca nuoc cot dua', slug: 'dau-phong-da-ca-nuoc-cot-dua', category: dauHat._id, price: 40000, countInStock: 150, shortDescription: 'Dau phong boc da ca beo dua', description: 'Dau phong boc lop da ca gion, vi nuoc cot dua beo ngay.', isFeatured: true },
      { name: 'Hat dieu rang muoi loai A', slug: 'hat-dieu-rang-muoi-a', category: dauHat._id, price: 180000, countInStock: 50, shortDescription: 'Hat dieu loai A rang muoi beo bui', description: 'Hat dieu nguyen hat loai A, rang muoi vua phai.', isFeatured: true },
      { name: 'Hat macca', slug: 'hat-macca', category: dauHat._id, price: 200000, countInStock: 40, shortDescription: 'Hat macca nut vo beo thom', description: 'Hat macca Dak Lak, nut vo san, beo thom dinh duong.', isFeatured: false },
      // Banh & Snack
      { name: 'Bap say kho bo', slug: 'bap-say-kho-bo', category: banh._id, price: 30000, countInStock: 250, shortDescription: 'Bap say gion vi kho bo', description: 'Bap say chan khong, tam gia vi kho bo dam da.', isFeatured: true },
      { name: 'Nui chien bo', slug: 'nui-chien-bo', category: banh._id, price: 35000, countInStock: 200, shortDescription: 'Nui chien gion tan vi bo', description: 'Nui ong chien vang, phu bo thom beo.', isFeatured: false },
      { name: 'Banh gau nhan kem', slug: 'banh-gau-nhan-kem', category: banh._id, price: 45000, countInStock: 150, shortDescription: 'Banh gau nhan kem ngot mem', description: 'Banh gau nho xinh, nhan kem socola/sua.', isFeatured: true },
      { name: 'Muoi o mai', slug: 'muoi-o-mai', category: banh._id, price: 25000, countInStock: 300, shortDescription: 'Muoi o mai chua cay man ngot', description: 'Muoi o mai truyen thong, cham trai cay cuc ngon.', isFeatured: false },
    ];

    await Product.insertMany(products);
    console.log('Da tao', products.length, 'san pham');

    console.log('\nSeeder hoan thanh!');
    console.log('Dang nhap: admin@khovatchat.vn / admin123');

    process.exit(0);
  } catch (error) {
    console.error('Loi seeder:', error);
    process.exit(1);
  }
};

seed();
