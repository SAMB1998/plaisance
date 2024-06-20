const Joi = require('joi');
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

// Schéma de validation pour les données de réservation
const reservationSchema = Joi.object({
    clientName: Joi.string().required(),
    boatName: Joi.string().required(),
    checkIn: Joi.date().iso().required(),
    checkOut: Joi.date().iso().required(),
});

exports.createReservation = async (req, res) => {
    // Validation des données avec Joi
    const { error } = reservationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { clientName, boatName, checkIn, checkOut } = req.body;
    const catwayId = req.params.id;

    console.log(`Received request to create reservation: catwayId=${catwayId}, clientName=${clientName}, boatName=${boatName}, checkIn=${checkIn}, checkOut=${checkOut}`);

    try {
        const catway = await Catway.findById(catwayId);
        if (!catway) {
            console.log('Catway not found');
            return res.status(404).json({ message: 'Catway not found' });
        }

        const reservation = new Reservation({
            catway: catwayId,
            clientName,
            boatName,
            checkIn,
            checkOut
        });

        await reservation.save();
        console.log('Reservation created successfully:', reservation);
        res.status(201).json(reservation);
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ catway: req.params.id });
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.idReservation);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.json(reservation);
    } catch (error) {
        console.error('Error fetching reservation:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.idReservation);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getReservationsByCatway = async (req, res) => {
    const { id } = req.params;
    try {
        const reservations = await Reservation.find({ catway: id });
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ error: error.message });
    }
};
