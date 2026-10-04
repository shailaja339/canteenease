/**
 * CanteenEase - Database Seeder Script
 * 
 * This script seeds the MongoDB database with:
 * - 1 Admin user
 * - 1 Sample student user
 * - 15+ realistic canteen food items
 * 
 * Usage: node seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Import models
const User = require('./models/User');
const Food = require('./models/Food');
const Order = require('./models/Order');
const Notification = require('./models/Notification');
const Rating = require('./models/Rating');

// =====================
// SEED DATA
// =====================

const users = [
  {
    name: 'Admin User',
    email: 'admin@canteenease.com',
    password: 'admin123',
    studentId: 'ADMIN001',
    phone: '9999999999',
    role: 'admin'
  },
  {
    name: 'Canteen Staff',
    email: 'staff@canteenease.com',
    password: 'staff123',
    studentId: 'STAFF001',
    phone: '9999999998',
    role: 'admin'
  },
  {
    name: 'Rahul Sharma',
    email: 'student@college.edu',
    password: 'student123',
    studentId: 'CS2023001',
    phone: '9876543210',
    role: 'student'
  },
  {
    name: 'Priya Patel',
    email: 'priya@college.edu',
    password: 'student123',
    studentId: 'EC2023045',
    phone: '9876543211',
    role: 'student'
  }
];

const pexelsImageUrls = {
  samosa: 'https://images.pexels.com/photos/9738980/pexels-photo-9738980.jpeg',
  'vada-pav': 'https://images.pexels.com/photos/9738980/pexels-photo-9738980.jpeg',
  'pav-bhaji': 'https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg',
  'masala-dosa': 'https://images.pexels.com/photos/20422129/pexels-photo-20422129.jpeg',
  'idli-sambar': 'https://images.pexels.com/photos/37867687/pexels-photo-37867687.jpeg',
  'medu-vada': 'https://images.pexels.com/photos/37867687/pexels-photo-37867687.jpeg',
  uttapam: 'https://images.pexels.com/photos/36854500/pexels-photo-36854500.jpeg',
  'veg-biryani': 'https://images.pexels.com/photos/12669168/pexels-photo-12669168.jpeg',
  'vegetable-pulao': 'https://images.pexels.com/photos/12669168/pexels-photo-12669168.jpeg',
  'indian-thali': 'https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg',
  'spring-roll-indian': 'https://d1mxd7n691o8sz.cloudfront.net/static/recipe/recipe/2023-12/Vegetable-Spring-Rolls-2-1-906001560ca545c8bc72baf473f230b4.jpg',
  'hakka-noodles': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/hakka-noodles-recipe.jpg',
  'maggi-noodles': 'https://www.jcookingodyssey.com/wp-content/uploads/2026/02/masala-maggi-noodles.jpg',
  'veg-burger': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmzQgPtejucCKyVLvk-_kNsCgT9TcrTzpCt2LVBY7Nert9M7-iAqfn3KsE&s=10',
  'grilled-sandwich': 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_960,w_960//InstamartAssets/Veg_Grilled_sandwich.webp',
  'veg-sandwich': 'https://mytastycurry.com/wp-content/uploads/2019/08/10-Minutes-Veg-sandwich-recipe.jpg',
  'paneer-roll': 'https://spicecravings.com/wp-content/uploads/2020/12/Paneer-kathi-Roll-Featured-1.jpg',
  'vegetable-pulao': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/tawa-pulao-recipe.jpg',
  'veg-biryani': 'https://www.madhuseverydayindian.com/wp-content/uploads/2022/11/easy-vegetable-biryani.jpg',
  'dal-rice-indian': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0xP0oE7uvs9pEOUArylAQ_EWZZS4C8xzQqy0CvnbRJuJnNj5xdE0aX0k&s=10',
  'rajma-chawal': 'https://www.kuchpakrahahai.in/wp-content/uploads/2023/05/Rajma-chawal.jpg',
  'chole-bhature': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-1_d0RDorLVeTEgDNTJnB-5BPkjSlvemo-SAfIgMfmfWxVGO-VSymL2H5&s=10',
  'aloo-paratha': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2020/08/aloo-paratha-recipe.jpg',
  'misal-pav': 'https://www.ohmyveg.co.uk/wp-content/uploads/2023/12/Misal-Pav-2-2-e1722869218662-500x500.jpg',
  'upma-indian': 'https://www.kuchpakrahahai.in/wp-content/uploads/2016/09/Vegetable-rawa-upma.jpg',
  'poha-indian': 'https://www.ohmyveg.co.uk/wp-content/uploads/2023/09/Poha-4-copy-3-e1722868478363.jpg',
  'medu-vada': 'https://maayeka.com/wp-content/uploads/2018/10/vrat-ka-medu-vada-2-2.jpg',
  'idli-sambar': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXFIhXiqaaKx0splUZoe7MIWqlYTQVTEF3T9v2SiW9VlU6EPhYwb8tUEY&s=10',
  'pav-bhaji': 'https://www.cookwithmanali.com/wp-content/uploads/2018/05/Best-Pav-Bhaji-Recipe.jpg',
  'vada-pav': 'https://www.cookingandme.com/wp-content/uploads/2020/04/14212295465_e37e2a1b98_z.jpg',
  samosa: 'https://static.toiimg.com/thumb/61050397.cms?imgsize=246859&width=800&height=800',
  'pakora-indian': 'https://www.secondrecipe.com/wp-content/uploads/2026/05/potato-pakora-air-fryer.jpg',
  'bread-pakora': 'https://static.toiimg.com/photo/84629641.cms',
  'veg-manchurian': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr2rDTJccc4UBHaeCLhNZJMx-oIbE0Ch3U_rjcb1edS73ER3Z9fvI1dOf4&s=10',
  dhokla: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2020/11/khaman-dhokla-recipe.jpg',
  'gulab-jamun': 'https://www.vegrecipesofindia.com/wp-content/uploads/2022/10/gulab-jamun-recipe-01.jpg',
  'jalebi-indian': 'https://images.pexels.com/photos/39852580/pexels-photo-39852580.jpeg',
  'chocolate-chip-ice-cream': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_TpF9B1VZR1JtisqXto9hMNPV9pEKUGA49GPXB-UPPcDkP21RLRB_eqUt&s=10',
  'mango-ice-cream': 'https://bakewithshivesh.com/wp-content/uploads/2022/05/IMG_9492-scaled.jpg',
  'butterscotch-ice-cream': 'https://www.keep-calm-and-eat-ice-cream.com/wp-content/uploads/2021/12/Butterscotch-ice-cream-hero-5.jpg',
  'strawberry-ice-cream': 'https://ohsweetbasil.com/wp-content/uploads/creamy-homemade-strawberry-ice-cream-recipe-6-scaled.jpg',
  'chocolate-ice-cream': 'https://www.adashofmegnut.com/wp-content/uploads/2011/06/Chocolate-Peanut-Butter-Ice-Cream-3-1.jpg',
  'vanilla-ice-cream': 'https://static.toiimg.com/thumb/54677722.cms?imgsize=134423&width=800&height=800',
  'mixed-fruit-juice': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXisjHOSvqy6epH3c7nxjlTj8B5SKufgkTwm229Mjke-ZrWt04Wu2QG68&s=10',
  'pineapple-juice': 'https://theallnaturalvegan.com/wp-content/uploads/2025/07/mango-pineapple-juice-500x500.jpg',
  'watermelon-juice': 'https://www.thatcutedish.com/wp-content/uploads/2023/06/frozen-watermelon-juice-korean-style-1.jpg',
  'apple-juice': 'https://www.sharmispassions.com/wp-content/uploads/2017/03/AppleJuice3.jpg',
  'mango-juice': 'https://www.cubesnjuliennes.com/wp-content/uploads/2022/07/Mango-Juice-Recipe.jpg',
  'orange-juice': 'https://www.sharmispassions.com/wp-content/uploads/2023/11/orange-juice-final3.jpg',
  'limca': 'https://cdn.uengage.io/uploads/5/image-875796-1716282404.jpeg',
  'thums-up': 'https://media-dev.bazaar5.com/media/product/86/7788/b07g1cykqv-thums-up-soft-drink-can-300-ml-0-6cbeb4fe.jpg',
  'fanta': 'https://cdn.uengage.io/uploads/18085/image-546261-1694859044.jpeg',
  'sprite': 'https://cdn.uengage.io/uploads/18085/image-277159-1692423599.jpeg',
  'pepsi': '/food-images/pepsi.jpg',
  'coca-cola': 'https://cdn.zeptonow.com/production/ik-seo/cms/product_variant/378a310b-f144-4481-a39f-3fb2e1a32370/Coca-Cola-Soft-Drink.jpeg',
  'pizza': 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80'
};

const imageUrl = (name) => pexelsImageUrls[name] || `https://loremflickr.com/600/400/${name}`;

const foods = [
  ['Samosa', 'Snacks', 'samosa', true],
  ['Vada Pav', 'Snacks', 'vada-pav', true],
  ['Pav Bhaji', 'Main/Snacks', 'pav-bhaji', true],
  ['Masala Dosa', 'South Indian', 'masala-dosa', true],
  ['Idli Sambar', 'South Indian', 'idli-sambar', true],
  ['Medu Vada', 'South Indian', 'medu-vada', true],
  ['Uttapam', 'South Indian', 'uttapam', true],
  ['Poha', 'Breakfast', 'poha-indian', true],
  ['Upma', 'Breakfast', 'upma-indian', true],
  ['Misal Pav', 'Snacks/Main', 'misal-pav', true],
  ['Aloo Paratha', 'Breakfast/Main', 'aloo-paratha', true],
  ['Chole Bhature', 'Main Course', 'chole-bhature', true],
  ['Rajma Chawal', 'Main Course', 'rajma-chawal', true],
  ['Dal Rice', 'Main Course', 'dal-rice-indian', true],
  ['Veg Biryani', 'Main Course', 'veg-biryani', true],
  ['Pulao', 'Main Course', 'vegetable-pulao', true],
  ['Veg Thali', 'Main Course', 'indian-thali', true],
  ['Paneer Roll', 'Fast Food', 'paneer-roll', true],
  ['Veg Sandwich', 'Fast Food', 'veg-sandwich', true],
  ['Grilled Sandwich', 'Fast Food', 'grilled-sandwich', true],
  ['Veg Burger', 'Fast Food', 'veg-burger', true],
  ['Maggi', 'Fast Food', 'maggi-noodles', true],
  ['Hakka Noodles', 'Indo-Chinese', 'hakka-noodles', true],
  ['Veg Manchurian', 'Indo-Chinese', 'veg-manchurian', true],
  ['Spring Roll', 'Snacks', 'spring-roll-indian', true],
  ['Pakora', 'Snacks', 'pakora-indian', true],
  ['Bread Pakora', 'Snacks', 'bread-pakora', true],
  ['Dhokla', 'Snacks', 'dhokla', true],
  ['Gulab Jamun', 'Dessert', 'gulab-jamun', true],
  ['Jalebi', 'Dessert', 'jalebi-indian', true],
  ['Vada Pav', 'Main Food', 'vada-pav', true],
  ['Samosa', 'Main Food', 'samosa', true],
  ['Sandwich', 'Main Food', 'veg-sandwich', true],
  ['Veg Burger', 'Main Food', 'veg-burger', true],
  ['Pizza', 'Main Food', 'pizza', true],
  ['Maggi', 'Main Food', 'maggi-noodles', true],
  ['Masala Dosa', 'Main Food', 'masala-dosa', true],
  ['Idli', 'Main Food', 'idli-sambar', true],
  ['Pav Bhaji', 'Main Food', 'pav-bhaji', true],
  ['Chole Bhature', 'Main Food', 'chole-bhature', true],
  ['Coca-Cola', 'Cold Drinks', 'coca-cola', true],
  ['Pepsi', 'Cold Drinks', 'pepsi', true],
  ['Sprite', 'Cold Drinks', 'sprite', true],
  ['Fanta', 'Cold Drinks', 'fanta', true],
  ['Thums Up', 'Cold Drinks', 'thums-up', true],
  ['Limca', 'Cold Drinks', 'limca', true],
  ['Orange Juice', 'Fruit Juices', 'orange-juice', true],
  ['Mango Juice', 'Fruit Juices', 'mango-juice', true],
  ['Apple Juice', 'Fruit Juices', 'apple-juice', true],
  ['Watermelon Juice', 'Fruit Juices', 'watermelon-juice', true],
  ['Pineapple Juice', 'Fruit Juices', 'pineapple-juice', true],
  ['Mixed Fruit Juice', 'Fruit Juices', 'mixed-fruit-juice', true],
  ['Vanilla', 'Ice Cream', 'vanilla-ice-cream', true],
  ['Chocolate', 'Ice Cream', 'chocolate-ice-cream', true],
  ['Strawberry', 'Ice Cream', 'strawberry-ice-cream', true],
  ['Butterscotch', 'Ice Cream', 'butterscotch-ice-cream', true],
  ['Mango', 'Ice Cream', 'mango-ice-cream', true],
  ['Chocolate Chip', 'Ice Cream', 'chocolate-chip-ice-cream', true]
].map(([name, category, imageName, isVegetarian], index) => ({
  name,
  description: `${name} freshly prepared in the CanteenEase kitchen`,
  price: 20 + ((index * 5) % 61),
  category,
  image: imageUrl(imageName),
  isVegetarian,
  isAvailable: true,
  preparationTime: 5 + (index % 16),
  rating: 4 + ((index % 10) / 10)
}));

// =====================
// SEED FUNCTION
// =====================

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/canteenease');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Food.deleteMany({});
    await Order.deleteMany({});
    await Notification.deleteMany({});
    await Rating.deleteMany({});
    console.log('✅ Existing data cleared');

    // Hash passwords and create users
    console.log('👥 Seeding users...');
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`   Created user: ${user.name} (${user.role})`);
    }

    // Create food items
    console.log('🍽️  Seeding food items...');
    const createdFoods = await Food.insertMany(foods);
    console.log(`   Created ${createdFoods.length} food items`);

    // Create sample orders so the staff dashboard has a useful demo queue.
    const student = createdUsers.find(u => u.role === 'student' && u.email === 'student@college.edu');
    const secondStudent = createdUsers.find(u => u.email === 'priya@college.edu');
    const sampleFood1 = createdFoods.find(f => f.name === 'Masala Dosa');
    const sampleFood2 = createdFoods.find(f => f.name === 'Samosa');
    const sampleFood3 = createdFoods.find(f => f.name === 'Veg Burger');

    if (student && secondStudent && sampleFood1 && sampleFood2 && sampleFood3) {
      console.log('📦 Creating sample orders...');
      const completedOrder = await Order.create({
        orderId: 'CE-2026-001',
        student: student._id,
        items: [
          { food: sampleFood1._id, name: sampleFood1.name, price: sampleFood1.price, quantity: 1 },
          { food: sampleFood2._id, name: sampleFood2.name, price: sampleFood2.price, quantity: 2 }
        ],
        totalAmount: sampleFood1.price + (sampleFood2.price * 2),
        pickupToken: 1,
        status: 'completed',
        paymentMethod: 'Cash at Counter'
      });
      const preparingOrder = await Order.create({
        orderId: 'CE-2026-002',
        student: secondStudent._id,
        items: [{ food: sampleFood3._id, name: sampleFood3.name, price: sampleFood3.price, quantity: 1 }],
        totalAmount: sampleFood3.price,
        pickupToken: 2,
        status: 'preparing',
        paymentMethod: 'Cash at Counter'
      });
      const pendingOrder = await Order.create({
        orderId: 'CE-2026-003',
        student: student._id,
        items: [{ food: sampleFood2._id, name: sampleFood2.name, price: sampleFood2.price, quantity: 1 }],
        totalAmount: sampleFood2.price,
        pickupToken: 3,
        status: 'pending',
        paymentMethod: 'Cash at Counter'
      });
      console.log(`   Created sample orders: ${completedOrder.orderId}, ${preparingOrder.orderId}, ${pendingOrder.orderId}`);

      await Rating.create([
        {
          food: sampleFood1._id,
          student: student._id,
          order: completedOrder._id,
          rating: 5,
          review: 'Very tasty and fresh.'
        },
        {
          food: sampleFood2._id,
          student: student._id,
          order: completedOrder._id,
          rating: 4,
          review: 'Crispy and good with chutney.'
        }
      ]);
      await Food.findByIdAndUpdate(sampleFood1._id, { rating: 5, ratingCount: 1 });
      await Food.findByIdAndUpdate(sampleFood2._id, { rating: 4, ratingCount: 1 });
      console.log('   Created sample student ratings');

      // Create a sample notification
      await Notification.create({
        user: student._id,
        message: `Welcome to CanteenEase! Your first order ${completedOrder.orderId} has been completed. Enjoy your food! 🍽️`,
        type: 'success',
        isRead: false
      });
      console.log('   Created welcome notification');
    }

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📋 Login Credentials:');
    console.log('   Admin:   admin@canteenease.com / admin123');
    console.log('   Staff:   staff@canteenease.com / staff123');
    console.log('   Student: student@college.edu / student123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
