const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // For handling CORS if needed

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));


const mongoURI = 'mongodb://localhost:27017/tripPlanner';
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((resp) => console.log('MongoDB connected!'))
    .catch((err) => console.error('MongoDB connection error:', err));





const CitySchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
});

const City = mongoose.model('City', CitySchema);
app.get('/api/cities', async (req, res) => {
    console.log('cities api')
    const cities = await City.find();
    res.json(cities);
});





const HotelSchema = new mongoose.Schema({
    name: String,
    location: String,
    rating: String,
    description: String,
    image: String,
});
const Hotel = mongoose.model('hotels', HotelSchema);
app.get('/api/city/:id/hotals', async (req, res) => {
    console.log('ID: ', req.params.id);
    const Hotels = await Hotel.find({city_id: req.params.id});
    res.json(Hotels);
});





const RoomsSchema = new mongoose.Schema({
    name: String,
    size: String,
    price: String,
    beds:String,
    bath: String,
    description: String,
    cancellation_fee: String,
    image: String,
});
const Room = mongoose.model('rooms', RoomsSchema);
app.get('/api/hotal/:id/rooms', async (req, res) => {
    console.log('room!: ', req.params.id);
    const rooms = await Room.find({hotal_id: req.params.id});
    res.json(rooms);
});

app.get('/api/room/:id', async (req, res) => {
    console.log('room!: ', req.params.id);
    const room = await Room.findOne({_id: req.params.id});
    res.json(room);
});

const bookingSchema = new mongoose.Schema({
    name: String,
    phone: String,
    cnic: String,
    payment: Number,
    startDate: Date,
    checkoutTime: Date,
    hotal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hotels', 
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms', 
    }
});
const booking = mongoose.model('booking', bookingSchema);
app.post('/api/booking', async (req, res) => {
    console.log('booking: ', req.body);
    const record = await booking.create(req.body);
    console.log('record: ', record);
    res.json(record);
});

app.get('/api/bookings', async (req, res) => {
    const bookings = await booking.find({}).populate('room');
    console.log('bookings: ', bookings);
    res.json(bookings);
});
app.get('/api/booking/:id', async (req, res) => {
    const bookingRecord = await booking.findOne({_id: req.params.id});
    console.log('bookingRecord: ', bookingRecord);
    res.json(bookingRecord);
});
app.delete('/api/booking/:id', async (req, res) => {
    const record = await booking.deleteOne({_id: req.params.id});
    console.log('record: ', record);
    res.json(record);
});

app.patch('/api/booking/:id', async (req, res) => {
    console.log('ID: ', req.params.id);
    console.log('body: ', req.body);

    const record = await booking.findByIdAndUpdate(req.params.id, req.body);
    console.log('record: ', record);
    res.json(record);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
